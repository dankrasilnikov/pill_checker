import { Pressable, StyleSheet, Text, View } from 'react-native';

export const ForgotPassword = () => {
  const handleForgotPassword = () => {};

  return (
    <View style={styles.problemsSection}>
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    paddingVertical: 16,
    paddingTop: 8,
    paddingHorizontal: 5,
  },
  problemsSection: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
