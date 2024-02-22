import NavLink from "./NavLink";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";

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
      href: "/my-posts",
      text: "My posts",
      protected: true,
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
        <div className="h-8">
          <LogoutLink>Log out</LogoutLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
