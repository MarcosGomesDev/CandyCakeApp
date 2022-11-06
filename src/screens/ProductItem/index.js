import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../store/modules/toast/actions';
import {useDispatch} from 'react-redux';
import {useLogin} from '../../context/LoginProvider';
import {api} from '../../services/api';
import Container from '../../components/core/Container';
import CarrousselImages from './CarrousselImages';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../styles/Colors';
import RatingProduct from './RatingProduct';
import useFavoritesList from '../../hooks/useFavoritesList';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { removeData } from '../../utils/storage';

const ProductItem = ({route}) => {
  const id = route.params;
  const {profile, setIsLoggedIn} = useLogin();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favorites = useFavoritesList()
  const queryClient = useQueryClient()

  const valid = profile.seller === false && favorites?.map(({_id}) => _id).includes(id)

  // RETORNA OS DADOS DO PRODUTO
    const {data: product, isLoading, isError} = useQuery(['product'], () => api.getProduct(id), {
      onSuccess: () => console.log('deu certo'),
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

  // ADICIONA O PRODUTO A LISTA DE FAVORITOS
  const {mutate: addToFavorites} = useMutation(() => api.addFavorites(id, profile.token),
    {
      onSuccess: (data) => {
        dispatch(showToast(data, 'success', 'done'))
        queryClient.invalidateQueries(["favorites-list"])
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
    }
  )

  // REMOVE O PRODUTO A LISTA DE FAVORITOS
  const {mutate: removeToFavorites} = useMutation(() => api.removeFavorites(id, profile.token),
    {
      onSuccess: (data) => {
        console.log(data)
        dispatch(showToast(data, 'success', 'done'))
        queryClient.invalidateQueries(["favorites-list"])
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
    }
  )

  return (
    <Container color={'#fff'}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnHeader}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Produto</Text>
        {profile.seller === false ? (
          <TouchableOpacity
            onPress={() => {valid ? removeToFavorites() : addToFavorites()}}
            style={styles.btnHeader}>
            <Icon
              name={valid ? 'favorite' : 'favorite-outline'}
              size={34}
              color={Colors.primary}
            />
          </TouchableOpacity>
        ) : <View style={styles.btnHeader}></View>}
      </View>
      {isLoading && (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      {product && (
        <ScrollView showsVerticalScrollIndicator={false}>
        
          <>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratings}>
              <RatingProduct rating={product.ratingAverage} />
              <Text style={{fontSize: 14, paddingLeft: 8, color: Colors.grey}}>
                ({product.rating?.length}) avaliações
              </Text>
            </View>
            <CarrousselImages data={product.images} />
            <Text
              style={[
                styles.price,
                {marginTop: product.images?.length === 1 ? 20 : 0},
              ]}>
              R$ {product.price}
            </Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.titleDescription}>Descrição</Text>
              <Text numberOfLines={3} style={styles.description}>
                {product.description}
              </Text>
            </View>
            {profile.seller === false && (
              <View style={styles.vendorContainer}>
                <Text style={{fontSize: 16, color: Colors.gray, fontWeight: '500'}}>
                  Vendido por
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SellerStore', product.seller._id)}>
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 16,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}> {product.seller.name}</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>Comentários</Text>
              {product.rating?.slice(0, 2).map((item, index) => (
                <View key={index} style={{paddingLeft: 15, flexDirection: 'row', marginBottom: 10}}>
                <Text
                  style={{color: Colors.primary, fontWeight: 'bold', paddingRight: 10, fontSize: 16}}>
                  {item.userName}
                </Text>
                <Text style={{color: Colors.primary, fontSize: 16}}>
                  {item.productReview}
                </Text>
              </View>
              ))}
              {product.rating?.length > 0 && (
                <TouchableOpacity
                  style={{marginBottom: 10}}
                  onPress={() => {navigation.navigate('CommentScreen', product._id)}}
                >
                  <Text style={{color: Colors.primary}}>Ver todos os comentários</Text>
                </TouchableOpacity>
              )}

              <View
                style={{
                  marginVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.sendCommentBtn}
                  onPress={() => navigation.navigate('CommentScreen', product._id)}
                >
                  <Text
                    style={styles.sendCommentBtnText}
                  >
                    Avaliar produto
                  </Text>
                </TouchableOpacity>
                {profile.seller === false && <TouchableOpacity
                  style={[styles.sendCommentBtn, {marginTop: 30, backgroundColor: Colors.green, flexDirection: 'row'}]}
                  // onPress={() => navigation.navigate('CommentScreen', product._id)}
                >
                  <Icon2 name="whatsapp"size={24} color={Colors.white} style={{paddingRight: 10}} />
                  <Text
                    style={styles.sendCommentBtnText}
                  >
                    Fale com o vendedor
                  </Text>
                </TouchableOpacity>}
              </View>
            </View>
          </>
        </ScrollView>
      )}
      {isError && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Erro ao mostrar este produto!</Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              width: '90%',
              height: 55
            }}
          >
            <Text>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    elevation: 10,
    zIndex: 10,
  },
  btnHeader: {
    marginTop: 2,
    width: '12.5%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.primary,
    marginTop: 3,
    flex: 1
  },
  price: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  productName: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    paddingVertical: 10,
    paddingLeft: 20,
  },
  ratings: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: -5,
    marginBottom: 10,
  },
  detailsContainer: {
    paddingLeft: 20,
    paddingRight: 15,
    marginTop: 10,
  },
  titleDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.primary,
  },
  description: {
    color: Colors.grey,
    fontSize: 16,
    textAlign: 'auto',
  },
  vendorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  commentsContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  commentsTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 30,
    marginBottom: 20,
    color: Colors.primary,
  },
  sendCommentBtn: {
    width: '90%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCommentBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductItem;
