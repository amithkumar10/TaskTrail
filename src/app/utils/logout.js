export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.clear();
  window.location.href = "/signin";
};
