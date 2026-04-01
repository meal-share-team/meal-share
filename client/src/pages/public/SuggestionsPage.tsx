// Suggestions page for people to sugest new restaurants that should be added to the website
// Can navigate to landing page, login, and sign up pages

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function SuggestionsPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSuggest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.currentTarget);
        const name = formData.get("restaurantName");
        const location = formData.get("location");

        const { error } = await supabase
            .from('suggestions')
            .insert([{ name, location }]);

        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            setSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-slate-900">

            <main className="max-w-4xl mx-auto px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Text Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider">
                            Help us grow
                        </div>
                        <h2 className="text-6xl font-black tracking-tighter leading-[0.85] text-black">
                            Missing a <br />
                            <span className="text-orange-500 italic">Favorite?</span>
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed font-medium">
                            Our community thrives on new discoveries. Suggest a restaurant you love, and we'll work on getting their menu live.
                        </p>
                    </div>

                    {/* Right: The Suggestion Card */}
                    <div className="relative group">
                        {/* Decorative Blur Background */}
                        <div className="absolute -inset-4 bg-orange-100 rounded-[3rem] blur-2xl opacity-50"></div>
                        
                        <div className="relative bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
                            {!submitted ? (
                                <form onSubmit={handleSuggest} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Restaurant Name</label>
                                        <input 
                                            name="restaurantName" 
                                            type="text" 
                                            placeholder="The Golden Spoon" 
                                            required 
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                        <input 
                                            name="location" 
                                            type="text" 
                                            placeholder="Cincinnati, OH" 
                                            required 
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-black text-white px-8 py-5 rounded-2xl text-lg font-extrabold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50"
                                    >
                                        {loading ? "Sending..." : "Submit Suggestion"}
                                    </button>
                                </form>
                            ) : (
                                <div className="py-12 text-center space-y-6">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
                                        ✓
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight">Got it!</h3>
                                    <p className="text-slate-500 font-medium">Thanks for contributing to the community. We'll check it out!</p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="text-orange-500 font-bold hover:underline"
                                    >
                                        Suggest another?
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-100 flex justify-between items-center">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 Meal Share</p>
                <div className="flex gap-6">
                    <Link to="/login" className="text-slate-400 hover:text-black font-bold text-xs uppercase">Login</Link>
                    <Link to="/signup" className="text-slate-400 hover:text-black font-bold text-xs uppercase">Sign Up</Link>
                </div>
            </footer>
        </div>
    );
}