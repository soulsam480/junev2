export function login() {}

export function googleLogin() {
  window.location.href = `${import.meta.env.VITE_API}/auth/google/`;
}
