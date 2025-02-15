import { useRef, useState } from 'react';

import { uploadImageForRecognition } from '../api/recognizeImage';

export const useScan = (onSuccess: (item: any) => void, onError: () => void) => {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleMedsScanned = async () => {
    if (!cameraRef.current) return;
    setLoading(true);

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const result = await uploadImageForRecognition(photo);
      console.log('Recognized: ', result);
      if (result?.success) {
        const item = {
          text: result?.text,
          active_ingredients: result?.active_ingredients,
        };
        onSuccess(item);
      } else {
        onError();
        console.log('Error:', result?.error);
      }
    } catch (error) {
      console.error(error);
      onError();
    } finally {
      setLoading(false);
    }
  };

  return { cameraRef, handleMedsScanned, loading };
};
