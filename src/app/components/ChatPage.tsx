import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Building2 } from 'lucide-react';

interface ChatPageProps {
  currentUser: any;
  interests: string[];
  chatWith?: string | null;
}

interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: number;
  animalId?: string;
}

const MOCK_ANIMALS = [
  { id: '1', name: 'Mel' },
  { id: '2', name: 'Thor' },
  { id: '3', name: 'Luna' },
  { id: '4', name: 'Bob' },
  { id: '5', name: 'Mia' },
];

const NGO_USERS = [
  { id: 'ngo1', name: 'ONG Amigos dos Bichos' },
  { id: 'ngo2', name: 'Lar dos Peludos' },
  { id: 'ngo3', name: 'Patinhas Solidárias' },
];

export function ChatPage({ currentUser, interests, chatWith }: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(chatWith || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (chatWith) {
      setSelectedChat(chatWith);
    }
  }, [chatWith]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const getChats = () => {
    if (currentUser.type === 'adopter') {
      return NGO_USERS;
    } else {
      const adopters = JSON.parse(localStorage.getItem('users') || '[]')
        .filter((u: any) => u.type === 'adopter' && interests.length > 0);
      return adopters.length > 0 ? adopters : [
        { id: 'adopter1', name: 'João Silva' },
        { id: 'adopter2', name: 'Maria Santos' }
      ];
    }
  };

  const chats = getChats();

  const getChatMessages = (chatId: string) => {
    return messages.filter(
      m => (m.from === currentUser.id && m.to === chatId) ||
           (m.from === chatId && m.to === currentUser.id)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: selectedChat,
      message: newMessage,
      timestamp: Date.now(),
    };

    const updated = [...messages, message];
    setMessages(updated);
    localStorage.setItem('chatMessages', JSON.stringify(updated));
    setNewMessage('');

    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        from: selectedChat,
        to: currentUser.id,
        message: currentUser.type === 'adopter'
          ? 'Olá! Obrigado pelo interesse. Vamos conversar sobre os critérios de adoção. O animal precisa de um lar com espaço adequado e muito amor. Você tem experiência com pets?'
          : 'Olá! Sim, estou muito interessado em adotar. Tenho experiência com animais e posso oferecer um lar amoroso. Quais são os próximos passos?',
        timestamp: Date.now(),
      };
      const withReply = [...updated, autoReply];
      setMessages(withReply);
      localStorage.setItem('chatMessages', JSON.stringify(withReply));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Mensagens</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Converse sobre os critérios de adoção
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border h-[calc(100vh-250px)] flex flex-col md:flex-row">
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-secondary/30 max-h-48 md:max-h-full">
            <div className="p-3 md:p-4 border-b border-border bg-white">
              <h2 className="text-sm md:text-base font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                Conversas
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-57px)] md:h-[calc(100%-65px)]">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-2 md:p-4 text-left hover:bg-accent transition-colors border-b border-border flex items-center gap-2 md:gap-3 ${
                    selectedChat === chat.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                    currentUser.type === 'adopter'
                      ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                  }`}>
                    {currentUser.type === 'adopter' ? (
                      <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <User className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium truncate">{chat.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      {getChatMessages(chat.id).length > 0
                        ? getChatMessages(chat.id)[getChatMessages(chat.id).length - 1].message
                        : 'Iniciar conversa'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-border bg-white flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    currentUser.type === 'adopter'
                      ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                  }`}>
                    {currentUser.type === 'adopter' ? (
                      <Building2 className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {chats.find(c => c.id === selectedChat)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
                  {getChatMessages(selectedChat).length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma mensagem ainda. Inicie a conversa!
                      </p>
                    </div>
                  )}

                  {getChatMessages(selectedChat).map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.from === currentUser.id
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-br-sm'
                            : 'bg-white border border-border rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.from === currentUser.id ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50/30 to-pink-50/30">
                <div className="text-center">
                  <MessageCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl mb-2">Selecione uma conversa</h3>
                  <p className="text-muted-foreground">
                    Escolha um chat para começar a conversar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
