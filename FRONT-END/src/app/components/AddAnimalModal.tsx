import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (animal: any) => void;
  currentUser: any;
}

export function AddAnimalModal({ isOpen, onClose, onAdd, currentUser }: AddAnimalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Cachorro',
    breed: '',
    age: '',
    gender: 'Macho',
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAnimal = {
      id: Date.now().toString(),
      ...formData,
      ngoName: currentUser.name,
      location: 'Brasil',
      ngoId: currentUser.id,
    };

    onAdd(newAnimal);
    setFormData({
      name: '',
      species: 'Cachorro',
      breed: '',
      age: '',
      gender: 'Macho',
      description: '',
      image: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl">Adicionar Novo Animal</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Animal *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Ex: Mel, Thor, Luna..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Espécie *</label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              >
                <option value="Cachorro">🐕 Cachorro</option>
                <option value="Gato">🐱 Gato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Raça *</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ex: Golden Retriever, Vira-lata..."
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Idade *</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ex: 3 anos, 6 meses..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gênero *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL da Foto *</label>
            <div className="relative">
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="https://exemplo.com/foto-do-animal.jpg"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cole o link de uma imagem do animal (Unsplash, Imgur, etc.)
            </p>
          </div>

          {formData.image && (
            <div className="rounded-xl overflow-hidden border-2 border-border">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem+Inválida';
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all min-h-[120px] resize-none"
              placeholder="Conte sobre a personalidade, temperamento e necessidades do animal..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-border hover:bg-secondary transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Animal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
