import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Page for existing users to login to their accounts
// Can navigate to langing, suggestions, and signup pages

function LoginPage() {
    const navigate = useNavigate();

    // Styling Objects
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
    };

    const primaryButtonStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginBottom: '15px',
    };

    const oauthButtonStyle: React.CSSProperties = {
        ...primaryButtonStyle,
        backgroundColor: 'white',
        color: '#1a202c',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const handleEmailLogin = async (formData: FormData) => {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return;
        }

        const role = (data.user?.user_metadata.role ?? "CUSTOMER") as string;
        navigate(role === "OWNER" ? "/owner" : "/app");
    };

    const handleOAuthLogin = async (provider: "google" | "github") => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/app`
            }
        });
    };

    return (
        <section style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '2rem' }}>
                    Welcome Back
                </h1>
                <p style={{ color: '#4a5568', marginBottom: '30px' }}>
                    Log in to manage your meal shares.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleEmailLogin(new FormData(e.currentTarget));
                    }}
                >
                    <input name="email" type="email" placeholder="Email" required style={inputStyle} />
                    <input name="password" type="password" placeholder="Password" required style={inputStyle} />
                    <button 
                        type="submit" 
                        style={primaryButtonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        Login
                    </button>
                </form>

                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', color: '#cbd5e1' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '0.8rem', color: '#94a3b8' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <button 
                    onClick={() => void handleOAuthLogin("google")} 
                    style={oauthButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    Continue with Google
                </button>

                <p style={{ marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                    No account? <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;