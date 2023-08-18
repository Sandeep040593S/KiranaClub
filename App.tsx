import React, {useEffect, useState} from 'react';

import SplashScreenComponent from './src/screens/SplashScreen';
import KiranaNewsList from './src/screens/kiranaNewsList';
import {StyleSheet, View} from 'react-native';

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true);
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      {appReady ? <KiranaNewsList /> : <SplashScreenComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
