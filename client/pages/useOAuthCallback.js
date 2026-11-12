import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { navigate } from '../redux/reducers/navigation';

const removeItem = (key) => {
    try {
        window.sessionStorage.removeItem(key);
    } catch (err) {
        void err;
    }
};

export const useOAuthCallback = ({
    code,
    stateKey,
    link,
    redirectTo,
    successMessage,
    notStartedMessage
}) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const searchParams = new URLSearchParams(window.location.search);
    const oauthCode = code || searchParams.get('code') || undefined;
    const oauthState = searchParams.get('state') || undefined;
    const completedKey = `${stateKey}Completed`;
    const hasLinkedRef = useRef(false);
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        if (!oauthCode || !token || hasLinkedRef.current) {
            return;
        }

        let completedCode;
        let expectedState;
        try {
            completedCode = window.sessionStorage.getItem(completedKey);
            expectedState = window.sessionStorage.getItem(stateKey);
        } catch {
            completedCode = expectedState = undefined;
        }

        if (completedCode === oauthCode) {
            dispatch(navigate(redirectTo));
            return;
        }

        // Only complete a link that this browser started, otherwise someone could link their
        // account to ours by getting us to open a callback url with their code
        if (!expectedState || expectedState !== oauthState) {
            toast.error(notStartedMessage);
            dispatch(navigate(redirectTo));
            return;
        }

        hasLinkedRef.current = true;
        setIsLinking(true);

        const doLink = async () => {
            try {
                await link(oauthCode);
                toast.success(successMessage);
            } catch (err) {
                toast.error(err?.message || err || 'An error occurred linking your account');
            }

            removeItem(stateKey);
            try {
                window.sessionStorage.setItem(completedKey, oauthCode);
            } catch (err) {
                void err;
            }

            setIsLinking(false);
            dispatch(navigate(redirectTo));
        };

        doLink();
    }, [
        completedKey,
        dispatch,
        link,
        notStartedMessage,
        oauthCode,
        oauthState,
        redirectTo,
        stateKey,
        successMessage,
        token
    ]);

    return { oauthCode, isLinking };
};
