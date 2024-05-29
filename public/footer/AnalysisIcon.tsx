type IconProps = {
  className?: string;
  isHovered?: boolean;
  color?: string;
};
export default function AnalysisIcon({
  className,
  isHovered,
  color,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5357 1.57004C22.9642 2.16728 27.2735 6.47681 27.8703 11.9053L27.3383 11.8247V12.0845H17.3564V2.1019H17.6163L17.5357 1.57004Z"
        stroke={
          color === "dark" && isHovered
            ? "#DED0B6"
            : color === "dark"
              ? "#FBFAF2"
              : color === "white" && isHovered
                ? "#143422"
                : color === "white" && isHovered
                  ? ""
                  : "#928C7F"
        }
        fill={color === "dark" ? "#143422" : "none"}
        strokeWidth="2.8"
      />
      <path
        d="M13.1129 15.9167H13.114H22.4624C22.0081 21.2965 17.4973 25.5215 12 25.5215C6.20118 25.5215 1.5 20.8203 1.5 15.0215C1.5 9.68797 5.47699 5.28301 10.6271 4.61043V4.62787L10.9483 4.60715L10.8784 5.06859H11.1368V13.9392C11.1368 14.4634 11.3449 14.9662 11.7155 15.337C12.086 15.7078 12.5887 15.9164 13.1129 15.9167ZM22.5666 14.4545C22.5667 14.4542 22.5667 14.454 22.5665 14.4546L22.5666 14.4545Z"
        stroke={
          color === "dark" && isHovered
            ? "#DED0B6"
            : color === "dark"
              ? "#FBFAF2"
              : color === "white" && isHovered
                ? "#143422"
                : color === "white" && isHovered
                  ? ""
                  : "#928C7F"
        }
        fill={color === "dark" ? "#143422" : "none"}
        strokeWidth="2.8"
      />
    </svg>
  );
}
