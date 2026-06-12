import { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { createAnimal } from '../../services/animal';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (animal: any) => void;
  onEdit?: (animal: any) => void;
  editingAnimal?: any;
  currentUser: any;
}

export function AddAnimalModal({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingAnimal,
  currentUser,
}: AddAnimalModalProps) {

const [formData, setFormData] = useState({
  name: '',
  species: 'Cachorro',
  breed: '',
  age: '',

  gender: 'Macho',
  size: 'Médio',

  description: '',

  status: 'Disponível',

  isVaccinated: false,
  isNeutered: false,

  image: null as File | null,

});

useEffect(() => {
  if (!editingAnimal) return;

  setFormData({
    name: editingAnimal.name || '',
    species: editingAnimal.species || 'Cachorro',
    breed: editingAnimal.breed || '',
    age: editingAnimal.age || '',

    gender: editingAnimal.gender || 'Macho',
    size: editingAnimal.size || 'Médio',

    description: editingAnimal.description || '',

    status: editingAnimal.status || 'Disponível',

    isVaccinated: editingAnimal.isVaccinated || false,
    isNeutered: editingAnimal.isNeutered || false,

    image: editingAnimal.image || null,
  });
}, [editingAnimal]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const backendAnimal = {
      name: formData.name,

      species:
        formData.species === 'Cachorro'
          ? 'DOG'
          : formData.species === 'Gato'
          ? 'CAT'
          : 'OTHER',

      breed: formData.breed,

      age: formData.age
        ? Number(formData.age)
        : undefined,

      gender:
        formData.gender === 'Macho'
          ? 'MALE'
          : 'FEMALE',

      size:
        formData.size === 'Pequeno'
          ? 'SMALL'
          : formData.size === 'Grande'
          ? 'LARGE'
          : 'MEDIUM',

      description: formData.description,

      isVaccinated: formData.isVaccinated,

      isNeutered: formData.isNeutered,
    };

    if (editingAnimal) {
      onEdit?.(backendAnimal);
    } else {
      await onAdd(backendAnimal);
    }

    setFormData({
      name: '',
      species: 'Cachorro',
      breed: '',
      age: '',
      gender: 'Macho',
      size: 'Médio',
      description: '',
      status: 'Disponível',
      isVaccinated: false,
      isNeutered: false,
      image: null,
    });

    onClose();

  } catch (error) {
    console.error(error);

    alert('Erro ao cadastrar animal.');
  }
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
  <label className="block text-sm font-medium mb-2">
    Porte *
  </label>

  <select
    value={formData.size}
    onChange={(e) =>
      setFormData({
        ...formData,
        size: e.target.value,
      })
    }
    className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border"
  >
    <option value="Pequeno">Pequeno</option>
    <option value="Médio">Médio</option>
    <option value="Grande">Grande</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">
    Status
  </label>

  <select
    value={formData.status}
    onChange={(e) =>
      setFormData({
        ...formData,
        status: e.target.value,
      })
    }
    className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border"
  >
    <option value="Disponível">
      Disponível
    </option>

    <option value="Pendente">
      Pendente
    </option>

    <option value="Adotado">
      Adotado
    </option>
  </select>
</div>

<div className="grid md:grid-cols-2 gap-4">

  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={formData.isVaccinated}
      onChange={(e) =>
        setFormData({
          ...formData,
          isVaccinated: e.target.checked,
        })
      }
    />

    Vacinado
  </label>

  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={formData.isNeutered}
      onChange={(e) =>
        setFormData({
          ...formData,
          isNeutered: e.target.checked,
        })
      }
    />

    Castrado
  </label>

</div>
          <label className="block text-sm font-medium mb-2">
  Foto do Animal *
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file
    });
  }}
  className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border"
/>


{formData.image instanceof File && (
  <div className="rounded-xl overflow-hidden border-2 border-border">
    <img
      src={URL.createObjectURL(formData.image)}
      alt="Preview"
      className="w-full h-48 object-cover"
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
              {editingAnimal ? 'Salvar Alterações' : 'Adicionar Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
