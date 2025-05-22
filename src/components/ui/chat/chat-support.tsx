/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { v4 as uuidv4 } from "uuid";

import CustomLink from "@/lib/customlink";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Markdown, { Components } from "react-markdown";
import { toast } from "sonner";
import { Message, References } from "../../../../lib/getHistory";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { useGetHistory } from "./hooks/useGetHistory";
import { postQueryToChatBot } from "./hooks/usePostQuery";

const ReferenceIds: React.FC<{
  ids: string[];
  references: References[] | undefined;
}> = ({ ids, references }) => {
  if (!ids || ids.length === 0) return null;
  const customComponents: Components = {
    a: CustomLink,
  };
  return (
    <span>
      {ids.map((id, index) => {
        const index_temp = Number(id) - 1;
        const fileName = references?.[index_temp]?.metadata?.file_name;
        const fileUrl =
          references?.[index_temp]?.metadata?.file_url === ""
            ? undefined
            : references?.[index_temp]?.metadata?.file_url;
        return (
          <HoverCard key={index}>
            <span>
              <HoverCardTrigger className="text-blue-500 cursor-pointer">
                [{id}]
              </HoverCardTrigger>
            </span>
            <HoverCardContent className="w-[400px]">
              <Markdown components={customComponents}>
                {[
                  "**References:** \n",
                  fileUrl
                    ? `\n [${fileName?.replace(".md", "")}](${fileUrl}) \n`
                    : "\n *internal documents* \n",
                ].join("")}
              </Markdown>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </span>
  );
};

export const UUID = "988b5c3b-4d21-4c0f-bddb-73957057b667";

const DataTemp = [
  {
    content:
      "# Từ mật khẩu đến Passkey: Bước vào kỷ nguyên mới của an ninh mạng Các cuộc **[tấn công phishing](https://hpttechstore.com/blogs/news/yubikey-ho-tro-phong-chong-tan-cong-phishing-nhu-the-nao)** (lừa đảo trực tuyến) đang ngày càng phổ biến và được xem là nguyên nhân góp phần vào hơn 80% các vi phạm an ninh. [1]\n\n Kẻ tấn công thường giả mạo các thực thể hợp pháp để lừa người dùng cung cấp thông tin cá nhân thông qua email, mạng xã hội, tin nhắn hoặc trang web giả mạo. Khi đã có được thông tin cá nhân, chúng có thể tiếp tục xâm nhập vào nhiều tài khoản khác. ## **Mật khẩu và những hạn chế** Mật khẩu từ lâu đã là phương thức chính để xác minh danh tính trực tuyến, nhưng chúng vốn dĩ không an toàn. Người dùng thường phải tạo ra những chuỗi ký tự phức tạp, khó nhớ và dễ mắc lỗi khi nhập. Hơn nữa, thói quen sử dụng lại mật khẩu cho nhiều tài khoản hoặc chọn những mật khẩu dễ đoán tạo điều kiện cho hacker xâm nhập. Các cuộc tấn công phishing tinh vi có thể khiến người dùng vô tình cung cấp mật khẩu của mình cho kẻ xấu.Để cài đặt YubiKey cho tài khoản Facebook, bạn có thể làm theo các bước sau đây, chi tiết như sau:\n\n**1. Chuẩn bị:**\n\n*   YubiKey (phiên bản tương thích với máy tính hoặc điện thoại của bạn).\n*   Trình duyệt web hoặc ứng dụng Facebook trên điện thoại.\n*   Tài khoản Facebook đã bật xác thực hai yếu tố (2FA).\n\n**2. Cài đặt trên máy tính:**\n\n*   **Bước 1:** Đăng nhập vào tài khoản Facebook của bạn.\n    *   Mở trình duyệt web trên máy tính.\n    *   Truy cập facebook.com và đăng nhập.\n*   **Bước 2:** Truy cập Cài đặt & Quyền riêng tư.\n    *   Nhấp vào mũi tên nhỏ xuống ở góc trên cùng bên phải, chọn “Cài đặt & Quyền riêng tư”.\n    *   Chọn “Cài đặt”, sau đó nhấp vào “Bảo mật và Đăng nhập” trong menu bên trái.\n*   **Bước 3:** Bật xác thực hai yếu tố.\n    *   Tìm mục “Xác thực hai yếu tố”, nhấp vào “Chỉnh sửa”.\n*   **Bước 4:** Thêm khóa YubiKey.\n    *   Chọn “Khóa bảo mật vật lý” và nhấp vào “Thêm khóa bảo mật”.\n\n**3. Cài đặt trên điện thoại:**\n\n*   **Bước 1:** Mở ứng dụng Facebook.\n    *   Mở ứng dụng Facebook trên điện thoại và đăng nhập.\n*   **Bước 2:** Truy cập Cài đặt & Quyền riêng tư.\n    *   Nhấn vào ba đường ngang ở góc dưới bên phải (iOS) hoặc góc trên bên phải (Android).\n    *   Chọn “Cài đặt & Quyền riêng tư”, sau đó chọn “Cài đặt”.\n    *   Nhấn vào “Bảo mật và Đăng nhập”.\n*   **Bước 3:** Thêm YubiKey.\n    *   Giống như trên máy tính, hãy truy cập vào mục “Xác thực hai yếu tố” và chọn “Khóa bảo mật vật lý”. [1]\n\n**4. Hoàn tất cài đặt:**\n\n*   Sau khi đã làm theo các bước trên, chương trình sẽ yêu cầu bạn chạm vào YubiKey để tiếp tục. [2]\n\nLưu ý: Bạn cần nhập mã PIN đã được đặt trên YubiKey vào tài khoản Facebook của mình để hoàn tất quá trình cài đặt. [3]",
    role: "assistant",
    references: [],
  },
];
export default function ChatSupport() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const conversation_id = searchParams?.get("conversation_id");

  const [conversationId, setConversationId] = useState<string>(
    conversation_id || uuidv4() || ""
  );
  const [dataMessages, setDataMessages] = useState<Message[]>([]);
  const { data: messages, refetch } = useGetHistory({
    userId: UUID,
    conversation_id: conversationId,
  });

  useEffect(() => {
    if (conversation_id) {
      setConversationId(conversation_id);
    }
  }, [conversation_id]);

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
      queryClient.invalidateQueries({ queryKey: ["userConversations", UUID] });
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
    mutation.mutate({
      query: query.trim(),
      user_id: UUID,
      conversation_id: conversationId,
    });
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
    <div className="w-full h-full flex flex-col overflow-hidden relative pb-24">
      <ScrollArea className="h-[68vh]">
        <ChatMessageList>
          {
            !!dataMessages.length &&
            dataMessages?.map((item, id) => {
              return (
                <ChatBubble
                  key={id + item.content}
                  variant={item.role === "user" ? "sent" : "received"}
                  className="mb-2"
                >
                  <ChatBubbleAvatar
                    fallback={item.role === "user" ? "U" : "✨"}
                  />
                  <ChatBubbleMessage>
                    <Markdown
                      components={{
                        li(props) {
                          const { children } = props;
                          const referenceRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
                          const renderedChildren = [];
                          let lastIndex = 0;

                          const textContent = Array.isArray(children)
                            ? children
                                .map((child) =>
                                  typeof child === "string" ? child : ""
                                )
                                .join("")
                            : String(children);

                          textContent.replace(
                            referenceRegex,
                            (match, p1, offset) => {
                              if (offset > lastIndex) {
                                renderedChildren.push(
                                  <React.Fragment key={`text-${lastIndex}`}>
                                    {textContent.substring(lastIndex, offset)}
                                  </React.Fragment>
                                );
                              }

                              const ids = p1
                                .split(",")
                                .map((id: string) => id.trim());

                              renderedChildren.push(
                                <ReferenceIds
                                  key={`ref-${offset}`}
                                  ids={ids}
                                  references={item.references}
                                />
                              );

                              lastIndex = offset + match.length;
                              return match;
                            }
                          );

                          if (lastIndex < textContent.length) {
                            renderedChildren.push(
                              <React.Fragment key={`text-${lastIndex}`}>
                                {textContent.substring(lastIndex)}
                              </React.Fragment>
                            );
                          }
                          return <li>{renderedChildren}</li>;
                        },
                        p(props) {
                          if (
                            React.isValidElement(props.children) &&
                            props.children.type === "strong"
                          ) {
                            return <p {...props} />;
                          } else {
                            const { children } = props;
                            const referenceRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
                            const renderedChildren = [];
                            let lastIndex = 0;

                            const textContent = Array.isArray(children)
                              ? children.join("")
                              : String(children);

                            textContent.replace(
                              referenceRegex,
                              (match, p1, offset) => {
                                if (offset > lastIndex) {
                                  renderedChildren.push(
                                    <React.Fragment key={`text-${lastIndex}`}>
                                      {textContent.substring(lastIndex, offset)}
                                    </React.Fragment>
                                  );
                                }

                                const ids = p1
                                  .split(",")
                                  .map((id: string) => id.trim());

                                // Thêm component ReferenceIds
                                renderedChildren.push(
                                  <ReferenceIds
                                    key={`ref-${offset}`}
                                    ids={ids}
                                    references={item.references}
                                  />
                                );

                                lastIndex = offset + match.length;
                                return match;
                              }
                            );

                            if (lastIndex < textContent.length) {
                              renderedChildren.push(
                                <React.Fragment key={`text-${lastIndex}`}>
                                  {textContent.substring(lastIndex)}
                                </React.Fragment>
                              );
                            }

                            return <p {...props}>{renderedChildren}</p>;
                          }
                        },
                      }}
                    >
                      {item.content || null}
                    </Markdown>
                  </ChatBubbleMessage>
                </ChatBubble>
              );
            })
          }

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
      <div className="flex items-center gap-2 absolute bottom-0 left-0 right-0 p-4 ">
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
          <Send className="size-4 dark:text-secondary-foreground" />
        </Button>
      </div>
    </div>
  );
}
