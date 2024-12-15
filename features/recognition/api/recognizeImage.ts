export const uploadImageForRecognition = async (base64: string) => {
  const response = await fetch('http://127.0.0.1:8000/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  return response.json();
};
