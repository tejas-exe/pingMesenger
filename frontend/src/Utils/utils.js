export const getAuthTokenFromCookie = () => {
  const token = document.cookie.replace("token=", "Bearer ");
  return token;
};
