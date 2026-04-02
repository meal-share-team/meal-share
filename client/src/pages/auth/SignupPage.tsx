// 1. Added React to the import
import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("CUSTOMER");
    
    // 2. FIXED: Added the missing loading state
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");
        const roleSelection = String(formData.get("role") ?? "CUSTOMER");
        const displayName = String(formData.get("displayName") ?? "");

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    role: roleSelection,
                    display_name: displayName 
                }
            }
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        alert("Check your email for a confirmation link!");
        navigate("/login");
    };

    return (
        <div className="min-h-[90vh] bg-white font-sans antialiased text-slate-900 flex items-center justify-center px-8 py-12">
            <div className="max-w-md w-full space-y-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl shadow-xl shadow-black/20 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-black text-3xl">M</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-black leading-tight">
                        Start <br />
                        <span className="text-orange-500 italic">Sharing.</span>
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                            <input name="email" type="email" placeholder="name@example.com" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Create Password</label>
                            <input name="password" type="password" placeholder="••••••••" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg" />
                        </div>

                        {/* 3. FIXED: Added the Confirm Password Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Password</label>
                            <input name="confirmPassword" type="password" placeholder="••••••••" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">I am a...</label>
                            <div className="relative">
                                <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg appearance-none cursor-pointer">
                                    <option value="CUSTOMER">Customer / Foodie</option>
                                    <option value="OWNER">Restaurant Owner</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        </div>

                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-500">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 ml-1">
                                {role === "OWNER" ? "Restaurant Name" : "Your Full Name"}
                            </label>
                            <input name="displayName" type="text" placeholder={role === "OWNER" ? "The Burger Joint" : "Ethan Bates"} required className="w-full px-6 py-4 bg-slate-50 border-2 border-orange-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-black text-white px-8 py-5 rounded-2xl text-lg font-extrabold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-center text-slate-400 font-bold text-sm">
                        Already have an account? <Link to="/login" className="text-black hover:text-orange-500 transition-colors border-b-2 border-orange-500/20 hover:border-orange-500">Sign in instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}