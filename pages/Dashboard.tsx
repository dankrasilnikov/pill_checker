import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useScan } from '$features/recognition/hooks/useScan';
import { CameraModal } from '$features/recognition/ui/CameraModal';
import { ErrorModal } from '$features/recognition/ui/ErrorModal';
import { ItemCard } from '$features/recognition/ui/ItemCard';
import { ItemModal } from '$features/recognition/ui/ItemModal';
import { RecognitionModal } from '$features/recognition/ui/RecognitionModal';
import { ScanButton } from '$features/recognition/ui/ScanButton';
import { LoadingOverlay } from '$shared/ui/LoadingOverlay';

const data = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index),
  name: `Medication ${index + 1}`,
  description: `Description of Medication ${index + 1}`,
  price: (Math.random() * 100).toFixed(2),
  image: 'https://via.placeholder.com/150',
}));

export const Dashboard = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [recognizedItem, setRecognizedItem] = useState(null);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [itemData, setItemData] = useState(null);

  const { cameraRef, handleMedsScanned, loading } = useScan(
    (item) => {
      setRecognizedItem(item);
      setRecognitionModalVisible(true);
    },
    () => setErrorModalVisible(true),
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setPermissionLoading(false);
    })();
  }, []);

  const openCamera = async () => {
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

  const renderItem = ({ item }) => <ItemCard item={item} setItemData={setItemData} />;

  if (permissionLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#0873bb' />
        <Text>Checking Permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <ItemModal visible={!!itemData} item={itemData} onClose={() => setItemData(null)} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
      />

      <ScanButton onPress={openCamera} />

      <CameraModal
        visible={cameraVisible}
        onClose={closeCamera}
        onScan={handleMedsScanned}
        cameraRef={cameraRef}
      />
      <RecognitionModal
        visible={recognitionModalVisible}
        item={recognizedItem}
        setModal={setRecognitionModalVisible}
      />
      <ErrorModal visible={errorModalVisible} setModal={setErrorModalVisible} />

      {loading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
