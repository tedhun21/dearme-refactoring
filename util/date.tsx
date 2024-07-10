import dayjs, { Dayjs } from "dayjs";

// 오늘 날짜 구하기 ("YYYY-MM-DD")
export const getToday = () => {
  const date = new Date();
  const year = dayjs(date).format("YYYY");
  const month = dayjs(date).format("MM");
  const day = dayjs(date).format("DD");
  const today = `${year}-${month}-${day}`;

  return today;
};

// 5일까지만 new표현
// difference가 4보다 클시 false, 4이하 일 시 true

export const isNew = ({ date, createdAt }: any) => {
  const today = dayjs();
  const baseDate = date ? dayjs(date) : today;

  return baseDate.diff(dayjs(createdAt), "day") <= 4;
};

// 5일 남았을때 임박(imminent) 표현
export const isImminent = ({ date, endDate }: any) => {
  const baseDate = date ? dayjs(date) : dayjs();
  const daysUntilEndDate = dayjs(endDate).diff(baseDate, "day");

  return daysUntilEndDate >= 0 && daysUntilEndDate <= 5;
};

// 목표 디데이 구하는 함수
export const goalDday = ({ date, endDate }: any): number | string => {
  const today = date ? dayjs(date).startOf("day") : dayjs().startOf("day");
  const targetDate = dayjs(endDate).startOf("day");

  if (targetDate.isAfter(today)) {
    const diff = targetDate.diff(today, "day");
    return `-${diff}`;
  } else if (targetDate.isSame(today, "day")) {
    return "D-Day";
  } else {
    const diff = today.diff(targetDate, "day");
    return `+${diff}`;
  }
};

// 날짜에 해당하는 달이 몇주인지
export const getWeeksInMonth = (date: Dayjs) => {
  const firstDayOfMonth = date.startOf("month");
  const lastDayOfMonth = date.endOf("month");
  const firstDayOfWeek = firstDayOfMonth.startOf("week");
  const lastDayOfWeek = lastDayOfMonth.endOf("week");
  return lastDayOfWeek.diff(firstDayOfWeek, "week") + 1;
};

// month name day, year
export const monthNameDayYear = (date: Dayjs) => {
  const monthName = dayjs(date).format("MMM");
  const day = dayjs(date).format("D");
  const year = dayjs(date).format("YYYY");
  return `${monthName} ${day}, ${year}`;
};

// 일기에 들어가는 날짜 형식
export const getDiaryDate = (date: string) => {
  if (!date) return "";

  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  // 한 자리 수의 월 앞에 0을 추가
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  // 한 자리 수의 일 앞에 0을 추가
  const day = String(dateObj.getDate()).padStart(2, "0");

  //요일
  const weekDay = dateObj.toLocaleString("en", { weekday: "short" });

  return `${year}. ${month}. ${day}. (${weekDay})`;
};

// 날짜 사이 기간
export const diffBetweenTwoDates = ({ startDate, endDate }: any) => {
  const standardDay = dayjs(endDate).diff(startDate, "day");
  const standardWeek = dayjs(endDate).diff(startDate, "week");
  const standardMonth = dayjs(endDate).diff(startDate, "month");

  const subWeek = dayjs(endDate).subtract(standardWeek, "week");
  const diffDay = dayjs(subWeek).diff(startDate, "day");

  const subMonth = dayjs(endDate).subtract(standardMonth, "month");
  const diffWeek = dayjs(subMonth).diff(startDate, "week");

  if (standardMonth >= 1) {
    return `${standardMonth}${standardMonth !== 1 ? "months" : "month"} ${
      diffWeek !== 0 ? `${diffWeek}${diffWeek !== 0 ? "weeks" : "week"}` : ""
    } ${diffDay !== 0 ? `${diffDay}${diffDay !== 1 ? "days" : "day"}` : ""}`;
  } else if (standardWeek >= 1) {
    return `${standardWeek}${standardWeek !== 1 ? "weeks" : "week"} ${
      diffDay !== 0 ? `${diffDay}${diffDay !== 1 ? "days" : "day"}` : ""
    }`;
  } else if (standardDay >= 1) {
    return `${standardDay} days`;
  }
};

// 연월일 구하기
export const returnDate = (date: Dayjs) => {
  const year = dayjs(date).get("year");
  const month = dayjs(date).get("month") + 1;
  const day = dayjs(date).get("date");
  return { year, month, day };
};

// 요일 구하기
export const dayOftheWeek = (date: Dayjs) => {
  return dayjs(date).format("dddd").slice(0, 3);
};

// ago
export const timeAgo = (date: any) => {
  const now = dayjs();
  const postDate = dayjs(date);

  const diffSeconds = now.diff(postDate, "second");

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffSeconds / 3600);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffSeconds / 86400);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  const diffMonths = Math.floor(diffSeconds / 2629800);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  const diffYears = Math.floor(diffSeconds / 31557600);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
};

// YYYY-MM 으로 변경
export const convertYearMonth = (date: Dayjs) => {
  return dayjs(date).format("YYYY-MM");
};
