import Link from "next/link";
import Image from "next/image";

import HeaderUserMenu from "./HeaderUserMenu";

export default function Header({ me }: any) {
  return (
    <header className="z-10 flex w-full flex-row items-center justify-between p-5">
      <Link href="/">
        <Image
          src="/header/logo.png"
          alt="logo"
          width={100}
          height={32}
          style={{ width: "100px", height: "32px" }}
          priority
        />
      </Link>
      <HeaderUserMenu me={me} />
    </header>
  );
}
