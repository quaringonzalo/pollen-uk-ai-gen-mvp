import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, ExternalLink, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  type: "bot" | "user";
  message: string;
  links?: Array<{
    text: string;
    url: string;
    type: 'internal' | 'external';
  }>;
}

interface ChatbotResponse {
  message: string;
  links?: Array<{
    text: string;
    url: string;
    type: 'internal' | 'external';
  }>;
}

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "bot",
      message: "Hi! I'm Hollybot. What can I help you with today?",
      links: [
        { text: "Check my applications", url: "prompt:What's the status of my job applications?", type: "internal" },
        { text: "Find events & workshops", url: "prompt:What events are coming up this week?", type: "internal" },
        { text: "Get job recommendations", url: "prompt:Show me jobs that match my profile", type: "internal" },
        { text: "Interview preparation", url: "prompt:Help me prepare for my upcoming interview", type: "internal" },
        { text: "Something else", url: "prompt:I need help with something else", type: "internal" }
      ]
    }
  ]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<ChatbotResponse> => {
      const response = await apiRequest("POST", "/api/chatbot", { message: userMessage });
      return response.json();
    },
    onSuccess: (response) => {
      setChatHistory(prev => [...prev, {
        type: "bot",
        message: response.message,
        links: response.links
      }]);
    },
    onError: (error) => {
      console.error("Chatbot error:", error);
      setChatHistory(prev => [...prev, {
        type: "bot",
        message: "I'm having trouble right now. You can browse jobs, check applications, or visit our community page while I get back online.",
        links: [
          { text: "Browse Jobs", url: "/jobs", type: "internal" },
          { text: "My Applications", url: "/applications", type: "internal" },
          { text: "Community Hub", url: "/community", type: "internal" }
        ]
      }]);
    }
  });

  const sendMessage = () => {
    if (message.trim() && !chatMutation.isPending) {
      const userMessage = message.trim();
      setChatHistory(prev => [...prev, { type: "user", message: userMessage }]);
      setMessage("");
      chatMutation.mutate(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] hidden">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border w-80 h-96 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Hollybot</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatHistory.map((msg, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`p-3 rounded-lg text-sm ${
                    msg.type === "bot"
                      ? "bg-pink-50 dark:bg-pink-900/20 text-pink-900 dark:text-pink-100"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ml-6"
                  }`}
                >
                  <div className="font-medium text-xs mb-1 opacity-70">
                    {msg.type === "bot" ? "Hollybot" : "You"}
                  </div>
                  {msg.message}
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-2">
                    {msg.links.map((link, linkIndex) => (
                      <Button
                        key={linkIndex}
                        variant={link.url.startsWith('prompt:') ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-7 ${link.url.startsWith('prompt:') ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50' : ''}`}
                        onClick={() => {
                          if (link.url.startsWith('prompt:')) {
                            // Extract the prompt text and send it as a message
                            const promptText = link.url.replace('prompt:', '');
                            setChatHistory(prev => [...prev, { type: "user", message: promptText }]);
                            chatMutation.mutate(promptText);
                          } else if (link.type === 'internal') {
                            window.location.href = link.url;
                          } else {
                            window.open(link.url, '_blank');
                          }
                        }}
                      >
                        {link.text}
                        {link.type === 'external' && <ExternalLink className="w-3 h-3 ml-1" />}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg text-sm text-pink-900 dark:text-pink-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-medium text-xs opacity-70">Hollybot</span>
                </div>
                <div className="mt-1">Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about applications, events, jobs..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={chatMutation.isPending}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={sendMessage}
                disabled={chatMutation.isPending || !message.trim()}
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg bg-pink-600 hover:bg-pink-700 border-0"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}
    </div>
  );
}