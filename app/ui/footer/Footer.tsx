import {
  ChartPieIcon as LineChartPieIcon,
  HomeIcon as LineHomeIcon,
  MagnifyingGlassIcon as LineMagnifyingGlassIcon,
  UserGroupIcon as LineUserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  ChartPieIcon as SolidChartPieIcon,
  HomeIcon as SolidHomeIcon,
  MagnifyingGlassIcon as SolidMagnifyingGlassIcon,
  UserGroupIcon as SolidUserGroupIcon,
} from "@heroicons/react/24/solid";
import FooterLink from "./FooterLink";

const footerItems = [
  {
    href: "/",
    label: "HOME",
    icon: LineHomeIcon,
    activeIcon: SolidHomeIcon,
  },
  {
    href: "/social",
    label: "SOCIAL",
    icon: LineUserGroupIcon,
    activeIcon: SolidUserGroupIcon,
  },
  {
    href: "/analysis",
    label: "ANALYSIS",
    icon: LineChartPieIcon,
    activeIcon: SolidChartPieIcon,
  },
  {
    href: "/search",
    label: "SEARCH",
    icon: LineMagnifyingGlassIcon,
    activeIcon: SolidMagnifyingGlassIcon,
  },
];

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 flex justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] bg-default-100 shadow-lg">
        <div className="flex w-full items-center justify-between gap-2 border-t-2 border-default-300 px-6 py-2 xxs:px-8 xs:px-10 s:px-12">
          {footerItems.map((item) => (
            <FooterLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              activeIcon={item.activeIcon}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
