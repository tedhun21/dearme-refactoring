import { CircularProgress, circularProgressClasses } from "@mui/material";

export default function Loading({ className }: any) {
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      size={20}
      thickness={5}
      sx={{
        color: className?.includes("text-black") ? "#000000" : "#ffffff",
        animationDuration: "550ms",
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: "round",
        },
      }}
    />
  );
}
