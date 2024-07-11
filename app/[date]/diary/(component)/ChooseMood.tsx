import JoyfulEmoji from "@/public/diary/JoyfulEmoji";
import HappyEmoji from "@/public/diary/HappyEmoji";
import NeutralEmoji from "@/public/diary/NeutralEmoji";
import UnhappyEmoji from "@/public/diary/UnhappyEmoji";
import SadEmoji from "@/public/diary/SadEmoji";
import MoodEmoji from "./MoodEmoji";
import { useWatch } from "react-hook-form";

const moodEmojis = [
  { mood: "JOYFUL", icon: JoyfulEmoji },
  { mood: "HAPPINESS", icon: HappyEmoji },
  { mood: "NEUTRAL", icon: NeutralEmoji },
  { mood: "UNHAPPY", icon: UnhappyEmoji },
  { mood: "SADNESS", icon: SadEmoji },
];

export default function ChooseMood({ register, control }: any) {
  const selectedMood = useWatch({ control, name: "mood" });

  return (
    <div className="flex items-center justify-between px-10">
      {moodEmojis.map((emoji) => (
        <MoodEmoji
          key={emoji.mood}
          mood={emoji.mood}
          icon={emoji.icon}
          register={register}
          watchValue={selectedMood}
        />
      ))}
    </div>
  );
}
