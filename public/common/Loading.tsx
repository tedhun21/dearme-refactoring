import { CircularProgress, circularProgressClasses } from "@mui/material";

export default function Loading() {
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      size={20}
      thickness={5}
      sx={{
        color: "#ffffff",
        animationDuration: "550ms",
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: "round",
        },
      }}
    />
  );
}
