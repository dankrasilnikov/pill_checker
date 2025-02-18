import { StyleSheet, Text, View } from 'react-native';

import PlusIcon from '$assets/plusIcon.svg';
import { Button } from '$shared/ui/Button';

type Props = {
  onPress: () => void;
};

export const ScanButton = ({ onPress }: Props) => {
  return (
    <Button onPress={onPress}>
      <View style={styles.buttonContentWrapper}>
        <PlusIcon width={30} height={30} />
        <Text style={styles.label}>Add medication</Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#0873bb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    zIndex: 1000,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  label: {
    fontSize: 24,
    color: '#ffffff',
  },
  icon: {
    width: 40,
    height: 40,
  },
  buttonContentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: 7,
  },
});
