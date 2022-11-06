import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import {showToast} from '../../../store/modules/toast/actions';
import {useLogin} from '../../../context/LoginProvider';
import {removeData} from '../../../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {URL} from '@env'
import Container from '../../../components/core/Container';
import Form from '../../../components/FormProduct';
import Colors from '../../../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

const EditProduct = ({route}) => {
    const item = route.params
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const navigation = useNavigation()
    const {profile, setIsLoggedIn} = useLogin()

    const {mutate, isLoading} = useMutation((product) => api.editProduct(product, profile.token), {
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
        <Container color='#fff'>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{zIndex: 10, backgroundColor: 'red', height: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10}}
                    onPress={navigation.goBack}
                >
                    <Icon name="arrow-back"
                        size={26}
                        color={Colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>
                    Editar Produto
                </Text>
            </View>
            <Form
                productData={item}
                titleBtn={isLoading ? (
                    <ActivityIndicator 
                        size={24}
                        color={Colors.white}
                    />) : 'Salvar'}
                handleSubmit={(product) => mutate(product)}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
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
        width: '80%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});

export default EditProduct;