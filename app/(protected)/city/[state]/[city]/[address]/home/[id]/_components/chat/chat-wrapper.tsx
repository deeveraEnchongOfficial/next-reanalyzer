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
import { ChatBubbleIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatWrapperProps {
  onShowModal: (isOpen: boolean) => void;
  showModal: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
  customButton?: React.ReactNode;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({
  children,
  title = "AI Conversation",
  description = "Chat with our AI assistant about anything you'd like.",
  showModal,
  onShowModal,
  customButton,
}) => {
  return (
    <Dialog open={showModal} onOpenChange={onShowModal}>
      <DialogTrigger asChild>
        {customButton ? (
          customButton
        ) : (
          <Button
            variant="outline"
            className="fixed top-[16vw] right-0 z-50 py-6 rounded-xl"
          >
            <ChatBubbleIcon className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      {showModal ? (
        <DialogContent className="h-full lg:h-[calc(100%-80px)] min-w-full lg:min-w-[calc(100%-80px)] rounded-lg shadow-lg">
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
                placeholder="Ask your question.."
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
  );
};

export default ChatWrapper;
