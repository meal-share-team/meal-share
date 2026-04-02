import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Page for existing users to login to their accounts
// Can navigate to langing, suggestions, and signup pages

export default function LoginPage() {
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
        <div className="min-h-[90vh] bg-white font-sans antialiased text-slate-900 flex items-center justify-center px-8">
            <div className="max-w-md w-full space-y-12">
                
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl shadow-xl shadow-black/20 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-black text-3xl">M</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-black">
                        Welcome <br />
                        <span className="text-orange-500 italic">Back.</span>
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Log in to see what your community is eating today.
                    </p>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            void handleEmailLogin(new FormData(e.currentTarget));
                        }}
                    >
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                required 
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-black transition-colors">Forgot?</Link>
                            </div>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-black text-white px-8 py-5 rounded-2xl text-lg font-extrabold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Social Account</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {/* OAuth Button */}
                    <button 
                        onClick={() => void handleOAuthLogin("google")}
                        className="w-full bg-white border-2 border-slate-100 text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        Continue with Google
                    </button>
                </div>

                {/* Footer Link */}
                <p className="text-center text-slate-400 font-bold text-sm">
                    New here?{' '}
                    <Link to="/signup" className="text-black hover:text-orange-500 transition-colors border-b-2 border-orange-500/20 hover:border-orange-500">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}