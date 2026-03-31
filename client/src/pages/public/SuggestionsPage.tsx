// Suggestions page for people to sugest new restaurants that should be added to the website
// Can navigate to landing page, login, and sign up pages

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

function SuggestionsPage() {
    const [submitted, setSubmitted] = useState(false);

    // Styling Objects (Matching your Landing/Layout)
    const pageStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
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
        maxWidth: '500px',
        textAlign: 'center',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        boxSizing: 'border-box', // Crucial for padding
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };

    const handleSuggest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("restaurantName");
        const location = formData.get("location");

        // Logic to send to Supabase (assuming you have a 'suggestions' table)
        const { error } = await supabase
            .from('suggestions')
            .insert([{ name, location }]);

        if (error) {
            alert(error.message);
        } else {
            setSubmitted(true);
        }
    };

    return (
        <section style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '2rem' }}>
                    Suggest a Restaurant
                </h1>
                <p style={{ color: '#4a5568', marginBottom: '30px' }}>
                    Know a great spot? Let us know and we'll reach out to them.
                </p>

                {!submitted ? (
                    <form onSubmit={handleSuggest}>
                        <input 
                            name="restaurantName" 
                            type="text" 
                            placeholder="Restaurant Name" 
                            required 
                            style={inputStyle} 
                        />
                        <input 
                            name="location" 
                            type="text" 
                            placeholder="City, State (e.g. Austin, TX)" 
                            required 
                            style={inputStyle} 
                        />
                        <button 
                            type="submit" 
                            style={buttonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                            Send Suggestion
                        </button>
                    </form>
                ) : (
                    <div style={{ color: '#059669', fontWeight: '600', padding: '20px' }}>
                        🎉 Thank you! We've received your suggestion.
                    </div>
                )}
            </div>
        </section>
    );
}

export default SuggestionsPage;