import { CameraView } from 'expo-camera';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { ScanButton } from '$features/recognition/ui/ScanButton';
import { Loading } from '$shared/ui/Loading';

export const CameraModal = ({ visible, cameraRef, loading, onClose, onScan }) => {
  return (
    <Modal visible={visible} transparent={false}>
      <CameraView style={styles.camera} facing={'back'} ref={cameraRef}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
        <ScanButton onPress={onScan} />
        {loading && <Loading />}
      </CameraView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});
