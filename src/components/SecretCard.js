import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Cell, Counter } from '@vkontakte/vkui';

import { openSecrets } from '../store/secrets/actions';

import Icon28CheckShieldOutline from '@vkontakte/icons/dist/28/check_shield_outline';

const SecretCard = ({ secret, issuer, account, code, openModal }) => {
    const dispatch = useDispatch();
    return (
        <Cell
            before={
                <Icon28CheckShieldOutline/>
            }
            description={account}
            indicator={
                <Counter mode="primary">
                    {code}
                </Counter>
            }
            onClick={() => {
                dispatch(openSecrets(secret));
                openModal("secret-info");
            }}
        >
            {issuer}
        </Cell>
    );
};

SecretCard.propTypes = {
    secret: PropTypes.any,
    issuer: PropTypes.string,
    account: PropTypes.string,
    code: PropTypes.string,
    openModal: PropTypes.func,
};

export default SecretCard;
