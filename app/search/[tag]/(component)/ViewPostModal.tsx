import { useQuery } from "@tanstack/react-query";

import SocialPost from "../../../social/(component)/SocialPost";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { getPost } from "@/api/post/api";

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
  const { isLoading, data: getPostResult } = useQuery({
    queryKey: ["getPostResult", postId],
    queryFn: () => getPost(postId),
    staleTime: 0,
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          backgroundColor: "#F5F3EB",
          borderRadius: "16px",
          py: "20px",
        }}
      >
        {isLoading ? (
          <div className="text-base font-bold text-default-700">Loading...</div>
        ) : getPostResult ? (
          <SocialPost post={getPostResult} />
        ) : (
          <div>No data available</div>
        )}
      </Box>
    </Modal>
  );
}
