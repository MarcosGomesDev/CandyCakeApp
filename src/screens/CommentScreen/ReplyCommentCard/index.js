import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Colors from '../../../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useLogin } from '../../../context/LoginProvider';

const ReplyCommentCard = ({data, onPress}) => {
    const {profile} = useLogin()
    const [height, setHeight] = useState(57);
    const avatar = 'https://res.cloudinary.com/gomesdev/image/upload/v1649718658/avatar_ip9qyt.png'
    
    return (
        <>
        <View style={[styles.replyContainer, {height: height}]}>
            <View style={{borderRadius: 150, paddingRight: 15}}>
                <Image source={{uri: data.sellerId?.avatar ?? avatar}} 
                style={{width: 40, height: 40, borderRadius: 200, borderColor: Colors.primary, borderWidth: 0.8}}
                />
            </View>
            <Text style={{width: '70%'}}>
            <Text style={{color: Colors.primary, fontWeight: 'bold'}}>{data.sellerName}  </Text>
            <Text style={{color: Colors.primary}} numberOfLines={2}>{data.replyReview}</Text>
            </Text>
            {profile._id === data.sellerId?._id && (
                <TouchableOpacity
                    onPress={onPress}
                    style={{alignItems: 'center', justifyContent: 'center'}}
                >
                    <Icon name="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
            )}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    replyContainer: {
        width: '80%',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 10,
        flexDirection: 'row'
    }
})

export default ReplyCommentCard;