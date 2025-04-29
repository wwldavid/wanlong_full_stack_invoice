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

export default function Home() {
  return (
    <main className="flex flex-col h-full justify-center max-w-5xl mx-auto text-center gap-8 bg-teal-100 my-12">
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
          <TableRow>
            <TableCell className="font-medium text-left p-4">
              <span>28/04/2025</span>
            </TableCell>
            <TableCell className="text-left p-4">
              <span>David</span>
            </TableCell>
            <TableCell className="text-left p-4">
              <span>david@gmail.com</span>
            </TableCell>
            <TableCell className="text-left p-4">
              <Badge className="rounded-full">open</Badge>
            </TableCell>
            <TableCell className="text-left p-4">
              <span>$250.00</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
