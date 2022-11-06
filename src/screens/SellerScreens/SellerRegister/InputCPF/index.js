import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  createRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../../styles/Colors';
import { TextInputMask } from 'react-native-masked-text';

import {widthPercent, heightPercent} from '../../../../utils/dimensions';

const InputCPF = forwardRef((props, ref) => {

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            borderBottomColor: props.error === true ? Colors.danger : Colors.primary,
          },
        ]}>
        <View style={{justifyContent: 'center'}}>
          <Icon
            name={props.iconName}
            size={24}
            color={props.error === true ? Colors.danger : Colors.primary}
          />
        </View>
        <TextInputMask
            style={[styles.input, {color: props.enabled ? props.enabled : Colors.primary}]}
            type={'cpf'}
            ref={ref}
            placeholder="444.444.444-44"
            underlineColorAndroid="transparent"
            placeholderTextColor="#a9a9a9"
            {...props}
          />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: heightPercent('5%'),
  },
  inputContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
    paddingHorizontal: 10,
    marginTop: 5,
    width: widthPercent('80%'),
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 15,
    paddingLeft: 10,
    flex: 1,
  },
});

export default InputCPF;
