import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChatBubbleIcon,
  MinusIcon,
  CornersIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatWrapperProps {
  onShowModal: boolean;
  onHandleShowModal: (isOpen: boolean) => void;
  children: React.ReactNode;
  setMinimize: (isOpen: boolean) => void;
  variant?: "modal" | "static";
  title?: string;
  description?: string;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({
  onShowModal,
  onHandleShowModal,
  setMinimize,
  children,
  variant = "modal",
  title = "AI Conversation",
  description = " Chat with our AI assistant about anything you'd like.",
}) => {
  return (
    <>
      {variant === "modal" ? (
        <Dialog open={onShowModal} onOpenChange={onHandleShowModal}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="fixed bottom-4 left-4 z-50 py-6 rounded-xl"
            >
              <ChatBubbleIcon className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          {onShowModal ? (
            <DialogContent className="h-full  lg:h-[calc(100%-80px)] min-w-[calc(100%-80px)] rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-full p-4 border-t border-b row-span-4">
                <div className="grid gap-4">{children}</div>
              </ScrollArea>
              <DialogFooter>
                <div className="flex items-center w-full gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button type="submit" variant="outline">
                    <PaperPlaneIcon className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          ) : (
            <></>
          )}
        </Dialog>
      ) : (
        <div className="w-full rounded-xl shadow-lg bg-white p-6 pt-0">
          <div className="flex items-center justify-end relative py-4">
            <div className="absolute -right-6 top-0">
              <Button variant="ghost" onClick={() => setMinimize(true)}>
                <MinusIcon />
              </Button>
              <Button variant="ghost" onClick={() => onHandleShowModal(true)}>
                <CornersIcon />
              </Button>
            </div>
          </div>
          <div className="text-center py-2">
            <h2 className="font-bold mb-1">{title}</h2>
            <p className="text-neutral-500 text-[.8rem]">{description}</p>
          </div>
          <ScrollArea className="h-[calc(100vh-345px)] p-4 border-neutral-200 border-t border-b mb-4">
            <div className="grid gap-4">{children}</div>
          </ScrollArea>
          <div className="flex items-center w-full gap-2">
            <Textarea
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" variant="outline" className="py-5">
              <PaperPlaneIcon className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWrapper;
