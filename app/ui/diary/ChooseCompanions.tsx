import { useWatch } from "react-hook-form";
import Companions from "./Companions";

const companions = ["FAMILY", "LOVER", "FRIEND", "ACQUAINTANCE", "ALONE"];

export default function ChooseCompanions({ register, control }: any) {
  const selectedCompanions = useWatch({ control, name: "companions" });

  return (
    <div className="flex flex-wrap">
      {companions.map((companion) => (
        <Companions
          key={companion}
          label={companion}
          register={register}
          watchValue={selectedCompanions}
        />
      ))}
    </div>
  );
}
