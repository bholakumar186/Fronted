import Header from "../components/navBar";
import FooterSection from "../components/footer";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  keyframes,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CarrerImage from "../assets/carrerImage.jpg";
import Lenis from "@studio-freight/lenis";
import AuthModalMUI from "./loginSignup";
import ApplyJobModal from "./applyjob";
import axios from "axios";
import { debounce } from "lodash";
import { supabase } from "../lib/supabaseClient";

const parseJsonArray = (str) => {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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

const JobDetailsDialog = ({ open, onClose, job }) => {
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const responsibilities = parseJsonArray(job?.key_responsibilities);
  const requiredSkills = parseJsonArray(job?.required_skills);
  const niceSkills = parseJsonArray(job?.nice_to_have_skills);
  const locations = parseJsonArray(job?.locations);

  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {job.job_title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        {job.job_description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {job.job_description}
            </Typography>
          </Box>
        )}

        {responsibilities.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Key Responsibilities
            </Typography>
            <ul style={{ marginTop: 4, paddingLeft: 20 }}>
              {responsibilities.map((item, i) => (
                <li key={i}>
                  <Typography variant="body2">{item}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}

        {requiredSkills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Required Skills
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, gap: 1 }}
            >
              {requiredSkills.map((s, i) => (
                <Chip key={i} label={s} variant="outlined" size="small" />
              ))}
            </Stack>
          </Box>
        )}

        {niceSkills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Nice to Have
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, gap: 1 }}
            >
              {niceSkills.map((s, i) => (
                <Chip
                  key={i}
                  label={s}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1.5}>
          {typeof job.vacancies === "number" && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600}>
                Vacancies:
              </Typography>
              <Typography variant="body2">{job.vacancies}</Typography>
            </Grid>
          )}
          {locations.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600}>
                Locations:
              </Typography>
              <Typography variant="body2">{locations.join(", ")}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button variant="contained" onClick={() => setOpenApplyModal(true)}>
          Apply Now
        </Button>
      </CardActions>

      <ApplyJobModal
        open={openApplyModal}
        handleClose={() => setOpenApplyModal(false)}
        job={job}
        openApplyModal={openApplyModal}
        setOpenApplyModal={setOpenApplyModal}
      />
    </Dialog>
  );
};

const Carrers = ({ setOpenModal, openModal, handleClose }) => {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [minVacancies, setMinVacancies] = useState("");
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const locationOptions = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (Array.isArray(j.locations))
        j.locations.forEach((loc) => set.add(loc));
    });
    return Array.from(set);
  }, [jobs]);

  const debouncedSetQuery = useCallback(
    debounce((value) => setQuery(value), 400),
    []
  );

  const handleQueryChange = (e) => {
    debouncedSetQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPage(1);
  };

  const handleMinVacanciesChange = (e) => {
    setMinVacancies(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handlePageChange = (_e, value) => setPage(value);

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setMinVacancies("");
    setPage(1);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: pageSize,
      };

      if (query) params.search = query;
      if (location) params.location = location;
      if (minVacancies) params.minVacancies = minVacancies;

      const response = await axios.get("/api/jobs", {
        params,
      });
      console.log("API Response:", response);
      console.log("API Params:", typeof response);

      setJobs(response?.data?.jobs || []);
      setTotal(response?.data?.total || 0);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message || "Failed to load jobs. Please try again."
      );
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query, location, minVacancies]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handleOpen = (job) => {
    setSelected(job);
    setOpen(true);
  };

  const handleCloseTP = () => setOpen(false);

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

  return (
    <>
      <Header
        setOpenModal={setOpenModal}
        openModal={openModal}
        userData={userData}
      />

      <Grid
        item
        sx={{
          width: "100%",
          height: "15rem",
          position: "relative",
          overflow: "hidden",
          mt: "4rem",
        }}
      >
        <Box
          component="img"
          src={CarrerImage}
          alt="Careers"
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
            top: "10%",
            left: "25%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
            animation: `${textAnimate} 6s ease-in-out infinite`,
            maxWidth: "960px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
              color: "#d47006ff",
            }}
          >
            Current Openings
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
              color: "#50d78fff",
            }}
          >
            Explore opportunities that power a sustainable future.
          </Typography>
        </Box>
      </Grid>

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 6 },
          backgroundColor: "#ddeff5ff",
        }}
      >
        <Box
          sx={{
            mb: 2.5,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "Loading jobs..."
                : `Showing ${jobs.length} of ${total} roles`}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="page-size-label">Per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pageSize}
                label="Per page"
                onChange={handlePageSizeChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Search title or description"
              onChange={handleQueryChange}
              sx={{ minWidth: 260, flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                value={location}
                label="Location"
                onChange={handleLocationChange}
              >
                <MenuItem value="">All</MenuItem>
                {locationOptions.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={clearFilters} variant="text">
              Clear filters
            </Button>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Job Cards */}
        {!loading && jobs.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs found matching your filters.
            </Typography>
          </Box>
        )}

        <Grid container spacing={2.5}>
          {jobs.map((job, idx) => (
            <Grid
              item
              xs={12}
              key={job.id || `${job.job_title}-${idx}`}
              sx={{ perspective: "1200px" }}
            >
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  display: "flex",
                  width: "93vw",
                  flexDirection: "column",
                  transform: "translateZ(0) scale(1)",
                  transition:
                    "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: 6,
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "box-shadow 200ms ease",
                    "&:hover": { transform: "none" },
                  },
                }}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {job.job_title}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mb: 1.5 }}
                  >
                    {job.salary_range && (
                      <Chip size="small" label={job.salary_range} />
                    )}
                    {typeof job.vacancies === "number" && (
                      <Chip
                        size="small"
                        label={`${job.vacancies} Vacancies`}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {job.job_description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ mt: "auto", px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => handleOpen(job)}>
                    More details
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleOpen(job)}
                  >
                    Apply / View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              shape="rounded"
            />
          </Box>
        )}

        <JobDetailsDialog open={open} onClose={handleCloseTP} job={selected} />
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

export default Carrers;
