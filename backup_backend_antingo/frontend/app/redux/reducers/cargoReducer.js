import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_CARGO,
    INIT_CREATE_CARGO,
    CREATE_CARGO_SUCCESS,
    UPDATE_CARGO_SUCCESS,
    SET_CARGO,
    SET_CARGOS,
    REMOVE_CARGO_SUCCESS
} from '../constants/cargoConstants';

const cargoState = {
    data: [],
    notifMsg: "",
    cargo: null,
}

const setCargo = (state, action) => {
    return updateObject(state, {
        cargo: {
            ...action.payload.cargo,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function cargoReducer(state = cargoState, action) {
    switch (action.type) {
        case INIT_CREATE_CARGO:
            return {
                ...state,
                cargo: null,
            }
        case CREATE_CARGO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                cargo: null,
            }
        case CREATE_CARGO: return updateObject(state, { cargo: null })
        case SET_CARGO: return setCargo(state, action);
        case REMOVE_CARGO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_CARGO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_CARGOS:
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
