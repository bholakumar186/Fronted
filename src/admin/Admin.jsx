import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  PersonSearch as PersonSearchIcon,
  ContactSupport as ContactSupportIcon,
  Help as HelpIcon,
  Category as CategoryIcon,
  Download as DownloadIcon,
  DeleteSweep as DeleteSweepIcon,
  DeleteForever as DeleteForeverIcon,
  ArrowUpward as ArrowUpwardIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Person as PersonIcon,
  WorkOutline as WorkOutlineIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  Chip,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo.png";
import ReusableButton from "../atoms/reusableButton";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  color: "#333",
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
}));

const NavMenuButton = styled(Button)(({ theme }) => ({
  color: "#1565c0",
  textTransform: "none",
  fontWeight: 500,
  borderRadius: 8,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#bbdefb",
  },
}));

const menuItems = [
  {
    text: "Main",
    icon: <DashboardIcon />,
    children: [
      { text: "Dashboard", icon: <DashboardIcon /> },
      { text: "Users", icon: <PeopleIcon /> },
      { text: "Payment", icon: <PaymentIcon /> },
      { text: "Team", icon: <GroupIcon /> },
    ],
  },

  { divider: true },
  { heading: "JOBS" },
  {
    text: "Jobs",
    icon: <WorkIcon />,
    children: [
      { text: "All Jobs", icon: <WorkOutlineIcon /> },
      { text: "Add New Job", icon: <WorkIcon /> },
      { text: "Categories", icon: <CategoryIcon /> },
      { divider: true },
      { text: "Archived Jobs", icon: <DeleteSweepIcon /> },
    ],
  },
  { text: "Applicant", icon: <PersonSearchIcon /> },
  { divider: true },
  { heading: "SUPPORT" },
  {
    text: "Queries",
    icon: <ContactSupportIcon />,
    children: [
      { text: "All Queries", icon: <ContactSupportIcon /> },
      { text: "Unread", icon: <ContactSupportIcon color="error" /> },
      { text: "Resolved", icon: <ContactSupportIcon color="success" /> },
    ],
  },
  { divider: true },
  { heading: "MEDIA" },
  { text: "FAQs", icon: <HelpIcon /> },
  { text: "Categories", icon: <CategoryIcon /> },
];

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setActiveMenuItem(null);
  };

  const handleSubMenuOpen = (event, item) => {
    setSubMenuAnchorEl(event.currentTarget);
    setActiveMenuItem(item);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
    setActiveMenuItem(null);
  };

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const applicationsData = [
    12, 19, 15, 27, 22, 35, 28, 41, 38, 52, 48, 61, 55, 73, 68, 82, 79, 94, 88,
    105, 112, 128, 135, 149, 142, 168, 175, 189, 182, 200,
  ];

  const renderMenuItems = (isMobile = false) => (
    <>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.divider && <Divider sx={{ my: 1 }} />}

          {item.heading && (
            <Typography
              variant="caption"
              fontWeight="bold"
              color="#1565c0"
              sx={{
                px: 2,
                py: 1,
                display: "block",
                bgcolor: "#e3f2fd",
              }}
            >
              {item.heading}
            </Typography>
          )}

          {item.text && !item.children && (
            <MenuItem
              onClick={handleMenuClose}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemIcon sx={{ color: "#1565c0", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
          )}

          {item.text && item.children && (
            <>
              <MenuItem
                onClick={(e) => {
                  if (!isMobile) {
                    handleSubMenuOpen(e, item);
                  }
                }}
                onMouseEnter={(e) => !isMobile && handleSubMenuOpen(e, item)}
                sx={{ borderRadius: 2, my: 0.5 }}
              >
                <ListItemIcon sx={{ color: "#1565c0", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <ListItemIcon sx={{ ml: "auto", minWidth: 0 }}>
                  <ArrowRightIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <Menu
                anchorEl={subMenuAnchorEl}
                open={Boolean(subMenuAnchorEl) && activeMenuItem === item}
                onClose={handleSubMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                  sx: {
                    mt: isMobile ? 0 : -8,
                    ml: isMobile ? 0 : 1,
                    width: isMobile ? "100%" : 240,
                    bgcolor: "#ffffff",
                  },
                }}
              >
                {item.children.map((subItem, subIndex) => (
                  <React.Fragment key={subIndex}>
                    {subItem.divider && <Divider />}
                    {subItem.text && (
                      <MenuItem onClick={handleMenuClose} sx={{ pl: 4 }}>
                        {subItem.icon && (
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {subItem.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={subItem.text} />
                      </MenuItem>
                    )}
                  </React.Fragment>
                ))}
              </Menu>
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <StyledAppBar position="fixed">
          <Toolbar>
            {isMobile && (
              <>
                <IconButton edge="start" onClick={handleMenuOpen}>
                  <MenuIcon sx={{ color: "#1565c0" }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      width: 280,
                      mt: 1,
                      bgcolor: "#e3f2fd",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#1565c0">
                      MAIN MENU
                    </Typography>
                  </Box>
                  {renderMenuItems()}
                </Menu>
              </>
            )}
            <img
              src={logo}
              alt="Logo"
              style={{ height: "5rem", width: "5rem", scale: "1.2" }}
            />

            <Typography
              variant="h7"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold", color: "#1565c0" }}
            >
              Transgulf Global Power Limited
            </Typography>

            {!isMobile && (
              <Stack direction="row" spacing={2} alignItems="center">
                {menuItems.map((item, index) => {
                  if (item.divider || item.heading) return null; // Skip dividers & headings in horizontal bar

                  if (item.children) {
                    // Items WITH submenu (Jobs, Queries)
                    return (
                      <Box key={index} sx={{ position: "relative" }}>
                        <NavMenuButton
                          startIcon={item.icon}
                          endIcon={
                            <ArrowRightIcon sx={{ fontSize: 16, ml: 0.5 }} />
                          }
                          onMouseEnter={(e) => handleSubMenuOpen(e, item)}
                          sx={{ fontWeight: 500 }}
                        >
                          {item.text}
                        </NavMenuButton>

                        {/* Dropdown Submenu on Hover */}
                        <Menu
                          anchorEl={subMenuAnchorEl}
                          open={
                            Boolean(subMenuAnchorEl) && activeMenuItem === item
                          }
                          onClose={handleSubMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          MenuListProps={{
                            onMouseLeave: handleSubMenuClose,
                          }}
                          PaperProps={{
                            sx: {
                              mt: 1,
                              boxShadow: 3,
                              borderRadius: 2,
                              minWidth: 220,
                            },
                          }}
                        >
                          {item.children.map((subItem, subIndex) => (
                            <MenuItem
                              key={subIndex}
                              onClick={handleSubMenuClose}
                              sx={{ gap: 1 }}
                            >
                              {subItem.icon && (
                                <ListItemIcon
                                  sx={{ minWidth: 36, color: "#1565c0" }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                              )}
                              <ListItemText>{subItem.text}</ListItemText>
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    );
                  }

                  // Regular items without children
                  return (
                    <NavMenuButton
                      key={index}
                      startIcon={item.icon}
                      onClick={() => console.log("Navigate to", item.text)}
                    >
                      {item.text}
                    </NavMenuButton>
                  );
                })}
              </Stack>
            )}
          </Toolbar>
        </StyledAppBar>
        <Box
          component="main"
          sx={{ pt: 10, px: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            gap={2}
          >
            <Typography
              variant="h4"
              color={"#1565c0"}
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <DashboardIcon fontSize="large" />
              Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <ReusableButton
                label="Download Report"
                color="white"
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  borderRadius: 50,
                  textTransform: "none",
                  px: 4,
                }}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
              >
                Delete Old
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
              >
                Delete All
              </Button>
            </Box>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Role:
              </Typography>
              <Chip
                label="Admin"
                size="small"
                sx={{ bgcolor: "#e0e0e0", mt: 0.5 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Access Level:
              </Typography>
              <Chip
                label="Full Admin Access"
                color="primary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Users:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                —
              </Typography>
            </Box>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={5}>
            <Paper
              elevation={0}
              sx={{ p: 3, textAlign: "center", borderRadius: 3, flex: 1 }}
            >
              <WorkOutlineIcon sx={{ fontSize: 40, color: "#666" }} />
              <Typography variant="h3" fontWeight="bold">
                43
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Jobs
              </Typography>
              <Chip
                icon={<ArrowUpwardIcon />}
                label="0.00% Since Last Month"
                size="small"
                sx={{ mt: 1, bgcolor: "#e8f5e9" }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{ p: 3, textAlign: "center", borderRadius: 3, flex: 1 }}
            >
              <DescriptionIcon sx={{ fontSize: 40, color: "#666" }} />
              <Typography variant="h3" fontWeight="bold">
                406
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Job Applicants
              </Typography>
              <Chip
                icon={<ArrowUpwardIcon />}
                label="12.5% Since Last Month"
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{ p: 3, textAlign: "center", borderRadius: 3, flex: 1 }}
            >
              <CurrencyRupeeIcon sx={{ fontSize: 40, color: "#666" }} />
              <Typography variant="h3" fontWeight="bold">
                ₹38,580
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Payment Collected
              </Typography>
              <Chip
                icon={<ArrowUpwardIcon />}
                label="100.00% Since Last Month"
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{ p: 3, textAlign: "center", borderRadius: 3, flex: 1 }}
            >
              <PersonIcon sx={{ fontSize: 40, color: "#666" }} />
              <Typography variant="h3" fontWeight="bold">
                678
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Users
              </Typography>
              <Chip
                icon={<ArrowUpwardIcon />}
                label="8.2% Since Last Month"
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            </Paper>
          </Stack>
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 3, bgcolor: "#fafafa", mb: 4 }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Today's Summary
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              divider={<Divider orientation="vertical" flexItem />}
              spacing={4}
              sx={{ mt: 2 }}
            >
              <Box flex={1} textAlign="center">
                <Typography variant="h4" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Job Applications
                </Typography>
              </Box>
              <Box flex={1} textAlign="center">
                <Typography variant="h4" fontWeight="bold">
                  ₹0
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Payment Collected
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: "#fff" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Daily Job Applications (Last 30 Days)
            </Typography>
            <LineChart
              xAxis={[
                {
                  data: last30Days,
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: "end",
                    fontSize: 12,
                  },
                },
              ]}
              series={[
                {
                  data: applicationsData,
                  label: "Applications",
                  color: "#1976d2",
                  curve: "catmullRom",
                },
              ]}
              height={350}
              margin={{ left: 60, right: 20, top: 50, bottom: 70 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
}
