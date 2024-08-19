import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatItemProps {
  name: string;
  message: string;
  avatarSrc: string;
  tag: "ai" | "user" | string;
}

const ChatItem: React.FC<ChatItemProps> = ({
  name,
  message,
  tag,
  avatarSrc,
}) => {
  return (
    <div
      className={`flex items-start gap-3 ${tag === "ai" ? "" : "justify-end"}`}
    >
      <Avatar className="w-8 h-8">
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} alt={`${name} avatar`} />
        ) : (
          <></>
        )}
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <div
        className={`${
          tag === "ai"
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }  px-4 py-2 rounded-lg max-w-[70%]`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatItem;
