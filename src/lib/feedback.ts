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
