"use client";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="relative w-full font-semibold">
      <span className={pending ? "text-transparent" : ""}>Submit</span>
      {pending && (
        <span className="absolute flex items-center justify-center w-ful h-full text-teal-200">
          <LoaderCircle className="animate-spin" />
        </span>
      )}
    </Button>
  );
};
export default SubmitButton;
