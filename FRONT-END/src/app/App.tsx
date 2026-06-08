import { getMe } from '../services/auth';
import { useState, useEffect } from 'react';
import { Heart, User, MessageCircle, LogOut, Home, FileCheck } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { FeedPage } from './components/FeedPage';
import { ProfilePage } from './components/ProfilePage';
import { ChatPage } from './components/ChatPage';
import { AdoptionRequests } from './components/AdoptionRequests';
type Page = 'feed' | 'profile' | 'chat' | 'requests';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [interests, setInterests] = useState<string[]>([]);
  const [chatWith, setChatWith] = useState<string | null>(null);

  useEffect(() => {
  async function loadUser() {

    const token =
      localStorage.getItem('token');

    if (!token) return;

    try {

      const user =
        await getMe();

      setCurrentUser(user);

    } catch (error) {

      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');

      console.error(error);
    }
  }

  loadUser();
}, []);

  useEffect(() => {
    if (currentUser) {
      const userInterests = JSON.parse(localStorage.getItem(`interests_${currentUser.id}`) || '[]');
      setInterests(userInterests);
    }
  }, [currentUser]);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === user.email);
    if (existingUser) {
      setCurrentUser(existingUser);
      localStorage.setItem('currentUser', JSON.stringify(existingUser));
      const userInterests = JSON.parse(localStorage.getItem(`interests_${existingUser.id}`) || '[]');
      setInterests(userInterests);
    }
  };

 const handleLogout = () => {
  setCurrentUser(null);

  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');

  setCurrentPage('feed');
};

  const handleInterest = (animalId: string) => {
    if (interests.includes(animalId)) return;

    const updated = [...interests, animalId];
    setInterests(updated);
    localStorage.setItem(`interests_${currentUser.id}`, JSON.stringify(updated));

    const requests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const MOCK_ANIMALS = [
      { id: '1', name: 'Mel', image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400' },
      { id: '2', name: 'Thor', image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400' },
      { id: '3', name: 'Luna', image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400' },
      { id: '4', name: 'Bob', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
      { id: '5', name: 'Mia', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400' },
    ];

    const animal = MOCK_ANIMALS.find(a => a.id === animalId);
    if (animal) {
      requests.push({
        id: Date.now().toString(),
        animalId: animal.id,
        animalName: animal.name,
        animalImage: animal.image,
        adopterId: currentUser.id,
        adopterName: currentUser.name,
        adopterEmail: currentUser.email,
        status: 'pending',
      });
      localStorage.setItem('adoptionRequests', JSON.stringify(requests));
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
              </div>
              <span className="text-lg md:text-xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                AdotaPet
              </span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setCurrentPage('feed')}
                className={`px-2 md:px-4 py-2 rounded-lg transition-all flex items-center gap-1 md:gap-2 ${
                  currentPage === 'feed'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'hover:bg-secondary'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">Feed</span>
              </button>

              {currentUser.type === 'ngo' && (
                <button
                  onClick={() => setCurrentPage('requests')}
                  className={`px-2 md:px-4 py-2 rounded-lg transition-all flex items-center gap-1 md:gap-2 ${
                    currentPage === 'requests'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                  <span className="hidden lg:inline">Solicitações</span>
                </button>
              )}

              <button
                onClick={() => setCurrentPage('chat')}
                className={`px-2 md:px-4 py-2 rounded-lg transition-all flex items-center gap-1 md:gap-2 ${
                  currentPage === 'chat'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'hover:bg-secondary'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden md:inline">Chat</span>
              </button>

              <button
                onClick={() => setCurrentPage('profile')}
                className={`px-2 md:px-4 py-2 rounded-lg transition-all flex items-center gap-1 md:gap-2 ${
                  currentPage === 'profile'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'hover:bg-secondary'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Perfil</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-2 md:px-4 py-2 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-1 md:gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'feed' && (
          <FeedPage
            currentUser={currentUser}
            onInterest={handleInterest}
            interests={interests}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage currentUser={currentUser} interests={interests} />
        )}
        {currentPage === 'chat' && (
          <ChatPage currentUser={currentUser} interests={interests} chatWith={chatWith} />
        )}
        {currentPage === 'requests' && currentUser.type === 'ngo' && (
          <AdoptionRequests
            currentUser={currentUser}
            onOpenChat={(adopterId: string) => {
              setChatWith(adopterId);
              setCurrentPage('chat');
            }}
          />
        )}
      </main>
    </div>
  );
}
