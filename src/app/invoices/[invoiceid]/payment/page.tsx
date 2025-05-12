import { Badge } from "@/components/ui/badge";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { createPayment } from "@/app/actions";
import { UpDateStatusClient } from "@/components/UpdateStatusClient";
import Stripe from "stripe";
const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

type Params = Promise<{ invoiceid: string }>;
type SearchParams = Promise<{ status?: string; session_id?: string }>;

interface InvoicePageProps {
  params: Params;
  searchParams: SearchParams;
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const { invoiceid } = await params;
  const invoiceId = parseInt(invoiceid);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  // 安全地解析 URL 参数
  const searchParamsData = await searchParams;
  const status = searchParamsData?.status || "";
  const sessionId = searchParamsData?.session_id || "";

  // 定义状态变量
  let paymentStatus = "";
  let isError = false;
  let isCanceled = false;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentStatus = session.payment_status || "";

      // 如果支付成功，直接更新状态
      if (paymentStatus === "paid") {
        return <UpDateStatusClient invoiceId={invoiceId} />;
      } else if (status === "success" && paymentStatus !== "paid") {
        // 如果状态为成功但支付状态不是paid，显示错误
        isError = true;
      }
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      isError = true;
    }
  } else if (status === "canceled") {
    // 如果状态为canceled，设置isCanceled为true
    isCanceled = true;
  }

  // 获取发票数据
  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className="w-full h-full">
      <Container>
        {isError && (
          <p className="bg-red-100 text-red-800 text-center px-3 py-2 rounded-lg mb-6">
            Something went wrong with the payment. Please try again.
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-100 text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was canceled.
          </p>
        )}

        {invoice.status === "paid" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="flex items-center gap-2 text-green-700 font-medium">
              <Check className="w-5 h-5 text-green-600" />
              Payment processed successfully! Your invoice has been marked as
              paid.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-5xl font-bold">
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-600",
                    invoice.status === "void" && "bg-gray-700",
                    invoice.status === "uncollectible" && "bg-red-600"
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>
            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-teal-600">
              Manage Invoice
            </h2>
            {invoice.status === "open" && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="flex gap-2 font-bold bg-teal-600">
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <p className="flex gap-2 items-center text-xl font-bold">
                <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                Invoice Paid
              </p>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4"> Invoice Details</h2>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
