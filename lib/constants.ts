export const APP_TITLE = "Nate's Next.js Starter";
export const EMAIL_SENDER = '"Nate" <noreply@trudine.com>';

export const redirects = {
  toLogin: "/login",
  toSignup: "/signup",
  afterLogin: (username: string) => `/${username}`,
  afterLogout: "/",
  afterResetPassword: "/",
  toVerify: "/verify-email",
  afterVerify: "/",
  toSettings: "/account",
} as const;
