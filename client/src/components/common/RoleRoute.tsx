import { Navigate } from "react-router-dom";
import { useAuth, type AppRole } from "../../context/AuthContext";

function RoleRoute({ allowedRoles, children }: {
    allowedRoles: AppRole[];
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return <>{children}</>;
}

export default RoleRoute;