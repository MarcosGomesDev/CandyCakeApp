import { useQuery } from "@tanstack/react-query"

import {useLogin} from '../context/LoginProvider';
import { api } from "../services/api";

const useFavoritesList = () => {
    const {profile} = useLogin()

    if(profile.seller === false) {
        const {data: favorites} = useQuery(['favorites-list'], () => api.getFavorites(profile.token))
        if(favorites !== 'undefined') return favorites
    }
}

export default useFavoritesList