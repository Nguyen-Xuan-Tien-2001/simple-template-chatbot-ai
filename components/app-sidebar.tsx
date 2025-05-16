"use client";

import {
  AudioWaveform,
  Command,
  MessageCirclePlus,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
// import { NavWorkspaces } from "@/components/nav-workspaces";
import { v4 as uuidv4 } from 'uuid';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useConversations } from "@/src/components/ui/chat/hooks/useConversations";
import { UUID } from "@/src/components/ui/chat/chat-support";

// This is sample data.
const data = {
  user: {
    name: "Nguyễn Xuân Tiến",
    email: "tiennx@hpt.vn",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
      isActive: true,
    },
    {
      title: "New Chat",
      url: "?conversation_id="+uuidv4(),
      icon: MessageCirclePlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: listConverstions } = useConversations({
    userId: UUID,
  });
  
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites
          favorites={
            listConverstions
              ? listConverstions.map((item) => ({
                  name: item.conversation_title,
                  url: `?conversation_id=${item.conversation_id}`,
                }))
              : []
          }
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
