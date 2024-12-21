export const uploadImageForRecognition = async (photo) => {
  const file = {
    uri: photo.uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  };

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${process.env.API_URL}/upload/`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (e) {
    console.error('Network error:', e.message);
  }
};
