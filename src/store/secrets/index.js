import * as types from './actionTypes';
import { getData, getCode, generateId } from '../../utils/otp';

const initialState = {
    loaded: false,
    list: [],
    selected: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SECRETS_LOAD: {
            const { secrets } = action;
            return {
                ...state,
                loaded: true,
                list: secrets.map((secret) => ({ ...getData(secret), code: getCode(getData(secret)) })),
            };
        }

        case types.SECRETS_REFRESH: {
            return {
                ...state,
                list: state.list.map((secret) => ({ ...secret, code: getCode(secret) })),
            };
        }

        case types.SECRETS_ADD: {
            const { secret } = action;
            const newSecret = { ...getData(secret), code: getCode(getData(secret)) };
            const hash = generateId(newSecret.label.issuer, newSecret.label.account);
            const newList = [ newSecret, ...state.list.filter((x) => generateId(x.label.issuer, x.label.account) !== hash) ];
            return {
                ...state,
                list: newList,
            };
        }

        case types.SECRETS_OPEN: {
            const { secret } = action;
            return {
                ...state,
                selected: secret,
            };
        }

        case types.SECRETS_REMOVE: {
            const { hash } = action;
            return {
                ...state,
                list: state.list.filter((x) => generateId(x.label.issuer, x.label.account) !== hash),
            }
        }

        default: return state;
    }
};
