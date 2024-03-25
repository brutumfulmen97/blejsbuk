"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { forwardRef, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/Drawer";

const EditProfileDrawer = forwardRef(function EditProfileDrawer(
  props: any,
  ref: any
) {
  const { user } = useKindeBrowserClient();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button ref={ref} className="hidden">
          open drawer
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Finish setting up your profile to {props.message}.
            </DrawerTitle>
            <br />
            <Link
              href={`/profile/edit/${user?.id}`}
              className="hover:underline text-center"
            >
              Do it now!
            </Link>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Link
                href="/"
                className="w-full text-center bg-neutral-700 rounded-md py-2 hover:bg-neutral-800"
              >
                I&apos;ll do it later.
              </Link>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
});
EditProfileDrawer.displayName = "EditProfileDrawer";

export default EditProfileDrawer;
