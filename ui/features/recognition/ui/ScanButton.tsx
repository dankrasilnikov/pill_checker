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
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  label: {
    fontSize: 24,
    color: '#ffffff',
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
