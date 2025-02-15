import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EducationSlide from '$features/education/ui/EducationSlide';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Scan & Identify Medications',
    description: 'Snap a photo to let our AI instantly recognize your medication and save you time.',
    imageSrc: require('../../../assets/education_1.png'),
  },
  {
    key: '2',
    title: 'Organize Your Prescriptions',
    description: 'Build a personal medication list for quick reference and effortless management.',
    imageSrc: require('../../../assets/education_1.png'),
  },
  {
    key: '3',
    title: 'Check Interactions & Stay Safe',
    description: 'AI examines your medications to help prevent dangerous interactions.',
    imageSrc: require('../../../assets/education_1.png'),
  },
];


export default function EducationSlider({ onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxWidth, setBoxWidth] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onDone && onDone();
    }
  };

  const skip = () => {
    onDone && onDone();
    console.log('skip')
  };

  const renderItem = ({ item }) => <EducationSlide item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setBoxWidth(width);
        }}
        style={[styles.nextButton, boxWidth ? { transform: [{ translateX: -boxWidth / 2 }] } : {}]}
        onPress={goNext}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>

      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index.toString()}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={skip}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#2563EB',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  nextButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 'auto',
    left: '50%',
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 35,
    position: 'absolute',
    bottom: 120,
    marginVertical: 0,
  },
  nextButtonText: {
    color: '#fff',
    width: 'auto',
    fontWeight: 800,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});
