type IconProps = {
  className?: string;
};

export default function PostIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.0012 20.0012H2.00117C1.46524 20.0198 0.945642 19.8151 0.566457 19.4359C0.187272 19.0567 -0.0174554 18.5371 0.00116823 18.0012V8.00117C-0.0174554 7.46524 0.187272 6.94564 0.566457 6.56646C0.945642 6.18727 1.46524 5.98254 2.00117 6.00117H6.00117V2.00117C5.98254 1.46524 6.18727 0.945642 6.56646 0.566457C6.94564 0.187272 7.46524 -0.0174554 8.00117 0.00116823H18.0012C18.5371 -0.0174554 19.0567 0.187272 19.4359 0.566457C19.8151 0.945642 20.0198 1.46524 20.0012 2.00117V12.0012C20.0195 12.537 19.8147 13.0564 19.4355 13.4356C19.0564 13.8147 18.537 14.0195 18.0012 14.0012H14.0012V18.0012C14.0195 18.537 13.8147 19.0564 13.4356 19.4355C13.0564 19.8147 12.537 20.0195 12.0012 20.0012ZM2.00117 8.00117V18.0012H12.0012V14.0012H8.00117C7.46533 14.0195 6.9459 13.8147 6.56679 13.4356C6.18767 13.0564 5.98284 12.537 6.00117 12.0012V8.00117H2.00117ZM8.00117 2.00117V12.0012H18.0012V2.00117H8.00117Z" />
    </svg>
  );
}
