import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { supabase } from "../lib/supabaseClient";
import { load } from "@cashfreepayments/cashfree-js";
import { redirect } from "react-router";
import { set } from "lodash";

const YEARS_OPTIONS = [
  "Fresher",
  "0–1 year",
  "1–2 years",
  "2–3 years",
  "3–5 years",
  "5+ years",
];

const ApplyJobModal = ({ open, job, onSuccess, handleClose }) => {
  const [step, setStep] = useState("form");
  const [applicationId, setApplicationId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [yoe, setYoe] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  useEffect(() => {
    if (open) {
      setStep("form");
      setApplicationId("");
      setFullName("");
      setPhone("");
      setSkills("");
      setYoe("");
      setResumeFile(null);
      setUploadPct(0);
      setErr("");
    }
  }, [open]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setToken(data.session.access_token);
        setUserId(data.session.user?.id);
      }
    };
    getSession();
  }, []);

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  const chips = job
    ? [
        job.salary_range,
        typeof job.vacancies === "number" && `${job.vacancies} Vacancies`,
        job.age_range && `Age: ${job.age_range}`,
      ].filter(Boolean)
    : [];

  const uploadResume = async (file) => {
    if (!file) throw new Error("No file selected");
    if (file.size > 5 * 1024 * 1024) throw new Error("File too large. Max 5MB");
    if (!file.name.toLowerCase().endsWith(".pdf"))
      throw new Error("Only PDF allowed");

    setUploading(true);
    setUploadPct(10);

    const presignRes = await axios.post("/api/resumes/presign", {
      job_id: job.job_id,
      filename: file.name,
      contentType: "application/pdf",
    });

    const { uploadUrl, key } = presignRes.data;
    if (!uploadUrl || !key) throw new Error("Failed to get upload URL");

    await axios.put(uploadUrl, file, {
      headers: {
        "x-amz-server-side-encryption": "AES256",
        "Content-Type": "application/pdf",
      },
      onUploadProgress: (e) => {
        if (e.total) setUploadPct(20 + Math.round((e.loaded / e.total) * 70));
      },
    });

    setUploadPct(100);
    setTimeout(() => setUploading(false), 500);
    return key;
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!job?.job_id) return setErr("Invalid job");

    setErr("");
    setSubmitting(true);

    try {
      const resume_path = await uploadResume(resumeFile);

      const res = await axios.post(
        "/api/apply/draft",
        {
          job_id: job.job_id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          skills: skills.trim(),
          years_of_experience: yoe,
          resume_path,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const data = res.data;
      setApplicationId(data.application_id);
      setStep(data.requires_payment ? "draft_saved" : "success");

      if (!data.requires_payment) {
        onSuccess?.();
        setTimeout(handleClose, 3000);
      }
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Failed to save application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Step 1: Store order_id before redirect
  const startPayment = async () => {
    if (!applicationId) {
      setErr("Invalid application");
      return;
    }

    setErr("");
    setStep("paying");

    try {
      const orderRes = await axios.post(
        "/api/payments/create-order",
        {
          application_id: applicationId,
          name: fullName.trim(),
          phone: phone.trim(),
          amount: job.application_fee || 500,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { payment_session_id, order_id } = orderRes?.data;

      if (!payment_session_id || !order_id) {
        throw new Error("Missing payment session ID or order ID from server");
      }

      localStorage.setItem("pending_order_id", order_id);
      localStorage.setItem("application_id", applicationId);
      setOrderId(order_id);

      const cashfree = await load({ mode: "sandbox" });

      await cashfree.checkout({
        paymentSessionId: payment_session_id,
        returnUrl: `${window.location.origin}/payment-callback`, 
      });
    } catch (error) {
      console.error("Payment setup failed:", error);
      setErr(
        error.response?.data?.message ||
          "Failed to start payment. Please try again."
      );
      setStep("draft_saved");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, p: 3, pb: 1 }}>
        {job?.job_title || "Apply for Job"}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Form Step */}
        {step === "form" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              {/* Job Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Job Description
                </Typography>
                <Typography color="text.secondary">
                  {job?.job_description}
                </Typography>
              </Box>

              {/* Responsibilities, Skills, etc. */}
              {safeArray(job?.key_responsibilities).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Key Responsibilities
                  </Typography>
                  <Box component="ul" sx={{ pl: 2.5 }}>
                    {safeArray(job.key_responsibilities).map((item, i) => (
                      <Typography
                        component="li"
                        variant="body2"
                        key={i}
                        sx={{ mb: 0.5 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {safeArray(job?.required_skills).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Required Skills
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mt: 1 }}
                  >
                    {safeArray(job.required_skills).map((s, i) => (
                      <Chip key={i} label={s} variant="outlined" size="small" />
                    ))}
                  </Stack>
                </Box>
              )}

              <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
                {chips.map(
                  (c, i) => c && <Chip key={i} size="small" label={c} />
                )}
                {safeArray(job?.locations).length > 0 && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`Locations: ${job.locations.join(", ")}`}
                  />
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Apply Now
              </Typography>

              {err && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {err}
                </Alert>
              )}

              <TextField
                label="Full Name"
                required
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone"
                required
                fullWidth
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(v);
                }}
                inputProps={{ maxLength: 10 }}
                helperText={
                  phone.length === 10 ? "" : "Enter 10-digit mobile number"
                }
                error={phone.length > 0 && phone.length < 10}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Your Skills (comma or line separated)"
                fullWidth
                multiline
                minRows={3}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="e.g., MS Office, Typing 40 WPM, Excel"
              />

              <TextField
                select
                label="Years of Experience"
                fullWidth
                value={yoe}
                onChange={(e) => setYoe(e.target.value)}
                sx={{ mb: 2 }}
              >
                {YEARS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" component="label" fullWidth>
                  {resumeFile ? resumeFile.name : "Choose Resume (PDF)"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                </Button>
                {uploading && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadPct}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSaveDraft}
                disabled={
                  submitting ||
                  uploading ||
                  !fullName ||
                  phone.length !== 10 ||
                  !skills ||
                  !yoe ||
                  !resumeFile
                }
              >
                {submitting
                  ? "Saving..."
                  : job?.requires_payment
                  ? "Save & Proceed to Payment"
                  : "Submit Application"}
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Payment Step */}
        {step === "draft_saved" && (
          <Box textAlign="center" py={6}>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Application Saved!
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                my: 3,
                maxWidth: 500,
                mx: "auto",
                backgroundColor: "#f8fafc",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Application ID
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ my: 1, color: "#1e40af" }}
              >
                {applicationId}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Complete Payment
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Amount: ₹{job?.application_fee || 500}
            </Typography>

            <Button variant="contained" size="large" onClick={startPayment}>
              Pay Now with Cashfree
            </Button>

            {err && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                {err}
              </Alert>
            )}
          </Box>
        )}

        {/* Paying Step */}
        {step === "paying" && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6">
              Redirecting to secure payment...
            </Typography>
            <LinearProgress sx={{ mt: 3, width: "70%", mx: "auto" }} />
          </Box>
        )}

        {/* Success Step */}
        {step === "success" && (
          <Box textAlign="center" py={6}>
            <CheckCircleIcon
              sx={{ fontSize: 100, color: "success.main", mb: 3 }}
            />
            <Typography variant="h4" fontWeight={700}>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Application ID: <strong>{applicationId}</strong>
            </Typography>
            <Typography sx={{ mt: 3 }}>
              Thank you! We'll contact you soon.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
