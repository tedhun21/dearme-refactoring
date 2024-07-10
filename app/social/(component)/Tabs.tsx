interface TabsProps {
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}

export default function Tabs({ selectedTab, setSelectedTab }: TabsProps) {
  return (
    <section className="mb-3 flex w-full justify-center">
      <div
        className={`cursor-pointer  ${
          selectedTab === "all"
            ? "border-b-4 border-default-900"
            : "text-default-500"
        } flex-1 transition duration-300 ease-in-out`}
        onClick={() => setSelectedTab("all")}
      >
        <div className="mb-2 flex justify-center text-base font-medium">
          All
        </div>
      </div>
      <div
        className={`cursor-pointer  ${
          selectedTab === "friends"
            ? "border-b-4 border-default-900"
            : "text-default-500"
        } flex-1 transition duration-300 ease-in-out`}
        onClick={() => setSelectedTab("friends")}
      >
        <div className="mb-2 flex justify-center text-base font-medium">
          Friends
        </div>
      </div>
    </section>
  );
}
