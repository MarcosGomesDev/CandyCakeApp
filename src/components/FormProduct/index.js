import React, {useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import TitleInput from './TitleInput';
import PriceInput from './PriceInput';
import DescriptionInput from './DescriptionInput';
import CategoryPicker from './CategoryPicker';
import SubCategoryPicker from './SubCategoryPicker';
import ImagesPicker from './ImagesPicker';
import Colors from '../../styles/Colors';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/modules/toast/actions';

const NewProduct = ({productData, handleSubmit, titleBtn}) => {
  const dispatch = useDispatch()

  let data = {
    _id: productData?._id ?? '',
    name: productData?.name ?? '',
    description: productData?.description ?? '',
    price: productData?.price ?? '',
    images: productData?.images ?? [],
    category: productData?.category?.name ?? '',
    subcategory: productData?.subcategory?.name ?? '',
  };

  const [product, setProduct] = useState(data || {});
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '0,00');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [subcategory, setSubCategory] = useState(product?.subcategory || '');
  const [images, setImages] = useState(product?.images || []);

  function submit() {
    if (
      name === '' ||
      price === '' ||
      category === '' ||
      subcategory === '' ||
      images === ''
    ) {
      dispatch(showToast('Preencha todos os campos!', 'error', 'error'));
      return;
    }
    handleSubmit(product);
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <ScrollView style={{paddingHorizontal: 15, marginBottom: 5}}>
          <View style={styles.formContainer}>
            <TitleInput
              name="name"
              value={name}
              onChangeText={text => {
                setName(text);
                setProduct({...product, name: text});
              }}
            />

            <PriceInput
              name="price"
              value={price}
              onChangeTextValue={text => {
                setPrice(text);
                setProduct({...product, price: text});
              }}
            />

            <DescriptionInput
              name="description"
              value={description}
              onChangeTextValue={text => {
                setDescription(text);
                setProduct({...product, description: text});
              }}
            />

            <CategoryPicker
              category={category}
              onChangeCategory={e => {
                setCategory(e);
                setProduct({...product, category: e});
              }}
            />

            <SubCategoryPicker
              subCategory={subcategory}
              onChangeSubCategory={e => {
                setSubCategory(e);
                setProduct({...product, subcategory: e});
              }}
            />

            <ImagesPicker
              values={images}
              onChangeImages={e => {
                setImages(e);
                setProduct({...product, images: e});
              }}
            />
          </View>
          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.textBtn}>{titleBtn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
    marginVertical: 0,
    marginHorizontal: 10,
    paddingBottom: 20,
  },
  btn: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewProduct;
