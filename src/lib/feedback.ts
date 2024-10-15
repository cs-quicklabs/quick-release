import { FeedbackPostType } from "@/types";
import { REVALIDATE_API } from "@/Utils/constants";

export const computeFeedback = (feedback: any, userId?: number) => {
  const { feedbackPostVotes, ...rest } = feedback;
  const releaseTags = feedback.releaseTags
    ? feedback.releaseTags.map((tag: any) => tag.releaseTag)
    : [];

  let upvotedCount = 0;
  let isUpvoted = false;

  if (feedbackPostVotes) {
    upvotedCount = feedbackPostVotes.length;
    if (userId) {
      isUpvoted = feedbackPostVotes.some(
        (feedbackPostVote: any) => feedbackPostVote.userId === userId
      );
    }
  }
  return Object.assign({}, rest, {
    releaseTags,
    upvotedCount,
    isUpvoted,
  });
};

export const getOneFeedbackPostDetails = async (
  projectName: string,
  id: string
): Promise<FeedbackPostType | null> => {
  return fetch(
    `${process.env.BASEURL}/api/public/projects/${projectName}/feedbacks/${id}`,
    { next: { revalidate: REVALIDATE_API } }
  )
    .then((response) => response.json())
    .then((resData) => (resData.success ? resData.data : null))
    .catch(() => null);
};
