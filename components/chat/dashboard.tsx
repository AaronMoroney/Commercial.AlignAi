"use client";

import { useState } from "react";
import { Conversation } from "@/lib/types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function newConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: `Chat ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    createdAt: new Date(),
    messages: [],
  };
}

export function Dashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([
    newConversation(),
  ]);
  const [activeId, setActiveId] = useState(conversations[0].id);

  function handleNew() {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }

  return (
    <SidebarProvider>
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center border-b border-border shrink-0 p-4" >
          <SidebarTrigger className="-ml-1" />
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow key={activeId} conversationId={activeId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
