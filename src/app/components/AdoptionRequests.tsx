import { useState, useEffect } from 'react';
import { Heart, User, CheckCircle, X, Mail, MessageCircle } from 'lucide-react';

interface AdoptionRequestsProps {
  currentUser: any;
  onOpenChat: (adopterId: string) => void;
}

interface Request {
  id: string;
  animalId: string;
  animalName: string;
  animalImage: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_ANIMALS = [
  {
    id: '1',
    name: 'Mel',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    id: '2',
    name: 'Thor',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
  },
  {
    id: '3',
    name: 'Luna',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400',
  },
  {
    id: '4',
    name: 'Bob',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  },
  {
    id: '5',
    name: 'Mia',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
];

export function AdoptionRequests({ currentUser, onOpenChat }: AdoptionRequestsProps) {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('adoptionRequests');
    if (stored) {
      setRequests(JSON.parse(stored));
    } else {
      const mockRequests: Request[] = [
        {
          id: '1',
          animalId: '1',
          animalName: 'Mel',
          animalImage: MOCK_ANIMALS[0].image,
          adopterId: 'adopter1',
          adopterName: 'João Silva',
          adopterEmail: 'joao@email.com',
          status: 'pending',
        },
        {
          id: '2',
          animalId: '3',
          animalName: 'Luna',
          animalImage: MOCK_ANIMALS[2].image,
          adopterId: 'adopter2',
          adopterName: 'Maria Santos',
          adopterEmail: 'maria@email.com',
          status: 'pending',
        },
      ];
      setRequests(mockRequests);
      localStorage.setItem('adoptionRequests', JSON.stringify(mockRequests));
    }
  }, []);

  const handleApprove = (requestId: string, animalId: string, adopterId: string) => {
    const updated = requests.map(r =>
      r.id === requestId ? { ...r, status: 'approved' as const } : r
    );
    setRequests(updated);
    localStorage.setItem('adoptionRequests', JSON.stringify(updated));

    const adoptedAnimals = JSON.parse(localStorage.getItem('adoptedAnimals') || '[]');
    if (!adoptedAnimals.includes(animalId)) {
      adoptedAnimals.push(animalId);
      localStorage.setItem('adoptedAnimals', JSON.stringify(adoptedAnimals));
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === adopterId || u.email === 'joao@email.com' || u.email === 'maria@email.com') {
        const approvedAdoptions = u.approvedAdoptions || [];
        if (!approvedAdoptions.includes(animalId)) {
          return {
            ...u,
            approvedAdoptions: [...approvedAdoptions, animalId],
            adoptionsCount: (u.adoptionsCount || 0) + 1
          };
        }
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleReject = (requestId: string) => {
    const updated = requests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );
    setRequests(updated);
    localStorage.setItem('adoptionRequests', JSON.stringify(updated));
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Solicitações de Adoção</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie os pedidos de adoção dos animais
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl mb-4">Pendentes</h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <img
                      src={request.animalImage}
                      alt={request.animalName}
                      className="w-full md:w-24 h-48 md:h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 w-full">
                      <h3 className="text-xl mb-2">{request.animalName}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <User className="w-4 h-4" />
                        <span>{request.adopterName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm break-all">{request.adopterEmail}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onOpenChat(request.adopterId)}
                          className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat</span>
                        </button>
                        <button
                          onClick={() => handleApprove(request.id, request.animalId, request.adopterId)}
                          className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Aprovar</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Rejeitar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl mb-4">Histórico</h2>
            <div className="space-y-4">
              {processedRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-border opacity-75"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={request.animalImage}
                      alt={request.animalName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{request.animalName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.adopterName}
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-border">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl mb-2">Nenhuma solicitação</h3>
            <p className="text-muted-foreground">
              Quando adotantes demonstrarem interesse, as solicitações aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
