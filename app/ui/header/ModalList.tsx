import Link from "next/link";

export default function ModalList({ label, href }: any) {
  return href ? (
    <Link href={href} className="rounded-md px-2 py-1 hover:bg-default-200">
      <span>{label}</span>
    </Link>
  ) : (
    <button className="rounded-md px-2 py-1 hover:bg-default-200">
      <span>{label}</span>
    </button>
  );
}
