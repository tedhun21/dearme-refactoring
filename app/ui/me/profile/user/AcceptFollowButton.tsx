import { acceptRequest } from "@/store/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AskModal from "../../AskModal";
import { useState } from "react";

export default function AcceptButton({ userId }: any) {
  const queryClient = useQueryClient();
  const [openRequestModal, setOpenRequestModal] = useState(false);

  const { mutate: acceptRequestMutate } = useMutation({
    mutationKey: ["acceptRequest"],
    mutationFn: acceptRequest,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getFriendship"] });

      const prevFriendship = queryClient.getQueryData(["getFriendship"]);

      queryClient.setQueryData(["getFriendship"], () => ({
        status: "FRIEND",
      }));

      return { prevFriendship };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["getFriendship"], context?.prevFriendship);
      window.alert(err);
    },
  });

  const handleAcceptRequest = () => {
    acceptRequestMutate(userId);
  };

  return (
    <>
      <button
        type="button"
        className="rounded-3xl bg-default-500 px-4 py-1 font-semibold text-white hover:bg-default-600 active:bg-default-700"
        onClick={() => setOpenRequestModal(true)}
      >
        Accept
      </button>
      <AskModal
        type="request"
        openModal={openRequestModal}
        setOpenModal={setOpenRequestModal}
        clickAction={handleAcceptRequest}
      />
    </>
  );
}
