"use client"
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChatMessageList } from "./chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function ChatSupport() {
  const DataTemp: { id: number; type: "received" | "sent"; content: string }[] =
    [
      {
        id: 1,
        type: "received",
        content: "Hello, how has your day been? I hope you are doing well.",
      },
      { id: 2, type: "sent", content: "I am doing well, thank you!" },
      { id: 3, type: "received", content: "What about you?" },
      { id: 4, type: "sent", content: "I am doing great!" },
      { id: 5, type: "received", content: "What are you up to?" },
      { id: 6, type: "sent", content: "Just working on some projects." },
      { id: 7, type: "received", content: "That sounds interesting!" },
      { id: 8, type: "sent", content: "Yes, it is!" },
      { id: 9, type: "received", content: "What projects are you working on?" },
      {
        id: 10,
        type: "received",
        content: "I am working on a chat application.",
      },
    ];
  return (
    <div className="min-w-[60vw] min-h-[100vh] flex flex-col justify-between p-24">
      <div className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Chat with our AI HSV ✨</h1>
        <p>Ask any question for our AI to answer</p>
        <div className="flex gap-2 items-center pt-2">
          <Button variant="secondary">New Chat</Button>
          <Button variant="secondary">See FAQ</Button>
        </div>
      </div>
      <div>
        <ScrollArea className="h-60 w-full rounded-md">
          <ChatMessageList>
            {DataTemp.map((item) => {
              return (
                <ChatBubble key={item.id} variant={item.type} className="mb-2">
                  <ChatBubbleAvatar
                    fallback={item.type !== "received" ? "ME" : "AI"}
                  />
                  <ChatBubbleMessage>{item.content}</ChatBubbleMessage>
                </ChatBubble>
              );
            })}

            <ChatBubble variant="received">
              <ChatBubbleAvatar fallback="AI" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          </ChatMessageList>
        </ScrollArea>
      </div>
      <div className="flex items-center gap-2">
        <ChatInput onChange={(value)=>{
          console.log('====================================');
          console.log("input changed:",value.target.value);
          console.log('====================================');
        }} />
        <Button type="submit" size="icon">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
