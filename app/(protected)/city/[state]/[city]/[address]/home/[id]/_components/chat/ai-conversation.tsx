import React, { useCallback } from "react";
import ChatWrapper from "./chat-wrapper";
import ChatItem from "./chat-item";
import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";

interface ConversationItem {
  id: string | number;
  name: string;
  message: string;
  avatarSrc: string;
  tag: "ai" | "user" | string;
}

interface AiConversationProps {
  conversationList: ConversationItem[];
  onShowModal: (isOpen: boolean) => void;
  showModal: boolean;
}

const AIConversation: React.FC<AiConversationProps> = ({
  conversationList,
  showModal,
  onShowModal,
}) => {
  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      onShowModal(isOpen);
    },
    [showModal]
  );

  return (
    <ChatWrapper
      onShowModal={handleModalChange}
      showModal={showModal}
      customButton={ChatConversationButton}
    >
      {showModal ? (
        conversationList.map((item) => (
          <ChatItem
            key={item.id}
            tag={item.tag}
            message={item.message}
            name={item.name}
            avatarSrc={item.avatarSrc}
          />
        ))
      ) : (
        <></>
      )}
    </ChatWrapper>
  );
};

export default AIConversation;

const ChatConversationButton = (
  <Button
    type="button"
    className="fixed w-[100px] flex items-center top-[16rem] right-0 z-50 py-6 rounded-xl rounded-r-none bg-gradient-to-l from-primary to-primary/50 transition-opacity duration-500 text-white hover:text-white opacity-100 hover:opacity-90"
    variant="ghost"
    size="icon"
  >
    <BsStars className="w-7 h-7 text-white shrink-0" />
    <span className="text-xs leading-2">
      Chat with <br />
      <span className="text-base font-semibold">Ethali</span>
    </span>
  </Button>
);
