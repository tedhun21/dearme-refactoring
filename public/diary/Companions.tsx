import React from "react";

interface CompanionsProps {
  text: string;
  selected: boolean; // selected 속성 추가
  onClick: () => void; // onClick 타입 정의
}

export default function Companions({
  text,
  selected,
  onClick,
}: CompanionsProps) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`rounded-lg border-2 border-default-400 bg-default-100 px-2 py-1 font-semibold ${
        selected
          ? "border-default-800 bg-default-800 text-default-100 hover:bg-default-700"
          : "text-default-800 hover:border-default-600 hover:bg-default-400"
      }`}
    >
      {text}
    </button>
  );
}
