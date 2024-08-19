import React, { useCallback } from "react";
import ChatWrapper from "./chat-wrapper";
import ChatItem from "./chat-item";

interface ConversationItem {
  id: string | number;
  name: string;
  message: string;
  avatarSrc: string;
  tag: "ai" | "user" | string;
}

interface AiConversationProps {
  showModalVersion: boolean;
  setShowModalVersion: React.Dispatch<React.SetStateAction<boolean>>;
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>;
  minimize: boolean;
  conversationList: ConversationItem[];
}

const AIConversation: React.FC<AiConversationProps> = ({
  showModalVersion,
  setShowModalVersion,
  minimize,
  setMinimize,
  conversationList,
}) => {
  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      if (minimize) {
        setMinimize(false);
      } else {
        setShowModalVersion(isOpen);
        if (!showModalVersion) {
          setMinimize(true);
        }
      }
    },
    [setShowModalVersion, setMinimize]
  );

  return (
    <ChatWrapper
      setMinimize={setMinimize}
      onHandleShowModal={handleModalChange}
      onShowModal={showModalVersion}
    >
      {showModalVersion ? (
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
