import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useLogin} from '../../../../context/LoginProvider';
import useFavoritesList from '../../../../hooks/useFavoritesList';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../../../styles/Colors';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../services/api';
import { showToast } from '../../../../store/modules/toast/actions';
import { useDispatch } from 'react-redux';
import { removeData } from '../../../../utils/storage';

const ResultSearchItem = ({item}) => {
    const navigation = useNavigation()
    const {profile, setIsLoggedIn} = useLogin();
    const favorites = useFavoritesList()
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    const valid = profile.seller === false && favorites?.map(({_id}) => _id).includes(item._id)

    // ADICIONA O PRODUTO A LISTA DE FAVORITOS
    const {mutate: addToFavorites} = useMutation(() => api.addFavorites(item._id, profile.token),
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
    })

    // REMOVE O PRODUTO A LISTA DE FAVORITOS
    const {mutate: removeToFavorites} = useMutation(() => api.removeFavorites(item._id, profile.token),
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
        useDispatch(showToast(messageError, 'error', 'error'))
        removeData();
        setIsLoggedIn(false);
        }
    }
    }
    )

    return (
        <TouchableOpacity
            data={item}
            style={styles.productContainer}
            onPress={() => navigation.navigate('ProductItem', item._id)}
        >
            <View style={styles.product}>
                <Image style={styles.imgProduct} source={{uri: item.images[0]}} />
                <View style={{flexDirection: 'column', flex: 1}}>
                    <Text style={styles.category}>{item.name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 5}}>
                        {item.ratingAverage > 0 && <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 5}}>
                            <Icon name="star" size={20} color={'#db9200'} />
                            <Text style={{fontSize: 16, color: '#db9200', marginHorizontal: 3}}>{item.ratingAverage}</Text>
                        </View>}
                        <Text style={{marginHorizontal: 5, fontSize: 14}}>{item.seller.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name="place" size={17} color={Colors.primary} />
                            <Text style={[styles.category, {
                                paddingLeft: 0, fontWeight: '400', color: Colors.grey, fontSize: 15}
                            ]}>
                                {item.distance} km
                            </Text>
                        </View>
                    </View>
                </View>
                    <Text style={styles.productPrice}>R$ {item.price}</Text>
                    <TouchableOpacity 
                        style={styles.addFav}
                        onPress={() => valid ? removeToFavorites() : addToFavorites()}
                    >
                        <Icon name={valid ? "favorite" : "favorite-outline"} size={24} color={Colors.primary} />
                    </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  productContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 10
  },
  product: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
  },
  imgProduct: {
      width: 70,
      height: 70,
      borderRadius: 160,
  },
  category: {
      color: Colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
      paddingLeft: 10
  },
  productName: {
      width: 170,
      paddingTop: 5,
      paddingLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
  },
  productPrice: {
      textAlign: 'center',
      marginRight: 20,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primary,
      
  },
  addFav: {
      width: 40,
      height: 40,
      borderRadius: 150,
      backgroundColor: '#efefef',
      justifyContent: 'center', 
      alignItems: 'center',
  },
})

export default ResultSearchItem;