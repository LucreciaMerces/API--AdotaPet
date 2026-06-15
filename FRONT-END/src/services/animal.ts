
const API_URL = 'http://localhost:3333/api/v1';

export async function getAnimals(
  search?: string,
  species?: string
) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();

  if (search) {
    params.append('search', search);
  }

  if (species === 'Cachorro') {
    params.append('species', 'DOG');
  }

  if (species === 'Gato') {
    params.append('species', 'CAT');
  }

  const response = await fetch(
    `${API_URL}/animals?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}

export async function getAnimalById(id: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_URL}/animals/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}

export async function createAnimal(data: any) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    'http://localhost:3333/api/v1/animals',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}
export async function updateAnimal(
  animalId: string,
  animalData: any
) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_URL}/animals/${animalId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(animalData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}
