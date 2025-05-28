import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Notification.css';

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
        <div className="notification">
            <div className="notification-image"></div>
            <span className="notification-title">Alert</span>
            <span className="notification-description">Logged in successfully!</span>
            <button className="notification-action">Ok</button>
            <button className="notification-close" onClick={handleClose}>✕</button>
        </div>
    );
};

export default Notification;