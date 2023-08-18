/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {fetchHeadlines} from '../services/api/fetchHeadlines';
import NewsItem from '../components/NewsItem';
import {
  getHeadlinesFromStorage,
  saveHeadlinesToStorage,
} from '../utils/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KiranaNewsList = () => {
  const [headlines, setHeadlines] = useState([]);
  const [visibleHeadlines, setVisibleHeadlines] = useState(
    headlines.slice(0, 10),
  );
  const [loading, setLoading] = useState(true);
  const dripTimer = useRef(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);

  useEffect(() => {
    //Fetch headlines from server
    fetchAndDisplayHeadlines();
  }, []);

  useEffect(() => {
    //Fetch next 5 new headlines from local storage every 10sec
    startDripTimer();
    return () => {
      clearTimeout(dripTimer.current);
    };
  }, [batchIndex]);

  useEffect(() => {
    // Load pinned headlines from storage on app load
    const loadPinnedHeadlines = async () => {
      try {
        const pinnedHeadlinesString = await AsyncStorage.getItem(
          'pinnedHeadlines',
        );

        if (pinnedHeadlinesString) {
          setPinnedHeadlines(JSON.parse(pinnedHeadlinesString));
        }
      } catch (error) {
        console.error('Error loading pinned headlines:', error);
      }
    };

    loadPinnedHeadlines();
  }, []);

  const startDripTimer = () => {
    dripTimer.current = setTimeout(() => {
      if (headlines.length === 0) {
        fetchNext100Headlines();
      } else {
        addRandomHeadlinesToTop();
      }
      startDripTimer();
    }, 10000); // Every 10 seconds
  };

  //function to get next5RandomElement to display
  function removeRandomElements(array, count) {
    const removedElements = [];

    while (count > 0 && array.length > 0) {
      const randomIndex = Math.floor(Math.random() * array.length);
      const removedElement = array.splice(randomIndex, 1)[0];
      removedElements.push(removedElement);
      count--;
    }

    return removedElements;
  }

  const addRandomHeadlinesToTop = async () => {
    // Create a copy of the current visible headlines
    const newHeadlines = removeRandomElements(headlines, 5);
    await saveHeadlinesToStorage(headlines);
    setVisibleHeadlines(newHeadlines);
  };

  const fetchNext100Headlines = async () => {
    //O
    const newBatchIndex = batchIndex + 1;
    setBatchIndex(newBatchIndex);
    const fetchedHeadlines = await fetchHeadlines();
    setHeadlines(fetchedHeadlines);
    await saveHeadlinesToStorage(fetchedHeadlines);
    setVisibleHeadlines(fetchedHeadlines.slice(0, 10));
  };

  const fetchAndDisplayHeadlines = async () => {
    try {
      setLoading(true);
      const storedHeadlines = await getHeadlinesFromStorage();
      if (storedHeadlines.length === 0) {
        const fetchedHeadlines = await fetchHeadlines();
        setHeadlines(fetchedHeadlines);
        await saveHeadlinesToStorage(fetchedHeadlines);

        setLoading(false);
        setVisibleHeadlines(fetchedHeadlines.slice(0, 10));
      } else {
        setLoading(false);
        setHeadlines(storedHeadlines);
        setVisibleHeadlines(storedHeadlines.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching and displaying headlines:', error);
    }
  };

  const handleSwipetoDelete = index => {
    const newHeadlines = [...visibleHeadlines];
    if (pinnedHeadlines.length > 0) {
      newHeadlines.splice(index - pinnedHeadlines.length, 1);
    } else {
      newHeadlines.splice(index, 1);
    }

    setVisibleHeadlines(newHeadlines);
  };

  const handleSwipeToPin = index => {
    const newHeadlines = [...visibleHeadlines];
    let swipedHeadline;
    if (pinnedHeadlines.length > 0) {
      swipedHeadline = newHeadlines.splice(
        index - pinnedHeadlines.length,
        1,
      )[0];
    } else {
      swipedHeadline = newHeadlines.splice(index, 1)[0];
    }
    // Assuming swiping to the left is for pinning
    setPinnedHeadlines([swipedHeadline, ...pinnedHeadlines]);

    setVisibleHeadlines(newHeadlines);
  };

  const fetchNextBatch = () => {
    // Manually fetch next batch of headlines from local storage
    if (headlines !== 0) {
      const startIndex = batchIndex * 5;
      const endIndex = startIndex + 5;
      const newVisibleHeadlines = headlines.slice(startIndex, endIndex);

      // Update state and reset drip timer
      setVisibleHeadlines(newVisibleHeadlines);
      setBatchIndex(batchIndex + 1); // Move to the next batch
      clearTimeout(dripTimer.current);
      startDripTimer();
    } else {
      fetchNext100Headlines();
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>Kirana Club Headlines</Text>
          <FlatList
            data={[...pinnedHeadlines, ...visibleHeadlines]}
            renderItem={({item, index}) => (
              <NewsItem
                article={item}
                index={index}
                handleSwipeRightToDelete={handleSwipetoDelete}
                handleSwipeLeftToPin={handleSwipeToPin}
              />
            )}
            keyExtractor={(_item, index) => index}
          />
          <View style={styles.roundedView}>
            <TouchableOpacity style={styles.addbutton} onPress={fetchNextBatch}>
              <Text style={styles.addbuttonText}>Next Batch</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    size: 'large',
    color: '#b4331b',
  },
  text: {
    marginBottom: 10,
    fontSize: 24,
    textAlign: 'left',
    color: '#b4331b',
    fontWeight: 'bold',
    paddingHorizontal: 0,
  },
  roundedView: {
    flexDirection: 'row',

    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  addbutton: {
    backgroundColor: '#b4331b',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addbuttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default KiranaNewsList;
