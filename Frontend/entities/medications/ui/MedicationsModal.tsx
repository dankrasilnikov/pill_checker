import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Image } from 'react-native';

import type { IMedication } from '$entities/medications/types';

type ItemModalProps = {
  visible: boolean;
  item: IMedication | null;
  onClose: () => void;
};

export const MedicationsModal = ({ visible, item, onClose }: ItemModalProps) => {
  if (!item) return null;

  const activeIngredients = item.active_ingredients.join(', ');

  return (
    <Modal visible={visible} transparent={true} animationType='slide' onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={{ uri: item.image }} style={styles.modalImage} />
          <Text style={styles.modalName}>{activeIngredients}</Text>
          <Text style={styles.modalDescription}>{item.description}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 18,
    color: '#1a8917',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#0873bb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
