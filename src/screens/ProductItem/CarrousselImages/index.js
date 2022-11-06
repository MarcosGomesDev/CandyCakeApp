import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../../../styles/Colors';


const {width} = Dimensions.get('window');

const CarrousselImages = ({data}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const OnBoardingItem = ({item}) => {
        return <Image source={{uri: item}} style={styles.image} />;
    };

    return (
        <View>
            <FlatList
                data={data}
                style={{width, height: 355}}
                pagingEnabled
                horizontal
                onMomentumScrollEnd={event =>
                setActiveIndex(
                    parseInt(event.nativeEvent.contentOffset.x / width + 0.3),
                )}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => String(item + index)}
                renderItem={({item}) => <OnBoardingItem item={item} />}
            />

            {data?.length > 1 ? (
                <View style={styles.dotsContainer}>
                {data.map((_, i) => (
                    <View
                    key={i}
                    style={[
                        styles.dot,
                        {
                        backgroundColor:
                            i === activeIndex ? Colors.primary : '#d4d4d4',
                        },
                    ]}
                    />
                ))}
                </View>
            ) : (
            <></>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width,
        height: width,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
    },
})

export default CarrousselImages;