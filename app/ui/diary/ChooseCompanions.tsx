import Companions from "@/public/diary/Companions";

export default function ChooseCompanions({ register, getValue }: any) {
  const companions = ["FAMILY", "LOVER", "FRIEND", "ACQUAINTANCE", "ALONE"];

  return (
    <span className="flex flex-wrap gap-2">
      {companions.map((companion) => (
        <Companions
          key={companion}
          label={companion}
          register={register}
          getValue={getValue}
        />
      ))}
    </span>
  );
}
