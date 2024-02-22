import NavLink from "./NavLink";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

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
    <nav className="bg-slate-900 h-screen w-[300px] flex flex-col justify-between p-8 ">
      <div className="flex flex-col gap-8">
        {routes.map((route) => {
          if (route.href === "/") {
            return (
              <div
                key={route.href}
                className="flex items-center justify-center"
              >
                <Link href={route.href}>
                  <Image
                    src="/logo.png"
                    width={100}
                    height={100}
                    alt="blejsbuk logo"
                  />
                </Link>
              </div>
            );
          }
          if (route.protected && !isAuthed) return null;
          return (
            <NavLink key={route.href} href={route.href}>
              {route.text}
            </NavLink>
          );
        })}
      </div>
      {!isAuthed ? (
        <div className="flex flex-col gap-8">
          <LoginLink>Log in</LoginLink>
          <RegisterLink>Register</RegisterLink>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="group cursor-pointer relative w-[fit-content] rounded-full p-4 bg-slate-600 hover:bg-slate-500">
            <User size={20} />
            <div className="scale-0 group-hover:scale-100 flex flex-col gap-4 w-[200px] rounded-md p-4 bg-[rgb(71,85,105,0.5)] absolute bottom-8 left-8 z-20">
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
