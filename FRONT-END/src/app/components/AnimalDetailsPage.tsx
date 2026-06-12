import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Shield, Scissors } from 'lucide-react';
import { getAnimalById } from '../../services/animal';

interface AnimalDetailsPageProps {
  animalId: string;
  onBack: () => void;
}

export function AnimalDetailsPage({
  animalId,
  onBack,
}: AnimalDetailsPageProps) {
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnimal() {
      try {
        const data = await getAnimalById(animalId);

        console.log('Animal carregado:', data);

        setAnimal(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAnimal();
  }, [animalId]);

  if (loading) {
    return (
      <div className="p-10">
        Carregando animal...
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="p-10">
        Animal não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-lg bg-white border border-border shadow-sm hover:bg-secondary transition"
        >
          ← Voltar ao Feed
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border">

          <div className="w-full h-80 bg-gray-100 flex items-center justify-center">

            {animal.imageUrl && (
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            )}

          </div>

          <div className="p-8">

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                {animal.name}
              </h1>

              <p className="text-lg text-muted-foreground">
                {animal.species === "DOG" && "Cachorro"}
                {animal.species === "CAT" && "Gato"}
                {animal.species === "BIRD" && "Pássaro"}
                {animal.species === "RABBIT" && "Coelho"}
                {animal.species === "OTHER" && "Outro"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              <div>
                <span className="font-semibold">
                  Raça:
                </span>{" "}
                {animal.breed || "Não informada"}
              </div>

              <div>
                <span className="font-semibold">
                  Idade:
                </span>{" "}
                {animal.age ?? "Não informada"}
                {animal.age != null && " anos"}
              </div>

              <div>
                <span className="font-semibold">
                  Sexo:
                </span>{" "}
                {animal.gender === "MALE"
                  ? "Macho"
                  : "Fêmea"}
              </div>

              <div>
                <span className="font-semibold">
                  Porte:
                </span>{" "}
                {animal.size === "SMALL" && "Pequeno"}
                {animal.size === "MEDIUM" && "Médio"}
                {animal.size === "LARGE" && "Grande"}
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">

              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                {animal.isVaccinated
                  ? "✓ Vacinado"
                  : "✗ Não vacinado"}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
                {animal.isNeutered
                  ? "✓ Castrado"
                  : "✗ Não castrado"}
              </div>

            </div>

            <div className="mb-8">

              <h2 className="text-2xl font-semibold mb-3">
                Sobre
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                {animal.description ||
                  "Nenhuma descrição informada."}
              </p>

            </div>

            <div className="border-t pt-6">

              <h2 className="text-2xl font-semibold mb-4">
                ONG responsável
              </h2>

              <div className="space-y-2">

                <p>
                  <span className="font-semibold">
                    Nome:
                  </span>{" "}
                  {animal.ngo?.name}
                </p>

                <p>
                  <span className="font-semibold">
                    Cidade:
                  </span>{" "}
                  {animal.ngo?.city}
                  {" - "}
                  {animal.ngo?.state}
                </p>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}