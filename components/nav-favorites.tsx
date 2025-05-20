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
import { useClearHistoryMutation } from "@/src/components/ui/chat/hooks/useClearHistoryMutation";
import { useQueryClient } from "@tanstack/react-query";
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
  const { mutate } = useClearHistoryMutation();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const conversation_id = searchParams?.get("conversation_id");
  const handleConversationClick = (url: string) => {
    router.push(url); 
  };
  const handleDelete = (conversationId: string) => {
    const userId = localStorage.getItem("user_id");
    if (!userId || getValueAfterEqualsSplit(conversationId) === null) {
      toast("User ID not found.");
      return;
    }

    mutate(
      {
        user_id: userId,
        conversation_id: getValueAfterEqualsSplit(conversationId) || "",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["userConversations", userId],
          });
          toast("Deleted successfully");
        },
        onError: () => {
          toast("Error posting query ");
        },
      }
    );
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
                <DropdownMenuItem onClick={() => handleDelete(item.url)}>
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

function getValueAfterEqualsSplit(inputString: string): string | null {
  // Tìm vị trí của dấu '=' đầu tiên
  const parts = inputString.split("=");
  // Nếu có ít nhất 2 phần (tức là có dấu '='), trả về phần tử thứ hai (giá trị sau dấu '=')
  if (parts.length > 1) {
    return parts[1];
  }
  // Nếu không có dấu '=', trả về null hoặc chuỗi rỗng tùy theo yêu cầu
  return null;
}
