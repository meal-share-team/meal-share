import { Link } from "react-router-dom";

export function Header() {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500">Meal Share</Link>
        <div className="space-x-4">
          <Link to="/suggestions">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Suggestions
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}