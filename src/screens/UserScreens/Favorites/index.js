/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {DrawerActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import {showToast} from '../../../store/modules/toast/actions';

import {useLogin} from '../../../context/LoginProvider';
import useFavoritesList from '../../../hooks/useFavoritesList';
import {api} from '../../../services/api';
import Container from '../../../components/core/Container';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../styles/Colors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Favorites = props => {
  const dispatch = useDispatch();
  const {setIsLoggedIn, profile} = useLogin();
  const navigation = useNavigation();
  const favorites = useFavoritesList()
  const queryClient = useQueryClient()

  

  const {mutate: removeToFavorites} = useMutation((id) => api.removeFavorites(id, profile.token), {
    onSuccess: (data) => {
      dispatch(showToast(data, 'success', 'done'))
      queryClient.invalidateQueries(['favorites-list'])
    },
    onError: (error) => {
      const status = error.request.status
      const messageError = error.response.data
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
          style={{
            width: 50,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() =>
            props.navigation.dispatch(DrawerActions.toggleDrawer())
          }>
          <Icon name="menu" size={30} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Favoritos</Text>
      </View>
      {!favorites ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            style={styles.load}
            size="large"
            color={Colors.primary}
          />
        </View>
      ) : (
        <ScrollView style={styles.productContainer}>
          <View style={styles.marginContainer}>
            {favorites.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.productBtn}
                onPress={() => {
                  navigation.navigate('ProductItem', item);
                }}>
                <View style={styles.productItem}>
                  <Image
                    style={styles.imgProduct}
                    source={{uri: item.images[0]}}
                  />
                  <View style={styles.descriptions}>
                    <Text numberOfLines={1} style={styles.productName}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.productName,
                        {fontSize: 14, marginBottom: 5},
                      ]}>
                      {item.seller.name}
                    </Text>
                    <Text style={styles.productPrice}>
                      R$ {item.price.toString().replace('.', ',')}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeToFavorites(item._id)}>
                    <Icon name="close" size={26} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.6,
    elevation: 10,
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    width: '80%',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  productContainer: {
    marginHorizontal: 10,
  },
  marginContainer: {
    marginTop: 10,
  },
  productBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgProduct: {
    width: '40%',
    height: 120,
    borderRadius: 10,
  },
  descriptions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  productName: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Favorites;
