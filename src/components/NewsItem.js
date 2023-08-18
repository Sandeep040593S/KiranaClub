import React, {useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';

const NewsItem = ({
  article,
  index,
  handleSwipeRightToDelete,
  handleSwipeLeftToPin,
}) => {
  const swipeableRef = useRef(null);

  const onRightSwipe = () => {
    return (
      <TouchableOpacity
        style={styles.delete}
        onPress={() => {
          handleSwipeRightToDelete(index);
          closeSwipeable();
        }}>
        <View>
          <Text>Delete</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const onLeftSwipe = () => {
    return (
      <TouchableOpacity
        style={styles.pin}
        onPress={() => {
          handleSwipeLeftToPin(index);
          closeSwipeable();
        }}>
        <View>
          <Text>Pin</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const closeSwipeable = () => {
    swipeableRef.current.close();
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={onRightSwipe}
        renderLeftActions={onLeftSwipe}>
        <View style={styles.container}>
          <View style={styles.roundedView}>
            <View style={styles.imgcontainer}>
              {article?.urlToImage !== null ? (
                <Image
                  source={{uri: article?.urlToImage}}
                  style={styles.img}
                  resizeMethod="auto"
                />
              ) : null}
            </View>
            <Text style={styles.text}>{article?.title}</Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgcontainer: {
    paddingRight: 5,
  },
  img: {
    width: 50,
    height: 50,
  },
  text: {
    color: '#a0a0a0',
    fontSize: 14,
    margin: '13px',
    color: '#b4331b',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },

  roundedView: {
    flexDirection: 'row',
    width: '90%',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  pin: {
    width: '20%',
    backgroundColor: 'yellow',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  delete: {
    width: '20%',
    backgroundColor: 'red',
    margin: 10,
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default NewsItem;
