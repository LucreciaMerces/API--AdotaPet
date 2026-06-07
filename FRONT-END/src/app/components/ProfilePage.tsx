import { useState } from 'react';
import { User, Mail, Heart, CheckCircle, Building2, PawPrint, Plus } from 'lucide-react';
import { AddAnimalModal } from './AddAnimalModal';

interface ProfilePageProps {
  currentUser: any;
  interests: string[];
}

const MOCK_ANIMALS = [
  {
    id: '1',
    name: 'Mel',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    id: '2',
    name: 'Thor',
    breed: 'Husky Siberiano',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
  },
  {
    id: '3',
    name: 'Luna',
    breed: 'Siamês',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400',
  },
  {
    id: '4',
    name: 'Bob',
    breed: 'Vira-lata',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  },
  {
    id: '5',
    name: 'Mia',
    breed: 'Persa',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
];

export function ProfilePage({ currentUser, interests }: ProfilePageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<any>(null);
  const [customAnimals, setCustomAnimals] = useState<any[]>(() => {
    const stored = localStorage.getItem('customAnimals');
    return stored ? JSON.parse(stored) : [];
  });

  const interestedAnimals = MOCK_ANIMALS.filter(animal =>
    interests.includes(animal.id)
  );

  const approvedAdoptions = currentUser.approvedAdoptions || [];
  const adoptedAnimals = MOCK_ANIMALS.filter(animal =>
    approvedAdoptions.includes(animal.id)
  );

  const hasApprovedAdoption = approvedAdoptions.length > 0;

  const allAnimals = [...MOCK_ANIMALS, ...customAnimals];
  const ngoAnimals = customAnimals.filter(
  animal => animal.ngoId === currentUser.id
);

  const adoptedAnimalsIds = JSON.parse(localStorage.getItem('adoptedAnimals') || '[]');
  const availableNgoAnimals = ngoAnimals.filter(a => !adoptedAnimalsIds.includes(a.id));
  const adoptedNgoAnimals = ngoAnimals.filter(a => adoptedAnimalsIds.includes(a.id));

  const handleAddAnimal = (animal: any) => {
    const updated = [...customAnimals, animal];
    setCustomAnimals(updated);
    localStorage.setItem('customAnimals', JSON.stringify(updated));
  };

  const handleDeleteAnimal = (animalId: string) => {
  const updated = customAnimals.filter(
    animal => animal.id !== animalId
  );

  setCustomAnimals(updated);
  localStorage.setItem('customAnimals', JSON.stringify(updated));
};

const handleEditAnimal = (updatedAnimal: any) => {
  const updated = customAnimals.map(animal =>
    animal.id === updatedAnimal.id
      ? updatedAnimal
      : animal
  );

  setCustomAnimals(updated);
  localStorage.setItem('customAnimals', JSON.stringify(updated));

  setEditingAnimal(null);
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-border">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
              {currentUser.type === 'ngo' ? (
                <Building2 className="w-12 h-12" />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl">{currentUser.name}</h1>
                {currentUser.type === 'ngo' && (
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm">
                    ONG
                  </span>
                )}
                {currentUser.type === 'adopter' && (
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                    Adotante
                  </span>
                )}
              </div>
             <div className="flex items-center gap-2 text-muted-foreground mb-4">
  <Mail className="w-4 h-4" />
  <span className="text-sm break-all">{currentUser.email}</span>
</div>

<div className="space-y-2 mb-4">

  {currentUser.phone && (
    <p className="text-sm">
      <strong>Telefone:</strong> {currentUser.phone}
    </p>
  )}

  {currentUser.city && currentUser.state && (
    <p className="text-sm">
      <strong>Localização:</strong> {currentUser.city} - {currentUser.state}
    </p>
  )}

  {currentUser.type === 'ngo' && currentUser.bio && (
    <div>
      <p className="font-medium mb-1">
        Sobre a ONG
      </p>

      <p className="text-sm text-muted-foreground">
        {currentUser.bio}
      </p>
    </div>
  )}

</div>

{hasApprovedAdoption && currentUser.type === 'adopter' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Adoção aprovada!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Parabéns! Sua adoção foi aprovada pela ONG.
                  </p>
                </div>
              )}

              {currentUser.type === 'adopter' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">Interesses</span>
                    </div>
                    <p className="text-2xl md:text-3xl text-orange-700">{interests.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                    <div className="flex items-center gap-2 text-pink-600 mb-1">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Adoções</span>
                    </div>
                    <p className="text-2xl md:text-3xl text-pink-700">{approvedAdoptions.length}</p>
                  </div>
                </div>
              )}

              {currentUser.type === 'ngo' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <PawPrint className="w-5 h-5" />
                      <span className="text-sm">Disponíveis</span>
                    </div>
                    <p className="text-2xl md:text-3xl text-blue-700">{availableNgoAnimals.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Adotados</span>
                    </div>
                    <p className="text-2xl md:text-3xl text-green-700">{adoptedNgoAnimals.length}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentUser.type === 'ngo' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Animal
            </button>
          )}
        </div>

        {currentUser.type === 'adopter' && adoptedAnimals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-border">
            <h2 className="text-2xl mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Pets adotados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {adoptedAnimals.map(animal => (
                <div key={animal.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-green-200">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
  <div className="text-white">
    <p className="font-medium">{animal.name}</p>
    <p className="text-sm text-white/80">{animal.breed}</p>
  </div>

  <div className="flex gap-2 mt-3">
    <button
      onClick={() => {
        setEditingAnimal(animal);
        setIsAddModalOpen(true);
      }}
      className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm"
    >
      Editar
    </button>

    <button
      onClick={() => handleDeleteAnimal(animal.id)}
      className="flex-1 bg-red-500 text-white py-1 rounded-lg text-sm"
    >
      Excluir
    </button>
  </div>
</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUser.type === 'adopter' && interestedAnimals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-border">
            <h2 className="text-2xl mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-orange-500" />
              Animais de interesse
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interestedAnimals.map(animal => (
                <div key={animal.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div className="text-white">
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-sm text-white/80">{animal.breed}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" fill="white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUser.type === 'adopter' && interestedAnimals.length === 0 && adoptedAnimals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-border">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl mb-2">Nenhum interesse ainda</h3>
            <p className="text-muted-foreground">
              Explore o feed e demonstre interesse em animais para adoção
            </p>
          </div>
        )}

        {currentUser.type === 'ngo' && availableNgoAnimals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-border">
            <h2 className="text-2xl mb-4 flex items-center gap-2">
              <PawPrint className="w-6 h-6 text-blue-500" />
              Animais disponíveis
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableNgoAnimals.map(animal => (
  <div
    key={animal.id}
    className="rounded-xl overflow-hidden border border-border bg-white"
  >
    <img
      src={animal.image}
      alt={animal.name}
      className="w-full h-48 object-cover"
    />

    <div className="p-3">
      <p className="font-medium">{animal.name}</p>
      <p className="text-sm text-muted-foreground">
        {animal.breed}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            setEditingAnimal(animal);
            setIsAddModalOpen(true);
          }}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Editar
        </button>

        <button
          onClick={() => handleDeleteAnimal(animal.id)}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
))}
            </div>
          </div>
        )}

        {currentUser.type === 'ngo' && adoptedNgoAnimals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-border">
            <h2 className="text-2xl mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Animais adotados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {adoptedNgoAnimals.map(animal => (
                <div key={animal.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-green-200">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div className="text-white">
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-sm text-white/80">{animal.breed}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <AddAnimalModal
  isOpen={isAddModalOpen}
  onClose={() => {
    setIsAddModalOpen(false);
    setEditingAnimal(null);
  }}
  onAdd={handleAddAnimal}
  onEdit={handleEditAnimal}
  editingAnimal={editingAnimal}
  currentUser={currentUser}
/>
    </div>
  );
}
