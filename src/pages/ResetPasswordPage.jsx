import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { PasswordField } from "../atoms/reusablefields";
import ReusableButton from "../atoms/reusableButton";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirmPass) {
      setErrorMsg("Both fields are required.");
      return;
    }
    if (password !== confirmPass) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Password updated! You can now log in.");
      setTimeout(() => navigate("/"), 2500);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: "25rem",
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: theme.palette.deepBlue,
        borderRadius: 2,
        color: theme.palette.white,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Set a New Password
      </Typography>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <PasswordField
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        {errorMsg && (
          <Typography variant="body2" sx={{ color: "#ffb3b3" }}>
            {errorMsg}
          </Typography>
        )}

        {successMsg && (
          <Typography variant="body2" sx={{ color: "#90ee90" }}>
            {successMsg}
          </Typography>
        )}

        <ReusableButton
          type="submit"
          width="100%"
          color={theme.palette.white}
          variant="contained"
          label={loading ? "Resetting..." : "Reset Password"}
          disabled={loading}
          height="3rem"
          onClick={handleResetPassword}
        />
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
