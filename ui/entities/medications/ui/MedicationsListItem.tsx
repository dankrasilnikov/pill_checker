import { Pressable, StyleSheet, Text } from 'react-native';

import type { IMedication } from '$entities/medications/types';

interface Props {
  item: IMedication;
  setItemData: (item: IMedication) => void;
}

export const MedicationsListItem = ({ item, setItemData }: Props) => {
  const activeIngredients = item.active_ingredients.join(', ');
  return (
    <Pressable onPress={() => setItemData(item)} style={styles.item}>
      <Text style={styles.name}>{activeIngredients}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Pressable>
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
});
