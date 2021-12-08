import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_TARIFA,
    INIT_CREATE_TARIFA,
    CREATE_TARIFA_SUCCESS,
    UPDATE_TARIFA_SUCCESS,
    SET_TARIFA,
    SET_TARIFAS,
    REMOVE_TARIFA_SUCCESS
} from '../constants/tarifaConstants';

const tarifaState = {
    data: [],
    notifMsg: "",
    tarifa: null,
}

const setTarifa = (state, action) => {
    return updateObject(state, {
        tarifa: {
            ...action.payload.tarifa,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function tarifaReducer(state = tarifaState, action) {
    switch (action.type) {
        case INIT_CREATE_TARIFA:
            return {
                ...state,
                tarifa: null,
            }
        case CREATE_TARIFA_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                tarifa: null,
            }
        case CREATE_TARIFA: return updateObject(state, { tarifa: null })
        case SET_TARIFA: return setTarifa(state, action);
        case REMOVE_TARIFA_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_TARIFA_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_TARIFAS:
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
