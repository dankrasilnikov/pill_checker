import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useMedsStore } from '$entities/medications/model/medicationsStore';
import { MedicationsListItem } from '$entities/medications/ui/MedicationsListItem';
import { MedicationsModal } from '$entities/medications/ui/MedicationsModal';
import { useScan } from '$features/recognition/hooks/useScan';
import { CameraModal } from '$features/recognition/ui/CameraModal';
import { ErrorModal } from '$features/recognition/ui/ErrorModal';
import { RecognitionModal } from '$features/recognition/ui/RecognitionModal';
import { ScanButton } from '$features/recognition/ui/ScanButton';
import { ColoredBadge } from '$shared/ui/ColoredBadge';

export const Dashboard = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [itemData, setItemData] = useState(null);

  const { medications, getMedications, medicationsLoading } = useMedsStore();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setPermissionLoading(false);
      await getMedications();
    })();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <MedicationsListItem item={item} setItemData={setItemData} />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.greetingContainer}>
        <Text style={styles.h1}>Welcome Svetlana</Text>
        <Text style={styles.subheading}>Your today meds review is ready</Text>
      </View>

      <Text style={styles.medicationsTitle}>Medications</Text>

      <ColoredBadge
        bgColor={'#FFF7ED'}
        borderColor={'#FDE2C3'}
        titleColor={'#EC6921'}
        title={'2 potential conflicts found'}
        description={
          'Increased isk of bleeding when taken together. Consider alternative pain relief options.'
        }
        extraTitle={'Ibuprofen + Aspirin'}
      />

      <MedicationsModal visible={!!itemData} item={itemData} onClose={() => setItemData(null)} />
      {permissionLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size='large' color='#0873bb' />
          <Text style={styles.stateMessage}>Checking Permissions...</Text>
        </View>
      ) : medicationsLoading ? (
        <View style={styles.state}>
          <Text style={styles.stateMessage}>Loading...</Text>
        </View>
      ) : !medications || medications.length === 0 ? (
        <View style={styles.state}>
          <Text style={styles.stateMessage}>Nothing Found :(</Text>
        </View>
      ) : (
        <View style={styles.list}>
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={5}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    marginTop: 10,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    padding: 16,
  },
  state: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateMessage: {
    textAlign: 'center',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'medium',
  },
  subheading: {
    color: '#737D8B',
    fontSize: 14,
    fontWeight: 'medium',
    marginLeft: 5,
  },
  greetingContainer: {
    marginTop: 50,
  },
  medicationsTitle: {
    fontSize: 20,
    marginVertical: 16,
  },
});
