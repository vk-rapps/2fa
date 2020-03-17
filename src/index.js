import 'core-js/features/map';
import 'core-js/features/set';

import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';

import App from './containers';
import '@vkontakte/vkui/dist/vkui.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store';
import * as API from './api';
import { loadSecrets } from './store/secrets/actions';

export const store = createStore(rootReducer);
API.getSecrets().then((secrets) => store.dispatch(loadSecrets(secrets)));

// Init VK Mini App
bridge.send('VKWebAppInit');

// Theme changer
bridge.subscribe(({ detail: { type, data }}) => {
    if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = data.scheme ? data.scheme : "bright_light";
        document.body.attributes.setNamedItem(schemeAttribute);
    }
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
