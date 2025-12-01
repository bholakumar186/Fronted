import { Button, useTheme } from "@mui/material";
import "@fontsource/nunito";

const ReusableButton = (props) => {
  const theme = useTheme();

  return (
    <>
      <Button
        color={props.color}
        onClick={props.onClick}
        startIcon={props.startIcon}
        sx={{
          fontWeight: props.fontWeight || 550,
          borderRadius: "0.5rem",
          textTransform: "none",
          fontFamily: "'Nunito', sans-serif",
          height: props.height,
          width: props.width,
          my: props.my,
          ...(props.variant === "contained"
            ? {
                backgroundColor:
                  props.backgroundColor || theme.palette.buttonBackgroundBlue,
                color: props.color,
                "&:hover": { backgroundColor: props.hoverColor || "#007bb8" },
              }
            : {}),
          ...(props.variant === "outlined"
            ? {
                border: `1px solid ${props.borderColor}`,
                color: props.color,
                "&:hover": { backgroundColor: "rgba(12,120,8,0.08)" },
              }
            : {}),
        }}
      >
        {props.label}
      </Button>
    </>
  );
};

export default ReusableButton;
