import NavLink from "./NavLink";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import { CircleFadingPlus, Edit2, Home, User } from "lucide-react";
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
      <nav className="bg-slate-950 w-[350px] hidden md:flex md:min-h-screen flex-col md:justify-between justify-center gap-1 md:gap-8 p-1 md:p-8 items-center md:items-start">
        <div className="bg-slate-950 flex flex-col justify-between fixed inset-0 right-auto gap-8 p-8 items-start">
          <div className="flex md:flex-col gap-1 md:gap-8 items-center md:items-start">
            {routes.map((route) => {
              if (route.href === "/") {
                return (
                  <div
                    key={route.href}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <NavLink href={route.href}>
                      <Home size={20} className="block md:hidden" />
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
                    className="md:hidden p-4 rounded-md  hover:bg-slate-500 block "
                  >
                    {route.href === "/create" ? (
                      <Edit2 size={20} />
                    ) : (
                      <CircleFadingPlus size={20} />
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
              <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-4 md:bg-slate-600 bg-zinc-600 hover:bg-slate-500">
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
          <Search className="md:hidden" />
        </div>
      </nav>
      <FloatingNav>
        <nav className="bg-slate-950 flex md:hidden md:h-screen md:justify-between justify-center gap-1 md:gap-8 p-1 md:p-8 items-center md:items-start">
          <div className="flex md:flex-col gap-1 md:gap-8 items-center md:items-start">
            {routes.map((route) => {
              if (route.href === "/") {
                return (
                  <div
                    key={route.href}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <NavLink href={route.href}>
                      <Home size={20} className="block md:hidden" />
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
                    className="md:hidden p-4 rounded-md  hover:bg-slate-500 block "
                  >
                    {route.href === "/create" ? (
                      <Edit2 size={20} />
                    ) : (
                      <CircleFadingPlus size={20} />
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
              <div className="group cursor-pointer relative w-[fit-content] rounded-md md:rounded-full p-4 md:bg-slate-600 bg-zinc-600 hover:bg-slate-500">
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
          <Search className="md:hidden" />
        </nav>
      </FloatingNav>
    </>
  );
};

export default Navbar;
