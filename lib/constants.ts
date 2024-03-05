export const APP_TITLE = "Nate's Next.js Starter";
export const EMAIL_SENDER = '"Nate" <noreply@trudine.com>';

export const redirects = {
  toLogin: "/login",
  toSignup: "/signup",
  afterLogin: "/dashboard",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard",
} as const;
