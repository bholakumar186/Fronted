import { useState, useEffect } from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Menu,
} from "@mui/material";
import logo from "../assets/logo.png";
import ReusableButton from "../atoms/reusableButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { ABOUT_US, HOME_ROUTE, CONTACT_US, CARRERS } from "../constants";
import { supabase } from "../lib/supabaseClient";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";

const getStyle = (theme) => ({
  headerTransgulfText: {
    fontWeight: 800,
    color: theme.palette.logoBlue,
    fontSize: "1.1rem",
    fontFamily: "'Nunito', sans-serif",
  },
  navLinkTextStyleHeader: {
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: theme.palette.logoBlue,
    "&:hover": { color: theme.palette.mediumBlue },
    transition: "color 0.2s",
    fontFamily: "'Nunito', sans-serif",
  },
});

const Header = ({ setOpenModal, userData }) => {
  const theme = useTheme();
  const style = getStyle(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [menuAnchor, setMenuAnchor] = useState(null); 
  const menuOpen = Boolean(menuAnchor);               

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = ["Home", "About", "Carrers", "Contact us"];

  useEffect(() => {
    switch (location.pathname) {
      case HOME_ROUTE:
        setActiveLink("Home"); break;
      case ABOUT_US:
        setActiveLink("About"); break;
      case CARRERS:
        setActiveLink("Carrers"); break;
      case CONTACT_US:
        setActiveLink("Contact us"); break;
      default:
        setActiveLink(""); break;
    }
  }, [location.pathname]);

  useEffect(() => {},[]);  

  const handleNavClick = (item) => {
    setActiveLink(item);

    switch (item) {
      case "Home":
        if (location.pathname !== HOME_ROUTE) navigate(HOME_ROUTE);
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "Contact us":
        if (location.pathname !== CONTACT_US) navigate(CONTACT_US);
        break;
      case "About":
        if (location.pathname !== ABOUT_US) navigate(ABOUT_US);
        break;
      case "Carrers":
        if (location.pathname !== CARRERS) navigate(CARRERS);
        break;
      default:
        break;
    }

    if (isMobile) setDrawerOpen(false);
  };

  const handleGetStartedClick = () => setOpenModal?.(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuAnchor(null);
    setDrawerOpen(false);
    navigate(HOME_ROUTE);
    window.location.reload()
  };

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const avatarLabel = (userData?.email || "U").trim().charAt(0).toUpperCase();

  const handleMyProfile = () => {
    navigate("/profile");
    handleMenuClose();
    if (isMobile) setDrawerOpen(false);
  };

  const handleMyApplication = () => {
    navigate("/my-application"); 
    handleMenuClose();
    if (isMobile) setDrawerOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.white,
        borderBottom: `1px solid ${theme.palette.logoBlue}`,
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center">
          <img src={logo} alt="Logo" style={{ height: "5rem", width: "5rem" }} />
          <Typography sx={style.headerTransgulfText}>
            Transgulf Global Power Limited
          </Typography>
        </Stack>

        {isMobile ? (
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="end"
              sx={{ color: theme.palette.logoBlue }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{ sx: { backgroundColor: "#f5f5f5" } }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.logoBlue}`,
                  background: "#e0e0e0",
                }}
              >
                <Typography variant="h6">Menu</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <List sx={{ width: 250, background: "#f5f5f5", height: "100%", my: "1.5rem" }}>
                {navItems.map((item) => (
                  <ListItem
                    key={item}
                    onClick={() => handleNavClick(item)}
                    sx={{ cursor: "pointer", borderBottom: "none" }}
                  >
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        sx: {
                          ...style.navLinkTextStyleHeader,
                          color:
                            activeLink === item
                              ? theme.palette.logoBlue
                              : theme.palette.text.primary,
                        },
                      }}
                    />
                  </ListItem>
                ))}

                {userData ? (<>
                  <ListItem onClick={handleMyProfile}>
                      <PersonIcon sx={{ mr: 1, color: theme.palette.logoBlue }} />
                      <ListItemText primary="My Profile" />
                    </ListItem>

                    <ListItem onClick={handleMyApplication}>
                      <DescriptionIcon sx={{ mr: 1, color: theme.palette.logoBlue }} />
                      <ListItemText primary="My Application" />
                    </ListItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <ListItem>
                    <ReusableButton
                      width="100%"
                      color={theme.palette.white}
                      variant="contained"
                      label="Get Started"
                      onClick={() => {
                        setDrawerOpen(false);
                        setOpenModal?.(true);
                      }}
                      my="1.5rem"
                    />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Stack direction="row" alignItems="center" spacing={3}>
            {navItems.map((item) => (
              <Typography
                key={item}
                onClick={() => handleNavClick(item)}
                sx={{
                  ...style.navLinkTextStyleHeader,
                  position: "relative",
                  cursor: "pointer",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-4px",
                    left: 0,
                    width: activeLink === item ? "100%" : 0,
                    height: "2px",
                    backgroundColor: theme.palette.logoBlue,
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": { width: "100%" },
                }}
              >
                {item}
              </Typography>
            ))}

            {userData ? (
              <>
                <Tooltip title={userData.email || "Account"}>
                  <Button
                    onClick={handleMenuOpen}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      textTransform: "none",
                      border: `1px solid ${theme.palette.logoBlue}`,
                      color: theme.palette.logoBlue,
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.6,
                      gap: 1,
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                      {avatarLabel}
                    </Avatar>
                    <Typography variant="body2" sx={{ maxWidth: 160 }} noWrap>
                      Welcome
                    </Typography>
                  </Button>
                </Tooltip>

                <Menu
                  sx={{ mt: 0.5  }}
                  anchorEl={menuAnchor} 
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleMyProfile}>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleMyApplication}>
                    <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                    My Application
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <ReusableButton
                width="8.5rem"
                color={theme.palette.white}
                variant="contained"
                label="Get Started"
                onClick={handleGetStartedClick}
              />
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
