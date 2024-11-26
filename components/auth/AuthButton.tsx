import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  pressedColor?: string; // Опциональные свойства
  backgroundColor?: string;
  color?: string;
  width?: string;
  onPress: () => void;
  label: string;
}

export const AuthButton = ({
                             pressedColor = '#0493b3', // Дефолтные значения
                             backgroundColor = '#0873bb',
                             color = '#fff',
                             onPress,
                             label,
                             width = '100%',
                           }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? pressedColor : backgroundColor, width },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
