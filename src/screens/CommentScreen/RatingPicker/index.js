import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';


const RatingPicker = ({defaultRating, maxRating, onChangeRating, width, height}) => {
    const emptyStar = require('../../../assets/star_corner.png')
    const fullStar = require('../../../assets/star_filled.png')
    
    return (
        <View
            style={{flexDirection: 'row'}}
        >
            {maxRating.map((item, key) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        key={item}
                        onPress={() => onChangeRating(item)}
                    >
                        <Image
                            source={
                                item <= defaultRating
                                ? require('../../../assets/star_filled.png')
                                : require('../../../assets/star_corner.png')
                            }
                            style={{width: width, height: height, resizeMode: 'cover', marginHorizontal: 3}} 
                        />
                    </TouchableOpacity>
                )
            })}
        </View>
    );
}

export default RatingPicker;