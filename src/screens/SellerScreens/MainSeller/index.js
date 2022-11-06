/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {removeData} from '../../../utils/storage';
import {showToast} from '../../../store/modules/toast/actions';
import {useDispatch} from 'react-redux';
import {useLogin} from '../../../context/LoginProvider';

import {api} from '../../../services/api';

import Container from '../../../components/core/Container';
import Item from './Item';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../styles/Colors';
import { useQuery } from '@tanstack/react-query';

const Products = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {profile, setIsLoggedIn} = useLogin();

  const {data, isLoading} = useQuery(['products-list'], () => api.getAllProductsSeller(profile.token), {
    onError: (error) => {
      const status = error.request.status
      const messageError = error.response.data
      console.log(messageError)
      if(status === 413) {
        dispatch(showToast(messageError, 'error', 'error'))
        removeData();
        setIsLoggedIn(false);
      }
    }
  })

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnHeader}
          onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Icon name="menu" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>
            Meus produtos
        </Text>
        <TouchableOpacity
          style={[styles.btnHeader, {transform: [{scale: 0}]}]}
          onPress={() => {}}
        >
          <Icon name="notifications" size={26} color={Colors.primary} />
        </TouchableOpacity>
    </View>
    <View style={styles.addContainer}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('NewProduct')}>
        <Icon name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            style={styles.load}
            size="large"
            color={Colors.primary}
          />
        </View>
      )}
      <ScrollView>
          { data ? (
            <View style={styles.marginContainer}>
              {data.map((item, index) => (
                <Item key={index} item={item} />
              ))}
            </View>
          )
        : null}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    elevation: 10,
    zIndex: 10,
    width: '100%',
  },
  title: {
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
      color: Colors.primary
  },
  btnHeader: {
      width: '12.5%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
  },
  addContainer: {
    margin: 10,
    zIndex: 1,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  addBtn: {
    height: 50,
    width: 50,
    borderRadius: 150,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.7,
    elevation: 5,
  },
  load: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  marginContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 5,
  },
});

export default Products;
