import { NavLink } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">{APP_NAME}</div>

      <nav className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/restaurants"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Restaurants
        </NavLink>

        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Reviews
        </NavLink>

        <NavLink
          to="/suggestions"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Suggestions
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;