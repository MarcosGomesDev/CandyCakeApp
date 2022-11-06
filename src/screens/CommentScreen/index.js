import React, {useRef, useState, useEffect} from 'react';
import {Text, ScrollView, View, StyleSheet, TouchableOpacity,
ActivityIndicator, Keyboard} from 'react-native';
import Container from '../../components/core/Container';
import Colors from '../../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showToast} from '../../store/modules/toast/actions';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import { useLogin } from '../../context/LoginProvider';
import CommentCard from './CommentCard';
import RatingPicker from './RatingPicker';
import FooterInput from './FooterInput';
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

const ModalComment = ({route}) => {
  const id = route.params
  const {profile} = useLogin()
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [showReply, setShowReply] = useState(false)
  const [rating, setRating] = useState(1)
  const [maxRating, setMaxRating] = useState([1,2,3,4,5])
  const [replyTo, setReplyTo] = useState('')
  const [comment, setComment] = useState('')
  const [idComment, setIdComment] = useState('')

  console.log(idComment)

  const {data, isLoading, isError} = useQuery(['comment-list'], () => api.getAllCommments(id), {
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

  const {mutate: deleteComment} = useMutation(() => api.removeComment(id, profile.token), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['comment-list'])
      queryClient.invalidateQueries(['product'])
      dispatch(showToast(data, 'success', 'done'))
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

  const {mutate: addComent} = useMutation(() => api.addComment(id, profile.token, comment, rating), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['comment-list'])
      queryClient.invalidateQueries(['product'])
      setComment('')
      setRating(1)
      Keyboard.dismiss()
      dispatch(showToast(data, 'success', 'done'))
    },
    onError: (e) => console.log(e.response.data)
  })

  const {mutate: addReplyComment} = useMutation(() => api.addReplyComment(idComment, profile.token, comment), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['comment-list'])
      setComment('')
      setShowReply(false)
      setRating(1)
      Keyboard.dismiss()
      dispatch(showToast(data, 'success', 'done'))
    }
  })

  const reply = async (id, name) => {
    setShowReply(true)
    setIdComment(id)
    setReplyTo(name)
  }

  const cancelReplyComment = () => {
    setShowReply(false)
    setReplyTo('')
  }

  return (
    <Container color={'#fff'}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={navigation.goBack}>
            <Icon name="arrow-back" size={30} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Comentários</Text>
        </View>

        {isLoading && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        <ScrollView style={{flex: 1}}>
          {data ? data.map((comment) => {
            return (
              <CommentCard
                key={comment}
                data={comment}
                replyComment={() => reply(comment._id, comment.userName)}
                onRemoveComment={() => deleteComment()}
              />
            )}): null}
        </ScrollView>

        {showReply && (
            <View style={[styles.footer, {height: 50, alignItems: 'center', paddingHorizontal: 15}]}>
                <Text style={{fontSize: 15, flex: 1, color: Colors.white}}>
                    Respondendo a 
                    <Text style={{fontWeight: 'bold', fontSize: 17}}> {replyTo}</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => cancelReplyComment()}
                >
                    <Icon size={24} color={Colors.white} name="close" />
                </TouchableOpacity>
            </View>
        )}

        {profile.seller === false && (
          <View style={styles.containerRating}>
          <Text style={styles.ratingTitle}>Nota:</Text>
          <RatingPicker
            defaultRating={rating}
            onChangeRating={setRating}
            maxRating={maxRating}
            width={24}
            height={24}
          />
          </View>
        )}

        <FooterInput
          image={profile.avatar}
          value={comment}
          onChangeText={setComment}
          onPress={() => {showReply ? addReplyComment() : addComent()}}
        />
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
  backBtn: {
    marginTop: 2,
    width: '12.5%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    marginTop: 3,
  },
  containerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: Colors.primary
  },
  ratingTitle: {
    color: Colors.white,
    fontSize: 16,
    width: '30%',
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.primary,
},
})

export default ModalComment;
