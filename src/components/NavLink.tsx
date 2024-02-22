// "use client";
// import clsx from "clsx";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function NavLink({
//   href,
//   text,
// }: {
//   href: string;
//   text: string;
// }) {
//   const pathname = usePathname();

//   return (
//     <Link
//       href={href}
//       className={clsx(
//         "px-4 py-2 rounded-md text-white hover:bg-teal-800",
//         pathname === href ? "bg-teal-600" : "bg-zinc-600"
//       )}
//     >
//       {text}
//     </Link>
//   );
// }
