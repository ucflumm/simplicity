import { useState } from 'react';

const useSnackbar = () => {
const [open, setOpen] = useState(false);
const [message, setMessage] = useState('');


const showSnackbar = (message) => {
    setMessage(message);
    setOpen(true);
};

const closeSnackbar = () => {
    setOpen(false);
};

return {
    open,
    message,
    showSnackbar,
    closeSnackbar,
};



};

export default useSnackbar;