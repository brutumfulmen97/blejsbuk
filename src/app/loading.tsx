import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen grid place-content-center">
      <Loader2 size={64} className="animate-spin" />
    </div>
  );
}
