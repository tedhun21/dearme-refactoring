type IconProps = {
  className?: string;
};

export default function TodoCheckTrueIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="white" />
      <path d="M10.001 20C4.48011 19.9939 0.00606298 15.5203 0 10V9.80001C0.109942 4.30455 4.63505 -0.0720257 10.1317 0.000898217C15.6283 0.0738221 20.0357 4.5689 19.9998 10.0653C19.9639 15.5618 15.4981 19.9989 10.001 20ZM5.41054 9.59001L4.0004 11L8.0008 15L16.0016 7.00001L14.5915 5.58001L8.0008 12.17L5.41054 9.59001Z" />
    </svg>
  );
}
