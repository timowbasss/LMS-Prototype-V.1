import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  X, 
  Bot,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  image?: string;
}

const EveChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Eve, your AI study assistant. I can help you with your coursework, study planning, and answer questions about your assignments. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock responses for the chatbot
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('assignment') || message.includes('homework')) {
      return "I can help you with assignments! You have upcoming assignments in Physics, Calculus, and Computer Science. Would you like me to show you the details for any specific assignment?";
    } else if (message.includes('grade') || message.includes('score')) {
      return "Your current GPA is 3.87. Your highest performing subject is Computer Science (95%), and Chemistry could use some attention (78%). Would you like study recommendations for improvement?";
    } else if (message.includes('study') || message.includes('plan')) {
      return "Based on your schedule, I recommend studying Physics for 2 hours today and reviewing your Calculus notes. Your most productive time is typically 2-4 PM. Should I create a study plan for you?";
    } else if (message.includes('schedule') || message.includes('calendar')) {
      return "You have 3 upcoming events: Quantum States Lab Report due March 15, Vector Fields Problem Set due March 12, and a Science Fair on April 10. Would you like me to add any study sessions to your calendar?";
    } else if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm Eve, ready to help you succeed in your studies. What would you like to work on today?";
    } else if (message.includes('help')) {
      return "I can assist you with:\n• Assignment tracking and reminders\n• Study schedule planning\n• Grade analysis and improvement tips\n• Course material explanations\n• Calendar management\n\nWhat specific area would you like help with?";
    } else {
      return "That's an interesting question! I'm here to help with your studies. Could you provide more context about what you're working on? I can assist with assignments, study planning, grades, or course materials.";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Speech recognition is not supported in your browser.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: 'I shared an image with you.',
          timestamp: new Date(),
          image: imageUrl
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate bot response to image
        setTimeout(() => {
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "I can see your image! While I can view images, my current capabilities are focused on helping with your academic work. Could you tell me what specific question you have about this image or how it relates to your studies?",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const FloatingButton = () => (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary hover:opacity-90 shadow-large z-50"
      size="sm"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );

  const ChatInterface = () => (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="h-full flex flex-col shadow-large border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-primary text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Eve - AI Assistant
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              Online
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        {message.image && (
                          <img 
                            src={message.image} 
                            alt="Uploaded image" 
                            className="max-w-full h-auto rounded mb-2"
                          />
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex-shrink-0 ${isListening ? 'bg-red-500 text-white' : ''}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Eve anything..."
                  className="flex-1"
                  disabled={isLoading}
                />

                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <>
      {!isOpen && <FloatingButton />}
      {isOpen && <ChatInterface />}
    </>
  );
};

export default EveChatbot;