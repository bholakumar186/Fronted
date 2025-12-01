import { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  CssBaseline,
  TextField,
  Button,
  useTheme,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import Header from "../components/navBar";
import contactUs from "../assets/contactus4.jpg";
import { LocationOn, Phone, Email } from "@mui/icons-material";
import FooterSection from "../components/footer";
import Lenis from "@studio-freight/lenis";
import AuthModalMUI from "./loginSignup";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../lib/supabaseClient";

const bgMotion = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const zoomPan = keyframes`
  0% { transform: scale(1) translateX(0); }
  50% { transform: scale(1.08) translateX(20px); }
  100% { transform: scale(1) translateX(0); }
`;

const themeColors = {
  darkNavy: "#0c1a3b",
  lightBlue: "#f4f8fc",
  accentYellow: "#ffc107",
  primaryBlue: "#2196f3",
  grievanceRed: "#dc3545",
  white: "#ffffff",
  textDark: "#333333",
};

const contactData = [
  {
    icon: <LocationOn sx={{ fontSize: 40, color: "#fff" }} />,
    title: "ADDRESS",
    details: [
      "Beside Vishal Mega Mart, 3rd Floor",
      "Above A.K Auto Agency, Kankarbagh,",
      "Patna, Bihar-800020",
    ],
  },
  {
    icon: <Phone sx={{ fontSize: 40, color: "#fff" }} />,
    title: "PHONE",
    details: ["Inquiry: +91 9931066620", "Whatsapp: +91 9931066620"],
  },
  {
    icon: <Email sx={{ fontSize: 40, color: "#fff" }} />,
    title: "EMAIL",
    details: ["support@transgulfglobalpowerlimited.in"],
  },
];

const SectionWrapper = styled(Box)({
  backgroundColor: themeColors.darkNavy,
  padding: "60px 20px",
  color: themeColors.white,
  width: "100vw",
});

const FormPaper = styled(Paper)({
  padding: "1.875rem",
  borderRadius: "10px",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: themeColors.lightBlue,
  color: themeColors.textDark,
});

const ContactForm = ({ handleContactChange, handleSubmit, contactForm }) => (
  <FormPaper elevation={3}>
    <Typography variant="h5" gutterBottom fontWeight={600}>
      Let’s Talk Solar
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Reach out with your general inquiries or project ideas. We’ll get back to
      you soon.
    </Typography>

    <Box
      component="form"
      onSubmit={(e) => handleSubmit(e, "contact")}
      sx={{ flexGrow: 1 }}
    >
      <TextField
        fullWidth
        label="Name *"
        name="name"
        margin="normal"
        value={contactForm.name}
        onChange={handleContactChange}
        required
      />
      <TextField
        fullWidth
        label="Email *"
        name="email"
        type="email"
        margin="normal"
        value={contactForm.email}
        onChange={handleContactChange}
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Issue Category *</InputLabel>
        <Select
          label="Issue Category *"
          name="issue_category"
          value={contactForm.issue_category}
          onChange={handleContactChange}
        >
          <MenuItem value="General Inquiry">General Inquiry</MenuItem>
          <MenuItem value="Project Quote">Project Quote</MenuItem>
          <MenuItem value="Service Request">Service Request</MenuItem>
          <MenuItem value="Other">Others</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Message *"
        name="message"
        margin="normal"
        multiline
        rows={4}
        value={contactForm.message}
        onChange={handleContactChange}
        required
      />
      <Box sx={{ mt: "auto" }} />
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: themeColors.primaryBlue,
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        Send Message
      </Button>
    </Box>
  </FormPaper>
);

const GrievanceContactBox = styled(Box)({
  marginTop: 20,
  paddingTop: 15,
  borderTop: "1px solid #ccc",
});

const SustainableFutureSection = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    issue_category: "",
    message: "",
  });
  const [grievanceForm, setGrievanceForm] = useState({
    name: "",
    email: "",
    grievance_category: "",
    description: "",
  });

  const handleContactChange = (e) =>
    setContactForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleGrievanceChange = (e) =>
    setGrievanceForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const formData = formType === "contact" ? contactForm : grievanceForm;
    const endpoint =
      formType === "contact" ? "/api/contact-us" : "/api/grievance";
    console.log("Preparing to submit form Api:", endpoint);
    if (
      !formData.name ||
      !formData.email ||
      (formType === "contact" && !formData.issue_category) ||
      (formType === "grievance" && !formData.grievance_category)
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          formType === "contact"
            ? "Thank you! Your message has been sent successfully. We'll get back to you soon."
            : "Grievance submitted successfully. Our team will review it shortly."
        );

        if (formType === "contact") {
          setContactForm({
            name: "",
            email: "",
            category: "",
            message: "",
          });
        } else {
          setGrievanceForm({
            name: "",
            email: "",
            category: "",
            description: "",
          });
        }
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        `Failed to submit ${
          formType === "contact" ? "message" : "grievance"
        }. Please try again later or email us directly.`
      );
    }
  };

  return (
    <SectionWrapper>
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 5, px: { xs: 1, md: 2 } }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: themeColors.accentYellow, mb: 2 }}
          >
            Let’s Build a Sustainable Future Together
          </Typography>
          <Typography sx={{ maxWidth: 800, mx: "auto", opacity: 0.8 }}>
            At Transgulf Global Power Limited, we’re committed to powering a
            sustainable future through advanced solar solutions. Whether you’re
            exploring solar energy for your home, business, or industrial
            project, our team is here to guide you with clear answers and
            dependable support.
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          alignItems="stretch"
          wrap={{ xs: "wrap", md: "nowrap" }}
          direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
        >
          <Grid item xs={12} sm={12} md={12} lg={6} sx={{ display: "flex" }}>
            <ContactForm
              handleContactChange={handleContactChange}
              handleSubmit={handleSubmit}
              contactForm={contactForm}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} sx={{ display: "flex" }}>
            <FormPaper elevation={3}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Grievance Redressal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We provide swift resolution for service issues or formal
                complaints.
              </Typography>

              <Box
                component="form"
                onSubmit={(e) => handleSubmit(e, "grievance")}
                sx={{ flexGrow: 1 }}
              >
                <TextField
                  fullWidth
                  label="Name *"
                  name="name"
                  margin="normal"
                  value={grievanceForm.name}
                  onChange={handleGrievanceChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  margin="normal"
                  value={grievanceForm.email}
                  onChange={handleGrievanceChange}
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Grievance Category *</InputLabel>
                  <Select
                    required
                    label="Grievance Category *"
                    name="grievance_category"
                    value={grievanceForm.grievance_category}
                    onChange={handleGrievanceChange}
                  >
                    <MenuItem value="Product Complaint">
                      Product/Installation
                    </MenuItem>
                    <MenuItem value="Service Complaint">
                      Customer Service
                    </MenuItem>
                    <MenuItem value="Billing Issue">Billing/Finance</MenuItem>
                    <MenuItem value="Other">Other Grievance</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Description of Grievance *"
                  name="description"
                  margin="normal"
                  multiline
                  rows={4}
                  value={grievanceForm.description}
                  onChange={handleGrievanceChange}
                  required
                />
                <Box sx={{ mt: "auto" }} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: themeColors.grievanceRed,
                    "&:hover": { backgroundColor: "#c82333" },
                  }}
                >
                  Submit Grievance
                </Button>
              </Box>

              <GrievanceContactBox>
                <Typography variant="subtitle1" fontWeight={600}>
                  Grievance Officer Contact:
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <EmailIcon
                    sx={{ mr: 1, fontSize: "1.1rem" }}
                    color="action"
                  />
                  <Link
                    href="mailto:grievances@transgulfglobalpowerlimited.in"
                    color="primary"
                    underline="hover"
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}
                  >
                    grievances@transgulfglobalpowerlimited.in
                  </Link>
                </Box>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <PhoneIcon
                    sx={{ mr: 1, fontSize: "1.1rem" }}
                    color="action"
                  />
                  <Typography variant="body2" fontSize="0.9rem">
                    Hotline: +91 9931066620
                  </Typography>
                </Box>
              </GrievanceContactBox>
            </FormPaper>
          </Grid>
        </Grid>
      </Box>
    </SectionWrapper>
  );
};

const ContactSection = ({ setOpenModal, openModal, handleClose }) => {
  const theme = useTheme();
  const [openContactPopup, setOpenContactPopup] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    issue_category: "",
    message: "",
  });
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleContactChange = (e) =>
    setContactForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const formData = formType === "contact" ? contactForm : grievanceForm;
    const endpoint =
      formType === "contact" ? "/api/contact-us" : "/api/grievance";
    console.log("Preparing to submit form Api:", endpoint);
    if (
      !formData.name ||
      !formData.email ||
      (formType === "contact" && !formData.issue_category) ||
      (formType === "grievance" && !formData.grievance_category)
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          formType === "contact"
            ? "Thank you! Your message has been sent successfully. We'll get back to you soon."
            : "Grievance submitted successfully. Our team will review it shortly."
        );

        if (formType === "contact") {
          setContactForm({
            name: "",
            email: "",
            category: "",
            message: "",
          });
        } else {
          setGrievanceForm({
            name: "",
            email: "",
            category: "",
            description: "",
          });
        }
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        `Failed to submit ${
          formType === "contact" ? "message" : "grievance"
        }. Please try again later or email us directly.`
      );
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const getSessionToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        return;
      }
      if (data?.session?.access_token) {
        setToken(data.session.access_token);
        setUserData(data?.session?.user);
      }
    };
    getSessionToken();
  }, []);

  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      smooth: true,
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (openContactPopup) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [openContactPopup]);

  return (
    <>
      <CssBaseline />
      <Header
        setOpenModal={setOpenModal}
        openModal={openModal}
        userData={userData}
      />

      <Grid
        container
        sx={{
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: "4.5rem", sm: "5rem" },
          background: "linear-gradient(270deg, #a1c4fd, #c2e9fb, #a1c4fd)",
          backgroundSize: "400% 400%",
          animation: `${bgMotion} 15s ease infinite`,
        }}
      >
        <Box
          sx={{
            width: "100vw",
            height: "40rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={contactUs}
            alt="Contact Us"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              filter: "brightness(0.7)",
              animation: `${zoomPan} 25s ease-in-out infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: theme.palette.mediumGreen,
              textAlign: "center",
              zIndex: 2,
              px: 2,
              width: "100%",
              maxWidth: 960,
            }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, mb: 2, letterSpacing: 1 }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mx: "auto",
                color: "#fff",
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              We’re here to help! Reach out with your queries or ideas, and our
              team will get back to you as soon as possible.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100vw",
            backgroundColor: "#cdeaf1ff",
            color: theme.palette.logoBlue,
            py: 8,
            px: { xs: 2, sm: 6, md: 12 },
          }}
        >
          <Grid
            container
            spacing={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "0.2rem",
              overflow: "hidden",
            }}
          >
            {contactData.map((item, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={index}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  py: 6,
                  borderRight: {
                    md:
                      index < contactData.length - 1
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "none",
                  },
                  backgroundColor: "#cdeaf1ff",
                  transition: "all .35s ease-in-out",
                  transform: "translateY(0)",
                  boxShadow: "0 0 0 rgba(0,0,0,0)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    backgroundColor: theme.palette.white,
                    zIndex: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "4.5rem",
                    height: "4.5rem",
                    borderRadius: "50%",
                    backgroundColor: theme.palette.logoBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    "& svg": { fontSize: "2rem", color: theme.palette.white },
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    textDecoration: "underline",
                    textUnderlineOffset: "0.25rem",
                  }}
                >
                  {item.title}
                </Typography>

                {item.details.map((line, i) => (
                  <Typography
                    key={i}
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: "1rem",
                      opacity: 0.9,
                      color: theme.palette.darkOrange,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>

        <Dialog
          open={openContactPopup}
          onClose={() => setOpenContactPopup(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              overflow: "visible",
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            },
          }}
        >
          <IconButton
            onClick={() => setOpenContactPopup(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: theme.palette.grey[700],
              zIndex: 10,
              "&:hover": { color: theme.palette.error.main },
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 3,
                color: themeColors.primaryBlue,
              }}
            >
              Get in Touch
            </Typography>

            <ContactForm
              handleContactChange={handleContactChange}
              handleSubmit={handleSubmit}
              contactForm={contactForm}
            />
          </DialogContent>
        </Dialog>

        <SustainableFutureSection />

        <Box sx={{ width: "100vw" }}>
          <FooterSection />
        </Box>

        {openModal && (
          <AuthModalMUI
            setOpenModal={setOpenModal}
            open={openModal}
            handleClose={handleClose}
          />
        )}
      </Grid>
    </>
  );
};

export default ContactSection;
