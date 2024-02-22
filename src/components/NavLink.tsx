"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "px-4 py-2 rounded-md text-white hover:bg-teal-800",
        pathname === href ? "bg-teal-600" : "bg-zinc-600"
      )}
    >
      {children}
    </Link>
  );
}
