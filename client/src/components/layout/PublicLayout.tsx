import React from "react";
import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
    // Shared styling for Nav Buttons
    const navButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        fontSize: '0.9rem',
        fontWeight: '600',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        fontFamily: "'Inter', sans-serif",
    };

    const loginButtonStyle: React.CSSProperties = {
        ...navButtonStyle,
        backgroundColor: '#2563eb', // Primary Blue
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    };

    const ghostButtonStyle: React.CSSProperties = {
        ...navButtonStyle,
        backgroundColor: 'transparent',
        color: '#4a5568', // Slate gray
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 40px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', // Subtle bottom border shadow
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                {/* Logo Section */}
                <Link to="/" style={{ 
                    fontWeight: '800', 
                    textDecoration: 'none', 
                    fontSize: '1.4rem', 
                    color: '#1a202c',
                    letterSpacing: '-0.02em'
                }}>
                    Meal<span style={{ color: '#2563eb' }}>Share</span>
                </Link>
    
                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link to="/suggestions" style={{ textDecoration: 'none' }}>
                        <button 
                            style={ghostButtonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Suggestions
                        </button>
                    </Link>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <button 
                            style={ghostButtonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Sign Up
                        </button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button 
                            style={loginButtonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                            Login
                        </button>
                    </Link>
                </div>
            </nav>

            <main>
                {/* The content of your pages (Landing, Login, etc.) appears here */}
                <Outlet />
            </main>
        </div>
    );
}

export default PublicLayout;