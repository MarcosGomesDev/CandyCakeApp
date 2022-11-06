import React, { useState } from 'react';
import { Image, View } from 'react-native';

// import { Container } from './styles';

const RatingProduct = ({rating}) => {
    const [maxRating] = useState([1,2,3,4,5])
    const emptyStar = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'
    const fullStar = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    return (
        <View
            style={{flexDirection: 'row'}}
        >
            {maxRating.map((item, key) => {
                return (
                    <Image
                        key={item}
                        source={
                            item <= rating
                            ? {uri: fullStar}
                            : {uri: emptyStar}
                        }
                        style={{width: 18, height: 18, resizeMode: 'cover', marginHorizontal: 2}} 
                    />
                )
            })}
        </View>
    );
}

export default RatingProduct;