"use client";

import React from "react";
import { BookOpen, Home, Rss, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export interface NavigationMenuItemType {
  title: string;
  href: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

const defaultNavigationMenuItems: NavigationMenuItemType[] = [
  { title: "Home", href: "#", icon: Home, isActive: true },
  { title: "Blog", href: "#blog", icon: Rss },
  { title: "Docs", href: "#docs", icon: BookOpen },
];

export default function NavigationMenuWithActiveItem({
  items = defaultNavigationMenuItems,
  className,
}: {
  items?: NavigationMenuItemType[];
  className?: string;
}) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="space-x-8">
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              active={item.isActive}
              asChild
              className={cn(
                "group relative inline-flex h-9 w-max items-center justify-center px-0.5 py-2 font-medium text-sm transition-colors text-zinc-300 hover:text-white cursor-pointer",
                "before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-[#00b0f4] before:transition-transform before:duration-300",
                "hover:before:scale-x-100",
                "focus:outline-hidden focus:before:scale-x-100",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-active:text-white data-[state=open]:before:scale-x-100 data-active:before:scale-x-100",
                "hover:bg-transparent focus:bg-transparent active:bg-transparent",
              )}
            >
              <Link className="flex flex-row items-center gap-2" href={item.href}>
                {item.icon && <item.icon className="h-4 w-4 shrink-0 text-[#00b0f4]" />}
                <span>{item.title}</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
