import React from "react";
import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
    return (
        <div>
            <nav>
                <Link to="/">Meal Share</Link>
                <div>
                    <Link to="/suggestions">Suggestions</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default PublicLayout;