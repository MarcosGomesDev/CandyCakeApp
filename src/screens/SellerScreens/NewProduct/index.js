/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Container from '../../../components/core/Container';

import Colors from '../../../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Form from '../../../components/FormProduct';
import {useLogin} from '../../../context/LoginProvider';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../store/modules/toast/actions';
import {removeData} from '../../../utils/storage';
import {useDispatch} from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

const NewProduct = () => {
  const {profile, setIsLoggedIn} = useLogin();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation((product) => api.addProduct(product, profile.token), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products-list'])
      dispatch(showToast(data, 'success', 'done'))
      navigation.goBack()
    },
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
    <Container color="#fff">
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            zIndex: 20,
            borderRadius: 150,
            justifyContent: 'center',
          }}
          onPress={navigation.goBack}>
          <Icon name="arrow-back" size={25} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Produto</Text>
      </View>
      <Form
        handleSubmit={(product) => mutate(product)}
        titleBtn={
          isLoading ? (
            <ActivityIndicator size={24} color={Colors.white} />
          ) : (
            'Criar produto'
          )
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    elevation: 10,
    zIndex: 10,
    marginBottom: 5,
  },
  title: {
    width: '70%',
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 10,
    paddingBottom: 20,
  },
  btn: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewProduct;
