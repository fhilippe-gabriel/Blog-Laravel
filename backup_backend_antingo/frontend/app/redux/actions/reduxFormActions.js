import * as types from '../constants/reduxFormConstants';
import * as notification from 'enl-redux/constants/notifConstants';

export const initAction = (data) => ({ type: types.INIT, data });
export const clearAction = { type: types.CLEAR };
export const closeNotifAction = { type: notification.CLOSE_NOTIF };

