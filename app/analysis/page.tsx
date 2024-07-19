"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import dayjs, { Dayjs } from "dayjs";
import { useRecoilState } from "recoil";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import Header from "../ui/header/Header";

import { Button } from "@mui/material";

import { settingState } from "@/store/atoms";
import TagSection from "./(component)/TagSection";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/user/api";

const chartFeelingData = {
  options: {
    chart: {
      type: "line",
      fontFamily: "inherit",
    },
    xaxis: {
      categories: [
        "12/01",
        "12/06",
        "12/06",
        "12/11",
        "12/16",
        "12/21",
        "12/26",
      ],
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70],
    },
  ],
};

const chartSleepData = {
  series: [
    {
      data: [
        {
          x: "12/01",
          y: [new Date().setHours(7), new Date().setHours(23)],
        },
        { x: "12/06", y: [new Date().setHours(7.5), new Date().setHours(23)] },
        { x: "12/11", y: [new Date().setHours(8), new Date().setHours(23)] },
        { x: "12/16", y: [new Date().setHours(7), new Date().setHours(23)] },
        { x: "12/21", y: [new Date().setHours(7), new Date().setHours(23)] },
        { x: "12/26", y: [new Date().setHours(7), new Date().setHours(23)] },
        { x: "12/31", y: [new Date().setHours(7), new Date().setHours(23)] },
      ],
    },
  ],
  options: {
    chart: { type: "rangeBar", zoom: { enabled: false } },
    plotOptions: {
      bar: {
        isDumbbell: true,
        columnWidth: 3,
        dumbbellColors: [["#008FFB", "#00E396"]],
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: "top",
      customLegendItems: ["기상시각", "취침시각"],
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        gradientToColors: ["#00E396"],
        inverseColors: true,
        stops: [0, 100],
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      tickPlacement: "on",
    },
    yaxis: {
      type: "datetime",
      formatter: (value: any) => {
        return value;
      },
    },
  },
};

export default function Analysis() {
  const [date, setDate] = useState<Dayjs | null>();
  const [{ isMonth }, setSetting] = useRecoilState(settingState);

  const { data: meData } = useQuery({ queryKey: ["getMe"], queryFn: getMe });

  return (
    <main className="flex min-h-screen justify-center">
      <div className="relative z-0 flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <div className="absolute -z-10 h-[500px] max-h-[700px] w-full rounded-b-[100px] bg-default-800"></div>
        <Header me={meData} />
        <article className="flex flex-col gap-4 px-5">
          <section className="flex flex-col gap-4">
            {/* date picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                defaultValue={dayjs()}
                views={["year", "month"]}
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{
                  width: "50%",
                  "& .MuiInputBase-root": {
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    fontFamily: "inherit",
                    fontSize: "20px",
                  },
                }}
              />
            </LocalizationProvider>
            {/* pill  switch */}
            <div className="relative rounded-3xl bg-default-400">
              <div
                className={`absolute h-[44px] w-1/2 transform rounded-3xl bg-default-200 transition-all ${
                  isMonth === true ? "translate-x-0" : "translate-x-[100%]"
                }`}
              />
              <Button
                disableRipple
                variant="text"
                sx={{
                  width: "50%",
                  height: "44px",
                  fontWeight: "bold",
                  color: isMonth === true ? "#143422" : "#928C7F",
                  transition: "all 0.2s 0.1s ease",
                }}
                onClick={() =>
                  setSetting((prev) => ({ ...prev, isMonth: true }))
                }
              >
                Month
              </Button>
              <Button
                disableRipple
                variant="text"
                sx={{
                  width: "50%",
                  height: "4px",
                  fontWeight: "bold",
                  color: isMonth === false ? "#143422" : "#928C7F",
                  transition: "all 0.2s 0.1s ease",
                }}
                onClick={() =>
                  setSetting((prev) => ({ ...prev, isMonth: false }))
                }
              >
                Year
              </Button>
            </div>
          </section>
          <section className="flex flex-col items-center rounded-2xl bg-default-200 shadow-2xl">
            <span className="pb-4 pt-6 font-bold text-default-800">
              Mood Analysis
            </span>
            <div className="w-full bg-default-100">
              <Chart
                options={chartFeelingData.options as any}
                series={chartFeelingData.series}
                type="line"
                width="100%"
                height="auto"
              />
            </div>
            <div>
              <span>pill graph</span>
              <span>기분 20%</span>
            </div>
          </section>
          <TagSection date={date} isMonth={isMonth} />
          <section>
            <h1 className="text-xl font-semibold">Sleep Analysis</h1>
            <span className="text-default-700">
              You can view statistics and graphs of your sleep records
            </span>
            <div className="flex justify-around gap-2 rounded-2xl bg-default-100 p-5">
              <div className="flex flex-col items-center">
                <span className="text-xs">PM</span>
                <span className="text-[28px] font-semibold">11:00</span>
                <span className="text-xs">평균취침시각</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">AM</span>
                <span className="text-[28px] font-semibold">07:00</span>
                <span className="text-xs">평균기상시각</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">Duration</span>
                <span className="text-[28px] font-semibold">9:00</span>
                <span className="text-xs">평균기상시간</span>
              </div>
            </div>
            <Chart
              options={chartSleepData.options as any}
              series={chartSleepData.series}
              type="rangeBar"
              width="100%"
              height="auto"
            />
          </section>
        </article>
      </div>
    </main>
  );
}
