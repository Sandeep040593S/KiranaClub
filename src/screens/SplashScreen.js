import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="center"
        source={require('../public/assets/img/kiranaLogo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SplashScreenComponent;
