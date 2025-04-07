import { Controller } from 'react-hook-form';
import { Dimensions, SafeAreaView, Text, TextInput } from 'react-native';

export const AuthInput = ({ errors, control, name, placeholder, rules }) => {
  return (
    <SafeAreaView>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput {...field} style={styles.input} placeholder={placeholder} />
        )}
        name={name}
        rules={{ required: true }}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = {
  inputContainer: {},
  label: {
    fontSize: 12,
    marginBottom: height * 0.01,
    marginLeft: 7,
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    bacgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
};
