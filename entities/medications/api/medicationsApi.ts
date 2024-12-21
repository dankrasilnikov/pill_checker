import { IMedication } from '$entities/medications/types';
import { supabase } from '$shared/api';

export const getMedications = async (): Promise<IMedication[] | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('medications').select('*').eq('user_id', user.id);

  if (error) {
    console.error('Error fetching medications:', error);
    return null;
  }

  return data as IMedication[];
};

export const saveMedication = async (medication: IMedication): Promise<IMedication | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('medications')
    .insert([
      {
        title: medication.title,
        description: medication.description,
        active_ingredients: medication.active_ingredients,
        image: medication?.image ? medication?.image : '',
        user_id: user.id,
      },
    ])
    .select();

  if (error) {
    console.error('Error saving medication:', error);
    return null;
  }

  console.log(data[0]);

  return data[0] as IMedication;
};
