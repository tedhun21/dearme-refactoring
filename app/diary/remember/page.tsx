"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import dayjs, { Dayjs } from "dayjs";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { getToday } from "@/util/date";

import MoodArrays from "@/app/diary/remember/(component)/MoodArrays";

export default function Remeber() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(
    dayjs(getToday()),
  );

  return (
    <main className="relative flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-black shadow-lg">
        {/* 헤더 */}
        <header className="flex w-full items-center justify-between p-5">
          <Link href="/">
            <Image
              src="/remember/whitelogo.png"
              alt="logo"
              width={80}
              height={26}
              style={{ width: "80px", height: "26px" }}
              priority
            />
          </Link>

          {/* Year & Month */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedMonth}
              onChange={(newValue) => setSelectedMonth(newValue)}
              views={["month", "year"]}
              sx={{
                width: "180px",
                backgroundColor: "transparent",

                ".Mui-focused": {
                  "&.MuiOutlinedInput-notchedOutline": {
                    border: "2px solid #EDA323 !important",
                    borderColor: "#EDA323 !important",
                  },
                },
                ".MuiInputBase-root": {
                  borderRadius: "12px",
                  padding: "0px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  color: "#ffffff",

                  ".MuiInputBase-input": {
                    padding: "8px 0 8px 16px",
                  },
                  ".MuiInputAdornment-root": {
                    ".MuiButtonBase-root": {
                      marginRight: "0px",
                    },
                  },
                },
                ".Mui-selected": {
                  backgroundColor: "#EDA323 !important",
                },

                // ".base-Popper-root": {
                //   ".MuiPaper-root": {
                //     ".MuiPickersMonth": {
                //       "&.MuiPickersMonth-monthButton + .Mui-selected": {
                //         backgroundColor: "#EDA323 !important",
                //       },
                //     },
                //   },
                // },
              }}
              slots={{
                openPickerIcon: () => (
                  <KeyboardArrowDownRoundedIcon className="stroke-2 text-white" />
                ),
              }}
            />
          </LocalizationProvider>
        </header>

        <div className="flex items-baseline gap-1 p-5">
          <h1 className="text-xl font-semibold text-white">Remember</h1>
          <h3 className="text-xs font-semibold text-default-300">moments</h3>
        </div>

        {/* Moods 카드 */}
        <section className="scrollbar-hide overflow-scroll px-5">
          <MoodArrays selectedMonth={selectedMonth} />
        </section>
      </div>
    </main>
  );
}
