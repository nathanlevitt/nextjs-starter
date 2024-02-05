import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col space-y-2.5 items-center justify-center w-screen h-screen">
      <h1 className="font-medium">Nate&apos;s Next.js Starter</h1>
      <Button className="text-xs">Get Started</Button>
    </div>
  );
}
