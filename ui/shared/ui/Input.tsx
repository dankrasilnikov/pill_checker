import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  type?: 'none' | 'password';
}

export const Input = ({ label, placeholder, value, onChange, type = 'none' }: Props) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={onChange}
        placeholder={placeholder}
        style={styles.input}
        value={value}
        textContentType={type}
      />
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  inputContainer: {},
  label: {
    fontSize: 12,
    marginBottom: height * 0.01,
    marginLeft: 7,
    color: '#1F2937',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
});
