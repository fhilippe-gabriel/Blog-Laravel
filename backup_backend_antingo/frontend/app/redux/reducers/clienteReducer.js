import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_CLIENTE,
    INIT_CREATE_CLIENTE,
    CREATE_CLIENTE_SUCCESS,
    UPDATE_CLIENTE_SUCCESS,
    SET_CLIENTE,
    SET_CLIENTES,
    REMOVE_CLIENTE_SUCCESS
} from '../constants/clienteConstants';

const clienteState = {
    data: [],
    notifMsg: "",
    cliente: null,
}


const setCliente = (state, action) => {
    return updateObject(state, {
        cliente: {
            ...action.payload.cliente,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function clienteReducer(state = clienteState, action) {
    switch (action.type) {
        case INIT_CREATE_CLIENTE:
            return {
                ...state,
                cliente: null,
            }
        case CREATE_CLIENTE_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                cliente: null,
            }
        case CREATE_CLIENTE: return updateObject(state, { cliente: null })
        case SET_CLIENTE: return setCliente(state, action);
        case REMOVE_CLIENTE_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_CLIENTE_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_CLIENTES:
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
