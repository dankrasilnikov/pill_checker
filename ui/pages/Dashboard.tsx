import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useMedsStore } from '$entities/medications/model/medicationsStore';
import { MedicationsListItem } from '$entities/medications/ui/MedicationsListItem';
import { MedicationsModal } from '$entities/medications/ui/MedicationsModal';
import { ColoredBadge } from '$shared/ui/ColoredBadge';

export const Dashboard = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [itemData, setItemData] = useState(null);

  const { medications, getMedications, medicationsLoading, populateTestMedications } =
    useMedsStore();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setPermissionLoading(false);
      populateTestMedications();
      await getMedications();
    })();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <MedicationsListItem item={item} setItemData={setItemData} />
  );

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.greetingContainer}>
        <Text style={styles.h1}>Welcome Svetlana</Text>
        <Text style={styles.subheading}>Your today meds review is ready</Text>
      </View>

      <View style={styles.badges}>
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
      </View>

      <Text style={styles.medicationsTitle}>Medications</Text>

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
          <Text style={styles.stateMessage}>No medications found...</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 100
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F0ECF5',
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
    fontSize: 24,
    marginTop: 16,
  },
  badges: {
    marginTop: 16,
  },
});
