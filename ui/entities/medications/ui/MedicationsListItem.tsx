import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { IMedication } from '$entities/medications/types';

interface Props {
  item: IMedication;
  setItemData: (item: IMedication) => void;
}

export const MedicationsListItem = ({ item, setItemData }: Props) => {
  const activeIngredients = item.active_ingredients.join(', ');
  return (
    <Pressable onPress={() => setItemData(item)} style={styles.item}>
      <View>
        <Text style={styles.name}>{activeIngredients}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <Text style={styles.conflict}>Conflict</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#ccc',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: '#fff',
    position: 'relative',
  },
  name: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    fontSize: 12,
    color: '#737D8B',
    marginVertical: 4,
  },
  conflict: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#F02C34',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 12,
  },
});
