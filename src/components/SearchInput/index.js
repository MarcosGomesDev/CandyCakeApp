
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../styles/Colors'

// create a component
const SearchInput = () => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Buscar')}
            style={styles.container}
        >
            <Icon style={styles.searchIcon} name="search" size={22} color={Colors.primary} />
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        width: 40,
    },
    searchIcon: {
        fontWeight: 'bold',
    },
});


export default SearchInput;
