/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { LogOut, MessageCirclePlus, Send } from "lucide-react";
import Markdown, { Components } from "react-markdown";

import { Button } from "@/components/ui/button";
import { ChatMessageList } from "./chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { postQueryToChatBot } from "./hooks/usePostQuery";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetHistory } from "./hooks/useGetHistory";
import { Message } from "./hooks/getHistory";
import { Separator } from "@/components/ui/separator";
import { useClearHistoryMutation } from "./hooks/useClearHistoryMutation";
import CustomLink from "@/lib/customlink";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
const UUID = "988b5c3b-4d21-4c0f-bddb-73957057b667";

export default function ChatSupport() {
  const [dataMessages, setDataMessages] = useState<Message[]>([]);
  const { data: messages, refetch } = useGetHistory({
    userId: UUID,
  });
  const customComponents: Components = {
    a: CustomLink,
  };

  const clearHistoryMutation = useClearHistoryMutation();

  useEffect(() => {
    if (messages) {
      setDataMessages(messages);
    }
  }, [messages]);
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login"); // Chuyển hướng đến trang đăng nhập nếu không có user_id
    } else {
    }
  }, []);

  const router = useRouter();
  const [query, setQuery] = useState("");
  const mutation = useMutation({
    mutationFn: postQueryToChatBot, // Hàm gọi API cho mutation
    onSuccess: (data) => {
      refetch();
    },
    onError: (error) => {
      // Xử lý khi gọi API thất bại
      console.error("Error posting query:", error);
      toast("Error posting query: " + (error as Error).message); // Hiển thị thông báo lỗi
    },
  });

  const handleSubmit = () => {
    if (!query.trim() || mutation.isPending) {
      return; // Không gửi nếu input rỗng hoặc đang loading
    }
    setDataMessages([...dataMessages, { role: "user", content: query.trim() }]); // Cập nhật dữ liệu từ API vào state
    setQuery("");
    // Gọi mutation với dữ liệu từ state 'query'
    mutation.mutate({ query: query.trim(), user_id: UUID });
  };

  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      if (!event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    }
  };
  return (
    <div className="bg-white max-w-[70vw] min-w-[70vw] max-h-[100vh] flex flex-col justify-between p-10 overflow-hidden">
      <div className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Chat with our AI HSV ✨</h1>
        <p>Ask me any question about HSV or Yubikey</p>
        <Separator className="my-2" />
        <div className="flex gap-2 items-center pt-2">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => {
              clearHistoryMutation.mutate({ user_id: UUID });
            }}
          >
            New Chat
            <MessageCirclePlus />
          </Button>
          <Button
            className="cursor-pointer text-red-500"
            onClick={handleLogOut}
            variant="secondary"
          >
            Log out
            <LogOut />
          </Button>
        </div>
      </div>
      <ScrollArea className="rounded-md h-[60vh]">
        <ChatMessageList>
          {!!dataMessages.length &&
            dataMessages?.map((item, id) => {
              return (
                <ChatBubble
                  key={id}
                  variant={item.role === "user" ? "sent" : "received"}
                  className="mb-2"
                >
                  <ChatBubbleAvatar
                    fallback={item.role === "user" ? "U" : "AI"}
                  />
                  <ChatBubbleMessage>
                    {item?.content
                      .split(/(\[\d+(?:, \d+)*\])/)
                      .map((part, index) => {
                        const match = part.match(/\[(\d+(?:, \d+)*)\]/);
                        if (match) {
                          const idArr = match[1].split(", ").map(Number);
                          return (
                            <HoverCard key={index}>
                              <HoverCardTrigger className="text-blue-500 cursor-pointer">
                                {part}
                              </HoverCardTrigger>
                              <HoverCardContent className="w-[400px]">
                                <Markdown components={customComponents}>
                                  {[
                                    "**References:** \n",
                                    ...idArr.map((id) => {
                                      const fileName =
                                        item.references?.[id - 1]?.metadata
                                          ?.filename;
                                      const fileUrl =
                                        item.references?.[id - 1]?.metadata
                                          ?.file_url === ""
                                          ? "internal documents"
                                          : item.references?.[id - 1]?.metadata
                                              ?.file_url;
                                      return `\n [${
                                        fileName?.replace(".md", "")
                                      }](${fileUrl}) \n`;
                                    }),
                                  ].join("")}
                                </Markdown>
                              </HoverCardContent>
                            </HoverCard>
                          );
                        }
                        return <Markdown components={customComponents} key={index}>{part}</Markdown>;
                      })}
                  </ChatBubbleMessage>
                </ChatBubble>
              );
            })}

          {mutation.isPending && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar fallback="AI" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          {!dataMessages.length && (
            <p className="text-sm text-muted-foreground">
              Ask me anything to get started
            </p>
          )}
        </ChatMessageList>
      </ScrollArea>
      <div className="flex items-center gap-2">
        <ChatInput
          placeholder="You can ask me any question about HSV or Yubikey..."
          disabled={mutation.isPending}
          value={query}
          onChange={(value) => {
            setQuery(value.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          disabled={mutation.isPending}
          className="cursor-pointer"
          onClick={() => handleSubmit()}
          type="submit"
          size="icon"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

type LinkMap = {
  [key: string]: string;
};

function generateMarkdownLinks(links: LinkMap): string {
  let result = "";
  let counter = 1; // Khởi tạo biến đếm

  for (const key in links) {
    if (Object.prototype.hasOwnProperty.call(links, key)) {
      const url = links[key];

      result += `\n **[${counter}]** [${key}](${url})`;
      counter++;
    }
  }
  return result;
}
