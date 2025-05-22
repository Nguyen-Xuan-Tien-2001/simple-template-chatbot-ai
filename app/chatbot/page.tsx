"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { LoadingSpinner } from "@/components/loading-page";
import { NavActions } from "@/components/nav-actions";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatSupport from "@/src/components/ui/chat/chat-support";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 shadow-sm z-10">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-l font-semibold custom-color">
                Talk to the HSV AI✨
              </h1>
            </div>
            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
            <div className="mx-auto h-full w-full max-w-5xl rounded-xl bg-muted/50">
              <ChatSupport />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};
export default page;
