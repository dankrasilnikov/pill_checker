import { Pressable, StyleSheet, Text } from 'react-native';


export const ItemCard = ({item, setItemData}) => {
  return (
    <Pressable onPress={() => setItemData(item)} style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </Pressable>
  );
}

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
  }
});
