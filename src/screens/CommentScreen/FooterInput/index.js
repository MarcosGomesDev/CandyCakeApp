import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Colors from '../../../styles/Colors';

const FooterInput = ({value, image, onChangeText, onPress}) => {
    const [height, setHeight] = useState(50);
    const avatar = 'https://res.cloudinary.com/gomesdev/image/upload/v1649718658/avatar_ip9qyt.png'

    return (
        <View style={[styles.footer, {height: height}]}>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingLeft: 10}}>
            <Image
                source={{uri: image ?? avatar}}
                style={{width: 40, height: 40, borderRadius: 150}}
            />
            </View>
            <TextInput
            ref={ref => this.ref = ref}
            style={[styles.input, {height: height}]}
            value={value}
            onChangeText={onChangeText}
            multiline={true}
            maxLength={144}
            onContentSizeChange={e => {
                const changeHeight = e.nativeEvent.contentSize.height
                if(changeHeight > 50) {
                setHeight(changeHeight)
                }
            }}
            placeholder="Adicione um comentário..."
            placeholderTextColor={Colors.white}
            />

            <TouchableOpacity
                onPress={onPress}
                style={styles.publishBtn}
                disabled={value.length < 1 ? true : false}
            >
            <Text style={[styles.publishBtnText, {opacity: value.length < 1 ? 0.3 : 1}]}>
                Publicar
            </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.primary,
    },
    input: {
        flex: 1,
        paddingLeft: 20,
        color: Colors.white,
        backgroundColor: Colors.primary,
        fontSize: 16
    },
    publishBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    publishBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
    }
})

export default FooterInput;