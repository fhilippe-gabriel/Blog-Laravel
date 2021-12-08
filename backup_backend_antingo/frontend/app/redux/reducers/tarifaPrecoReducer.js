import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_TARIFA_PRECO,
    INIT_CREATE_TARIFA_PRECO,
    CREATE_TARIFA_PRECO_SUCCESS,
    UPDATE_TARIFA_PRECO_SUCCESS,
    SET_TARIFA_PRECO,
    SET_TARIFA_PRECOS,
    REMOVE_TARIFA_PRECO_SUCCESS
} from '../constants/tarifaPrecoConstants';

const tarifaPrecoState = {
    data: [],
    notifMsg: "",
    tarifaPreco: null,
}

const setTarifaPreco = (state, action) => {
    return updateObject(state, {
        tarifaPreco: {
            ...action.payload.tarifaPreco,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function tarifaPrecoReducer(state = tarifaPrecoState, action) {
    switch (action.type) {
        case INIT_CREATE_TARIFA_PRECO:
            return {
                ...state,
                tarifaPreco: null,
            }
        case CREATE_TARIFA_PRECO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                tarifaPreco: null,
            }
        case CREATE_TARIFA_PRECO: return updateObject(state, { tarifaPreco: null })
        case SET_TARIFA_PRECO: return setTarifaPreco(state, action);
        case REMOVE_TARIFA_PRECO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_TARIFA_PRECO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_TARIFA_PRECOS:
            return {
                ...state,
                ...action.payload,
            }
        case CLOSE_NOTIF:
            return {
                ...state,
                notifMsg: '',
            }
        default:
            return state;
    }
}
