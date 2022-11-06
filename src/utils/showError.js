import {useDispatch} from "react-redux";
import {showToast} from "../store/modules/toast/actions";

export function showError ({value}) {
    console.log(value, 'o valor q chega na func')
    const dispatch = useDispatch()

    return dispatch(showToast(value, 'error', 'error'))
}