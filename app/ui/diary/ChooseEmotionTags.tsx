import { useWatch } from "react-hook-form";

const tags = [
  "#FRESH",
  "#TIRED",
  "#HAPPY",
  "#MOTIVATED",
  "#ANNOYING",
  "#LONELY",
  "#PROUD",
  "#ANXIETY",
  "#DEPRESSED",
  "#PIT-A-PAT",
  "#COZY",
  "#ANGRY",
  "#GLOOMY",
  "#EXCITED",
  "#PRESSURE",
  "#SAD",
  "#DISGUSTING",
  "#AFRAID",
  "#BORED",
];

export default function ChooseEmotionTags({
  register,
  setValue,
  control,
}: any) {
  const selectedFeelings = useWatch({ control, name: "feelings" }) || [];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setValue("feelings", [...selectedFeelings, value]);
    } else {
      setValue(
        "feelings",
        selectedFeelings.filter((feeling: string) => feeling !== value),
      );
    }
  };

  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => {
        const isChecked = selectedFeelings.includes(tag);
        return (
          <div key={tag} className="px-1 py-2">
            <input
              type="checkbox"
              id={tag}
              value={tag}
              {...register("feelings")}
              onChange={(e) =>
                handleCheckboxChange(e.target.value, e.target.checked)
              }
              className="hidden"
            />
            <label
              htmlFor={tag}
              className={`cursor-pointer rounded-lg border-2 border-default-400 bg-default-300 px-2 py-1 text-sm font-semibold xs:text-base ${
                isChecked
                  ? "border-default-800 bg-default-800 text-default-100 hover:bg-default-700"
                  : "text-default-800 hover:border-default-600 hover:bg-default-400"
              }`}
            >
              {tag}
            </label>
          </div>
        );
      })}
    </div>
  );
}
