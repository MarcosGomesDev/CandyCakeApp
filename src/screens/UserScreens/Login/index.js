import React, {useState, createRef, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../store/modules/toast/actions';
import {useDispatch} from 'react-redux';
import Container from '../../../components/core/Container';
import Colors from '../../../styles/Colors';
import Input from '../../../components/Input';
import {api} from '../../../services/api';
import {useLogin} from '../../../context/LoginProvider';
import {isValidEmail} from '../../../utils/validators';
import {heightPercent} from '../../../utils/dimensions';
import {storeData} from '../../../utils/storage';

const Login = () => {
  const {setIsLoggedIn, setProfile} = useLogin();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animatedScale = useRef(new Animated.Value(0)).current;
  const [load, setLoad] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInput = createRef();
  const passInput = createRef();

  useEffect(() => {
    animatedScale.setValue(1);
    emailInput.current.resetError();
    passInput.current.resetError();
  }, [email, password]);

  const signIn = async () => {

    animatedScale.setValue(0.8);
    Animated.spring(animatedScale, {
      toValue: 1,
      bounciness: 24,
      speed: 20,
      useNativeDriver: true,
    }).start();

    if (email === '') {
      dispatch(showToast('Por favor insira o email', 'error', 'error'));
      emailInput.current.focusOnError();
      return;
    }

    if (!isValidEmail(email)) {
      dispatch(showToast('Email inválido!', 'error', 'error'));
      emailInput.current.focusOnError();
      return;
    }

    if (password === '') {
      dispatch(showToast('Por favor insira a senha', 'error', 'error'));
      passInput.current.focusOnError();
      return;
    }

    // if(password.length < 8) {
    //     dispatch(showToast('Muito curta, a senha precisa ter 8 caracteres', 'error', 'error'))
    //     passInput.current.focusOnError()
    //     return
    // }
    setLoad(true)
    await api.loginUser(email, password)
    .then((data) => {
      console.log(data)
      storeData(data)
      setLoad(false)
      setEmail('')
      setPassword('')
      setProfile(data)
      setIsLoggedIn(true)
    })
    .catch((e) => {
      setLoad(false)
      dispatch(showToast(e.response.data, 'error', 'error'))
    })
  };

  return (
    <Container color={'#fff'}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Olá,</Text>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
        </View>
      </View>
      <ScrollView style={styles.mainContent}>
        <View style={{alignItems: 'center'}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            paddingLeft: 40,
            fontSize: 26,
            color: Colors.primary,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Login
        </Text>
        <Input
          title="Email"
          ref={emailInput}
          placeholder="email@exemplo.com"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          iconName="person"
          keyboardType="email-address"
        />
        <Input
          title="Senha"
          ref={passInput}
          placeholder="********"
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          iconName={'lock'}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('ForgotPasswordUser')}>
          <Text style={styles.forgotBtnText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signIn} style={styles.btn}>
          <Text style={styles.textBtn}>
            {load ? (
              <ActivityIndicator size={'small'} color={Colors.white} />
            ) : (
              'Entrar'
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SellerLogin')}
          style={{marginTop: 10, marginBottom: 25}}>
          <Text style={[styles.forgotBtnText, {fontWeight: '600'}]}>
            Entrar como vendedor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRegister}
          onPress={() => navigation.navigate('UserRegister')}>
          <Text style={styles.forgotBtnText}>
            Não possui conta? Cadastre-se
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.secondary,
    height: heightPercent('25%'),
    borderBottomRightRadius: 35,
    justifyContent: 'flex-end',
  },
  headerContent: {
    marginBottom: 50,
  },
  title: {
    color: Colors.primary,
    paddingLeft: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 26,
  },
  mainContent: {
    marginTop: 10,
    flex: 1,
  },
  inputContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    marginTop: 40,
    borderBottomWidth: 1,
    paddingBottom: 7,
    paddingHorizontal: 10,
    width: '80%',
  },
  forgotBtn: {
    marginTop: 18,
    alignSelf: 'flex-end',
    marginRight: 35,
  },
  forgotBtnText: {
    color: Colors.primary,
  },
  btn: {
    width: '80%',
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  btnRegister: {
    alignItems: 'center',
  },
});

export default Login;
