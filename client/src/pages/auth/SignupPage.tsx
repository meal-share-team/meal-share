import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Page for creating an account with meal share for both restaurants and customers
// Can navigate to Landing , suggestions, and login pages

function SignupPage() {
    const navigate = useNavigate();

    // Styling Objects (Matching Landing, Login, and Suggestions)
    const pageStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#f8fafc',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: 'none', // Removes default browser arrow
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px',
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '10px',
    };

    const handleSignup = async (formData: FormData) => {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const role = String(formData.get("role") ?? "CUSTOMER");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Check your email for the confirmation link!");
        navigate("/login");
    };

    return (
        <section style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '2rem', letterSpacing: '-0.02em' }}>
                    Create Account
                </h1>
                <p style={{ color: '#4a5568', marginBottom: '30px' }}>
                    Join Meal Share to start exploring menus.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleSignup(new FormData(e.currentTarget));
                    }}
                >
                    <input name="email" type="email" placeholder="Email" required style={inputStyle} />
                    <input name="password" type="password" placeholder="Password" required style={inputStyle} />
                    
                    <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>
                        I am a...
                    </div>
                    <select name="role" title="role" defaultValue="CUSTOMER" style={selectStyle}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="OWNER">Restaurant Owner</option>
                    </select>

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '25px', color: '#64748b', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </section>
    );
}

export default SignupPage;