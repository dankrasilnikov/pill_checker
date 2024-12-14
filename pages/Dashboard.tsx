import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ItemModal } from '$features/recognition/ui/ItemModal';
import { ScanButton } from '$features/scan/ui/ScanButton';

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
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);

  const cameraRef = useRef(null);

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

  const handleMedsScanned = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });


      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo.base64 }),
      });

      const result = await response.json();

      if (result.success && result.item) {
        setRecognizedItem(result.item);
        setRecognitionModalVisible(true);
      } else {
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
      closeCamera();
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => setItemData(item)} style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </Pressable>
  );

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
      <ItemModal visible={!!itemData} item={itemData} onClose={() => setItemData(null)}/>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}

      />

      <ScanButton onPress={openCamera} />
      {/*Split*/}
      {cameraVisible && (
        <Modal visible={cameraVisible} transparent={false}>
          <CameraView style={styles.camera} facing={'back'} ref={cameraRef}>
            <Pressable style={styles.closeButton} onPress={closeCamera}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            <ScanButton onPress={handleMedsScanned} />
          </CameraView>
        </Modal>
      )}
      {/*Split*/}
      <Modal visible={recognitionModalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Is this what you're looking for?</Text>
          <Text style={styles.modalText}>{recognizedItem?.name}</Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setRecognitionModalVisible(false);
              }}
            >
              <Text>Try Again</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setRecognitionModalVisible(false);
                Alert.alert('Success', 'Item confirmed.');
              }}
            >
              <Text>Yes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/*Split*/}
      <Modal visible={errorModalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>We can't understand...</Text>
          <Text style={styles.modalText}>Try to take a better picture.</Text>
          <Pressable
            style={styles.modalButton}
            onPress={() => {
              setErrorModalVisible(false);
            }}
          >
            <Text>OK</Text>
          </Pressable>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#fff' />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: '#1a8917',
    fontWeight: 'bold',
  },
  list: {
    position: 'relative',
    marginTop: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#0873bb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    backgroundColor: '#0873bb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
