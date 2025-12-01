import Header from "../components/navBar";
import contactUsPng from "../assets/contactUs.png";
import {
  Box,
  Grid,
  Typography,
  CssBaseline,
  keyframes,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import aboutUsVideo from "../assets/aboutUs.mp4";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import AuthModalMUI from "../pages/loginSignup.jsx";
import FlagIcon from "@mui/icons-material/Flag";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedIcon from "@mui/icons-material/Verified";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ForestIcon from "@mui/icons-material/Forest";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FooterSection from "../components/footer.jsx";
import { supabase } from "../lib/supabaseClient";

const zoomPan = keyframes`
  0% { transform: scale(1) translateX(0); }
  50% { transform: scale(1.08) translateX(20px); }
  100% { transform: scale(1) translateX(0); }
`;

const textAnimate = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.9; text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }
  25% { transform: translateY(-8px) rotate(-1deg); opacity: 1; text-shadow: 3px 3px 12px rgba(0,0,0,0.6); }
  50% { transform: translateY(0) rotate(0deg); opacity: 0.95; text-shadow: 2px 2px 10px rgba(0,0,0,0.7); }
  75% { transform: translateY(-8px) rotate(1deg); opacity: 1; text-shadow: 3px 3px 12px rgba(0,0,0,0.6); }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.9; text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }
`;

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { text-shadow: 0 0 5px rgba(202, 40, 86, 0.3); }
  50% { text-shadow: 0 0 15px rgba(202, 40, 86, 0.5); }
  100% { text-shadow: 0 0 5px rgba(202, 40, 86, 0.3); }
`;

const AboutUs = ({ setOpenModal, openModal, handleClose }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
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

  const SectionHeader = ({ label }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: "2rem" }}>
      <Box
        sx={{ width: "5rem", height: 3, bgcolor: "#ca2856ff", borderRadius: 2 }}
      />
      <Typography
        sx={{
          color: "#ca2856ff",
          fontWeight: 700,
          letterSpacing: 1.5,
          fontSize: "0.9rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  const AnimatedList = ({ items, baseDelay = 0.1 }) => (
    <List>
      {items.map((item, i) => (
        <ListItem
          key={i}
          sx={{
            py: 0.5,
            opacity: 0,
            animation: `${fadeUp} 0.6s ease-out ${
              baseDelay + i * 0.07
            }s forwards`,
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <CheckCircleOutlineIcon
              sx={{ color: "#190888ff", fontSize: "1rem" }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              fontSize: "0.95rem",
              color: "#4b4b4b",
              lineHeight: 1.7,
            }}
            primary={item}
          />
        </ListItem>
      ))}
    </List>
  );

  const Card = ({ icon, title, items, delay = 0 }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.2, md: 3 },
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        animation: `${fadeUp} 0.7s ease-out ${delay}s both`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "rgba(25, 8, 136, 0.08)",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#190888ff" }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1.5 }} />
      <AnimatedList items={items} baseDelay={delay + 0.15} />
    </Paper>
  );

  const Pill = ({ icon, text }) => (
    <Chip
      icon={icon}
      label={text}
      variant="outlined"
      sx={{ mr: 1, mb: 1, fontWeight: 600, borderColor: "rgba(25,8,136,0.2)" }}
    />
  );

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
        sx={{ position: "relative", mt: "5rem", backgroundColor: "#f6f6f3ff" }}
      >
        <Grid
          item
          sx={{
            width: "100%",
            height: "28rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={contactUsPng}
            alt="About Us"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.3)",
              animation: `${zoomPan} 25s ease-in-out infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "25%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#fff",
              animation: `${textAnimate} 6s ease-in-out infinite`,
              width: "auto",
              maxWidth: "960px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h6"
              sx={{ textShadow: "1px 1px 5px rgba(0,0,0,0.7)" }}
            >
              Learn more about our mission, vision, and how we make an impact.
            </Typography>
          </Box>
        </Grid>

        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            m: "1rem",
            flexWrap: "wrap",
            backgroundColor: "#f6f6f3ff",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: "3rem",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                flex: "1 1 55%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                component="video"
                src={aboutUsVideo}
                autoPlay
                loop
                muted
                playsInline
                aria-label="About Transgulf Global Power video"
                sx={{
                  width: "100%",
                  height: "25rem",
                  objectFit: "cover",
                  borderRadius: "1rem",
                }}
              />
            </Box>

            <Box
              sx={{
                flex: "1 1 45%",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.8rem",
                animation: `${fadeUp} 0.8s ease-out`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  opacity: 0,
                  animation: `${fadeUp} 0.8s ease-out 0.1s forwards`,
                }}
              >
                <Box
                  sx={{
                    width: "5rem",
                    height: "3px",
                    backgroundColor: "#ca2856ff",
                    borderRadius: "2px",
                  }}
                />
                <Typography
                  sx={{
                    color: "#ca2856ff",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  About Us
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#190888ff",
                  fontSize: "1.8rem",
                  animation: `${fadeUp} 1s ease-out 0.2s forwards, ${shimmer} 4s ease-in-out infinite`,
                }}
              >
                Transgulf Global Power Limited
              </Typography>

              <Typography
                sx={{
                  color: "#565558ff",
                  fontWeight: 550,
                  fontSize: "0.9rem",
                  mt: "1rem",
                  opacity: 0,
                  animation: `${fadeUp} 1s ease-out 0.4s forwards`,
                }}
              >
                At Transgulf Global Power Limited, we are building the future of
                clean energy in India. We focus on developing and operating
                utility-scale solar power plants that generate reliable,
                sustainable electricity for government agencies, public
                utilities, and private enterprises.
              </Typography>

              <Typography
                sx={{
                  color: "rgba(121, 100, 4, 1)",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                  fontSize: "0.8rem",
                  fontWeight: 550,
                  opacity: 0,
                  animation: `${fadeUp} 1s ease-out 0.6s forwards`,
                }}
              >
                Our work aligns with the Government of India’s renewable energy
                mission to achieve 500 GW of green capacity by 2030 and a Net
                Zero economy by 2070. Each project we build strengthens the
                national grid, reduces carbon emissions, and helps create a
                self-reliant, eco-friendly energy future.
              </Typography>

              <Typography
                sx={{
                  color: "rgba(121, 100, 4, 1)",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                  fontSize: "0.8rem",
                  fontWeight: 550,
                  opacity: 0,
                  animation: `${fadeUp} 1s ease-out 0.6s forwards`,
                }}
              >
                For us, renewable energy is not just about producing power —
                it’s about protecting nature, supporting communities, and
                creating long-term value for our partners and the planet.
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid
          container
          sx={{
            px: { xs: 2, md: 6 },
            py: { xs: 4, md: 8 },
            backgroundColor: "#ffffff",
            flexDirection: "column",
          }}
        >
          <Grid item xs={12} sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
            <SectionHeader label="Our Core" />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#190888ff",
                animation: `${fadeUp} 0.7s ease-out 0.1s both`,
              }}
            >
              Vision, Mission & Approach
            </Typography>
            <Typography
              sx={{
                color: "#5a5a5a",
                maxWidth: 760,
                mx: "auto",
                mt: 1,
                animation: `${fadeUp} 0.7s ease-out 0.2s both`,
              }}
            >
              Clear intent. Real impact. Sustainable progress.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ p: { xs: 0, md: 1.2 } }}>
            <Card
              icon={<FlagIcon sx={{ color: "#190888ff" }} />}
              title="Vision"
              items={[
                "Lead India’s transformation toward a sustainable energy future.",
                "Deliver utility‑scale solar that supports national renewable targets.",
                "Protect biodiversity; rejuvenate degraded land around projects.",
                "Enable cleaner industrial growth and resilient communities.",
              ]}
              delay={0.1}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ p: { xs: 0, md: 1.2 } }}>
            <Card
              icon={<TrackChangesIcon sx={{ color: "#190888ff" }} />}
              title="Mission"
              items={[
                "Accelerate clean energy through reliable, large‑scale solar generation.",
                "Align with 500 GW by 2030 and Net Zero by 2070 milestones.",
                "Reduce carbon emissions and conserve resources at every stage.",
                "Create eco‑positive zones with restoration and community programs.",
              ]}
              delay={0.2}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ p: { xs: 0, md: 1.2 } }}>
            <Card
              icon={<InsightsIcon sx={{ color: "#190888ff" }} />}
              title="Approach"
              items={[
                "Consistent performance: 10–12% higher generation vs. norms.",
                "Transparent, compliant delivery from land to grid.",
                "Partnering with government, corporates, and communities.",
                "Sustainability-first decisions for people and planet.",
              ]}
              delay={0.3}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2.5, textAlign: "center" }}>
            <Pill icon={<VerifiedIcon />} text="Performance with proof" />
            <Pill
              icon={<HandshakeIcon />}
              text="Transparent, compliant delivery"
            />
            <Pill icon={<ForestIcon />} text="Sustainability in action" />
          </Grid>

          <Grid item xs={12} sx={{ mt: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                background: "linear-gradient(180deg,#f7faff, #fff)",
                border: "1px solid rgba(25,8,136,0.08)",
                animation: `${fadeUp} 0.7s ease-out 0.4s both`,
              }}
            >
              <Typography sx={{ color: "#2e2e2e", fontWeight: 700, mb: 0.6 }}>
                Sustainability in Action
              </Typography>
              <Typography sx={{ color: "#4b4b4b", lineHeight: 1.8 }}>
                Each megawatt we produce prevents nearly 1,500 tons of CO₂
                emissions annually, revitalizes ecosystems through tree
                plantation and land rehabilitation, and supports local
                employment through skill development and community welfare
                initiatives. We don’t just generate clean energy — we help
                nature thrive alongside progress.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid sx={{ width: "100vw" }}>
          <FooterSection />
        </Grid>

        <AuthModalMUI
          setOpenModal={setOpenModal}
          open={openModal}
          handleClose={handleClose}
        />
      </Grid>
    </>
  );
};

export default AboutUs;
