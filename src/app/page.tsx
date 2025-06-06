import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col h-screen justify-center max-w-5xl mx-auto text-center gap-8">
      <h1 className="text-5xl font-bold">Invoice Notebook</h1>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
