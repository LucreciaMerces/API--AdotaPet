import { Heart, MapPin, Calendar, Info } from 'lucide-react';

interface AnimalCardProps {
  animal: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    description: string;
    image: string;
    ngoName: string;
    location: string;
  };
  onInterest: (animalId: string) => void;
  hasInterest?: boolean;
}

export function AnimalCard({ animal, onInterest, hasInterest }: AnimalCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-border group hover:scale-[1.02]">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onInterest(animal.id)}
            disabled={hasInterest}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              hasInterest
                ? 'bg-pink-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-pink-500 hover:text-white hover:scale-110'
            }`}
          >
            <Heart className="w-5 h-5" fill={hasInterest ? 'white' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-2xl mb-1">{animal.name}</h3>
          <p className="text-white/90 text-sm">{animal.breed}</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{animal.age}</span>
          <span className="mx-1">•</span>
          <span>{animal.gender}</span>
        </div>

        <p className="text-sm text-foreground/80 line-clamp-2">{animal.description}</p>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-foreground">{animal.ngoName}</p>
            <p className="text-muted-foreground">{animal.location}</p>
          </div>
        </div>

        <button
          onClick={() => onInterest(animal.id)}
          disabled={hasInterest}
          className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
            hasInterest
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          {hasInterest ? (
            <>
              <Info className="w-5 h-5" />
              <span>Interesse enviado!</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              <span>Tenho interesse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}