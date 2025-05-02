import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/container";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) return;
  const results = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.userId, userId));

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between">
          <h1 className="text-5xl font-bold">Invoices</h1>
          <Button className="inline-flex gap-2" variant="ghost" asChild>
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="text-left p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              return (
                <TableRow key={result.id}>
                  <TableCell className="font-medium text-left p-0">
                    <Link className="block p-4" href={`/invoices/${result.id}`}>
                      {new Date(result.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${result.id}`}>
                      David
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${result.id}`}>
                      david@gmail.com
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${result.id}`}>
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
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${result.id}`}>
                      {(result.value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
