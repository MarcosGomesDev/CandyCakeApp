import { useQuery } from '@tanstack/react-query'

import {api} from '../services/api'

const useProducts = () => {
    const {data, isError, isLoading} = useQuery(['product-list'], api.getProducts)
    return [data];
}

export default useProducts;
