import React from "react";
import { Link } from "react-router-dom";
// Landing page of website where you first arrive to the website and can navigate to
// sugestions, login, and sign up

function LandingPage() {
    // Styling Objects
    const sectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(to bottom, #ffffff, #f0f4f8)', // Subtle gradient
        fontFamily: "'Inter', sans-serif, system-ui",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#1a202c',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
    };

    const paragraphStyle: React.CSSProperties = {
        maxWidth: '550px',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        color: '#4a5568',
        marginBottom: '2.5rem',
    };

    const primaryButtonStyle: React.CSSProperties = {
        padding: '12px 30px',
        fontSize: '1rem',
        fontWeight: '600',
        backgroundColor: '#2563eb', // Modern Blue
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    };

    const secondaryButtonStyle: React.CSSProperties = {
        ...primaryButtonStyle,
        backgroundColor: 'transparent',
        color: '#2563eb',
        border: '2px solid #2563eb',
        boxShadow: 'none',
    };

    return (
        <section style={sectionStyle}>
            <h1 style={titleStyle}>Meal Share</h1>
            <p style={paragraphStyle}>
                Review real menu items, rate combos, and help restaurants 
                understand what people <span style={{color: '#2563eb', fontWeight: 'bold'}}>actually</span> order.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <button 
                        style={primaryButtonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        Get Started
                    </button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button 
                        style={secondaryButtonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Sign In
                    </button>
                </Link>
            </div>
        </section>
    );
}

export default LandingPage;