import { LoginForm } from "@/components/forms/login-form";
import { SubmitButton } from "@/components/forms/submit-button";
import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-col space-y-2.5 items-center justify-center w-screen h-screen">
      <h1 className="font-medium">Nate&apos;s Next.js Starter</h1>

      <pre className="p-2 text-xs border rounded-lg">
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>

      {!session && <LoginForm />}

      {session && (
        <form
          action={async () => {
            "use server";
            await logout();
            redirect("/");
          }}
        >
          <SubmitButton>Logout</SubmitButton>
        </form>
      )}
    </div>
  );
}
