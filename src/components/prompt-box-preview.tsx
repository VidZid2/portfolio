"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, FolderKanban, Paperclip, MessageSquareIcon, CopyIcon, RefreshCcwIcon, ThumbsDownIcon, ThumbsUpIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { memo, useCallback, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CurvedMenu } from "@/components/ui/curved-menu";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useStickToBottomContext } from "use-stick-to-bottom";

function ScrollTracker({ onScrollStateChange }: { onScrollStateChange: (isAtBottom: boolean) => void }) {
  const { isAtBottom } = useStickToBottomContext();
  
  useEffect(() => {
    onScrollStateChange(isAtBottom);
  }, [isAtBottom, onScrollStateChange]);

  return null;
}
import { 
  Message, 
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { cn } from "@/lib/utils";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";
import {
  PromptInput,
  type PromptPlusMenuItem,
  type PromptSettingGroup,
} from "@/components/ui/prompt-box";
import { ArcRevealHero } from "@/components/ruixen/arc-reveal-hero";
import {
  DEFAULT_LLM_MODELS,
  ModelSelectorPrompt,
  type ModelConfiguration,
} from "@/components/model-selector-prompt";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Button } from "@/components/ui/button";

const settingGroups: PromptSettingGroup[] = [
  {
    id: "model",
    label: "Model",
    display: "featured",
    moreMenuLabel: "More models",
    options: [
      {
        value: "mimo-2.5",
        label: "AI Helper",
        description: "Intelligent assistant engineered to answer questions and explore this portfolio",
      },
    ],
  },
  {
    id: "effort",
    label: "Effort",
    display: "submenu",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
];

interface AttachmentItemProps {
  attachment: any;
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});
AttachmentItem.displayName = "AttachmentItem";

const SUGGESTIONS = [
  { label: "Tech Stack", prompt: "What is your main technology stack and what tools do you use?" },
  { label: "PRIMA's Architecture", prompt: "Explain the architecture of your PRIMA project and how you built it." },
  { label: "Why Front-End?", prompt: "Why are you so passionate about front-end engineering instead of other fields?" },
];

export function PromptBoxPreview({ onClose }: { onClose?: () => void }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [effort, setEffort] = useState("high");
  const [modelValue, setModelValue] = useState("ai-helper");
  const [configurations, setConfigurations] = useState<Record<string, ModelConfiguration>>({});
  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [closeTooltipOpen, setCloseTooltipOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    const showTimer = setTimeout(() => {
      setCloseTooltipOpen(true);
      hideTimer = setTimeout(() => {
        setCloseTooltipOpen(false);
      }, 4000);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const plusMenuItems: PromptPlusMenuItem[] = [
    {
      id: "attach",
      label: "Add files or photos",
      icon: <Paperclip className="h-4 w-4" />,
      shortcut: "⌘U",
      onSelect: () => fileInputRef.current?.click(),
    },
  ];

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(newFile);
          }, "image/jpeg", 0.8);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newAttachments: any[] = [];
      
      for (const file of filesArray) {
        try {
          const compressedFile = file.type.startsWith("image/") ? await compressImage(file) : file;
          newAttachments.push({
            filename: compressedFile.name,
            id: nanoid(),
            mediaType: compressedFile.type,
            type: "file" as const,
            url: URL.createObjectURL(compressedFile),
            file: compressedFile,
          });
        } catch (err) {
          console.error("Failed to compress image", err);
          // Fallback to original
          newAttachments.push({
            filename: file.name,
            id: nanoid(),
            mediaType: file.type,
            type: "file" as const,
            url: URL.createObjectURL(file),
            file,
          });
        }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const [initialMessages] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai-chat-messages");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setSessionActive(true);
    }
  }, [initialMessages]);

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, isDesktop ? 300 : 800); // 300ms for desktop exit, 800ms for mobile curved menu exit
  }, [onClose, isDesktop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
      if (e.code === "NumpadSubtract" || e.key === "-") {
        setShowDebug(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const chatResponse = useChat({
    // @ts-ignore
    api: "/api/chat",
    body: {
      effort: effort,
    },
    initialMessages: initialMessages as any,
  });

  const { 
    messages, 
    append, 
    sendMessage, 
    status, 
    reload, 
    regenerate, 
    setMessages, 
    error 
  } = chatResponse as any;

  const triggerSend = sendMessage || append;
  const triggerReload = regenerate || reload;

  const handleSuggestionClick = (promptText: string) => {
    setSessionActive(true);
    try {
      if (triggerSend) {
        triggerSend(
          { role: 'user', content: promptText }
        );
      }
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      // Memory limit logic: If user messages reach 50, delete past conversations safely
      const userMessageCount = messages.filter((m: any) => m.role === 'user').length;
      let activeMessages = messages;
      
      if (userMessageCount >= 50) {
        // Keep the last 40 messages (approx 20 user / 20 assistant messages)
        const messagesToKeep = 40;
        if (messages.length > messagesToKeep) {
          activeMessages = messages.slice(messages.length - messagesToKeep);
          setMessages(activeMessages);
          // Return early to let the next render cycle handle the save
          return;
        }
      }

      const estimatedTokens = activeMessages.reduce((acc: number, m: any) => acc + Math.ceil((m.content?.length || 0) / 4), 0);
      if (estimatedTokens > 50000) {
        setMessages([]);
        localStorage.removeItem("ai-chat-messages");
        setSessionActive(false);
        return;
      }
      try {
        // Strip out large base64 URLs from attachments/parts before saving to avoid quota errors
        const sanitizedForStorage = activeMessages.map((m: any) => {
          const mCopy = { ...m };
          if (mCopy.experimental_attachments) {
            mCopy.experimental_attachments = mCopy.experimental_attachments.map((a: any) => ({
              ...a,
              url: a.url?.startsWith('data:') ? '' : a.url
            }));
          }
          if (mCopy.parts) {
            mCopy.parts = mCopy.parts.map((p: any) => {
              if (p.type === 'file' && p.url?.startsWith('data:')) {
                return { ...p, url: '' };
              }
              return p;
            });
          }
          return mCopy;
        });
        localStorage.setItem("ai-chat-messages", JSON.stringify(sanitizedForStorage));
      } catch (e) {
        console.error("Failed to save chat history to localStorage", e);
      }
    } else {
      localStorage.removeItem("ai-chat-messages");
    }
  }, [messages]);
  
  const isLoading = status === "submitted" || status === "streaming";

  const baseInputTokens = useMemo(() => {
    return messages.filter((m: any) => m.role === 'user').reduce((acc: number, m: any) => {
      const text = m.content || m.parts?.find((p: any) => p.type === 'text')?.text || '';
      return acc + Math.ceil(text.length / 4);
    }, 0);
  }, [messages]);

  const outputTokens = useMemo(() => {
    return messages.filter((m: any) => m.role !== 'user').reduce((acc: number, m: any) => {
      const text = m.content || m.parts?.find((p: any) => p.type === 'text')?.text || '';
      return acc + Math.ceil(text.length / 4);
    }, 0);
  }, [messages]);

  const currentInputTokens = Math.ceil(inputValue.length / 4);
  const inputTokens = baseInputTokens + currentInputTokens;
  const totalTokens = inputTokens + outputTokens;

  const showMessages = sessionActive || isExpanded || inputValue.length > 0;

  const customGreetings = [
    { text: "Welcome." },
    { text: "I'm Josiah De Asis." },
    { text: "I engineered this AI for you." },
    { text: "Curious about my work?" },
    { text: "Just ask away." },
  ];

  const chatContent = (
    <>
      {/* Mobile Close Button (visible only on mobile/tablet) */}
      <div className="absolute top-4 right-4 z-[99] md:hidden">
        <Button 
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="rounded-full bg-zinc-100/50 backdrop-blur-sm dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm transition-colors size-9 flex items-center justify-center"
          variant="outline"
          size="icon"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      {showMessages && messages.length > 0 && (
            <div className="absolute top-4 left-4 z-[90] hidden md:flex items-center gap-2">
              <ConversationDownload 
                className="static right-auto left-auto top-auto bg-zinc-100/50 backdrop-blur-sm dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm transition-colors"
                messages={messages.map((m: any) => ({
                  key: m.id,
                  role: m.role as "user" | "assistant",
                  content: m.content
                })) as any} 
              />
              <TooltipProvider delayDuration={200}>
                <Tooltip open={closeTooltipOpen} onOpenChange={setCloseTooltipOpen}>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleClose(); }}
                      className="rounded-full bg-zinc-100/50 backdrop-blur-sm dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm transition-colors"
                      variant="outline"
                      size="icon"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8} hideArrow={true} className="text-[12px] font-medium bg-zinc-900 text-white dark:bg-white dark:text-black border-none rounded-md px-2 py-1 shadow-md">
                    <p>Close (Esc)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Aurora Glow */}
          <AnimatePresence>
            {messages.length === 0 && !isLoading && inputValue.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute -bottom-[120px] left-1/2 -translate-x-1/2 w-[80%] max-w-[600px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none z-0"
              />
            )}
          </AnimatePresence>

          <div className="flex flex-col h-full relative overflow-hidden z-10">
            <ArcRevealHero 
              greetings={customGreetings}
              greetingHold={1500}
              storageKey="ask-ai-intro-seen"
              contained
              className="w-full h-full"
              introClassName="text-white dark:text-zinc-950"
              greetingClassName="text-[#6495ED] dark:text-[#6495ED]"
            >
              <div className="relative h-full w-full p-4 scrollbar-hide">
                {/* Debug Panel toggled by Numpad minus */}
                {showDebug && (
                  <div className="absolute top-16 right-4 z-[999] bg-black/80 text-green-400 p-2 rounded text-[10px] font-mono pointer-events-auto max-w-xs overflow-auto max-h-40">
                    <div>messages: {messages?.length ?? "null"}</div>
                    <div>isLoading: {isLoading ? "true" : "false"}</div>
                    <div>status: {status ?? "null"}</div>
                    <div>append: {append ? "defined" : "undefined"}</div>
                    <div>sendMessage: {sendMessage ? "defined" : "undefined"}</div>
                    <div>error: {error ? error.message : "none"}</div>
                    <div>sessionActive: {sessionActive ? "true" : "false"}</div>
                  </div>
                )}

                {/* Chat room messages */}
                <div className="absolute inset-0 flex flex-col overflow-hidden px-4">
          <div className="flex-1 overflow-y-auto space-y-4 pt-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <AnimatePresence>
            
            {(!showMessages || (messages.length === 0 && !isLoading)) && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "absolute inset-x-0 pointer-events-none z-10 flex flex-col items-center transition-all duration-500 ease-in-out",
                  showMessages ? "top-8 translate-y-0" : "top-1/2 -translate-y-1/2"
                )}
              >
                <ConversationEmptyState
                  className="h-fit"
                  description="Messages will appear here as the conversation progresses."
                  icon={<MessageSquareIcon className="size-6 text-zinc-400 dark:text-zinc-500" />}
                  title="Start a conversation"
                />
              </motion.div>
            )}

            {showMessages && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative size-full"
            >
            <Conversation className="relative size-full">
            <ScrollTracker onScrollStateChange={setIsAtBottom} />
            <ConversationContent>
              {messages.map((m: any, index: number) => {
                  const role = (m as any).role;
                  const id = (m as any).id;
                  const textContent = (m as any).content || (m as any).parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                  const reasoningContent = (m as any).reasoning || (m as any).parts?.filter((p: any) => p.type === 'reasoning').map((p: any) => p.reasoning).join('') || (m as any).parts?.filter((p: any) => p.type === 'reasoning').map((p: any) => p.text).join('') || '';

                  return (
                  <Message from={role as "user" | "assistant"} key={id}>
                    {role === "user" && (
                      (() => {
                        const attachments = (m as any).experimental_attachments || 
                                          (m as any).parts?.filter((p: any) => p.type === 'file') || 
                                          [];
                        if (attachments.length === 0) return null;
                        return (
                          <Attachments variant="grid">
                            {attachments.map((attachment: any, i: number) => {
                              const url = attachment.url || (attachment instanceof File ? URL.createObjectURL(attachment) : "");
                              const type = attachment.contentType || attachment.mediaType || (attachment instanceof File ? attachment.type : "");
                              const name = attachment.name || attachment.filename || (attachment instanceof File ? attachment.name : "");
                              return (
                                <Attachment data={{ url, type: "file", mediaType: type, name, filename: name } as any} key={i}>
                                  <AttachmentPreview />
                                </Attachment>
                              );
                            })}
                          </Attachments>
                        );
                      })()
                    )}
                    <MessageContent>
                      {role === "assistant" ? (
                        <>
                          {reasoningContent && (
                            <Reasoning isStreaming={isLoading && index === messages.length - 1}>
                              <ReasoningTrigger />
                              <ReasoningContent>{reasoningContent}</ReasoningContent>
                            </Reasoning>
                          )}
                          <MessageResponse>{textContent}</MessageResponse>
                        </>
                      ) : (
                        <div>{textContent}</div>
                      )}
                    </MessageContent>
                    {role === "assistant" && (
                      <MessageActions>
                        {triggerReload && (
                          <MessageAction
                            label="Retry"
                            onClick={() => triggerReload()}
                            tooltip="Regenerate response"
                          >
                            <RefreshCcwIcon className="size-4" />
                          </MessageAction>
                        )}
                        <MessageAction
                          label="Copy"
                          onClick={() => navigator.clipboard.writeText(textContent)}
                          tooltip="Copy to clipboard"
                        >
                          <CopyIcon className="size-4" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                  );
                })}
              {error && (
                <Message from="assistant" key="error">
                  <MessageContent className="bg-red-500/10 text-red-500">
                    {error.message || "An error occurred while generating the response."}
                  </MessageContent>
                </Message>
              )}
              {isLoading && (
                <Message from="assistant" key="loading">
                  <MessageContent className="animate-pulse">Thinking...</MessageContent>
                </Message>
              )}
              <div className="h-28 shrink-0" />
            </ConversationContent>
            <ConversationScrollButton className="z-20 bottom-24" />
          </Conversation>
          </motion.div>
          )}
          </AnimatePresence>
        </div>
        <ProgressiveBlur position="bottom" height="15%" className="z-10 pointer-events-none -inset-x-8 opacity-60" />
        <ProgressiveBlur position="top" height="8%" className="z-10 pointer-events-none -inset-x-8 opacity-60" />
        </div>
        
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md flex flex-col items-center gap-3 z-20 px-4"
          initial={false}
          animate={{
            y: isAtBottom || messages.length === 0 ? 0 : 150,
            opacity: isAtBottom || messages.length === 0 ? 1 : 0,
            scale: isAtBottom || messages.length === 0 ? 1 : 0.9,
            pointerEvents: isAtBottom || messages.length === 0 ? "auto" : "none",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          style={{ willChange: "transform, opacity" }}
        >
          {attachments.length > 0 && (
            <div className="w-full px-2">
              <Attachments variant="grid">
                {attachments.map((attachment) => (
                  <AttachmentItem
                    attachment={attachment}
                    key={attachment.id}
                    onRemove={handleRemoveAttachment}
                  />
                ))}
              </Attachments>
            </div>
          )}
          {messages.length === 0 && showMessages && (
            <div className="flex flex-wrap gap-2 justify-center w-full mb-1 select-none animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(s.prompt)}
                  className="px-3 py-1.5 text-[11px] font-medium border border-zinc-200 dark:border-white/10 hover:border-[#6495ED] dark:hover:border-[#6495ED] bg-white/70 hover:bg-[#6495ED]/5 dark:bg-zinc-900/70 dark:hover:bg-[#6495ED]/10 text-zinc-600 hover:text-[#6495ED] dark:text-zinc-400 dark:hover:text-[#6495ED] rounded-full shadow-sm transition-all backdrop-blur-sm cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <TooltipProvider delayDuration={200}>
          <Tooltip open={isHovered && !isDropdownOpen && !isExpanded}>
            <TooltipTrigger asChild>
              <div 
                className="w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocusCapture={() => setIsExpanded(true)}
              >
                <ModelSelectorPrompt
                  models={DEFAULT_LLM_MODELS}
                  configurations={configurations}
                  value={modelValue}
                  prompt={inputValue}
                  onModelChange={(model) => setModelValue(model.value)}
                  onConfigurationChange={(_, __, nextConfigs) => setConfigurations(nextConfigs)}
                  onPromptChange={setInputValue}
                  onSubmit={({ model, configuration, prompt }) => {
                    setSessionActive(true);
                    setEffort(configuration.reasoning);
                    try {
                      if (triggerSend) {
                        triggerSend(
                          { role: 'user', content: prompt },
                          { data: { effort: configuration.reasoning }, body: { effort: configuration.reasoning } }
                        );
                      }
                    } catch (e) {
                      console.error("Send error:", e);
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={12} hideArrow={true} className="text-[11px] bg-zinc-900 text-white dark:bg-white dark:text-black border-none rounded-md px-2 py-1 shadow-md">
              <p>Tap in, let it bloom, and hit Enter to send.</p>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </motion.div>
              </div>
            </ArcRevealHero>
          </div>
    </>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {isDesktop ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-md"
                onClick={handleClose}
              />
              <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  style={{ willChange: "transform, border-radius, height, width" }}
                  className={cn(
                    "pointer-events-auto flex flex-col bg-white dark:bg-zinc-950 dark:border dark:border-white/10 rounded-[1.5rem] shadow-2xl relative overflow-hidden w-full transition-all duration-500",
                    showMessages
                      ? "max-w-[800px] h-[80vh] max-h-[800px]"
                      : "max-w-2xl h-[450px]"
                  )}
                >
                  {chatContent}
                </motion.div>
              </div>
            </>
          ) : (
            <CurvedMenu isOpen={isOpen} onAnimationComplete={() => {}}>
              {chatContent}
            </CurvedMenu>
          )}
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;

  return createPortal(modalContent, document.body);
}
