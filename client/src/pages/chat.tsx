import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send,
  Users,
  Hash,
  Plus,
  Search,
  Smile
} from "lucide-react";

export default function CommunityChat() {
  const [message, setMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");

  const channels = [
    { id: "general", name: "general", description: "General discussions", members: 247, unread: 0 },
    { id: "job-search", name: "job-search", description: "Job hunting tips and opportunities", members: 189, unread: 3 },
    { id: "interview-prep", name: "interview-prep", description: "Interview practice and advice", members: 156, unread: 1 },
    { id: "tech-careers", name: "tech-careers", description: "Technology career discussions", members: 134, unread: 0 },
    { id: "marketing-sales", name: "marketing-sales", description: "Marketing and sales careers", members: 112, unread: 0 },
    { id: "finance-consulting", name: "finance-consulting", description: "Finance and consulting opportunities", members: 98, unread: 2 },
    { id: "remote-work", name: "remote-work", description: "Remote work tips and opportunities", members: 156, unread: 0 },
    { id: "startups", name: "startups", description: "Startup career discussions", members: 89, unread: 1 },
    { id: "networking", name: "networking", description: "Professional networking", members: 143, unread: 0 },
    { id: "career-change", name: "career-change", description: "Career transition support", members: 87, unread: 2 },
    { id: "freelancing", name: "freelancing", description: "Freelance and contract work", members: 76, unread: 0 },
    { id: "skill-building", name: "skill-building", description: "Learning and development", members: 134, unread: 1 }
  ];

  const getMessagesForChannel = (channelId: string) => {
    const messagesByChannel: Record<string, any[]> = {
      general: [
        {
          id: 1,
          user: "Sarah M.",
          avatar: "SM",
          time: "10:23 AM",
          message: "Just had a great interview at a startup! The behavioural questions really caught me off guard though. Anyone have tips for next time?",
          reactions: ["👍", "💪"]
        },
        {
          id: 2,
          user: "Alex K.",
          avatar: "AK", 
          time: "10:25 AM",
          message: "Congrats Sarah! For behavioural questions, I always use the STAR method - Situation, Task, Action, Result. Really helps structure your answers.",
          reactions: ["👏", "💡"]
        },
        {
          id: 3,
          user: "Jordan L.",
          avatar: "JL",
          time: "10:28 AM", 
          message: "Yes! And practice with common questions like 'Tell me about a time you overcame a challenge' or 'Describe a time you worked in a team'. Having examples ready makes a huge difference.",
          reactions: ["✅"]
        }
      ],
      "job-search": [
        {
          id: 1,
          user: "Marcus J.",
          avatar: "MJ",
          time: "9:15 AM",
          message: "Found this amazing job at a fintech startup - they're looking for someone with Python skills. Anyone interested?",
          reactions: ["🔥", "👀"]
        },
        {
          id: 2,
          user: "Priya P.",
          avatar: "PP",
          time: "9:18 AM",
          message: "I'd love to hear more! Been looking for Python roles. Can you share the link?",
          reactions: ["🙋‍♀️"]
        }
      ],
      "tech-careers": [
        {
          id: 1,
          user: "David K.",
          avatar: "DK",
          time: "11:30 AM",
          message: "Just started my first dev role! Any tips for making a good impression in the first month?",
          reactions: ["🎉", "👏"]
        },
        {
          id: 2,
          user: "Lisa W.",
          avatar: "LW",
          time: "11:35 AM",
          message: "Congrats! My advice: ask questions, take notes, and don't be afraid to admit when you don't know something. Everyone appreciates honesty.",
          reactions: ["💯", "✨"]
        }
      ],
      "remote-work": [
        {
          id: 1,
          user: "Tom R.",
          avatar: "TR",
          time: "2:45 PM",
          message: "What's everyone's home office setup like? Looking for desk recommendations that won't break the bank",
          reactions: ["🏠", "💻"]
        }
      ]
    };
    
    return messagesByChannel[channelId] || [
      {
        id: 1,
        user: "Community Bot",
        avatar: "CB",
        time: "Now",
        message: `Welcome to #${channelId}! Start a conversation with your fellow community members.`,
        reactions: ["👋"]
      }
    ];
  };

  const onlineMembers = [
    { name: "Sarah M.", status: "online", avatar: "SM" },
    { name: "Alex K.", status: "online", avatar: "AK" },
    { name: "Jordan L.", status: "online", avatar: "JL" },
    { name: "Emma C.", status: "online", avatar: "EC" },
    { name: "Marcus J.", status: "away", avatar: "MJ" },
    { name: "Priya P.", status: "online", avatar: "PP" },
    { name: "David K.", status: "online", avatar: "DK" },
    { name: "Lisa W.", status: "online", avatar: "LW" },
    { name: "Tom R.", status: "away", avatar: "TR" },
    { name: "Maria S.", status: "online", avatar: "MS" }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Community Chat</h1>
              <p className="text-sm sm:text-base text-gray-600">Connect with fellow job seekers in real-time</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/community">
                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Check out Community Activities</span>
                  <span className="sm:hidden">Community</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 h-[500px] sm:h-[600px]">
          {/* Channels Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="h-full">
              <CardHeader className="pb-3 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Channels</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colours ${
                        activeChannel === channel.id 
                          ? "bg-blue-100 text-blue-600" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <CardTitle className="text-base sm:text-lg">{activeChannel}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {channels.find(c => c.id === activeChannel)?.members} members
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {channels.find(c => c.id === activeChannel)?.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {getMessagesForChannel(activeChannel).map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{msg.message}</p>
                        <div className="flex gap-1">
                          {msg.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              className="text-sm hover:bg-gray-100 px-1 rounded"
                            >
                              {reaction}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder={`Message #${activeChannel}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1 order-3 lg:order-3">
            <Card className="h-full">
              <CardHeader className="pb-3 p-3 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Online ({onlineMembers.filter(m => m.status === 'online').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-3 sm:p-6">
                <div className="space-y-2">
                  {onlineMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}