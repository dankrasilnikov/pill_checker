import { Dimensions, Text, TextInput, View } from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'none' | 'password';
}

export const AuthInput = ({ label, placeholder, value, onChange, type = 'none' }: Props) => {

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput onChangeText={onChange}
                 placeholder={placeholder}
                 style={styles.input}
                 value={value}
                 textContentType={type}
      />
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = {
  inputContainer: {},
  label: {
    fontSize: 18,
    marginBottom: height * 0.02,
    marginLeft: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
};
