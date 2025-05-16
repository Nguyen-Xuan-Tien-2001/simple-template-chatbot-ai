"use client";

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

export function NavFavorites({
  favorites,
}: {
  favorites: {
    name: string;
    url: string;
    emoji?: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversation_id = searchParams?.get("conversation_id");
  const handleConversationClick = (url: string) => {
    router.push(url); // Sử dụng router.push để thay đổi URL mà không reload trang
  };
  const handleDelete = () => {
    // Xử lý xóa lịch sử ở đây
    toast("Đang phát triển tính năng xóa lịch sử");
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Histories</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.name + item.url}>
            <SidebarMenuButton
              isActive={item.url === `?conversation_id=${conversation_id}`}
              asChild
              onClick={() => handleConversationClick(item.url)}
            >
              <span className="cursor-pointer">
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
