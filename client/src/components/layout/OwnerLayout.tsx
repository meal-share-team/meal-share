import React from "react";
import { Link, Outlet } from "react-router-dom";

function OwnerLayout() {
  return (
        <div>
            <nav>
                <Link to="/owner">Dashboard</Link>
                <Link to="/owner/menu-items">Menu Items</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default OwnerLayout;