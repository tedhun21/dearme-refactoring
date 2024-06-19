import Link from "next/link";
import Image from "next/image";

import HeaderUserModal from "./LogoutUserModal";
import LoginUserModal from "./LoginUserModal";

export default function Header({ me }: any) {
  return (
    <header className="z-10 flex w-full flex-row items-center justify-between p-5">
      <Link href="/">
        <Image
          src="/header/logo.png"
          alt="logo"
          width={80}
          height={26}
          style={{ width: "80px", height: "26px" }}
          priority
        />
      </Link>
      {me ? <LoginUserModal me={me} /> : <HeaderUserModal />}
    </header>
  );
}
