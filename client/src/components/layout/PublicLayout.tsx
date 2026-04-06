import React from "react";
import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
            {/* Glassmorphism Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
                            <span className="text-white font-black text-xl">M</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter text-black">
                            Meal <span className="text-orange-500">Share</span>
                        </h1>
                    </Link>
            
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6 md:gap-10">
                        {/* <Link 
                            to="/suggestions" 
                            className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors hidden sm:block uppercase tracking-widest"
                        >
                            Suggestions
                        </Link> */}
                        
                        <Link 
                            to="/login" 
                            className="text-sm font-bold text-slate-900 hover:opacity-70 transition-opacity uppercase tracking-widest"
                        >
                            Sign In
                        </Link>
                        
                        <Link 
                            to="/signup" 
                            className="bg-black !text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-md shadow-black/10"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main>
                <Outlet />
            </main>

            {/* Minimal Global Footer */}
            {/* <footer className="max-w-7xl mx-auto px-8 py-10 border-t border-slate-50 text-center">
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    Powered by the community • 2026
                </p>
            </footer> */}
        </div>
    );
}

export default PublicLayout;