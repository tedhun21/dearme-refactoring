import Link from "next/link";

import { useRecoilState } from "recoil";
import { Button } from "@mui/material";

import { ISetting, settingState } from "@/store/atoms";

import LoginUserModal from "../../../ui/header/LoginUserModal";
import LogoutUserModal from "../../../ui/header/LogoutUserModal";

export default function TodogoalHeader({ me }: any) {
  const [{ todogoalTitle }, setSetting] =
    useRecoilState<ISetting>(settingState);

  return (
    <section className="flex w-full items-center justify-between">
      {me && me?.nickname ? (
        <div className="flex flex-col">
          <span className="font-semibold">Hello</span>
          <span className="truncate whitespace-nowrap text-sm">
            {me?.nickname}
          </span>
        </div>
      ) : me ? (
        <Link href="/me/edit" className="text-xs">
          <span>Set Nickname</span>
        </Link>
      ) : (
        <span className="">Login</span>
      )}
      <div className="flex">
        <div className="relative rounded-3xl bg-default-800">
          <div
            className={`absolute h-[40px] w-[100px] transform rounded-3xl bg-default-900 transition-all ${
              todogoalTitle === "Todo" ? "translate-x-0" : "translate-x-[100px]"
            }`}
          />
          <Button
            disableRipple
            variant="text"
            sx={{
              width: "100px",
              height: "40px",
              fontWeight: "bold",
              color: todogoalTitle === "Todo" ? "#143422" : "#ffffff",
              transition: "all 0.2s 0.1s ease",
            }}
            onClick={() =>
              setSetting((prev) => ({ ...prev, todogoalTitle: "Todo" }))
            }
          >
            Todo
          </Button>
          <Button
            disableRipple
            variant="text"
            sx={{
              width: "100px",
              height: "40px",
              fontWeight: "bold",
              color: todogoalTitle === "Todo" ? "#ffffff" : "#143422",
              transition: "all 0.2s 0.1s ease",
            }}
            onClick={() =>
              setSetting((prev) => ({ ...prev, todogoalTitle: "Goal" }))
            }
          >
            Goal
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        {me ? <LoginUserModal me={me} /> : <LogoutUserModal />}
      </div>
    </section>
  );
}
