import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {api} from '../../services/api'
import ProductListItem from '../../components/ProductList/ProductListItem';
import Container from '../../components/core/Container';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../styles/Colors';
import {useLogin} from '../../context/LoginProvider'
import { useQuery } from '@tanstack/react-query';
import { removeData } from '../../utils/storage';

const Seller = ({ route }) => {
    const id = route.params
    const navigation = useNavigation()
    const {profile, setIsLoggedIn} = useLogin()
    const {data, isLoading} = useQuery(['seller-products'], () => api.getProducts(id, profile.token), {
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
                    onPress={navigation.goBack}
                >
                    <Icon name="arrow-back" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {data ? data[0].seller.name : null}
                </Text>
                <TouchableOpacity>
                    <Icon name="shopping-bag" size={34} color={Colors.white} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{
                        alignSelf: 'flex-end',
                        justifyContent: 'center',
                        alignItems:'center',
                        width: 50,
                        height: 50,
                    }}
                >
                    <Icon name="tune" size={24} color={Colors.primary} />
                </TouchableOpacity>
                {data ? (
                    <View style={styles.containerProducts}>
                    {data.map((item) => (
                        <ProductListItem
                            data={item}
                            key={item._id}
                            onPress={() => navigation.navigate('ProductItem', item._id)}
                        />
                    ))}
                </View>
                ): null}
                
                {isLoading && (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                )}
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.6,
        elevation: 10,
        zIndex: 10,
        width: '100%',
        paddingHorizontal: 10
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        color: Colors.primary,
        marginTop: 3,
    },
    btnHeader: {
        marginTop: 2,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerProducts: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
});

export default Seller;