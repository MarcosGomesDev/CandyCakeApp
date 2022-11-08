/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Container from '../../components/core/Container';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../styles/Colors';
import {useLogin} from '../../context/LoginProvider'

// create a component
const Settings = (props) => {
  const {profile} = useLogin()
  const navigation = useNavigation()
  const avatarDefault = 'https://res.cloudinary.com/gomesdev/image/upload/v1649718658/avatar_ip9qyt.png'

  console.log(profile)

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnHeader}
          onPress={() =>
            props.navigation.dispatch(DrawerActions.toggleDrawer())
          }>
          <Icon name="menu" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <View style={{flexDirection: 'row', paddingHorizontal: 20, height: 120, backgroundColor: Colors.primary, alignItems: 'center'}}>
        <Image style={{width: 80, height: 80, borderRadius: 150}} source={{uri: profile.avatar ?? avatarDefault}} />
        <View style={{flexDirection: 'column', flex: 1, paddingLeft: 25}}>
          <Text style={{fontSize: 15, color: '#dcdcdc', fontWeight: '500'}}>Olá</Text>
          <Text style={{fontSize: 20, color: Colors.white, fontWeight: 'bold'}}>{profile.name}</Text>
        </View>
        <TouchableOpacity 
          style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor:  '#cdcdcd', borderRadius: 150}}
          onPress={() => navigation.navigate('MyAccount')}
        >
          <Icon
            style={styles.editIcon}
            name="edit"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        {profile.seller === true && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('Meus produtos')}
              style={styles.btnAbout}
            >
              <Text style={styles.btnAboutText}>Meus produtos</Text>
              <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Meus produtos')}
              style={styles.btnAbout}
            >
              <Text style={styles.btnAboutText}>Mídias sociais</Text>
              <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
            </TouchableOpacity>
          </>
        )}


        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.btnAbout}
        >
          <Text style={styles.btnAboutText}>Meus dados</Text>
          <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnAbout}
        >
          <Text style={styles.btnAboutText}>Relatar um problema</Text>
          <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HelpScreen')}
          style={styles.btnAbout}
        >
          <Text style={styles.btnAboutText}>Ajuda</Text>
          <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.btnAbout}
      >
        <Text style={[styles.btnAboutText, {color: Colors.danger}]}>Excluir conta</Text>
        <Icon name="arrow-forward-ios" size={20} color={Colors.danger} />
      </TouchableOpacity>
      <View style={{borderTopWidth: 0.6, borderTopColor: Colors.grey}}>
        
        <TouchableOpacity
          style={styles.btnAbout}
        >
          <Text style={styles.btnAboutText}>Sobre</Text>
          <Icon name="arrow-forward-ios" size={20} color={Colors.grey} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    elevation: 1,
    zIndex: 1,
    paddingRight: 40
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary,
  },
  btnHeader: {
    height: '100%',
    justifyContent:  'center',
    alignItems: 'center',
    width: 50,
    zIndex: 30
  },
  btnAbout: {
    height: 55,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  btnAboutText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'left'
  }
});

export default Settings;
