import { useQuery } from "@tanstack/react-query";

import Modal from "@mui/material/Modal";

import { getPost } from "@/api/post/api";
import Loading from "@/public/common/Loading";
import SocialPost from "../../../social/(component)/SocialPost";

interface ViewPostModalProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
}

export default function ViewPostModal({
  open,
  handleClose,
  postId,
}: ViewPostModalProps) {
  const { isPending, data: PostData } = useQuery({
    queryKey: ["getPostResult", postId],
    queryFn: () => getPost(postId),
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      {isPending ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-default-200 xxs:w-[390px] xs:w-[460px] s:w-[550px]">
          <SocialPost post={PostData} />
        </div>
      )}
    </Modal>
  );
}
