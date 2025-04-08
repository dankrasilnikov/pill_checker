import { StyleSheet, View, Text } from 'react-native';

interface Props {
  bgColor: string;
  borderColor: string;
  titleColor: string;
  title: string;
  description?: string;
  extraTitle?: string;
}

export const ColoredBadge = ({
  bgColor,
  borderColor,
  titleColor,
  title,
  description,
  extraTitle,
}: Props) => {
  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor, borderColor: borderColor }]}>
      {title ? <Text style={[styles.title, { color: titleColor }]}>{title}</Text> : ''}
      {extraTitle ? <Text style={styles.extraTitle}>{extraTitle}</Text> : ''}
      {description ? <Text style={styles.description}>{description}</Text> : ''}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    width: '100%'
  },
  title: {
    fontSize: 16,
  },
  extraTitle: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#000',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#737D8B',
  },
});
