import { useState, useEffect } from 'react';
import { getAnimals } from '../../services/animal';
import { Search, SlidersHorizontal } from 'lucide-react';
import { AnimalCard } from './AnimalCard';

interface FeedPageProps {
  currentUser: any;
  onInterest: (animalId: string) => void;
  interests: string[];
  onOpenAnimal: (animalId: string) => void;
}

export function FeedPage({
  currentUser,
  onInterest,
  interests,
  onOpenAnimal,
}: FeedPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Cachorro' | 'Gato'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);

  
useEffect(() => {
  async function loadAnimals() {
    try {
      const data = await getAnimals(
        searchTerm,
        filterSpecies === 'all' ? undefined : filterSpecies
      );

      const formattedAnimals = data.map((animal: any) => ({
        ...animal,

        image:
          animal.images?.find((img: any) => img.isPrimary)?.url ||
          animal.images?.[0]?.url ||
          "https://via.placeholder.com/400x400?text=Sem+Imagem",

        age: animal.age
          ? `${animal.age} meses`
          : "Idade não informada",

        breed: animal.breed || "Sem raça definida",

        ngoName: animal.ngo?.name || "ONG",

        location:
          `${animal.ngo?.city || ""}${
            animal.ngo?.city && animal.ngo?.state ? " - " : ""
          }${animal.ngo?.state || ""}`,
      }));

      console.log("ANIMAIS FORMATADOS:", formattedAnimals);

      setAnimals(formattedAnimals);

    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    }
  }

  loadAnimals();
}, [searchTerm, filterSpecies]);


  const filteredAnimals = animals;

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
  // antes estava: <div key={animal.id} onClick={() => onOpenAnimal(animal.id)}className="cursor-pointer">
           <div
  key={animal.id}
  onClick={() => {
    console.log("CLIQUE NO CARD", animal.id);
    onOpenAnimal(animal.id);
  }}
  className="cursor-pointer"
>
              <AnimalCard
                animal={animal}
                onInterest={onInterest}
                hasInterest={interests.includes(animal.id)}
              />
            </div>
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