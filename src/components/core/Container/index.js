import React from 'react';
import {SafeAreaView, StatusBar, Platform, StyleSheet, Dimensions} from 'react-native';
import Toast from '../../Toast';

const width = Dimensions.get('window').width

const Container = ({children, color}) => {
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color}]}>
      <Toast />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    elevation: 1,
    zIndex: 1,
    width: width
  },
});

export default Container;
