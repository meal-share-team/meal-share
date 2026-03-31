import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function SignupPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");
        const role = String(formData.get("role") ?? "CUSTOMER");

        // 1. Check if passwords match before calling Supabase
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role }
            }
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        alert("Account created! Please check your email for a confirmation link.");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-black hover:opacity-80 transition-opacity">
                    Meal Share
                </Link>
                <div className="space-x-6 text-sm font-medium text-slate-600 flex items-center">
                    <Link to="/login" className="text-black bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                        Login
                    </Link>
                </div>
            </nav>

            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
                    
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Sign Up</h2>
                        <p className="text-slate-500 font-medium">Create your Meal Share account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="rallapbv@mail.uc.edu" 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
                            <div className="relative">
                                <select 
                                    name="role" 
                                    defaultValue="CUSTOMER"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all cursor-pointer"
                                >
                                    <option value="CUSTOMER">Customer (I want to find meals)</option>
                                    <option value="OWNER">Restaurant Owner (I want to list meals)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-black text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                        >
                            {loading ? 'Processing...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-8 font-medium">
                        Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;