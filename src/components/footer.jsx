import { Box, Container, Typography, Grid, Divider } from "@mui/material";
import logo from "../assets/logo.png";

const transDesc = `Trans Gulf Global Power Limited offers innovative, sustainable, and cost-effective solar
energy solutions for personal, industrial, and government applications across India.
Explore our reliable Energy-as-a-Service model with advanced solar technology and
hassle-free installations.`;

const FooterSection = () => {
  return (
    <Box sx={{ backgroundColor: "#111428", color: "#fff", py: 6 }}>
      <Container>
        <Grid
          container
          spacing={6}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  background: "#fff",
                  width: "4rem",
                  height: "4rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  clipPath: "circle()",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: "4.5rem",
                    width: "4.5rem",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: "#00BFA6", fontWeight: "bold" }}
              >
                Trans Gulf Global Power Limited
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#ffb700",
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.9rem",
                  md: "0.95rem",
                  lg: "1rem",
                },

                mx: "5rem",
                mt: {  sm: "-1.5rem", },
                maxWidth: {
                  xs: "90%",
                  sm: "80%",
                  md: "75%",
                  lg: "70%",
                  xl: 1200,
                },
              }}
            >
              Shaping the future of global energy
            </Typography>

            <Typography
              sx={{
                whiteSpace: "pre-line",
                fontSize: "1rem",
                color: "#f9f6f6ff",
                lineHeight: 1.8,
                fontWeight: 500,
                textAlign: "justify",
              }}
            >
              {transDesc}
            </Typography>

            <Typography sx={{ color: "#ffb700", mt: 2, fontSize: "0.9rem" }}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                CIN:
              </Box>{" "}
              U35109BR2025PLC079266
            </Typography>
          </Grid>

          {/* commented out for future use  */}

          {/* <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                height: "300px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230291.54045808292!2d85.15829619999997!3d25.59476880000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a7e3d687d3cd%3A0x65eec2095e303281!2sRana%20Gulf%20Renewable%20Energy%20Limited!5e0!3m2!1sen!2sin!4v1760418979507!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              ></iframe>
            </Box>
          </Grid> */}

          <Grid item xs={12} md={4} sx={{ py: "2.2rem" }}>
            <Typography sx={{ mb: 1, fontWeight: "bold", fontSize: "1.1rem" }}>
              Contact Us
            </Typography>
            <Typography sx={{ color: "#B0BEC5", lineHeight: 1.8 }}>
              support@transgulfglobalpowerlimited.in <br />
              +91 9931066620 <br />
              Kankarbagh, Patna, Bihar
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <Typography
          sx={{ textAlign: "center", color: "#B0BEC5", fontSize: "0.9rem" }}
        >
          © {new Date().getFullYear()} Transgulf Global Power Limited. All
          rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterSection;
