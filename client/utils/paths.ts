export const SERVER_BASE_URL = "http://localhost:5000";
export const SERVER_PROFILE_IMAGE_BASE_URL = `${SERVER_BASE_URL}/uploads/profile`;

export const profileImageURL = (path: string | null | undefined) => {
  // TODO: handle null case
  return `${SERVER_PROFILE_IMAGE_BASE_URL}/${path}`;
};
