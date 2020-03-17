import React, { useState } from 'react';
import { View, ModalRoot } from '@vkontakte/vkui';

import Home from './Home';
import SecretInfo from './SecretInfo';

const App = () => {
    const [ activeModal, setActiveModal ] = useState(null);
    const modals = (
        <ModalRoot activeModal={activeModal}>
            <SecretInfo id="secret-info" onClose={() => setActiveModal(null)} />
        </ModalRoot>
    );
    return (
        <View activePanel="home" modal={modals}>
            <Home id="home" openModal={setActiveModal} />
        </View>
    );
};

export default App;
