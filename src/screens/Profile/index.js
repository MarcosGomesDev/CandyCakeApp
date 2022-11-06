/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {showToast} from '../../store/modules/toast/actions';
import {useDispatch} from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';

import Container from '../../components/core/Container';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../styles/Colors';
import {useLogin} from '../../context/LoginProvider';
import {storeData, removeData} from '../../utils/storage';
import {URL} from '@env';

const Profile = props => {
  const dispatch = useDispatch();
  const avatarDefault = 'https://res.cloudinary.com/gomesdev/image/upload/v1649718658/avatar_ip9qyt.png'
  const {setIsLoggedIn, setProfile, profile} = useLogin();
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile.name)
  const [lastname, setLastname] = useState(profile.lastname)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.socialmedias)
  const [facebook, setFacebook] = useState(profile.socialmedias)
  const [instagram, setInstagram] = useState(profile.socialmedias)
  
  const options = {
    selectionLimit: 1,
    mediaType: 'photo',
  };

  const handleImageUser = async () => {
    const data = await ImagePicker.launchImageLibrary(options);
    if (data.didCancel) {
      return;
    }
    if (data.error) {
      return;
    }
    if (!data.assets[0].uri) {
      return;
    }

    const image = data.assets[0];
    setAvatar(image);
  };

  const uploadImage = async () => {
    setLoading(true);
    const data = new FormData();

    data.append('avatar', {
      name: new Date() + '_avatar',
      uri: avatar.uri,
      type: avatar.type,
    });

    const response = await fetch(`${URL}/user/upload-profile`, {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        authorization: `Bearer ${profile.token}`,
      },
      body: data,
    }).catch(err => console.log(err));

    const res = await response.json();

    if (response.status === 201) {
      setLoading(false);
      const userInfo = {...profile, avatar: res.avatar};
      await storeData(userInfo);
      setProfile(userInfo);
      setModalVisible(false);
      setAvatar([]);
      dispatch(showToast(res.message, 'success', 'done'));
    }

    if (response.status === 413) {
      setLoading(false);
      setModalVisible(false);
      dispatch(showToast(data, 'error', 'error'));
      removeData();
      setIsLoggedIn(false);
    }

    if (response.status === 401) {
      setLoading(false);
      setModalVisible(false);
      dispatch(showToast(data, 'error', 'error'));
    }

    if (response.status === 500) {
      setLoading(false);
      setModalVisible(false);
      dispatch(showToast(data, 'error', 'error'));
    }
  };


  return (
    <Container color="#fff">
      <View style={{backgroundColor: Colors.primary}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{padding: 20}}
            onPress={() =>
              props.navigation.goBack()
            }>
            <Icon name="arrow-back" size={26} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Perfil</Text>
          <TouchableOpacity
            style={{padding: 20}}
            onPress={() =>
              props.navigation.goBack()
            }>
            <Text style={{color: Colors.white, fontWeight: 'bold', fontSize: 16}}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Image style={styles.profileImage} source={{uri: profile.avatar ?? avatarDefault}} />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setModalVisible(true)}
          >
            <Icon
              name="add-a-photo"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.username}>{profile.name}</Text>
        </View>
      </View>
        <ScrollView>
        <View style={{
          paddingHorizontal: 20,
          paddingBottom: 30,
          marginTop: -10,
          alignItems: 'center',
        }}>
          <Input
            iconName="person"
            title="Nome"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            iconName="person"
            title="Sobrenome"
            defaultValue={lastname}
          />
          <Input
            iconName="email"
            title="E-mail"
            defaultValue={email}
          />
          {profile.seller === true && (
          <>
          <Input
            iconName="phone"
            title="Celular"
            defaultValue={phone}
          />
          <Input
            title="Facebook"
            defaultValue={facebook}
          />
          <Input
            title="Instagram"
            defaultValue={instagram}
          />
          </>
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => {
                setModalVisible(false);
                setAvatar([]);
              }}>
              <Icon name="close" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View>
            <Image
              style={[
                styles.profileImage,
                {alignSelf: 'center', marginVertical: 20},
              ]}
              source={{uri: profile?.avatar ?? avatarDefault}}
            />
            <TouchableOpacity
              onPress={() => handleImageUser()}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
                alignSelf: 'center',
                backgroundColor: Colors.primary,
                marginVertical: 20,
                borderRadius: 15,
              }}>
              <Text style={[styles.btnTextModal, {fontSize: 14}]}>
                Selecionar imagem
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => uploadImage()}
              style={styles.btnModal}>
              <Text style={styles.btnTextModal}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  'Salvar'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
    marginLeft: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 15,
    padding: 5
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  editIcon: {
    bottom: 50,
    marginLeft: 90,
    backgroundColor: Colors.secondary,
    height: 40,
    width: 40,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  username: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  closeModal: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  btnModal: {
    paddingVertical: 22,
    paddingHorizontal: 120,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  btnTextModal: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
