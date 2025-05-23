"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const router = useRouter();
  const handleConversationClick = (url: string) => {
    router.push(url + uuidv4());
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            onClick={() => {
              return (
                item.title === "New Chat" && handleConversationClick(item.url)
              );
            }}
          >
            <span className="cursor-pointer">
              <item.icon />
              <span>{item.title}</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
