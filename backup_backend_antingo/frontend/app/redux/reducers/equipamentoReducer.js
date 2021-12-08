import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_EQUIPAMENTO,
    INIT_CREATE_EQUIPAMENTO,
    CREATE_EQUIPAMENTO_SUCCESS,
    UPDATE_EQUIPAMENTO_SUCCESS,
    SET_EQUIPAMENTO,
    SET_EQUIPAMENTOS,
    REMOVE_EQUIPAMENTO_SUCCESS
} from '../constants/equipamentoConstants';

const equipamentoState = {
    data: [],
    notifMsg: "",
    equipamento: null,
}

const setEquipamento = (state, action) => {
    return updateObject(state, {
        equipamento: {
            ...action.payload.equipamento,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function equipamentoReducer(state = equipamentoState, action) {
    switch (action.type) {
        case INIT_CREATE_EQUIPAMENTO:
            return {
                ...state,
                equipamento: null,
            }
        case CREATE_EQUIPAMENTO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                equipamento: null,
            }
        case CREATE_EQUIPAMENTO: return updateObject(state, { equipamento: null })
        case SET_EQUIPAMENTO: return setEquipamento(state, action);
        case REMOVE_EQUIPAMENTO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_EQUIPAMENTO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_EQUIPAMENTOS:
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
