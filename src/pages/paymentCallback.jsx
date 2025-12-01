import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { supabase } from "../lib/supabaseClient";
import { CARRERS } from "../constants";

const PaymentCallback = () => {
  const [status, setStatus] = useState("checking"); // checking, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setToken(data?.session?.access_token);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    const checkPayment = async () => {
      const pendingOrderId = localStorage.getItem("pending_order_id");
      console.log("Pending order id ", pendingOrderId);
      setOrderId(pendingOrderId);

      if (!pendingOrderId) {
        setError("No pending payment found");
        setStatus("failed");
        return;
      }

      try {
        const response = await axios.get(
          `/api/payments/verify-payment?order_id=${pendingOrderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = response.data;

        if (result.status === "SUCCESS") {
          setPaymentData(result);
          setStatus("success");

          localStorage.setItem("lastPayment", JSON.stringify(result));
        } else if (result.status === "FAILED") {
          setError("Payment failed. Please try again.");
          setStatus("failed");
          sessionStorage.removeItem("pending_order_id");
        } else {
          setTimeout(checkPayment, 2000);
        }
      } catch (err) {
        console.error("Payment check error:", err);
        setError(err.response?.data?.error || "Failed to verify payment");
        setStatus("failed");
      }
    };

    checkPayment();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      {status === "checking" && (
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Verifying Payment...
          </Typography>
          <Typography color="text.secondary">
            Please wait while we confirm your payment
          </Typography>
        </Box>
      )}

      {status === "success" && (
        <Box textAlign="center" maxWidth={500}>
          <CheckCircleIcon
            sx={{ fontSize: 100, color: "success.main", mb: 3 }}
          />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Payment Successful!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Your application has been submitted successfully.
          </Typography>

          {paymentData && (
            <Box sx={{ my: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {paymentData.payment_id}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Amount: ₹{paymentData.amount}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(CARRERS)}
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Box>
      )}

      {status === "failed" && (
        <Box textAlign="center" maxWidth={500}>
          <ErrorIcon sx={{ fontSize: 100, color: "error.main", mb: 3 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Payment Failed
          </Typography>
          <Alert severity="error" sx={{ my: 3 }}>
            {error || "Something went wrong with your payment"}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate(CARRERS)}
            sx={{ mr: 2 }}
          >
            Back to Jobs
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PaymentCallback;
