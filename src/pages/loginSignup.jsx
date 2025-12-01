import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ReusableTextField, PasswordField } from "../atoms/reusablefields";
import ReusableButton from "../atoms/reusableButton";
import "@fontsource/nunito";
import { supabase } from "../lib/supabaseClient";
import axios from "axios";
import { set } from "lodash";
import { red } from "@mui/material/colors";

const modalStyle = (theme, showForgotPassword) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: showForgotPassword ? "50%" : "70%",
  height: showForgotPassword ? "50%" : "80%",
  bgcolor: theme.palette.deepBlue,
  borderRadius: "0.5rem",
  boxShadow: 24,
  p: { xs: "1.5rem", sm: "3rem" },
  textAlign: "center",
  border: "2px solid " + theme.palette.white,
  color: theme.palette.white,
});

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.47-1.01 7.49-3.08l-3.57-2.77c-1.02.68-2.32 1.08-3.92 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.85C2.96 20.31 6.67 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.51 14.21c-.2-.6-.31-1.24-.31-1.9 0-.66.11-1.3.31-1.9V7.56H.96A11.95 11.95 0 000 12c0 1.93.46 3.75.96 5.44l4.55-2.85z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.98c1.61 0 3.05.55 4.18 1.64l3.13-3.13C16.91.92 14.47 0 12 0 6.67 0 2.96 2.69.96 7.56l4.55 2.85C6.42 6.66 8.98 4.98 12 4.98z"
      fill="#EA4335"
    />
  </svg>
);

const saveUserData = async (email, id, token) => {
  if (!email || !token) {
    console.warn("Missing email or token, skipping save-user");
    return;
  }

  try {
    await axios.post(
      "/api/save-user",
      { email, id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(
      "save-user API failed:",
      error.response?.data || error.message
    );
  }
};

function SuccessView({ message }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CheckCircleOutlineIcon
        sx={{ fontSize: 96, color: theme.palette.lightOrange }}
      />
      <Typography
        variant="h6"
        sx={{ color: theme.palette.white, fontFamily: "'Nunito', sans-serif" }}
      >
        {message}
      </Typography>
    </Box>
  );
}

const LoginForm = ({
  toggleView,
  handleClose,
  onSuccess,
  toggleForgotPassword = { toggleForgotPassword },
}) => {
  const theme = useTheme();
  const [defaultDataState] = useState({ email: "", pass: "" });
  const [loginDetails, setLoginDetails] = useState(defaultDataState);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [token, setToken] = useState(null);

  // const saveUserData = async (user) => {
  //   return await saveUserData({
  //     email: savedData.user?.user_metadata?.email ?? savedData.user?.email,
  //     token: token,
  //   });
  // };
  useEffect(() => {
    if (token) {
      saveUserData(
        savedData?.data?.user.email,
        savedData?.data?.user.id,
        token
      );
      onSuccess("Login successful!");
    }
    if (savedData) {
      window.location.reload();
    }
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    try {
      const data = await supabase.auth.signInWithPassword({
        email: loginDetails.email,
        password: loginDetails.pass,
      });
      console.log("Login response data:", data);
      localStorage.setItem("loginData", JSON.stringify(data));

      setSavedData(data);

      if (data?.data?.session?.access_token) {
        setToken(data?.data?.session?.access_token);
      } else {
        throw new Error("No access token returned from Supabase");
      }
    } catch (error) {
      setErrorMsg(error.message || "Login failed.");
    }
  };

  useEffect(() => {
    try {
      const data = supabase.auth.getSession();
      if (data) {
        setToken(data?.data?.session?.access_token);
      }
    } catch (error) {
      alert("Error fetching session data");
    }
  }, [token]);

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ my: "0.5rem" }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: theme.palette.white,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Welcome Back to Transgulf Power
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.lightOrange}
        sx={{ mb: "1.8rem", fontFamily: "'Nunito', sans-serif" }}
      >
        login here to get further access
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <ReusableTextField
          label="Email"
          onChange={(event) =>
            setLoginDetails((prev) => ({ ...prev, email: event.target.value }))
          }
        />

        <PasswordField
          onChange={(event) =>
            setLoginDetails((prev) => ({ ...prev, pass: event.target.value }))
          }
        />
      </Box>

      {errorMsg ? (
        <Typography variant="body2" sx={{ mt: 1, color: "#ffb3b3" }}>
          {errorMsg}
        </Typography>
      ) : null}

      <ReusableButton
        width={"100%"}
        color={theme.palette.white}
        variant={"contained"}
        label={"Log In"}
        my={"1rem"}
        height={"3rem"}
        onClick={handleLogin}
      />

      <Divider sx={{ my: 2 }}>
        <Typography sx={{ px: 2, color: "rgba(255,255,255,0.6)" }}>
          OR
        </Typography>
      </Divider>

      <GoogleSignInButton label="Login with Google" />

      <Box
        sx={{ display: "flex", justifyContent: "space-between", px: "0.2rem" }}
      >
        <Link
          href="#"
          variant="body2"
          sx={{ color: theme.palette.lightOrange, mx: "1.5rem" }}
          onClick={(e) => {
            e.preventDefault();
            toggleForgotPassword();
          }}
        >
          Forgot Password?
        </Link>
      </Box>

      <ReusableButton
        width={"100%"}
        color={theme.palette.lightOrange}
        variant={"outlined"}
        label={"Don't have an account? Sign Up"}
        height={"2.5rem"}
        onClick={toggleView}
        fontWeight={650}
        my={"2rem"}
      />
    </Box>
  );
};

const SignupForm = ({ toggleView, handleClose, onSuccess }) => {
  const theme = useTheme();

  const [signupDetails, setSignupDetails] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    if (loading) return;
    setErrorMsg("");

    let { email, password, confirmPass } = signupDetails;
    email = (email || "").trim().toLowerCase();

    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }
    if (password !== confirmPass) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      console.log("Signup response data:", data, "error:", error);
      localStorage.setItem("signupData", JSON.stringify(data));

      if (!data?.user?.user_metadata?.email) {
        const msg =
          "This email is already registered. Please verify your email or try logging in.";
        setErrorMsg(msg);
        return;
      }
      onSuccess("Please check your email to verify your account.");
    } catch (e) {
      setErrorMsg("Unexpected error. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: theme.palette.white,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Start Your Green Energy Journey
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.lightOrange}
        sx={{ mb: 3, fontFamily: "'Nunito', sans-serif" }}
      >
        Create your account here
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <ReusableTextField
          label="Email"
          value={signupDetails.email}
          onChange={(e) =>
            setSignupDetails((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <PasswordField
          label="Password"
          value={signupDetails.password}
          onChange={(e) =>
            setSignupDetails((prev) => ({ ...prev, password: e.target.value }))
          }
        />

        <PasswordField
          label="Confirm password"
          value={signupDetails.confirmPass}
          onChange={(e) =>
            setSignupDetails((prev) => ({
              ...prev,
              confirmPass: e.target.value,
            }))
          }
        />
      </Box>

      {errorMsg ? (
        <Typography variant="body2" sx={{ mt: 1, color: "#ffb3b3" }}>
          {errorMsg}
        </Typography>
      ) : null}

      <ReusableButton
        type="submit"
        width={"100%"}
        color={theme.palette.white}
        variant={"contained"}
        label={loading ? "Signing up..." : "Sign Up Securely"}
        my={"1rem"}
        height={"2.5rem"}
        disabled={loading}
        onClick={handleSignup}
      />

      <Divider sx={{ my: 2 }}>
        <Typography sx={{ px: 2, color: "rgba(255,255,255,0.6)" }}>
          OR
        </Typography>
      </Divider>

      <GoogleSignInButton label="SignUp with Google" />

      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <ReusableButton
          width={"100%"}
          color={theme.palette.lightOrange}
          variant={"outlined"}
          label={"Already have an account? Log In"}
          height={"1.5rem"}
          onClick={toggleView}
          fontWeight={650}
          my={"2rem"}
          disabled={loading}
        />
      </Box>
    </Box>
  );
};

const GoogleSignInButton = ({ label }) => {
  const theme = useTheme();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/HOME_ROUTE`,
      },
    });
  };

  return (
    <ReusableButton
      label={label}
      onClick={handleGoogleLogin}
      variant="outlined"
      width="100%"
      height="3rem"
      sx={{
        borderColor: theme.palette.white,
        color: theme.palette.white,
        textTransform: "none",
        fontWeight: 600,
        fontFamily: "'Nunito', sans-serif",
        "&:hover": {
          borderColor: theme.palette.lightOrange,
          bgcolor: "rgba(255, 152, 0, 0.1)",
        },
      }}
      startIcon={<GoogleIcon />}
    >
      {label}
    </ReusableButton>
  );
};

const ForgotPasswordForm = ({ toggleView, onSuccess }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        console.error("Reset password error:", error);
        setErrorMsg(error.message || "Failed to send reset email.");
        return;
      }

      onSuccess("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMsg("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: theme.palette.white, mb: 2 }}
      >
        Reset Your Password
      </Typography>
      <ReusableTextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errorMsg && (
        <Typography variant="body2" sx={{ mt: 1, color: "#ffb3b3" }}>
          {errorMsg}
        </Typography>
      )}
      <ReusableButton
        type="submit"
        width="100%"
        color={theme.palette.white}
        variant="contained"
        label={loading ? "Sending..." : "Send Reset Link"}
        my="1rem"
        height="2.5rem"
        disabled={loading}
        onClick={handleReset}
      />
      <ReusableButton
        width="100%"
        color={theme.palette.lightOrange}
        variant="outlined"
        label="Back to Login"
        height="2.5rem"
        onClick={toggleView}
        my="1rem"
        disabled={loading}
      />
    </Box>
  );
};

const AuthModalMUI = ({ open, handleClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const theme = useTheme();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const getModalStyle = modalStyle(theme, showForgotPassword);

  const toggleForgotPassword = () => {
    setShowForgotPassword((prev) => !prev);
  };
  const toggleView = () => setIsLoginView((prev) => !prev);

  const handleSuccess = (message) => {
    setSuccessMessage(message || "Success");
  };

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => {
      setSuccessMessage("");
      handleClose();
    }, 4000);

    return () => clearTimeout(t);
  }, [successMessage, handleClose]);

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={getModalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.lightOrange,
          }}
        >
          <CloseIcon />
        </IconButton>

        {successMessage ? (
          <SuccessView message={successMessage} />
        ) : showForgotPassword ? (
          <ForgotPasswordForm
            toggleView={() => setShowForgotPassword(false)}
            onSuccess={handleSuccess}
          />
        ) : isLoginView ? (
          <LoginForm
            toggleView={toggleView}
            handleClose={handleClose}
            onSuccess={handleSuccess}
            toggleForgotPassword={toggleForgotPassword}
          />
        ) : (
          <SignupForm
            toggleView={toggleView}
            handleClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </Box>
    </Modal>
  );
};

export default AuthModalMUI;
