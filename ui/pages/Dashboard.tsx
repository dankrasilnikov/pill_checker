import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

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

  const renderItem = ({ item }) => <MedicationsListItem item={item} setItemData={setItemData} />;

  return (
    <>
      {permissionLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size='large' color='#0873bb' />
          <Text style={styles.stateMessage}>Checking Permissions...</Text>
        </View>
      ) : (
        <FlatList
          data={medications || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={5}
          ListHeaderComponent={
            <View>
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
                    'Increased risk of bleeding when taken together. Consider alternative pain relief options.'
                  }
                  extraTitle={'Ibuprofen + Aspirin'}
                />
              </View>
              <Text style={styles.medicationsTitle}>Medications</Text>
            </View>
          }
          ListEmptyComponent={
            !medicationsLoading && (!medications || medications.length === 0) ? (
              <View style={styles.state}>
                <Text style={styles.stateMessage}>No medications found...</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            medicationsLoading ? (
              <View style={styles.state}>
                <ActivityIndicator size='large' color='#0873bb' />
                <Text style={styles.stateMessage}>Loading...</Text>
              </View>
            ) : null
          }
          style={styles.wrapper}
          contentContainerStyle={styles.contentContainer}
        />
      )}
      <MedicationsModal visible={!!itemData} item={itemData} onClose={() => setItemData(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0ECF5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  state: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  stateMessage: {
    textAlign: 'center',
    marginTop: 10,
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
    marginBottom: 16,
  },
  badges: {
    marginTop: 16,
  },
});
