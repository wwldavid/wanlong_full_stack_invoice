import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

type Params = Promise<{ invoiceid: string }>;

export default async function InvoicePage({ params }: { params: Params }) {
  const { userId } = await auth();
  if (!userId) return;
  const { invoiceid } = await params;
  const invoiceId = parseInt(invoiceid);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  return (
    <main className=" h-full  max-w-2xl mx-auto gap-8 my-12">
      <div className="flex justify-between mb-8">
        <h1 className="flex items-center gap-4 text-5xl font-bold">
          Invoice {invoiceId}
          <Badge
            className={cn(
              "rounded-full capitalize",
              result.status === "open" && "bg-blue-500",
              result.status === "paid" && "bg-green-600",
              result.status === "void" && "bg-gray-700",
              result.status === "uncollectible" && "bg-red-600"
            )}
          >
            {result.status}
          </Badge>
        </h1>
        <p></p>
      </div>
      <p className="text-3xl mb-3">${(result.value / 100).toFixed(2)}</p>
      <p className="text-lg mb-8">{result.description}</p>
      <h2 className="font-bold text-lg mb-4"> Invoice Details</h2>
      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice ID
          </strong>
          <span>{invoiceId}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Date
          </strong>
          <span>{new Date(result.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Name
          </strong>
          <span></span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Email
          </strong>
          <span></span>
        </li>
      </ul>
    </main>
  );
}
