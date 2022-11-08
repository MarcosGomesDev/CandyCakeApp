import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

import Pdf from 'react-native-pdf';

const HelpScreen = () => {
    const source = {uri : 'https://raw.githubusercontent.com/MarcosGomesDev/Pdf/62925239554c5a9fae79f603997c5aaf0bf8fdee/Ajuda.pdf' , cache : true};

    return (
        <View style={styles.container}>
            <Pdf
                trustAllCerts={false}
                source={source}
                style={styles.pdf}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default HelpScreen;