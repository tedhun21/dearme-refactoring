import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import GoalModal from "./GoalModal";
import { useState } from "react";

export default function TodogoalCreateGoal({ date }: any) {
  const [modalCreateGoalOpen, setModalCreateGoalOpen] = useState(false);
  return (
    <>
      <div className="group flex h-12 w-12 items-center justify-center p-1 transition-all duration-200 hover:p-0 active:p-2">
        <button
          onClick={() => setModalCreateGoalOpen(true)}
          className="h-full w-full rounded-full bg-default-600 p-2 duration-200 group-hover:h-12 group-hover:w-12 group-hover:bg-default-400 group-active:h-8 group-active:w-8"
        >
          {modalCreateGoalOpen ? (
            <XMarkIcon className="stroke-2 text-white" />
          ) : (
            <PlusIcon className="stroke-2 text-white" />
          )}
        </button>
        {/* Create Goal */}
        <GoalModal
          type="create"
          date={date}
          modalOpen={modalCreateGoalOpen}
          setModalOpen={setModalCreateGoalOpen}
        />
      </div>
    </>
  );
}
