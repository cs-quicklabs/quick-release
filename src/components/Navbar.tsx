"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "LogOut",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
];

export function Navbar() {
  const router = useRouter();
  const [loader, setLoader] = React.useState(false);
  const handleLogout = async () => {
    setLoader(true);
    try {
      const data = await signOut({
        redirect: false,
      });
      setLoader(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };
  return (
    <div className="flex justify-around items-center my-4">
      <Link href="/allLogs">Quick Release</Link>
      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[250px] ">
                  {components.map((component) => (
                    <div className="flex items-center">
                      <ListItem
                        onClick={handleLogout}
                        key={component.title}
                        title={component.title}
                      ></ListItem>
                      {loader ? <Loader /> : null}
                    </div>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
