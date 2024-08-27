export const computeFeedback = (feedback: any, userId?: number) => {
  const { upvotedFeedbacksByUsers, ...rest } = feedback;
  const releaseTags = feedback.releaseTags
    ? feedback.releaseTags.map((tag: any) => tag.releaseTag)
    : [];

  let upvotedCount = 0;
  let isUpvoted = false;

  if (upvotedFeedbacksByUsers) {
    upvotedCount = upvotedFeedbacksByUsers.length;
    isUpvoted = upvotedFeedbacksByUsers.some(
      (user: any) => user.usersId === userId
    );
  }
  return Object.assign({}, rest, {
    releaseTags,
    upvotedCount,
    isUpvoted,
  });
};
