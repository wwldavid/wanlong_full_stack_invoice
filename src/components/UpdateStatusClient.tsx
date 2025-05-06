"use client";

import { useEffect } from "react";

export function UpDateStatusClient({ invoiceId }: { invoiceId: number }) {
  useEffect(() => {
    const updateStatus = async () => {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");

      await fetch("/actions/update-status", {
        method: "POST",
        body: formData,
      }).then(() => {
        window.location.href = `/invoices/${invoiceId}/payment`;
      });
    };
    updateStatus();
  }, [invoiceId]);

  return null;
}
