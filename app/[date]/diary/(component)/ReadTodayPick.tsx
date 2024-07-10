import PickCard from "./PickCard";

export default function ReadTodayPick({ picks }: any) {
  return (
    <section className="flex flex-col gap-4 bg-default-800 p-4">
      <label className="flex text-lg font-medium text-default-100">
        Today&#39;s PICK
      </label>
      {picks?.map((pick: any) => (
        <PickCard key={pick.id} type="read" imageType="url" pick={pick} />
      ))}
    </section>
  );
}
