export const uploadImageForRecognition = async (photo) => {

  const file = {
    uri: photo.uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  };

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://192.168.0.19:8000/upload/', {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response:', response);

    const result = await response.json();
    console.log('Result:', result);
    return result;
  } catch (e) {
    console.error('Network error:', e.message);
  }

};
