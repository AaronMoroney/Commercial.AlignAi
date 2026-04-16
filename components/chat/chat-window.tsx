"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Message, ModelId  } from "@/lib/types";

interface ChatWindowProps {
  conversationId: string;
}

// needs a return type
async function promptModel(
  modelId: string, 
  prompt: string, 
  state: Dispatch<SetStateAction<Message[]>>,
)  {
  const res = await fetch("/api/chat", {
    method: "POST", 
    headers: { 
      "Content-type": "application/json",
    }, 
    body: JSON.stringify({content: prompt})
  })

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  // need to type this correctly
  // 2. Add an empty assistant message to start streaming into
  state(prev => [...prev, 
    { 
      role: "assistant", 
      content: "", 
      id: crypto.randomUUID(),
      timestamps: Date.now(),
    }]);

  while(true) {
    const { done, value } = await reader.read();

    if(done) {
      break;
    }

    const chunk = decoder.decode(value, { 
      stream: true 
    });

    // assistant is always last!
    state(prev => {
      const messages = [...prev];
      const last = messages.length - 1;

      messages[last] = {
        ...messages[last],
        content: messages[last].content + chunk,
      };

      return messages;
    });
  }
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(["chatgpt"]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  function handleSend() {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const prompt = input.trim();
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    setTimeout(async () => {
      const responses: Partial<Record<ModelId, string>> = {};
      for (const modelId of selectedModels) {
        responses[modelId] = await promptModel(modelId, prompt, setMessages);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        responses,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <ScrollArea className="flex-1 px-4 pb-40">
        <div className="mx-auto max-w-3xl py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
              <div className="text-4xl font-bold tracking-tight text-foreground">AlignAI</div>
              <p className="text-muted-foreground text-sm max-w-sm">
                Compare responses from ChatGPT, Claude, Gemini, and Grok side-by-side.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3 py-4">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs text-muted-foreground font-semibold">AI</span>
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground animate-pulse">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        selectedModels={selectedModels}
        onModelsChange={setSelectedModels}
        disabled={loading}
      />
    </div>
  );
}
