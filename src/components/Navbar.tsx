import NavLink from "./NavLink";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import { CircleFadingPlus, Edit2, Home, Info, User } from "lucide-react";
import Search from "./Search";
import { FloatingNav } from "./ui/floating-navbar";

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
      href: "/about-us",
      text: "About us",
      protected: false,
    },
    {
      href: "/create",
      text: "Create new post",
      protected: true,
    },
    {
      href: "/create-community",
      text: "Create new community",
      protected: true,
    },
  ];

  return (
    <>
      <div className="hidden md:block h-screen md:w-[350px] lg:w-[325px]" />
      <nav className="bg-slate-950 hidden fixed z-[100] left-0 top-0 bottom-0 md:flex md:min-h-screen flex-col md:justify-between justify-center gap-1 md:gap-8 p-1 md:p-8 items-center md:items-start">
        <div className="flex md:flex-col md:w-[195px] gap-1 md:gap-8 items-center md:items-start">
          {routes.map((route) => {
            if (route.href === "/") {
              return (
                <div
                  key={route.href}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <NavLink href={route.href}>
                    <Home size={16} className="block md:hidden" />
                    <Image
                      src="/logo.png"
                      width={100}
                      height={100}
                      className="hidden md:block mx-auto"
                      alt="blejsbuk logo"
                    />
                  </NavLink>
                  <Search
                    className="hidden md:block mt-4 w-full"
                    text={"Search..."}
                  />
                </div>
              );
            }
            if (route.protected && !isAuthed) return null;
            return (
              <div key={route.href} className="md:w-full">
                <NavLink
                  href={route.href}
                  className="md:hidden p-3 rounded-md  hover:bg-slate-500 block "
                >
                  {route.href === "/create" ? (
                    <Edit2 size={16} />
                  ) : route.href === "/about-us" ? (
                    <Info size={16} />
                  ) : (
                    <CircleFadingPlus size={16} />
                  )}
                </NavLink>
                <NavLink href={route.href} className="md:block hidden w-full">
                  {route.text}
                </NavLink>
              </div>
            );
          })}
        </div>
        {!isAuthed ? (
          <div className="flex md:flex-col gap-8 md:ml-0 ml-auto mr-4">
            <LoginLink className="hover:underline">Log in</LoginLink>
            <RegisterLink className="hover:underline">Register</RegisterLink>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-3 md:bg-slate-600 bg-zinc-600 hover:bg-slate-500">
              <User size={16} />
              <div className="scale-0 group-hover:scale-100 flex flex-col gap-4 w-[150px] rounded-md p-3 bg-[rgb(71,85,105,0.5)] absolute md:bottom-8 md:left-8 left-8 top:8 z-20 transition-all duration-300 ease-in origin-top-left md:origin-bottom-left">
                <Link href="/profile" className="hover:underline">
                  Go to profile
                </Link>
                <LogoutLink className="hover:underline">Log out</LogoutLink>
              </div>
            </div>
          </div>
        )}
        <Search className="md:hidden" />
      </nav>
      <FloatingNav>
        <nav className="flex flex-wrap  md:hidden md:h-screen md:justify-between justify-center gap-1 md:gap-8 p-1 md:p-8 items-center md:items-start">
          <div className="flex md:flex-col gap-1 md:gap-8 items-center md:items-start">
            {routes.map((route) => {
              if (route.href === "/") {
                return (
                  <div
                    key={route.href}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <NavLink href={route.href}>
                      <Home size={16} className="block md:hidden" />
                      <Image
                        src="/logo.png"
                        width={100}
                        height={100}
                        className="hidden md:block mx-auto"
                        alt="blejsbuk logo"
                      />
                    </NavLink>
                    <Search
                      className="hidden md:block mt-4 w-full"
                      text={"Search..."}
                    />
                  </div>
                );
              }
              if (route.protected && !isAuthed) return null;
              return (
                <div key={route.href} className="md:w-full">
                  <NavLink
                    href={route.href}
                    className="md:hidden p-3 rounded-md  hover:bg-slate-500 block "
                  >
                    {route.href === "/create" ? (
                      <Edit2 size={16} />
                    ) : route.href === "/about-us" ? (
                      <Info size={16} />
                    ) : (
                      <CircleFadingPlus size={16} />
                    )}
                  </NavLink>
                  <NavLink href={route.href} className="md:block hidden w-full">
                    {route.text}
                  </NavLink>
                </div>
              );
            })}
          </div>
          {!isAuthed ? (
            <div className="flex gap-2 justify-center">
              <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-3 md:bg-slate-600 bg-zinc-600 hover:bg-slate-500">
                <User size={16} />
                <div className="scale-0 group-hover:scale-100 flex flex-col gap-4 w-[150px] rounded-md p-3 bg-[rgb(71,85,105,0.5)] absolute md:bottom-8 md:left-8 right-8 top:8 z-20 transition-all duration-300 ease-in origin-top-right md:origin-bottom-left">
                  <LoginLink className="hover:underline">Log in</LoginLink>
                  <RegisterLink className="hover:underline">
                    Register
                  </RegisterLink>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-3 md:bg-slate-600 bg-zinc-600 hover:bg-slate-500">
                <User size={16} />
                <div className="scale-0 group-hover:scale-100 flex flex-col gap-4 w-[150px] rounded-md p-3 bg-[rgb(71,85,105,0.5)] absolute md:bottom-8 md:left-8 right-8 top:8 z-20 transition-all duration-300 ease-in origin-top-right md:origin-bottom-left">
                  <Link href="/profile" className="hover:underline">
                    Go to profile
                  </Link>
                  <LogoutLink className="hover:underline">Log out</LogoutLink>
                </div>
              </div>
            </div>
          )}
          <Search className="md:hidden" />
        </nav>
      </FloatingNav>
    </>
  );
};

export default Navbar;
