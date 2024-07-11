export const computeChangeLog = (changelog: any) => {
  const releaseTags = changelog.releaseTags.map((tag: any) => tag.releaseTag);
  const releaseCategories = changelog.releaseCategories.map((category: any) => category.releaseCategory);

  return Object.assign({}, changelog, {
    releaseTags,
    releaseCategories,
  });
};
