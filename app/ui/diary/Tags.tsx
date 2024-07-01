import React, { useState } from "react";

interface TagsProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

export default function Tag({ text, selected, onClick }: TagsProps) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`rounded-lg border-2 border-default-400 bg-default-300 px-2 py-1 font-semibold ${
        selected
          ? "border-default-800 bg-default-800 text-default-100 hover:bg-default-700"
          : "text-default-800 hover:border-default-600 hover:bg-default-400"
      }`}
    >
      {text}
    </button>
  );
}
