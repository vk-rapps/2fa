import bridge from '@vkontakte/vk-bridge';
import { getData, generateId } from './utils/otp';

export const getSecrets = () => new Promise(async (resolve) => {
    const keys = await bridge.send("VKWebAppStorageGetKeys", { "count": 100, "offset": 0 });
    if (keys.keys.length === 0) return resolve([]);
    const secrets = await bridge.send("VKWebAppStorageGet", { "keys": keys.keys });
    const result = secrets.keys.map((x) => x.value);
    return resolve(result);
});

export const saveSecret = (secret) => new Promise((resolve) => {
    const data = getData(secret);
    const key = generateId(data.label.issuer, data.label.account);

    bridge.send("VKWebAppStorageSet", { "key": key, "value": secret });
    return resolve();
});

export const removeSecret = (key) => new Promise((resolve) => {
    bridge.send("VKWebAppStorageSet", { "key": key, "value": '' });
    return resolve();
});
