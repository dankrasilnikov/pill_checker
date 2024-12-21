import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMedsStore } from '$entities/medications/model/medicationsStore';

export const RecognitionModal = ({ visible, item, setModal, closeCamera }) => {
  const { addMedication } = useMedsStore();

  const saveMedication = async () => {
    if (!item?.text) {
      setModal(false);
      return;
    }

    setModal(false);

    const medication = {
      title: item.text,
      description: item.text,
      active_ingredients: item.active_ingredients,
    };

    try {
      await addMedication(medication);
      await closeCamera();
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication. Please try again.');
      console.error('Error saving medication:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Is this what you&#39;re looking for?</Text>
        <Text style={styles.modalText}>Description: {item?.text}</Text>
        <Text style={styles.modalText}>Active ingredients: {item?.active_ingredients}</Text>
        <View style={styles.modalButtons}>
          <Pressable style={styles.modalButton} onPress={() => setModal(false)}>
            <Text>Try Again</Text>
          </Pressable>
          <Pressable
            style={styles.modalButton}
            onPress={async () => {
              await saveMedication();
            }}
          >
            <Text>Yes</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});
