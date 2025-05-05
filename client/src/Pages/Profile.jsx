import React from 'react';
import TabBar from '../Components/TabBar';
import '../Styles/Global.css'; 

function Profile () {
    return (
        <div className="background-container">
            <TabBar />
            <div className="content">
                <h1>This page is unavalible for you</h1>
            </div>
        </div>
    );
};

export default Profile;