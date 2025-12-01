import { Box, Typography, Container, Stack, useTheme } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";
import React from "react";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
});

const ContactIntro = () => {
 
  const theme = useTheme()  

  return (
    <Box
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      sx={{
        width: "100vw",
        py: { xs: 6, md: 8 },
        px: "0.5rem",
        position: "relative",
        overflow: "hidden",
        color: theme.palette.white,
        textAlign: "center",
      }}
    >
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background:
            "linear-gradient(-45deg, #2e353d, #324a6e, #1b2735, #3b556d)",
          backgroundSize: "400% 400%",
        }}
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -60, 0],
            opacity: [0.3, 0.7, 0.3],
            x: [0, Math.sin(i) * 20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          style={{
            position: "absolute",
            bottom: `${Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            width: 10 + i * 3,
            height: 10 + i * 3,
            borderRadius: "50%",
            backgroundColor: "rgba(255,183,0,0.15)",
            filter: "blur(2px)",
          }}
        />
      ))}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div variants={fadeUp(0)}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 3,
              letterSpacing: 1,
              color: theme.palette.lightOrange,
              textShadow: "0 0 15px rgba(255,183,0,0.4)",
              background:
                "linear-gradient(90deg, #ffb700 0%, #fff7e1 50%, #ffb700 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shine 5s linear infinite",
              "@keyframes shine": {
                to: { backgroundPosition: "200% center" },
              },
            }}
          >
            Let’s Build a Sustainable Future Together
          </Typography>
        </motion.div>

        {/* Description */}
        <motion.div variants={fadeUp(0.2)}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              mb: 4,
              opacity: 0.95,
            }}
          >
            At <strong>Trans Gulf Global Power Limited</strong>, we’re committed to
            powering a sustainable future through advanced solar solutions.
            Whether you’re exploring solar energy for your home, business, or
            industrial project, our team is here to guide you with clear answers
            and dependable support.
          </Typography>
        </motion.div>

        {/* Contact Info */}
        <Stack
          component={motion.div}
          variants={fadeUp(0.4)}
          direction="column"
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          {[ 
            { icon: <Phone />, label: "Phone", value: "+91 9931066620" },
            { icon: <Email />, label: "Email", value: "support@transgulfglobalpowerlimited.in" },
            { icon: <LocationOn />, label: "Office Address", value: "Kankarbagh, Patna, Bihar" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 150 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              >
                {React.cloneElement(item.icon, { sx: { color: "#ffb700" } })}
              </motion.div>
              <Typography variant="body1">
                <strong>{item.label}:</strong> {item.value}
              </Typography>
            </motion.div>
          ))}
        </Stack>

        {/* Social + Thank you */}
        <motion.div variants={fadeUp(0.6)}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "#ffb700",
            }}
          >
            Stay Connected
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Follow us on social media for updates on new projects, clean energy
            insights, and company initiatives. <br />
            (Links coming soon on our official website.)
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Thank you for choosing <strong>Trans Gulf Global Power Limited</strong> —{" "}
            your trusted partner in transforming sunlight into lasting power.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactIntro;
