import Link from "next/link";

export default function MeNavList({ href, label, icon: Icon, pathname }: any) {
  return (
    <Link
      href={href}
      className={`group flex flex-1 flex-col items-center justify-center gap-1 py-4 ${
        pathname === href
          ? "border-b-4 border-b-default-900"
          : "group-hover:border-b-default-500"
      }`}
    >
      <div className="flex flex-col items-center gap-1">
        <Icon
          className={`size-6 stroke-2 ${
            pathname === href
              ? "text-default-800"
              : "text-default-500 group-hover:text-default-700"
          }`}
        />
        <span
          className={`font-semibold ${
            pathname === href
              ? "text-black"
              : "text-default-500 group-hover:text-default-700"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}
