export const computeChangeLog = (changelog: any) => {
  const releaseTags = changelog.releaseTags.map((tag: any) => tag.releaseTag);

  return Object.assign({}, changelog, {
    releaseTags,
  });
};
