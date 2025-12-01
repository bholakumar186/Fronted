import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, List, ListItem, Divider, useTheme } from "@mui/material";
import axios from "axios";
import { useAuth } from "../auth/authprovider";
import Header from "../components/navBar";
import FooterSection from "../components/footer";
import AuthModalMUI from "./loginSignup";
import { supabase } from "../lib/supabaseClient";

const MyApplications = ({ setOpenModal, openModal, handleClose }) => {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState(null);
  const [loadingApps, setLoadingApps] = useState(false);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const fetchApps = async () => {
      if (!user) return;
      setLoadingApps(true);
      try {
        const res = await axios.get(`/api/my-applications`);
        setApplications(res.data || []);
      } catch (err) {
        console.warn("Could not fetch applications:", err.message || err);
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, [user]);

  if (loading) return null;

  return (
    <>
     <Header
        setOpenModal={setOpenModal}
        openModal={openModal}
        userData={userData}
      />
    <Box sx={{ width: "100%", mx: "auto", mt: 10, }}>
      <Paper sx={{ p: 3, bgcolor: theme.palette.deepBlue, color: theme.palette.white }} elevation={3}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>My Applications</Typography>

        {loadingApps ? (
          <Typography>Loading applications...</Typography>
        ) : !applications || applications.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>No Applications Found</Typography>
            <Typography sx={{ opacity: 0.85, mb: 2 }}>You haven't submitted any applications yet.</Typography>
            <Button variant="contained">Apply Now</Button>
          </Box>
        ) : (
          <List>
            {applications.map((app, idx) => (
              <React.Fragment key={app.id || idx}>
                <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{app.title || `Application ${idx + 1}`}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>{app.status || "Pending"}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{app.summary || "-"}</Typography>
                </ListItem>
                {idx < applications.length - 1 && <Divider sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />}
              </React.Fragment>
            ))}
          </List>
        )}
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

export default MyApplications;
