import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const theme = useTheme()

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={props.label || "Password"}
      fullWidth
      required
      type={!showPassword ? "text" : "password"}
      variant="outlined"
      onChange={props.onChange}
      InputProps={{
        sx: {
          height: "3rem",
          "& .MuiInputBase-input": {
            px: "1rem",
            fontSize: "1.2rem",
            lineHeight: "1.2rem",
          },
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              sx={{ color: theme.palette.lightOrange }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.lightOrange,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.lightOrange,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.white,
          },
        },
        input: { color: theme.palette.white },
        label: { color: theme.palette.lightestGrey, fontSize: "0.75rem" },
      }}
    />
  );
};

const ReusableTextField = ({
  label,
  type = "text",
  required = false,
  fullWidth = true,
  onChange
}) => {
const theme = useTheme()

  return (
    <TextField
      label={label}
      fullWidth={fullWidth}
      required={required}
      type={type}
      onChange={onChange}
      variant="outlined"
      InputProps={{
        sx: {
          height: "3rem",
          "& .MuiInputBase-input": {
            px: "1rem",
            fontSize: "0.9rem",
            lineHeight: "1.2rem",
          },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.lightOrange,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.lightOrange,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.white,
          },
        },
        input: { color: theme.palette.white },
        label: { color: theme.palette.lightestGrey, fontSize: "0.75rem" },
      }}
    />
  );
};
export { PasswordField, ReusableTextField };
