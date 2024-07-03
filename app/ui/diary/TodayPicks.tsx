import ReadTodayPick from "./ReadTodayPick";
import UploadTodayPick from "./UploadTodayPick";

export default function TodayPicks({
  type,
  selectedPicks,
  setSelectedPicks,
}: any) {
  return (
    <>
      {type === "create" ? (
        <UploadTodayPick
          selectedPicks={selectedPicks}
          setSelectedPicks={setSelectedPicks}
        />
      ) : type === "read" ? (
        <ReadTodayPick selectedPicks={selectedPicks} />
      ) : (
        type === "edit" && <div>hi</div>
      )}
    </>
  );
}
