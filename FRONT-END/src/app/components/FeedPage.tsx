import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { AnimalCard } from './AnimalCard';

interface FeedPageProps {
  currentUser: any;
  onInterest: (animalId: string) => void;
  interests: string[];
}

const MOCK_ANIMALS = [
  {
    id: '1',
    name: 'Mel',
    species: 'Cachorro',
    breed: 'Golden Retriever',
    age: '3 anos',
    gender: 'Fêmea',
    description: 'Mel é uma cachorrinha dócil e carinhosa, adora crianças e é muito brincalhona. Já está castrada e com todas as vacinas em dia.',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
    ngoName: 'ONG Amigos dos Bichos',
    location: 'São Paulo, SP',
    ngoId: 'ngo1'
  },
  {
    id: '2',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'Husky Siberiano',
    age: '2 anos',
    gender: 'Macho',
    description: 'Thor é um cãozinho super ativo e cheio de energia! Precisa de um tutor que goste de atividades físicas e tenha espaço.',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
    ngoName: 'Lar dos Peludos',
    location: 'Rio de Janeiro, RJ',
    ngoId: 'ngo2'
  },
  {
    id: '3',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamês',
    age: '1 ano',
    gender: 'Fêmea',
    description: 'Luna é uma gatinha elegante e independente, mas muito carinhosa com quem conquista sua confiança. Ideal para apartamentos.',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
    ngoName: 'Felinos Felizes',
    location: 'Belo Horizonte, MG',
    ngoId: 'ngo1'
  },
  {
    id: '4',
    name: 'Bob',
    species: 'Cachorro',
    breed: 'Vira-lata',
    age: '4 anos',
    gender: 'Macho',
    description: 'Bob foi resgatado das ruas e está pronto para encontrar uma família amorosa. É calmo, obediente e se dá bem com outros pets.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    ngoName: 'Patinhas Solidárias',
    location: 'Curitiba, PR',
    ngoId: 'ngo3'
  },
  {
    id: '5',
    name: 'Mia',
    species: 'Gato',
    breed: 'Persa',
    age: '6 meses',
    gender: 'Fêmea',
    description: 'Mia é uma filhotinha de gato persa, super fofa e brincalhona. Adora colo e ronronar. Já está vacinada e vermifugada.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    ngoName: 'ONG Amigos dos Bichos',
    location: 'São Paulo, SP',
    ngoId: 'ngo1'
  },
  {
    id: '6',
    name: 'Rex',
    species: 'Cachorro',
    breed: 'Pastor Alemão',
    age: '5 anos',
    gender: 'Macho',
    description: 'Rex é um cão leal e protetor, ideal para quem busca um companheiro guardião. É bem treinado e obediente.',
    image: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800',
    ngoName: 'Lar dos Peludos',
    location: 'Rio de Janeiro, RJ',
    ngoId: 'ngo2'
  },
  {
    id: '7',
    name: 'Nina',
    species: 'Gato',
    breed: 'Vira-lata',
    age: '2 anos',
    gender: 'Fêmea',
    description: 'Nina é uma gatinha muito carinhosa e tranquila. Gosta de ficar pertinho do tutor e é ótima companhia.',
    image: 'https://cdn.shopify.com/s/files/1/0500/8965/6473/files/gray-g16b72164c_1920_480x480.jpg?v=1663247513',
    ngoName: 'Felinos Felizes',
    location: 'Belo Horizonte, MG',
    ngoId: 'ngo1'
  },
  {
    id: '8',
    name: 'Max',
    species: 'Cachorro',
    breed: 'Beagle',
    age: '1 ano',
    gender: 'Macho',
    description: 'Max é um filhote cheio de energia e muito curioso. Adora brincar e fazer novos amigos, tanto humanos quanto pets.',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
    ngoName: 'Patinhas Solidárias',
    location: 'Curitiba, PR',
    ngoId: 'ngo3'
  }
];

export function FeedPage({ currentUser, onInterest, interests }: FeedPageProps) {
  const adoptedAnimals = JSON.parse(
  localStorage.getItem('adoptedAnimals') || '[]'
);

const customAnimals = JSON.parse(
  localStorage.getItem('customAnimals') || '[]'
);

const animals = [...MOCK_ANIMALS, ...customAnimals].filter(
  animal => !adoptedAnimals.includes(animal.id)
);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Cachorro' | 'Gato'>('all');
  const [showFilters, setShowFilters] = useState(false);


  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || animal.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Animais disponíveis para adoção</h1>
          <p className="text-sm md:text-base text-muted-foreground">Encontre seu novo melhor amigo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-lg bg-secondary hover:bg-accent transition-colors flex items-center gap-2 justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm mb-2">Espécie</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterSpecies('all')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all ${
                    filterSpecies === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterSpecies('Cachorro')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all ${
                    filterSpecies === 'Cachorro'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  🐕 Cachorros
                </button>
                <button
                  onClick={() => setFilterSpecies('Gato')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all ${
                    filterSpecies === 'Gato'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  🐱 Gatos
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map(animal => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onInterest={onInterest}
              hasInterest={interests.includes(animal.id)}
            />
          ))}
        </div>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl mb-2">Nenhum animal encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
