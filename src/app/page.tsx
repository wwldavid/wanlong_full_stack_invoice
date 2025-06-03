import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col h-screen justify-center max-w-5xl mx-auto text-center gap-8">
      <h1 className="text-5xl font-bold text-[#f8b500]">Invoice Notebook</h1>
      <p>
        <Button asChild variant="ghost">
          <Link
            href="/dashboard"
            className="bg-[#478384] text-white px-4 py-2 rounded-md hover:bg-[#376c6c]"
          >
            Sign In
          </Link>
        </Button>
      </p>
    </main>
  );
}
