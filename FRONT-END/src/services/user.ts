const API_URL = 'http://localhost:3333/api/v1';

export async function getProfile() {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_URL}/users/me`,
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