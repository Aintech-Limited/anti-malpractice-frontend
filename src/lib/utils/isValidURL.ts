export const isValidURL = (url: string) => {
  const displayAvatar =
    url.trim() !== "" && url.trim() !== undefined && url.trim() !== null;
  if (!displayAvatar) return false;
  try {
    const link = new URL(url ?? "");

    if (link.protocol !== "https:") return false;
  } catch (error) {
    return false;
  }
  return true;
};
