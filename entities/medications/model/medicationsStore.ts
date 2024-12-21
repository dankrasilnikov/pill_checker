import { create } from 'zustand';

import { getMedications, saveMedication } from '$entities/medications/api/medicationsApi';
import type { IMedication } from '$entities/medications/types';

interface IMedsState {
  medications: IMedication[] | null;
  error: string | null;
  medicationsLoading: boolean;
  addMedication: (medication: IMedication) => Promise<void>;
  getMedications: () => Promise<void>;
  populateTestMedications: () => void;
}

export const useMedsStore = create<IMedsState>((set) => ({
  medications: null,
  error: null,
  medicationsLoading: false,

  addMedication: async (medication: IMedication) => {
    set({ medicationsLoading: true, error: null });

    try {
      const data = await saveMedication(medication);

      set((state) => ({
        medications: state.medications ? [...state.medications, data] : [data],
        medicationsLoading: false,
      }));

      return data[0];
    } catch (err: any) {
      set({ error: err.message, medicationsLoading: false });
      console.error('Unexpected error:', err);
    }
  },

  getMedications: async () => {
    set({ medicationsLoading: true, error: null });

    try {
      const medications = await getMedications();

      set({ medications: medications, medicationsLoading: false });
    } catch (err: any) {
      set({ error: err.message, medicationsLoading: false });
      console.error('Unexpected error:', err);
    }
  },
  populateTestMedications: () => {
    const testMedications: IMedication[] = [
      {
        id: '1',
        title: 'Aspirin',
        description: 'Used to treat pain, fever, or inflammation.',
        active_ingredients: ['Acetylsalicylic Acid'],
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        title: 'Paracetamol',
        description: 'Pain reliever and a fever reducer.',
        active_ingredients: ['Paracetamol'],
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '3',
        title: 'Ibuprofen',
        description: 'Nonsteroidal anti-inflammatory drug (NSAID).',
        active_ingredients: ['Ibuprofen'],
        image: 'https://via.placeholder.com/150',
      },
    ];

    set({ medications: testMedications });
  },
  //TODO delete medication
}));
