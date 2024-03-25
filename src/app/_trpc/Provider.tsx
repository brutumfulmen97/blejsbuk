"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useEffect, useRef, useState } from "react";
import { trpc } from "./client";
import superjson from "superjson";
import EditProfileDrawerContext from "~/utils/EditProfileDrawerContext";
import EditProfileDrawer from "~/components/EditProfileDrawer";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const editRef = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson, // Add this line
        }),
      ],
    })
  );

  useEffect(() => {
    if (isOpen && editRef.current) {
      editRef.current.click();
      setIsOpen(false);
    }
  }, [isOpen]);

  return (
    <EditProfileDrawerContext.Provider
      value={{
        isOpen,
        setIsOpen,
        message,
        setMessage,
      }}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <EditProfileDrawer message={message} ref={editRef} />
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </EditProfileDrawerContext.Provider>
  );
}
