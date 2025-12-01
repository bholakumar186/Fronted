import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import AuthModalMUI from "./loginSignup";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/authprovider";
import Header from "../components/navBar";
import FooterSection from "../components/footer";

const UserProfile = ({ setOpenModal, openModal, handleClose }) => {
  const theme = useTheme();
  const { user, session, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

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

  if (loading) return null;

  return (
    <>
      <Header
        setOpenModal={setOpenModal}
        openModal={openModal}
        userData={userData}
      />
      <Box sx={{ width: "100%", mx: "auto", mt: 10 }}>
        <Paper
          sx={{
            p: 4,
            bgcolor: theme.palette.deepBlue,
            color: theme.palette.white,
          }}
          elevation={3}
        >
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 96, height: 96, fontSize: 28 }}>
              {(user?.email || "U").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user?.user_metadata?.full_name || user?.email || "User"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Account Details
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Typography sx={{ color: theme.palette.white }}>
                User ID
              </Typography>
              <Typography sx={{ color: theme.palette.white, opacity: 0.85 }}>
                {user?.id}
              </Typography>

              <Typography sx={{ color: theme.palette.white }}>Email</Typography>
              <Typography sx={{ color: theme.palette.white, opacity: 0.85 }}>
                {user?.email}
              </Typography>

              <Typography sx={{ color: theme.palette.white }}>
                Full name
              </Typography>
              <Typography sx={{ color: theme.palette.white, opacity: 0.85 }}>
                {user?.user_metadata?.full_name || "-"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing((s) => !s)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
            <Button variant="outlined" color="inherit">
              Change Password
            </Button>
          </Box>
        </Paper>
      </Box>
      <FooterSection />
         <AuthModalMUI
        setOpenModal={setOpenModal}
        open={openModal}
        handleClose={handleClose}
      />
    </>
  );
};

export default UserProfile;
