import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications);
    const currentNotification = notifications[notifications.length - 1];

    useEffect(() => {
        let timer;
        if (currentNotification) {
            timer = setTimeout(() => {
                dispatch({ type: 'REMOVE_NOTIFICATION', payload: currentNotification.id });
            }, 2500);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [currentNotification, dispatch]);

    if (!currentNotification) return null;

    const handleClose = () => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: currentNotification.id });
    };

    return (
        <div className={`notification ${currentNotification.type}`}>
            <span>{currentNotification.message}</span>
            <button onClick={handleClose}>✕</button>
        </div>
    );
};

export default Notification;
