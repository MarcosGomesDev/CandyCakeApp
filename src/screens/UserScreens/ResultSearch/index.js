import React, {useState, useEffect} from 'react';
import { ScrollView, View, StyleSheet, Text, Image, 
ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback,
SafeAreaView} from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ActionFooter, { ActionPrimaryButton } from '../../../components/core/ActionFooter';
import { useNavigation } from '@react-navigation/native'
import {getLocation, storeRange, getRange} from '../../../utils/storage'
import Container from '../../../components/core/Container';
import Colors from '../../../styles/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {api} from '../../../services/api'
import Modal from 'react-native-modal'
import ResultSearchItem from './ResultSearchItem';
import RatingPicker from '../../CommentScreen/RatingPicker';
import {Slider} from '@miblanchard/react-native-slider';

const ResultSearch = ({route}) => {
    const item = route.params
    const navigation = useNavigation()
    const queryClient = useQueryClient()
    const [modalVisible, setModalVisible] = useState(false)
    const [range, setRange] = useState(5)
    const [rating, setRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1,2,3,4,5])
    console.log(item)
    // const {data: local} = useQuery(['local'], getLocation, {
    //     onSuccess: (data) => console.log(data),
    //     retry: 1
    // })

    const {data, isLoading, isError} = useQuery(['search-list'], () => 
        api.searchProducts(item.name, item.latitude, item.longitude, range, rating), {
        onSuccess: (data) => console.log('deu bom'),
        onError: (e) => console.log(e.response.data),
        retry: 3
    })
    
    const {mutate} = useMutation(() => api.searchProducts(item.name, item.latitude, item.longitude, range, rating), {
        onSuccess: () => {
            console.log('chamou api de novo')
            queryClient.removeQueries(['search-list'])
        }
    })

    return (
        <Container>
            <View style={styles.header}>
            <TouchableOpacity
                style={{paddingVertical: 15, paddingHorizontal: 10}} 
                onPress={() => navigation.navigate('Início')}
            >
                <Icon name="arrow-back" size={26} color={Colors.primary} />
            </TouchableOpacity>
            </View>
            
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text style={{color: Colors.primary, fontSize: 16, padding: 10, flex: 1}}>
                        Resultados da busca por {item.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                            justifyContent: 'center',
                            alignItems:'center',
                            width: 50,
                            height: 50,
                        }}
                    >
                        <Icon name="tune" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading && (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
            {data ? data.map((item) => (
                <ResultSearchItem key={item._id} item={item} />
                )) : 
                null
            }
            
            <Modal
                transparent={true}
                isVisible={modalVisible}
                customBackdrop={
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setModalVisible(!modalVisible)
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: "#000"}} />
                    </TouchableWithoutFeedback>
                }
                style={{marginHorizontal: 0, marginBottom: 0}}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={{paddingVertical: 20, alignItems: 'center', borderBottomColor: Colors.primary, 
                    borderBottomWidth: 0.4}}>
                        <Text style={{color: Colors.primary, fontSize: 26, fontWeight: 'bold'}}>
                            Filtros de busca
                        </Text>
                    </View>
                    <View style={{marginVertical: 20, flex: 1, paddingHorizontal: 15}}>
                    <TouchableOpacity
                        onPress={() => {
                            setRating(0)
                            setRange(5)
                            setModalVisible(!modalVisible)
                            mutate()
                        }}
                        style={{
                            alignSelf: 'flex-end'
                        }}
                    >
                        <Text style={{color: Colors.primary}}>Restaurar padrões</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text style={{color: Colors.primary, alignSelf: 'center', fontSize: 30, marginTop: 25}}>
                            Distância
                        </Text>
                        <Text style={{color: Colors.primary, alignSelf: 'center', fontSize: 30, marginTop: 20}}>{range} km</Text>
                        <View style={{
                            flexDirection: 'row',
                            marginBottom: 10,
                            marginTop: 30,
                            paddingHorizontal: 10
                        }}>
                            <Text style={{color: Colors.primary, flex: 1}}>1 km</Text>
                            <Text style={{color: Colors.primary, alignSelf: 'flex-end'}}>50 km</Text>
                        </View>
                        <Slider
                            containerStyle={{
                                width: '90%',
                                alignSelf: 'center',
                                marginBottom: 30,
                            }}
                            value={range}
                            minimumValue={1}
                            maximumValue={50}
                            trackClickable={true}
                            maximumTrackTintColor="#a9a9a9"
                            minimumTrackTintColor={Colors.tertiary}
                            thumbTintColor={Colors.tertiary}
                            thumbStyle={{
                                width: 25,
                                height: 25,
                                borderRadius: 150
                            }}
                            step={1}
                            onSlidingComplete={(value) => setRange(value)}
                        />
                        
                        <Text style={{color: Colors.primary, alignSelf: 'center', fontSize: 30, marginTop: 20, marginBottom: 20}}>
                            Avaliação
                        </Text>
                        
                        <View style={{alignItems: 'center'}}>
                            <RatingPicker
                                defaultRating={rating}
                                onChangeRating={setRating}
                                maxRating={maxRating}
                                width={30}
                                height={30}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(!modalVisible)
                            mutate()
                        }}
                        style={{
                            width: '90%',
                            height: 60,
                            backgroundColor: Colors.primary,
                            alignSelf: 'center',
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{color: Colors.white, fontSize: 18, fontWeight: 'bold'}}>Aplicar filtros</Text>
                    </TouchableOpacity>
                    </View>
                    <ActionFooter
                        pdv={20}
                        btw={0.3}
                        btc={Colors.primary}
                    >
                        <ActionPrimaryButton title="Cancelar" 
                            onPress={() => {
                                setModalVisible(!modalVisible)
                            }}
                        />
                    </ActionFooter>
                </SafeAreaView>
            </Modal>
        </Container>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.6,
        zIndex: 10,
        elevation: 10,
    },
    container: {
        width: '100%',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 60,
        marginHorizontal: 0,
        paddingHorizontal: 0
    },
});

export default ResultSearch;