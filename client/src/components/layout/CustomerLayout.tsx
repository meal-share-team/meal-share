import React from "react";
import { Link, Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
        <div>
            <nav>
                <Link to="/app">Home</Link>
                <Link to="/app/restaurants">Restaurants</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default CustomerLayout;