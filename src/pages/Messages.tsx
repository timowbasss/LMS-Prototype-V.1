import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Plus, Search, Users, UserCheck, Shield } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Contact {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  department?: string;
  avatar?: string;
  online: boolean;
}

const Messages = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: { id: '2', name: 'Dr. Sarah Johnson', role: 'teacher' },
      recipient: { id: '1', name: 'John Doe', role: 'student' },
      subject: 'Assignment Feedback',
      content: 'Great work on your latest assignment! I have some suggestions for improvement.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      sender: { id: '3', name: 'Admin Office', role: 'admin' },
      recipient: { id: '1', name: 'John Doe', role: 'student' },
      subject: 'Schedule Change',
      content: 'There has been a change to your class schedule. Please check your calendar.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'high'
    }
  ]);

  const [contacts] = useState<Contact[]>([
    { id: '2', name: 'Dr. Sarah Johnson', role: 'teacher', department: 'Physics', online: true },
    { id: '3', name: 'Prof. Michael Chen', role: 'teacher', department: 'Mathematics', online: false },
    { id: '4', name: 'Admin Office', role: 'admin', department: 'Administration', online: true },
    { id: '5', name: 'Lisa Wang', role: 'student', department: 'Physics', online: true },
    { id: '6', name: 'David Miller', role: 'student', department: 'Chemistry', online: false }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium' as const
  });

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast.error('Please fill in all fields');
      return;
    }

    const recipient = contacts.find(c => c.id === newMessage.recipient);
    if (!recipient) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: { id: '1', name: 'John Doe', role: 'student' },
      recipient: { id: recipient.id, name: recipient.name, role: recipient.role },
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date(),
      read: true,
      priority: newMessage.priority
    };

    setMessages([message, ...messages]);
    setNewMessage({ recipient: '', subject: '', content: '', priority: 'medium' });
    setShowCompose(false);
    toast.success('Message sent successfully!');
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <UserCheck className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'teacher': return 'default';
      case 'admin': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with teachers, students, and administrators.
          </p>
        </div>
        
        <Dialog open={showCompose} onOpenChange={setShowCompose}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={newMessage.recipient} onValueChange={(value) => setNewMessage({ ...newMessage, recipient: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(contact.role)}
                        <span>{contact.name}</span>
                        <Badge variant={getRoleBadgeVariant(contact.role)} className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              />
              
              <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage({ ...newMessage, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Message content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                rows={6}
              />
              
              <Button onClick={sendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Inbox
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredMessages.map(message => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  !message.read ? 'bg-primary/5 border-primary/20' : 'bg-gradient-subtle hover:bg-muted/50'
                } ${selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) markAsRead(message.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {message.sender.name}
                        </span>
                        <Badge variant={getRoleBadgeVariant(message.sender.role)} className="text-xs">
                          {message.sender.role}
                        </Badge>
                        {message.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${!message.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {message.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Message Detail or Contacts */}
        <div className="space-y-6">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedMessage.sender.avatar} />
                    <AvatarFallback>{selectedMessage.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedMessage.sender.name}</span>
                      <Badge variant={getRoleBadgeVariant(selectedMessage.sender.role)}>
                        {selectedMessage.sender.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(selectedMessage.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
                
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-subtle hover:bg-muted/50 cursor-pointer">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{contact.name}</span>
                        <Badge variant={getRoleBadgeVariant(contact.role)} className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.department}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;