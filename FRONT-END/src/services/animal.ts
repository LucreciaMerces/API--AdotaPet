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