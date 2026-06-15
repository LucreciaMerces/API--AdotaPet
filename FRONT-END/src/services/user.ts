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

export async function uploadAvatar(file: File) {
  const token = localStorage.getItem('token');

  const formData = new FormData();

  formData.append('avatar', file);

  const response = await fetch(
    `${API_URL}/users/avatar`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}