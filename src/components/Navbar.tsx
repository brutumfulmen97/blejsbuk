import NavLink from "./NavLink";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Home, User } from "lucide-react";

const Navbar = async () => {
  const { isAuthenticated } = await getKindeServerSession();
  const isAuthed = await isAuthenticated();

  const routes = [
    {
      href: "/",
      text: "Home",
      protected: false,
    },
    {
      href: "/create",
      text: "Create new post",
      protected: true,
    },
  ];

  return (
    <nav className="bg-slate-900 md:h-screen md:w-[300px] flex md:flex-col md:justify-between justify-center gap-1 md:gap-8 p-1 md:p-8 items-center md:items-start">
      <div className="flex md:flex-col gap-1 md:gap-8 items-center md:items-start">
        {routes.map((route) => {
          if (route.href === "/") {
            return (
              <div
                key={route.href}
                className="flex items-center justify-center"
              >
                <Link
                  href={route.href}
                  className="p-4 rounded-md  hover:bg-slate-500"
                >
                  <Home size={20} className="block md:hidden" />
                  <Image
                    src="/logo.png"
                    width={100}
                    height={100}
                    className="hidden md:block"
                    alt="blejsbuk logo"
                  />
                </Link>
              </div>
            );
          }
          if (route.protected && !isAuthed) return null;
          return (
            <>
              <Link
                href={route.href}
                className="md:hidden p-4 rounded-md  hover:bg-slate-500"
              >
                <Edit2 size={20} />
              </Link>
              <NavLink
                key={route.href}
                href={route.href}
                className="md:block hidden"
              >
                {route.text}
              </NavLink>
            </>
          );
        })}
      </div>
      {!isAuthed ? (
        <div className="flex md:flex-col gap-8 md:ml-0 ml-auto mr-4">
          <LoginLink className="hover:underline">Log in</LoginLink>
          <RegisterLink className="hover:underline">Register</RegisterLink>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-4 md:bg-slate-600 hover:bg-slate-500">
            <User size={20} />
            <div className="scale-0 group-hover:scale-100 flex flex-col gap-4 w-[150px] rounded-md p-4 bg-[rgb(71,85,105,0.5)] absolute md:bottom-8 md:left-8 left-8 top:8 z-20 transition-all duration-300 ease-in origin-top-left md:origin-bottom-left">
              <Link href="/profile" className="hover:underline">
                Go to profile
              </Link>
              <LogoutLink className="hover:underline">Log out</LogoutLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
