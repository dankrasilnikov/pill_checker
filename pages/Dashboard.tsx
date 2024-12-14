import { FlatList, Text, View, StyleSheet } from 'react-native';

import { ScanButton } from '$features/scan/ui/ScanButton';

const data = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index),
  name: `Medication ${index + 1}`,
  description: `Description of Medication ${index + 1}`,
  price: (Math.random() * 100).toFixed(2), // Цена от 0 до 100
}));

const renderItem = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <Text style={styles.price}>${item.price}</Text>
  </View>
);

export const Dashboard = () => {
  const onScan = () => {};
  return (
    <View style={styles.list}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
      />
      <ScanButton onPress={onScan} />
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
});
