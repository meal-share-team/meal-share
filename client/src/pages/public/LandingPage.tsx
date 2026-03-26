import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <section>
            <h1>Meal Share</h1>
            <p>
                Review real menu items, rate combos, and help restaurants understand what people actually order.
            </p>
            <div>
                <Link to="/signup">Sign Up</Link>
                <Link to="/login">Login</Link>
            </div>
        </section>
    );
}

export default LandingPage;