/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { showToast } from '../../../store/modules/toast/actions';
import { useDispatch } from 'react-redux';

import Input from '../../../components/Input';
import InputCPF from './InputCPF';
import Container from '../../../components/core/Container';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../styles/Colors';

// create a component
const SellerRegister = ({ navigation }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('')
  const [credential, setCredential] = useState('');
  const [error, setError] = useState(false)
  const [cpfValid, setCpfValid] = useState(false)

  const nameInput = createRef();
  const lastNameInput = createRef();
  const storeNameInput = createRef()
  const credentialInput = createRef();

  useEffect(() => {
    nameInput.current.resetError();
    lastNameInput.current.resetError();
    storeNameInput.current.resetError()
  }, [name, lastName, storeName, credential]);

  const back = () => {
    navigation.goBack();
  };

  const next = async (name, lastName, storeName, credential) => {
    if (name === '') {
      dispatch(showToast('Por favor insira o nome', 'error', 'error'));
      nameInput.current.focusOnError();
      return;
    }

    if (name.length < 3) {
      dispatch(
        showToast(
          'Nome muito curto, mínimo de 3 caracteres!',
          'error',
          'error',
        ),
      );
      nameInput.current.focusOnError();
      return;
    }

    if (lastName === '') {
      dispatch(showToast('Por favor insira o sobrenome', 'error', 'error'));
      lastNameInput.current.focusOnError();
      return;
    }

    if (lastName.length < 3) {
      dispatch(
        showToast(
          'Sobrenome muito curto, mínimo de 3 caracteres!',
          'error',
          'error',
        ),
      );
      lastNameInput.current.focusOnError();
      return;
    }

    if (storeName === '') {
      dispatch(showToast('Por favor insira o nome da loja', 'error', 'error'));
      storeNameInput.current.focusOnError();
      return;
    }

    if (storeName.length < 3) {
      dispatch(
        showToast(
          'Nome da loja muito curto, mínimo de 3 caracteres!',
          'error',
          'error',
        ),
      );
      storeNameInput.current.focusOnError();
      return;
    }

    if (credential === '') {
      dispatch(showToast('Por favor insira o CPF', 'error', 'error'));
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 400);
      return;
    }

    if (credential.length < 11) {
      dispatch(
        showToast(
          'CPF inválido!',
          'error',
          'error',
        ),
      );
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 400);
      return;
    }

    if (cpfValid === false) {
      dispatch(
        showToast(
          'CPF inválido!',
          'error',
          'error',
        ),
      );
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 400);
      return;
    }

    const item = {
      name,
      lastName,
      storeName,
      credential
    };

    navigation.navigate('addressInfo', item);
  };

  const validatorCPF = (value) => {

    if (value === '00000000000' || value === '11111111111' || value == "22222222222" || value == "33333333333" ||
      value == "44444444444" || value == "55555555555" || value == "66666666666" ||
      value == "77777777777" || value == "88888888888" || value == "99999999999") {
      dispatch(showToast('CPF inválido', 'error', 'error'))
      setCpfValid(false)
      return false
    }

    add = 0;
    for (i = 0; i < 9; i++)
      add += parseInt(value.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(value.charAt(9))) {
      console.log(false);
      dispatch(showToast('CPF inválido', 'error', 'error'))
      setCpfValid(false)
      return false
    }
    // Valida 2o digito	
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(value.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(value.charAt(10))) {
      console.log(false);
      dispatch(showToast('CPF inválido', 'error', 'error'))
      setCpfValid(false)
      return false
    }
    setCpfValid(true)
    return true
  }

  console.log(credential)

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={back} style={styles.backBtn}>
          <Icon name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Olá,</Text>
          <Text style={[styles.title, { fontSize: 20 }]}>
            Por favor insira seus dados!
          </Text>
        </View>
      </View>
      <KeyboardAwareScrollView extraScrollHeight={15}>
        <View style={styles.mainContent}>
          <Text
            style={{
              alignSelf: 'flex-start',
              paddingLeft: 40,
              fontSize: 26,
              color: Colors.primary,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            Cadastro vendedor
          </Text>
          <Input
            title="Nome"
            ref={nameInput}
            placeholder="Seu nome"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
            iconName={'person'}
          />
          <Input
            title="Sobrenome"
            ref={lastNameInput}
            placeholder="Seu sobrenome"
            autoCorrect={false}
            value={lastName}
            onChangeText={setLastName}
            iconName={'person'}
          />
          <Input
            title="Nome da loja"
            ref={storeNameInput}
            placeholder="Nome da loja"
            autoCorrect={false}
            value={storeName}
            onChangeText={setStoreName}
            iconName={'store'}
          />
          <InputCPF
            title="CPF"
            ref={credentialInput}
            iconName={'person'}
            placeholder="444.444.444-44"
            error={error}
            onChangeText={(maskedValue, rawValue) => {
              if (maskedValue.length === 14) {
                const cpf = maskedValue.replace('.', '').replace('.', '').replace('-', '')
                setCredential(parseInt(cpf))
                validatorCPF(cpf)
              }
            }}
          />
          {/* <TextInputMask
            style={{ width: '80%', height: 45, borderWidth: 1 }}
            type={'cpf'}
            ref={credentialInput}
            value={credential}
            placeholder="444.444.444-44"
            // includeRawValueInChangeText={true}
            onChangeText={(maskedValue, rawValue) => {
              if (maskedValue.length === 14) {
                validatorCPF(maskedValue)
              }
            }}
          /> */}
          <TouchableOpacity
            onPress={() => next(name, lastName, storeName, credential)}
            style={styles.btn}>
            <Text style={styles.textBtn}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.secondary,
    height: 190,
    borderBottomRightRadius: 35,
    justifyContent: 'flex-end',
  },
  headerContent: {
    marginBottom: 50,
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    height: 35,
    width: 35,
    backgroundColor: Colors.primary,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.primary,
    paddingLeft: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 26,
  },
  mainContent: {
    alignItems: 'center',
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
  input: {
    fontSize: 16,
    paddingLeft: 10,
    color: Colors.primary,
    flex: 1,
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
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SellerRegister;
