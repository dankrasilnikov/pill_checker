import { useRef, useState } from 'react';
import { uploadImageForRecognition } from '../api/recognizeImage';

export const useScan = (onSuccess: (item: any) => void, onError: () => void) => {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleMedsScanned = async () => {
    console.log('test scan')
    if (!cameraRef.current) return;

    console.log('scan')

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const result = await uploadImageForRecognition(photo.base64);

      if (result.success && result.item) {
        onSuccess(result.item);
      } else {
        onError();
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
