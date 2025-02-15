import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useMedsStore } from '$entities/medications/model/medicationsStore';
import { MedicationsListItem } from '$entities/medications/ui/MedicationsListItem';
import { MedicationsModal } from '$entities/medications/ui/MedicationsModal';
import { useScan } from '$features/recognition/hooks/useScan';
import { CameraModal } from '$features/recognition/ui/CameraModal';
import { ErrorModal } from '$features/recognition/ui/ErrorModal';
import { RecognitionModal } from '$features/recognition/ui/RecognitionModal';
import { ScanButton } from '$features/recognition/ui/ScanButton';

export const Dashboard = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [recognizedItem, setRecognizedItem] = useState(null);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [itemData, setItemData] = useState(null);

  const { medications, getMedications, medicationsLoading } = useMedsStore();

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
      await getMedications();
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

  const renderItem = ({ item }: { item: any }) => (
    <MedicationsListItem item={item} setItemData={setItemData} />
  );

  return (
    <View style={styles.wrapper}>
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
      <ErrorModal visible={errorModalVisible} setModal={setErrorModalVisible} />
      <MedicationsModal visible={!!itemData} item={itemData} onClose={() => setItemData(null)} />
      {permissionLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size='large' color='#0873bb' />
          <Text style={styles.stateMessage}>Checking Permissions...</Text>
        </View>
      ) : medicationsLoading ? (
        <View style={styles.state}>
          <Text style={styles.stateMessage}>Loading...</Text>
        </View>
      ) : !medications || medications.length === 0 ? (
        <View style={styles.state}>
          <Text style={styles.stateMessage}>Nothing Found :(</Text>
        </View>
      ) : (
        <View style={styles.list}>
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={5}
          />
        </View>
      )}
      <ScanButton onPress={openCamera} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    marginTop: 10,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
});
