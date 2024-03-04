import { useState, useCallback } from 'react';

const useSnackbar = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showSnackbar = useCallback((message) => {
        setMessage(message);
        setOpen(true);
    }, []);

    const closeSnackbar = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        open,
        message,
        showSnackbar,
        closeSnackbar,
    };
};

export default useSnackbar;