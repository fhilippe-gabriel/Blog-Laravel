import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_CERTIFICADO,
    INIT_CREATE_CERTIFICADO,
    CREATE_CERTIFICADO_SUCCESS,
    UPDATE_CERTIFICADO_SUCCESS,
    SET_CERTIFICADO,
    SET_CERTIFICADOS,
    REMOVE_CERTIFICADO_SUCCESS,
    SET_CERTIFICADO_SITUACOES
} from '../constants/certificadoConstants';

const certificadoState = {
    data: [],
    notifMsg: "",
    certificado: null,
    situacoes: [],
}

const setCertificado = (state, action) => {
    return updateObject(state, {
        certificado: {
            ...action.payload.certificado,
        }
    });
};

const setCertificadoSituacoes = (state, action) => {
    console.log(action)
    return updateObject(state, {
        situacoes: {
            ...action.payload[0],
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function certificadoReducer(state = certificadoState, action) {
    switch (action.type) {
        case INIT_CREATE_CERTIFICADO:
            return {
                ...state,
                certificado: null,
            }
        case CREATE_CERTIFICADO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                certificado: null,
            }
        case CREATE_CERTIFICADO: return updateObject(state, { certificado: null })
        case SET_CERTIFICADO: return setCertificado(state, action);
        case SET_CERTIFICADO_SITUACOES: return setCertificadoSituacoes(state, action);
        case REMOVE_CERTIFICADO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_CERTIFICADO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_CERTIFICADOS:
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
