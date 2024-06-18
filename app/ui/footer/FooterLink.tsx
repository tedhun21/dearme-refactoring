import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLink({
  href,
  label,
  icon: Icon,
  activeIcon: ActiveIcon,
}: any) {
  const pathname = usePathname();
  return (
    <Link href={href} className="group flex flex-col items-center gap-1">
      {pathname === href ? (
        <ActiveIcon className="size-6" />
      ) : (
        <Icon className="size-6 stroke-2 text-default-500 group-hover:text-default-800" />
      )}
      <span
        className={`text-xs font-semibold group-hover:text-default-800 s:text-sm  ${
          pathname === href ? "text-black" : "text-default-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
