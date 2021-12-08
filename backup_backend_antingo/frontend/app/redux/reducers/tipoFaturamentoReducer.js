import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_TIPO_FATURAMENTO,
    INIT_CREATE_TIPO_FATURAMENTO,
    CREATE_TIPO_FATURAMENTO_SUCCESS,
    UPDATE_TIPO_FATURAMENTO_SUCCESS,
    SET_TIPO_FATURAMENTO,
    SET_TIPO_FATURAMENTOS,
    REMOVE_TIPO_FATURAMENTO_SUCCESS
} from '../constants/tipoFaturamentoConstants';

const tipoFaturamentoState = {
    data: [],
    notifMsg: "",
    tipoFaturamento: null,
}

const setTipoFaturamento = (state, action) => {
    return updateObject(state, {
        tipoFaturamento: {
            ...action.payload.tipoFaturamento,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function tipoFaturamentoReducer(state = tipoFaturamentoState, action) {
    switch (action.type) {
        case INIT_CREATE_TIPO_FATURAMENTO:
            return {
                ...state,
                tipoFaturamento: null,
            }
        case CREATE_TIPO_FATURAMENTO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                tipoFaturamento: null,
            }
        case CREATE_TIPO_FATURAMENTO: return updateObject(state, { tipoFaturamento: null })
        case SET_TIPO_FATURAMENTO: return setTipoFaturamento(state, action);
        case REMOVE_TIPO_FATURAMENTO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_TIPO_FATURAMENTO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_TIPO_FATURAMENTOS:
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
