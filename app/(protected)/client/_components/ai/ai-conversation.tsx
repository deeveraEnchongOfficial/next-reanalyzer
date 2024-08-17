import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import Divider from "@/components/divider";

const AIConversation = () => {
  return (
    <div className="z-50 hidden md:block rounded-xl bg-white">
      {/* <ChatBubbleIcon className="w-5 h-5" />
        <span>AI Chat</span> */}
      <div className="p-4">
        <span className="font-semibold">Open AI Chat</span>
      </div>
      <div className="w-full max-w-md rounded-lg shadow-lg">
        <div className="px-4 w-full">
          <Divider className="!my-0" />
        </div>
        <div className="grid gap-4 p-4 ">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" alt="AI Avatar" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg max-w-[70%]">
              <p>Hello! How can I assist you today?</p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg max-w-[70%]">
              <p>Id like to learn more about your product features.</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" alt="AI Avatar" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg max-w-[70%]">
              <p>
                Certainly! Our product offers a range of features to help
                streamline your workflow. Some key highlights include...
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg max-w-[70%]">
              <p>
                That sounds very helpful. Can you tell me more about pricing?
              </p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-4 w-full ">
          <Divider className="!my-1" />
        </div>
        <div className="flex items-center w-full gap-2 p-4">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" variant="outline">
            <PaperPlaneIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIConversation;
