import * as types from './actionTypes';

export const loadSecrets = (secrets = []) => {
    return {
        type: types.SECRETS_LOAD,
        secrets,
    };
};

export const refreshSecrets = () => {
    return {
        type: types.SECRETS_REFRESH,
    }
};

export const addSecrets = (secret) => {
    return {
        type: types.SECRETS_ADD,
        secret,
    };
};

export const openSecrets = (secret) => {
    return {
        type: types.SECRETS_OPEN,
        secret
    };
};

export const removeSecrets = (hash) => {
    return {
        type: types.SECRETS_REMOVE,
        hash,
    };
};
