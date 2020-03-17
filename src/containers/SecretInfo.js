import React from 'react';
import { generateId } from '../utils/otp';
import * as API from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { ModalPage, ModalPageHeader, Div, Group, IS_PLATFORM_ANDROID, IS_PLATFORM_IOS, PanelHeaderButton, Button, InfoRow } from '@vkontakte/vkui';

import { removeSecrets } from '../store/secrets/actions';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon28CancelOutline from '@vkontakte/icons/dist/28/cancel_outline';

const SecretInfo = ({ id, onClose }) => {
    const dispatch = useDispatch();
    const secret = useSelector((store) => store.secrets.selected);
    const remove = () => {
        const key = generateId(secret.label.issuer, secret.label.account);
        API.removeSecret(key)
            .then(() => {
                dispatch(removeSecrets(key));
                onClose();
            });
    };

    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={onClose}><Icon24Cancel /></PanelHeaderButton>}
                    right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={onClose}><Icon24Dismiss /></PanelHeaderButton>}
                >
                    Информация
                </ModalPageHeader>
            }
            onClose={onClose}
            dynamicContentHeight
        >
            <Group>
                <Div style={{ marginTop: 0, paddingTop: 0 }}>
                    <InfoRow header="Сервис" style={{ marginBottom: 12 }}>
                        {secret.label.issuer}
                    </InfoRow>
                    <InfoRow header="Аккаунт" style={{ marginBottom: 12 }}>
                        {secret.label.account}
                    </InfoRow>
                    <InfoRow header="Секрет">
                        {secret.query.secret}
                    </InfoRow>
                </Div>
            </Group>
            <Group style={{ paddingBottom: 8 }}>
                <Div>
                    <Button
                        size="xl"
                        mode="destructive"
                        before={<Icon28CancelOutline/>}
                        onClick={remove}
                    >
                        Удалить
                    </Button>
                </Div>
            </Group>
        </ModalPage>
    );
};

export default SecretInfo;
