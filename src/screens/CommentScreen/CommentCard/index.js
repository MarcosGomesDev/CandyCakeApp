import React, {useState} from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { useLogin } from '../../../context/LoginProvider';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../../styles/Colors';
import ReplyCommentCard from '../ReplyCommentCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

const commentCard = ({data, replyComment, onRemoveComment}) => {
    const [maxRating, setMaxRating] = useState([1,2,3,4,5])
    const rating = data.productRating
    const avatar = 'https://res.cloudinary.com/gomesdev/image/upload/v1649718658/avatar_ip9qyt.png'
    const {profile} = useLogin()
    const queryClient = useQueryClient()
    const emptyStar = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'
    const fullStar = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    
    const {mutate} = useMutation(() => api.deleteReplyComment(data._id, profile.token), {
        onSuccess: () => {
            console.log('excluiu')
            queryClient.invalidateQueries(['comment-list'])
            queryClient.invalidateQueries(['product'])
        }
    })

    return (
        <>
        <View style={styles.commentContainer}>
            <View style={styles.commentContent}>
                <View style={{flexDirection: 'row', width: '90%', marginRight: 20, marginBottom: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <View style={{borderRadius: 150, paddingRight: 15}}>
                            <Image source={{uri: data.userId?.avatar ?? avatar}} 
                            style={{width: 40, height: 40, borderRadius: 200, borderColor: Colors.primary, borderWidth: 0.8}}
                            />
                        </View>
                        <View>
                            <View 
                                style={{flexDirection: 'row', marginRight: 20, marginBottom: 5}}
                            >
                                {maxRating.map((item, key) => {
                                    return (
                                        <Image
                                            key={item}
                                            source={
                                                item <= rating
                                                ? {uri: fullStar}
                                                : {uri: emptyStar}
                                            }
                                            style={styles.star} 
                                        />
                                    )
                                })}
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.userName}>
                                    {data.userName}
                                </Text>
                                <Text style={{color: Colors.primary, fontSize: 15}}>
                                    {data.productReview}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {profile._id === data.userId._id && (
                        <TouchableOpacity
                            onPress={onRemoveComment}
                            style={{alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Icon name="close" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
                {profile.seller === true && (
                    <TouchableOpacity
                        style={styles.replyBtn}
                        onPress={replyComment}
                    >
                        <Text style={styles.replyBtnText}>Responder</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
        {data.replyRating ? data.replyRating.map((item) => {
            return (
                <ReplyCommentCard
                    key={item}
                    data={item}
                    onPress={() => mutate()}
                />
            )
        }): null}
        </>
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        height: 80,
        width: '100%',
    },
    commentContent: {
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    star: {
        width: 18,
        height: 18,
        resizeMode: 'cover',
        marginHorizontal: 1,
    },
    userName: {
        fontWeight: 'bold',
        color: Colors.primary,
        fontSize: 16,
        paddingRight: 10
    },
    replyBtn: {
        height: 20,
        width: 60
},
    replyBtnText: {
        color: Colors.grey,
        fontSize: 12
    },
})

export default commentCard;