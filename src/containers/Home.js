import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import * as API from '../api';
import { getData } from '../utils/otp';
import PropTypes from 'prop-types';
import {
    Panel,
    PanelHeader,
    PanelSpinner,
    List,
    Div,
    Group,
    InfoRow,
    Header,
    Progress,
    Placeholder,
    Button,
    PanelHeaderButton,
    Snackbar,
    Avatar
} from '@vkontakte/vkui';

import SecretCard from '../components/SecretCard';

import { refreshSecrets, addSecrets } from '../store/secrets/actions';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon28QrCodeOutline from '@vkontakte/icons/dist/28/qr_code_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';

const Home = ({ id, openModal }) => {
    const dispatch = useDispatch();
    const [ snackbar, setSnackbar ] = useState(null);
    const isSecretsLoaded = useSelector((store) => store.secrets.loaded);
    const secrets = useSelector((store) => store.secrets.list);
    const [ timer, setTimer ] = useState(30);

    useEffect(() => {
        if (isSecretsLoaded) {
            if (timer === 0) {
                dispatch(refreshSecrets());
                setTimer(30);
            } else {
                setTimeout(() => setTimer((p) => p - 1), 1000);
            }
        }
    }, [isSecretsLoaded, timer]);

    const openScanner = () => {
        bridge.send("VKWebAppOpenQR", {});
    };

    bridge.subscribe((e) => {
        if (e.detail.type === "VKWebAppOpenQRResult") {
            const secret = getData(e.detail.data.qr_data);

            if (!secret) {
                return setSnackbar(
                    <Snackbar
                        layout="vertical"
                        onClose={() => setSnackbar(null)}
                        before={
                            <Avatar size={24} style={{ backgroundColor: 'var(--destructive)' }}>
                                <Icon16Cancel fill="#fff" width={14} height={14} />
                            </Avatar>
                        }
                    >
                        Не удалось распознать QR код
                    </Snackbar>
                );
            }
            if (secret.type !== "totp") {
                return setSnackbar(
                    <Snackbar
                        layout="vertical"
                        onClose={() => setSnackbar(null)}
                        before={
                            <Avatar size={24} style={{ backgroundColor: 'var(--destructive)' }}>
                                <Icon16Cancel fill="#fff" width={14} height={14} />
                            </Avatar>
                        }
                    >
                        Неподдерживаемый тип двухфакторной авторизации
                    </Snackbar>
                );
            }

            API.saveSecret(e.detail.data.qr_data)
                .then(() => {
                    dispatch(addSecrets(e.detail.data.qr_data));

                    return setSnackbar(
                        <Snackbar
                            layout="vertical"
                            onClose={() => setSnackbar(null)}
                            before={
                                <Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}>
                                    <Icon16Done fill="#fff" width={14} height={14} />
                                </Avatar>
                            }
                        >
                            Аккаунт успешно добавлен!
                        </Snackbar>
                    );
                });
        }
    });

    return (
        <Panel id={id}>
            <PanelHeader
                left={
                    <PanelHeaderButton onClick={openScanner}>
                        <Icon28QrCodeOutline/>
                    </PanelHeaderButton>
                }
            >
                2FA
            </PanelHeader>
            <Group>
                <Div>
                    <InfoRow header={`Коды обновятся через: ${timer}`}>
                        <Progress value={timer*100/30} />
                    </InfoRow>
                </Div>
            </Group>
            <Group header={<Header mode="secondary">Мои аккаунты</Header>}>
                {!isSecretsLoaded ? <PanelSpinner/> : (
                    secrets.length > 0 ? (
                        <List>
                            {secrets.map((secret) => (
                                <SecretCard
                                    key={secret.label.issuer + secret.label.account}
                                    secret={secret}
                                    issuer={secret.label.issuer}
                                    account={secret.label.account}
                                    code={secret.code}
                                    openModal={openModal}
                                />
                            ))}
                        </List>
                    ) : (
                        <Placeholder
                            icon={<Icon56ErrorOutline/>}
                            header="Список аккаунтов пуст"
                            action={
                                <Button
                                    size="l"
                                    before={<Icon28QrCodeOutline/>}
                                    onClick={openScanner}
                                >
                                    Добавить
                                </Button>
                            }
                        >
                            Скорее всего вы еще не добавили аккаунты
                        </Placeholder>
                    )
                )}
            </Group>
            {snackbar}
        </Panel>
    );
};

Home.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Home;
