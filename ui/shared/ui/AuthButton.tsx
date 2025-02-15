import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  pressedColor?: string;
  backgroundColor?: string;
  color?: string;
  width?: string;
  onPress: () => void;
  label: string;
}

export const AuthButton = ({
  pressedColor = '#0493b3',
  backgroundColor = '#2563EB',
  color = '#fff',
  borderColor = '',
  onPress,
  label,
  width = '100%',
}: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? pressedColor : backgroundColor, width, borderColor, borderWidth: borderColor ? 1 : 0 },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
