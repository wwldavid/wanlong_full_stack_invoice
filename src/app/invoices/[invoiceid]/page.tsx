import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

type Params = Promise<{ invoiceid: string }>;

import Invoice from "./invoice";

export default async function InvoicePage({ params }: { params: Params }) {
  const { userId, orgId } = await auth();
  if (!userId) return;
  const { invoiceid } = await params;
  const invoiceId = parseInt(invoiceid);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId))
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
