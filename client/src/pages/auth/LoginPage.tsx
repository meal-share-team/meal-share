import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function LoginPage() {
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-black hover:opacity-80 transition-opacity">
                    Meal Share
                </Link>
                <div className="space-x-6 text-sm font-medium text-slate-600 flex items-center">
                    <Link to="/suggestions" className="hover:text-black transition-colors">Suggestions</Link>
                    <Link to="/signup" className="text-black bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Login Card Container */}
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
                    
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                    </div>

                    {/* Integrated Form */}
                    <form className="space-y-5" onSubmit={handleEmailLogin}>
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

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input 
                                name="password"
                                type="password" 
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all transform active:scale-[0.98] mt-2"
                        >
                            Login
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400 font-semibold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <button 
                        onClick={() => void handleOAuthLogin("google")}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                        Continue with Google
                    </button>

                    <p className="text-center text-slate-500 mt-8 font-medium">
                        No account? <Link to="/signup" className="text-black font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;