import { Checkbox } from 'expo-checkbox';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  agreedTerms: boolean;
  setAgreedTerms: Dispatch<SetStateAction<boolean>>;
}

export const AgreeCheckbox = ({ agreedTerms, setAgreedTerms }: Props) => {
  return (
    <Pressable style={styles.checkboxContainer} onPress={() => setAgreedTerms(!agreedTerms)}>
      <Checkbox value={agreedTerms} onValueChange={setAgreedTerms} color='#2563EB' />
      <Text>I Agree With You {agreedTerms ? '👍' : ''}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
});
