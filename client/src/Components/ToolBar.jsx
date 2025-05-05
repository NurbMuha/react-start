import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ToolBar.css";

function ToolBar() {
    return (
        <div className="tool-bar">
            <nav>
                <ul>
                    <li><Link to="/home/foryou">For you</Link></li>
                    <li><Link to="/home/followed">Followed</Link></li>
                    <li><Link to="/home/career">Career</Link></li>
                    <li><Link to="/home/liked">Liked</Link></li>
                    <li><Link to="/home/saved">Saved</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default ToolBar;