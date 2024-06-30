import HappyEmoji from "@/public/diary/HappyEmoji";
import JoyfulEmoji from "@/public/diary/JoyfulEmoji";
import NeutralEmoji from "@/public/diary/NeutralEmoji";
import SadEmoji from "@/public/diary/SadEmoji";
import UnhappyEmoji from "@/public/diary/UnhappyEmoji";

export default function ChooseMood({
  selectedMood,
  setSelectedMood,
  onMoodSelect,
}: any) {
  const handleMoodClick = (mood: string) => {
    // 이미 선택된 기분을 다시 클릭했는지 확인
    if (mood === selectedMood) {
      // 선택을 취소하고 상위 컴포넌트에도 알림
      setSelectedMood(null);
      onMoodSelect(null);
    } else {
      // 새로운 기분을 선택하고 상위 컴포넌트에 알림
      setSelectedMood(mood);
      onMoodSelect(mood);
    }
  };

  return (
    <div className="flex items-center justify-between px-16">
      <button type="button" onClick={() => handleMoodClick("JOYFUL")}>
        <JoyfulEmoji
          selected={selectedMood === "JOYFUL"}
          className="hover:shadow-rad size-8 rounded-full"
        />
      </button>

      <button type="button" onClick={() => handleMoodClick("HAPPY")}>
        <HappyEmoji
          selected={selectedMood === "HAPPY"}
          className="hover:shadow-rad size-8 rounded-full"
        />
      </button>
      <button type="button" onClick={() => handleMoodClick("NEUTRAL")}>
        <NeutralEmoji
          selected={selectedMood === "NEUTRAL"}
          className="hover:shadow-rad size-8 rounded-full"
        />
      </button>
      <button type="button" onClick={() => handleMoodClick("UNHAPPY")}>
        <UnhappyEmoji
          selected={selectedMood === "UNHAPPY"}
          className="hover:shadow-rad size-8 rounded-full"
        />
      </button>
      <button type="button" onClick={() => handleMoodClick("SAD")}>
        <SadEmoji
          selected={selectedMood === "SAD"}
          className="hover:shadow-rad size-8 rounded-full"
        />
      </button>
    </div>
  );
}
