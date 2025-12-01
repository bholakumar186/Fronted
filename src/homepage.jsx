import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  CssBaseline,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  FaPiggyBank,
  FaChartLine,
  FaRecycle,
  FaHandsHelping,
  FaBuilding,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import EcoScene from "./components/ecoScene";
import iso from "./assets/Iso.png";
import mcaLogo from "./assets/Ministry_of_Corporate_Affairs.png";
import msmelogo from "./assets/msme-logo.png";
import startupIndia from "./assets/startup_india.png";
import heroSecVideo from "./assets/heroSecVideo.mp4";
import { FaQuoteLeft } from "react-icons/fa";
import rajeshImg from "./assets/Rajesh.jpg";
import priyaImg from "./assets/Priya.jpg";
import anjaliImg from "./assets/Anjali.jpg";
import { Add, Remove } from "@mui/icons-material";
import "@fontsource/nunito";
import ReusableButton from "./atoms/reusableButton";
import AuthModalMUI from "./pages/loginSignup";
import FooterSection from "./components/footer";
import Lenis from "@studio-freight/lenis";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import BoltIcon from "@mui/icons-material/Bolt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { motion } from "framer-motion";
import Header from "./components/navBar";
import { supabase } from "./lib/supabaseClient";
import { set } from "lodash";
import { Link } from "react-router";
const benefitsData = [
  {
    title: "Save on Electricity Costs",
    icon: <FaFileInvoiceDollar size={50} color="#ffb700" />,
    desc: "Reduce your monthly bills by generating your own clean energy.",
  },
  {
    title: "Increase Your Home’s Value",
    icon: <FaBuilding size={50} color="#00e5ff" />,
    desc: "Homes with solar systems sell faster and at higher prices.",
  },
  {
    title: "Profit From Your Solar Panels",
    icon: <FaPiggyBank size={50} color="#ffb700" />,
    desc: "Sell excess energy back to the grid and earn passive income.",
  },
  {
    title: "Reduce Pollution",
    icon: <FaRecycle size={50} color="#00e5ff" />,
    desc: "Cut your carbon footprint and help fight climate change.",
  },
  {
    title: "Use Energy Guilt-Free",
    icon: <FaHandsHelping size={50} color="#ffb700" />,
    desc: "Enjoy clean power that’s renewable, sustainable, and safe.",
  },
  {
    title: "Earn Tax Credits & Incentives",
    icon: <FaChartLine size={50} color="#00e5ff" />,
    desc: "Take advantage of government benefits for going solar.",
  },
];

const testimonials = [
  {
    quote:
      "Our factory needed a reliable solar system — Trans Gulf delivered. They reduced our costly downtime and ensured consistent solar park operations. Highly recommended for any industry seeking reliable solar solutions!",
    name: "Ms. Priya Singh",
    title: "Operations Director, Anant Industries",
    image: priyaImg,
  },
  {
    quote:
      "Switching to Trans Gulf's solar system was the best financial decision we made. Our electricity bills are down 70%, and their team handled everything with professionalism — from design to installation.",
    name: "Rajesh Kumar",
    title: "Homeowner, Bangalore",
    image: rajeshImg,
  },
  {
    quote:
      "Our family is thrilled to be powered by the sun, thanks to Trans Gulf. We’ve significantly cut bills and are making a real difference to the planet. Their commitment to sustainability is inspiring!",
    name: "Anjali Sharma",
    title: "Eco-Conscious Homeowner, Pune",
    image: anjaliImg,
  },
];

const faqs = [
  {
    q: "1. What does Transgulf Global Power Limited do?",
    a: "We specialize in providing renewable energy solutions through advanced solar panel systems Our company focuses on designing and maintaining solar power systems for businesses, and government organizations to promote clean and sustainable energy.",
  },
  {
    q: "2. Why Should I Go Solar?",
    a: "Switching to solar energy helps you save on electricity bills, generate your own clean power, and reduce your carbon footprint. It’s an environmentally friendly choice that also increases your property’s value and offers long-term energy independence.",
  },
  {
    q: "3. How long does the installation process typically take?",
    a: "Most residential solar installations are completed within 2–5 days depending on system size and roof type. For commercial systems, we handle permitting and ensure a smooth experience.",
  },
  {
    q: "4. Are there government incentives available?",
    a: "Yes! The Indian government offers various tax credits and capital subsidies for renewable projects. We'll guide you through the application process to maximize your solar savings.",
  },
  {
    q: "5. What kind of warranty and maintenance is included?",
    a: "We provide performance and warranty certificates for 5–10 years. Our team also offers easy service and maintenance packages to keep your system performing efficiently.",
  },
  {
    q: "6. What happens during cloudy days or power outages?",
    a: "Your system is designed to ensure optimal efficiency. For backup needs, we offer hybrid systems with battery storage to maintain power during outages.",
  },
];

const certs = [
  {
    title: "Safety Compliance Certification",
    desc: "Certified for adhering to global workplace safety and operational compliance standards.",
    image: mcaLogo,
  },
  {
    title: "Environmental Excellence Award",
    desc: "Awarded for our commitment to sustainable energy and environmental responsibility.",
    image: msmelogo,
  },
  {
    title: "ISO 9001:2015 Certification",
    desc: "Recognized for maintaining international quality management standards across all operations.",
    image: iso,
  },
  {
    title: "Recognized by Startup India",
    desc: "Officially recognized by Startup India for innovation and contribution to India’s renewable energy ecosystem.",
    image: startupIndia,
  },
];

const items = [
  {
    icon: <PublicIcon fontSize="medium" />,
    value: "Substantial",
    label: "Global Carbon Footprint Mitigation",
  },
  {
    icon: <SchoolIcon fontSize="medium" />,
    value: "Strategic",
    label: "Modernizing Educational Sector Infrastructure",
  },
  {
    icon: <BoltIcon fontSize="medium" />,
    value: "Pioneering",
    label: "Next-Generation Grid Resiliency Solutions",
  },
  {
    icon: <BusinessCenterIcon fontSize="medium" />,
    value: "Strategically",
    label: "Consistent Portfolio Expansion",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01,
      delayChildren: 0.01,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const HeroSection = ({setOpenModal}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ backgroundColor: theme.palette.homeBackgroundBlue }}>
      <Container disableGutters maxWidth={false} xs={12}>
        <Grid
          container
          spacing={{ xs: 4, md: "1rem", lg: "1.5rem" }}
          alignItems={{ md: "center", xs: "flex-start" }}
          direction={{ md: "column", lg: "row", sm: "column", xs: "column" }}
          justifyContent={"center"}
          width={"100%"}
          px={{ xs: "0.8rem" }}
          overflow={"hidden"}
        >
          <Grid item xs={12} lg={3}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#4e4d4dc9",
                mb: { xs: "0.5rem", md: "1rem" },
                lineHeight: { xs: 1.1, md: 1.25 },
                fontSize: {
                  xs: "2rem",
                  sm: "2.4rem",
                  md: "2.8rem",
                  lg: "2.8rem",
                },
                fontFamily: "'Nunito', sans-serif",
                textAlign: { xs: "left", md: "left" },
                mt: { xs: "1rem" },
                letterSpacing: { xs: "0.5px", md: "1px" },
              }}
            >
              Maximum value from <br />
              every megawatt
            </Typography>

            <Typography
              sx={{
                color: theme.palette.white,
                mb: { xs: 3, md: 4 },
                maxWidth: 520,
                lineHeight: 1.6,
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 550,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              We are the market makers, using advanced storage to turn solar
              into a resilient, profitable asset that guarantees superior grid
              stability and returns.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 4 }}
            >

              <ReusableButton
                width={"13rem"}
                color={theme.palette.white}
                variant={"contained"}
                label={"Get Free Consultation"}
                fontWeight={600}
                onClick={() => setOpenModal(true)}
              />
              <ReusableButton
                width={"13rem"}
                color={theme.palette.mediumGreen1}
                variant={"outlined"}
                label={"Calculate Your Savings"}
                borderColor={theme.palette.white}
                fontWeight={800}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} lg={8} sx={{}}>
            <Box
              sx={{
                width: { xs: "70%", sm: "90%", lg: "100%" },
                height: isMobile ? "12rem" : "23rem",
                borderRadius: "0.5rem",
                background: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                ml: "1.5rem",
              }}
            >
              <EcoScene />
            </Box>
          </Grid>
        </Grid>

        <Stack
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          direction={{ xs: "column", md: "row" }}
          sx={{
            p: { xs: 2, sm: 3 },
            pb: { xs: 4, md: 8 },
            maxHeight: "25rem",
            px: { md: "2.1rem" },
            gap: 2.5,
            justifyContent: { xs: "center", md: "space-between" },
          }}
        >
          {items.map((items, i) => (
            <Card
              key={i}
              component={motion.div}
              variants={itemVariants}
              elevation={3}
              sx={{
                flex: "1 1 240px",
                minWidth: 240,
                borderRadius: 3,
                px: 2.5,
                py: 1.5,
                backgroundColor: "#bddcf8ff",
                display: "grid",
                flexDirection: "column",
                gridTemplateColumns: "auto 1fr",
                columnGap: 1.25,
                height: "5rem",
                alignItems: "center",
                // Keep the hover effect for a professional touch
                transition: "transform .25s ease, box-shadow .25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 30px rgba(0,0,0,.12)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "#d96720c9",
                  color: "#050246ff",
                  mr: 0.5,
                }}
              >
                {items.icon}
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    color: theme.palette.skyBlue,
                    lineHeight: 1.1,
                  }}
                >
                  {items.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(121, 100, 4, 1)",
                    fontWeight: 600,
                    mt: 0.25,
                  }}
                >
                  {items.label}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

const AboutSection = () => {
  return (
    <Box
      sx={{
        background: "#7db8f8fe",
        width: "100%",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          width: "100%",
          px: { xs: "1rem", md: "2rem" },
          background: "#7db8f8fe",
        }}
      >
        <Grid
          container
          alignItems="center"
          spacing={0}
          gap={"1.5rem"}
          sx={{ width: "100%", m: 0, p: 0 }}
        >
          <Box
            component="video"
            src={heroSecVideo}
            autoPlay
            loop
            muted
            playsInline
            sx={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "cover",
              borderRadius: "1rem",
              elevation: 0,
            }}
          />

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: { xs: "2rem", md: "3rem", lg: "0.5rem" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 2, color: "#0e5207ff" }}
            >
              About Us
            </Typography>

            <Typography
              sx={{
                color: "#04055eff",
                mb: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
                letterSpacing: 0.2,
                width: "100%",
                textAlign: "justify",
                "& p": {
                  marginBottom: "1.2rem",
                },
              }}
            >
              <p>
                Transgulf Global Power Limited is a leading provider of
                renewable energy and engineering solutions in India. We
                specialize in the design, development, and execution of turnkey
                solar and hybrid power projects that deliver efficiency,
                reliability, and long-term performance.
              </p>

              <p>
                Driven by innovation and backed by technical expertise, we
                provide end-to-end project management — from concept and
                installation to maintenance and optimization. Our commitment to
                operational excellence, sustainability, and quality ensures
                every project meets the highest industry and environmental
                standards.
              </p>

              <p>
                Recognized by{" "}
                <strong style={{ color: "#b94909ff" }}>Startup India</strong>,{" "}
                <strong style={{ color: "#ebe4e4ff" }}>MSME</strong>, and
                certified under{" "}
                <strong style={{ color: "#038925ff" }}>ISO 9001:2015</strong>,
                Transgulf Global Power stands as a trusted partner for
                government bodies, institutions, and private enterprises seeking
                dependable renewable energy solutions.
              </p>

              <p>
                At Transgulf, we don’t just build solar systems —{" "}
                <strong>we empower India’s clean energy transformation.</strong>
              </p>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const CertificationsSection = () => {
  const scrollRef = useRef(null);
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 1;
    let direction = 1;
    const scroll = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += scrollAmount * direction;
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        direction = -1;
      } else if (scrollContainer.scrollLeft <= 0) {
        direction = 1;
      }
    };

    const interval = setInterval(scroll, 2);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ px: "2rem", backgroundColor: "#7db8f8fe" }}>
      <Container disableGutters maxWidth={false}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#0e5207ff",
            mb: 4,
            textAlign: "left",
          }}
        >
          Recognised and Certified By
        </Typography>

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            py: 2,
          }}
        >
          {certs.map((cert, index) => (
            <Card
              key={index}
              sx={{
                flex: "0 0 auto",
                maxWidth: "20rem",
                height: "18rem",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                background: "#a7daedff",
                textAlign: "center",
                p: "0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={cert.image}
                alt={cert.title}
                sx={{
                  width: "5.5rem",
                  height: "5.5rem",
                  objectFit: "contain",
                  borderRadius: "10%",
                  mb: 2,
                }}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#04055eff",
                    mb: 0.5,
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {cert.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#0a4704ff",
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                    textAlign: "center",
                  }}
                >
                  {cert.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

const SolarBenefitsSection = () => {
  const column1 = benefitsData.slice(0, 3);
  const column2 = benefitsData.slice(3, 6);

  const BenefitItem = ({ benefit }) => (
    <Box
      sx={{
        px: "4rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
        borderLeft: "2px solid transparent",
        "&:hover": {
          borderLeftColor: "#00e5ff",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
        },
      }}
    >
      <Box sx={{ mb: 1.5, "& svg": { transition: "transform 0.3s ease" } }}>
        {benefit.icon}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "white",
          mb: 1,
          letterSpacing: 0.5,
        }}
      >
        {benefit.title}
      </Typography>
      <Typography sx={{ color: "#aaa", fontSize: "1rem" }}>
        {benefit.desc}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ py: "1rem", background: "#111428", pr: "1.5rem", overflow: "hidden" }}>
      <Container disableGutters sx={{ m: "1.8rem" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 4,
            letterSpacing: 1,
          }}
        >
          The Premium Benefits of <br />
          <Box component="span" sx={{ color: "#ffb700" }}>
            Solar Energy
          </Box>
        </Typography>

        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Box>
              <Typography
                variant="h5"
                sx={{ color: "#00e5ff", fontWeight: 600, mb: 2, mx: "2rem" }}
              >
                Driving Sustainability & Value
              </Typography>
              <Typography
                sx={{
                  color: "#ccc",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  mx: "2rem",
                }}
              >
                Investing in solar power with Transgulf Global Power goes beyond
                cutting costs. It is a commitment to a healthier planet and a
                smarter financial future. Discover the tangible value we bring
                to your home and portfolio.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={0}>
              <Grid
                item
                xs={6}
                sx={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                {column1.map((benefit, index) => (
                  <BenefitItem key={index} benefit={benefit} />
                ))}
              </Grid>

              <Grid item xs={6}>
                {column2.map((benefit, index) => (
                  <BenefitItem key={index} benefit={benefit} />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const TestimonialsSection = () => {
  return (
    <Box sx={{ py: 10, background: "#7db8f8fe" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: "#002147", mb: 1 }}
          >
            What Our Clients Say
          </Typography>
          <Typography variant="h6" sx={{ color: "#6c757d" }}>
            Real Stories, Real Savings
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            overflow: "hidden",
            position: "relative",
            whiteSpace: "nowrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 4,
              animation: "scroll 30s linear infinite",
              "@keyframes scroll": {
                "0%": { transform: "translateX(0)" },
                "50%": { transform: "translateX(-50%)" },
                "100%": { transform: "translateX(0)" },
              },
              "&:hover": { animationPlayState: "paused" },
            }}
          >
            {[...testimonials, ...testimonials].map((story, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#e8faff",
                  borderRadius: "20px",
                  border: "2px solid #b4ebf6",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                  px: "2rem",
                  width: "26rem",
                  height: "18rem",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    flex: 1,
                    pr: 2,
                  }}
                >
                  <FaQuoteLeft
                    size={22}
                    color="#00a7c4"
                    style={{ marginBottom: "10px" }}
                  />
                  <Typography
                    sx={{
                      color: "#1a1a1a",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      mb: 2,
                      flexGrow: 1,
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      whiteSpace: "normal",
                      maxWidth: "100%",
                    }}
                  >
                    {story.quote}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#002147",
                        fontSize: "0.95rem",
                      }}
                    >
                      — {story.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#6c757d",
                        fontSize: "0.85rem",
                        mt: 0.3,
                      }}
                    >
                      {story.title}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component="img"
                  src={story.image}
                  alt={story.name}
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "contain",
                    border: "3px solid #00bcd4",
                    ml: 2,
                    flexShrink: 0,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box sx={{ py: 10, background: "#7db8f8fe" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: "#002147", mb: 1 }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" sx={{ color: "#6c757d" }}>
            Quick answers to your queries for a brighter future.
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {faqs.map((faq, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={5.5}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  border: "2px solid #00bcd4",
                  borderRadius: "14px",
                  p: 3,
                  background: "#fff",
                  width: "60rem",
                  minHeight: "5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#002147",
                      fontSize: "1rem",
                      flex: 1,
                      pr: 2,
                      wordWrap: "break-word",
                    }}
                  >
                    {faq.q}
                  </Typography>
                  <IconButton
                    onClick={() => handleToggle(index)}
                    sx={{
                      color: "#00bcd4",
                      transition: "transform 0.3s ease",
                      transform:
                        openIndex === index ? "rotate(180deg)" : "none",
                    }}
                  >
                    {openIndex === index ? <Remove /> : <Add />}
                  </IconButton>
                </Box>

                <Collapse in={openIndex === index}>
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "#a47c02ff",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      wordWrap: "break-word",
                    }}
                  >
                    {faq.a}
                  </Typography>
                </Collapse>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography sx={{ color: "#555" }}>
            Still have questions? Our experts are here to help.
          </Typography>
          <Typography
            component="a"
            href="#contact"
            sx={{
              color: "#002147",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Contact Us Today
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const HomePage = ({ setOpenModal, openModal, handleClose }) => {
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
      }
    };
    getSessionToken();
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
    const getSessionData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUserData(data?.session?.user);
      } else {
        console.log("No active session.");
      }

      if (error) {
        console.error("Error getting session:", error.message);
      }
    };
    getSessionData();
  }, []);

  return (
    <Box>
      <CssBaseline />
      <Header
        setOpenModal={setOpenModal}
        openModal={openModal}
        userData={userData}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "4.5rem",
        }}
      >
        <HeroSection setOpenModal={setOpenModal} />
        <AboutSection />
        <CertificationsSection />
        <SolarBenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <FooterSection />
        {openModal && (
          <AuthModalMUI
            setOpenModal={setOpenModal}
            open={openModal}
            handleClose={handleClose}
          />
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
