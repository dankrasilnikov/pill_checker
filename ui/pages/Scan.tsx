import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useScan } from '$features/recognition/hooks/useScan';
import { CameraModal } from '$features/recognition/ui/CameraModal';
import { ErrorModal } from '$features/recognition/ui/ErrorModal';
import { RecognitionModal } from '$features/recognition/ui/RecognitionModal';
import { ScanButton } from '$features/recognition/ui/ScanButton';
import { Camera } from 'expo-camera';

export const Scan = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [recognizedItem, setRecognizedItem] = useState(null);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);

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
      ;
      <ScanButton onPress={openCamera} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})
