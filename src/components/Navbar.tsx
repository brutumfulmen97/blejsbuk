// import { lazy } from "react";
// import { currentUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { clsx } from "clsx";
// import NavLink from "./NavLink";
// import { router } from "~/server/trpc";

// const UserButton = lazy(() =>
//   import("@clerk/nextjs").then((mod) => ({ default: mod.UserButton }))
// );

// const Navbar = async () => {
//   const user = await currentUser();

//   const routes = [
//     {
//       href: "/",
//       text: "Home",
//     },
//     {
//       href: "/test",
//       text: "Test",
//     },
//     {
//       href: "/my-posts",
//       text: "My posts",
//     },
//     {
//       href: "/create",
//       text: "Create new post",
//     },
//   ];

//   return (
//     <nav className="bg-slate-900 h-screen flex flex-col justify-between p-8 ">
//       <div className="flex flex-col gap-8">
//         {routes.map((route) => (
//           <NavLink key={route.href} href={route.href} text={route.text} />
//         ))}
//       </div>
//       {!user ? (
//         <div className="flex flex-col gap-8">
//           <NavLink href="/sign-in" text="Sign in" />
//           <NavLink href="/sign-up" text="Sign up" />
//         </div>
//       ) : (
//         <div className="h-8">
//           <UserButton />
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
