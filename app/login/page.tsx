import Link from "next/link";
import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";
import { validateRequest } from "@/lib/auth";

export default async function Login() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }

  return (
    <div className="container w-full space-y-6">
      <Icons.logo className="mx-auto mt-8" />

      <div className="mx-auto flex flex-col justify-center space-y-6 max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium underline-offset-4 hover:text-primary hover:underline"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>

        <LoginForm />

        <p className="px-8 text-sm text-center text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
