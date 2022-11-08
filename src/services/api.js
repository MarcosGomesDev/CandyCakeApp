import axios from 'axios';

const URL = 'http://192.168.1.4:3003'

// ============================= ROTAS DO USUÁRIO =============================
async function loginUser(email, password) {
  const response = await axios.post(`${URL}/sign-in/user`, {email, password})

  return response.data
}

async function registerUser(name, email, password) {
  const response = await axios.post(`${URL}/sign-up/user`, {name, email, password})

  return response.data
}

async function updateUser(data) {
  const response = await axios.post(`${URL}/user/update`, data)

  return response.data
}

async function userForgotPassword(email) {
  const response = await axios.post(`${URL}/user/forgot-password`, {email});

  return response.data
}

async function verifyUserTokenPasswordReset(email, token) {
  const data = {
    email: email,
    token: token
  }
  const response = await axios.post(`${URL}/user/valid-token`, data)

  return response.data
}

async function userResetPassword(token, password) {
  const data = {
    password: password
  }
  const response = await axios.post(`${URL}/user/reset-password/${token}`, data)

  console.log(response.data)
  return response.data
}

async function uploadImageUserProfile(data, token) {
  const response = await fetch(`${URL}/user/upload-profile`, {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data',
      authorization: `Bearer ${token}`,
    },
    body: data
  })

  return response.data
}

async function getFavorites(token) {
  const response = await axios.get(`${URL}/user/favorites`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data
}

async function addFavorites(id, token) {
  const headers = {
    authorization: `Bearer ${token}`
  }

  const data = {
    id: id
  }

  const response = await axios.post(`${URL}/favorites/new`, data, {headers: headers})

  return response.data
}

async function removeFavorites(id, token) {
  const headers = {
    Authorization: `Bearer ${token}`
  }

  const response = await axios.delete(`${URL}/favorites/delete`, {headers: headers, params: {id: id}})

  return response.data
}

async function searchProducts(name, latitude, longitude, range, rating) {
  const response = await axios.get(`${URL}/product/search`, {
    params: {
      name: name,
      latitude: latitude,
      longitude: longitude,
      range: range,
      rating: rating
    }
  })

  return response.data
}

// ============================= ROTAS DO VENDEDOR =============================
async function loginSeller(email, password) {
  const response = await axios.post(`${URL}/sign-in/seller`, {email, password});

  return response.data
}

async function registerSeller(data) {
  const response = await axios.post(`${URL}/sign-up/seller`, data)

  return response.data
}

async function updateSeller(token, data) {
  const response = await axios.post(`${URL}/seller/update`, data, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  return response.data
}

async function getAllProductsSeller(token) {
  const response = await axios.get(`${URL}/seller/products`, {headers: {authorization: `Bearer ${token}`}})

  return response.data
}

async function sellerForgotPassword(email) {
  const response = await axios.post(`${URL}/seller/forgot-password`, {email});

  return response.data
}

async function verifySellerTokenPasswordReset(email, token) {
  const data = {
    email: email,
    token: token
  }

  const response = await axios.post(`${URL}/seller/verify-token`, data)

  return response.data
}

async function sellerResetPassword(token, password) {
  const data = {
    password: password
  }
  const response = await axios.post(`${URL}/seller/reset-password/${token}`, data)

  return response.data
}

async function uploadImageSellerProfile(data, token) {
  const response = await fetch(`${URL}/seller/upload-profile`, {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data',
      authorization: `Bearer ${token}`,
    },
    body: data
  })

  return response.data
}

// ============================= ROTAS DE PRODUTOS =============================
async function getProducts(id, token) {
  const response = await axios.get(`${URL}/products`, {
    headers: {
      authorization: `Bearer ${token}`
    },
    params: {id: id}
  })

  return response.data
}

async function getProduct(id) {
  const response = await axios.get(`${URL}/product`, {
    params: {id: id}
  })

  return response.data
}

async function addProduct(product, token) {
  console.log(product)
  const data = new FormData();
    Object.keys(product).forEach(key => {
      if (key === 'images') {
        for (let i = 0; i < product[key].length; i++) {
          data.append('images', {
            name: new Date() + 'product',
            uri: product[key][i].uri,
            type: product[key][i].type,
          });
        }
      } else {
        data.append(key, product[key]);
      }
    });

    const res = await fetch(`${URL}/product/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
        authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const response = await res.json()

    return response
}

async function editProduct(product, token) {

  const exist = product.images[0].hasOwnProperty('type')

  const data = new FormData();
  
  Object.keys(product).forEach(key => {
      if (key === 'images') {
          for (let i = 0; i < product[key].length; i++) {
              if(exist === true) {
                  data.append('images', {
                      name: new Date() + 'product',
                      uri: product[key][i].uri,
                      type: product[key][i].type,
                  });
              } else {
                  data.append('images', product[key][i])
              }
          }
      } else {
          data.append(key, product[key]);
      }
  });

  const res = await fetch(`${URL}/product/${product._id}/update`, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
      },
      body: data,
  });

  const response = await res.json()

  return response
}

async function deleteProduct(id, token) {
  const response = await axios.delete(`${URL}/product/${id}/delete`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  return response.data
}

// ============================= ROTAS PRA CAT E SUBCAT =============================
async function getAllCategories() {
  const response = await axios.get(`${URL}/categories`)

  return response.data
}

async function getAllSubCategories() {
  const response = await axios.get(`${URL}/subCategories`)

  return response.data
}

// ============================= ROTAS PRA COMENTÁRIOS =============================
async function getAllCommments(id) {
  const response = await axios.get(`${URL}/product/${id}/comments`)

  return response.data
}

async function addReplyComment(id, token, replyComment) {
  const data = {
    replyComment: replyComment
  }
  
  const response = await axios.post(`${URL}/product/rating`, data, {
    headers: {authorization: `Bearer ${token}`},
    params: {
      id: id,
    }
  })

  return response.data
}

async function addComment(id, token, comment, rating) {
  const data = {
    comment: comment,
    rating_selected: rating
  }

  const headers = {
    authorization: `Bearer ${token}`
  }

  const response = await axios.post(`${URL}/${id}/comment/new`, data , {headers: headers})

  return response.data
}

async function removeComment(id, token) {
  const response = await axios.delete(`${URL}/product/${id}/rating/delete`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  
  return response.data
}

async function deleteReplyComment(id, token) {
  const response = await axios.delete(`${URL}/product/rating/${id}`, {
    headers: {authorization: `Bearer ${token}`}
  })

  return response.data
}

export const api = {
  loginUser,
  registerUser,
  uploadImageUserProfile,
  userForgotPassword,
  verifyUserTokenPasswordReset,
  userResetPassword,
  addComment,
  removeComment,
  addFavorites,
  removeFavorites,
  loginSeller,
  registerSeller,
  sellerForgotPassword,
  verifySellerTokenPasswordReset,
  sellerResetPassword,
  uploadImageSellerProfile,
  addReplyComment,
  deleteReplyComment,
  addProduct,
  editProduct,
  deleteProduct,
  getProduct,
  getFavorites,
  getProducts,
  getAllCommments,
  getAllSubCategories,
  getAllProductsSeller,
  getAllCategories,
  searchProducts,
  updateSeller,
  updateUser
}
