import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import CameraIcon from '$assets/cameraIcon.svg';
import GalleryIconGray from '$assets/galleryIconGray.svg';
import PillsIconBlue from '$assets/pillsIconBlue.svg';
import { useScan } from '$features/recognition/hooks/useScan';
import { CameraModal } from '$features/recognition/ui/CameraModal';
import { ErrorModal } from '$features/recognition/ui/ErrorModal';
import { RecognitionModal } from '$features/recognition/ui/RecognitionModal';
import { ColoredBadge } from '$shared/ui/ColoredBadge';

export const Scan = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [recognizedItem, setRecognizedItem] = useState(null);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setPermissionLoading(false);
    })();
  }, []);

  const openCamera = () => {
    if (permissionLoading) {
      Alert.alert('Permissions', 'Checking camera permissions. Please try again shortly.');
      return;
    }
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to grant camera permission to use this feature.');
      return;
    }

    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
  };

  const { cameraRef, handleMedsScanned, loading } = useScan(
    (item) => {
      setRecognizedItem(item);
      setRecognitionModalVisible(true);
    },
    () => setErrorModalVisible(true),
  );

  return (
    <View style={styles.container}>
      <ErrorModal visible={errorModalVisible} setModal={setErrorModalVisible} />
      <CameraModal
        loading={loading}
        visible={cameraVisible}
        onClose={closeCamera}
        onScan={handleMedsScanned}
        cameraRef={cameraRef}
      />
      <RecognitionModal
        visible={recognitionModalVisible}
        item={recognizedItem}
        setModal={setRecognitionModalVisible}
        closeCamera={closeCamera}
      />

      <View style={styles.pillsIcon}>
        <PillsIconBlue />
      </View>

      <Text style={styles.medsTitle}>Add Your Medication</Text>
      <Text style={styles.medsDescription}>
        Take a clear photo of your medication label or select from your gallery
      </Text>

      <Pressable style={() => [styles.button, styles.blueBg]} onPress={openCamera} disabled={false}>
        <CameraIcon />
        <Text style={[styles.buttonText, { color: '#ffffff' }]}>Take Photo</Text>
      </Pressable>

      <Pressable style={() => [styles.button, styles.grayBg]} onPress={pickImage} disabled={false}>
        <GalleryIconGray />
        <Text style={[styles.buttonText, { color: '#374151' }]}>Choose from Gallery</Text>
      </Pressable>

      <View style={styles.badgeContainer}>
        <ColoredBadge
          bgColor={'#EFF6FF'}
          borderColor={'#EFF6FF'}
          titleColor={'#1F2937'}
          title={'Tips for best results'}
          description={
            '- Ensure good lighting \n' +
            '- Position Label clearly in frame \n' +
            '- Keep the camera steady'
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 100,
  },
  list: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 100,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F0ECF5',
    padding: 16,
  },
  state: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateMessage: {
    textAlign: 'center',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'medium',
  },
  subheading: {
    color: '#737D8B',
    fontSize: 14,
    fontWeight: 'medium',
    marginLeft: 5,
  },
  greetingContainer: {
    marginTop: 50,
  },
  medicationsTitle: {
    fontSize: 24,
    marginTop: 16,
  },
  badges: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 26,
  },
  medsDescription: {
    fontSize: 14,
    color: '#737D8B',
    textAlign: 'center',
    marginTop: 12,
  },
  pillsIcon: {
    backgroundColor: '#EFF6FF',
    padding: 24,
    borderRadius: '50%',
  },
  blueBg: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
  },
  grayBg: {
    backgroundColor: '#fff',
    color: '#374151',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  badgeContainer: {
    width: '100%',
    marginTop: 30,
  },
});
