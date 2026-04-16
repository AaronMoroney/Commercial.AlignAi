"use client";

import { Conversation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageSquarePlus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: ChatSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm tracking-wide group-data-[collapsible=icon]:hidden">
            AlignAI
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNew}
            className="size-7 shrink-0"
            title="New chat"
          >
            <MessageSquarePlus className="size-4" />
          </Button>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 group-data-[collapsible=icon]:hidden">
              Conversations
            </p>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    isActive={conv.id === activeId}
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                      "w-full justify-start gap-2 text-sm",
                      conv.id === activeId && "bg-sidebar-accent"
                    )}
                    title={conv.title}
                  >
                    <MessageSquare className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {conv.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        {/* footer content goes here */}
      </SidebarFooter>
    </Sidebar>
  );
}
