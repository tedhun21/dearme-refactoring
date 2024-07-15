import Link from "next/link";

export default function ModalList({ label, href, onClick }: any) {
  return href ? (
    <Link
      href={href}
      className="rounded-md px-2 py-1 text-center hover:bg-default-200"
    >
      {label}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-2 py-1 text-center hover:bg-default-200"
    >
      {label}
    </button>
  );
}
