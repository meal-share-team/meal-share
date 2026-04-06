import React from 'react';
import { Link } from "react-router-dom";
// Landing page of website where you first arrive to the website and can navigate to
// sugestions, login, and sign up

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-slate-900">

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
                {/* Left Content */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-black">
                            Don't just eat. <br />
                            <span className="text-orange-500 italic">Share it.</span>
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
                            Join a community of food lovers. Discover hidden gems, rate individual dishes, and help others find their next favorite meal.
                        </p>
                    </div>
          
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Link to="/signup" className="w-full sm:w-auto bg-black !text-white px-10 py-5 rounded-2xl text-lg font-extrabold hover:bg-slate-800 hover:scale-[1.02] transition-all shadow-xl shadow-black/20 text-center">
                            Join Meal Share
                        </Link>
                        <Link to="/suggestions" className="w-full sm:w-auto bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 hover:border-slate-200 transition-all text-center">
                            Explore Menu
                        </Link>
                    </div>

                    {/* Real-time Stats */}
                    <div className="flex gap-12 pt-10 border-t border-slate-100">
                        <div>
                            <p className="text-4xl font-black text-black">500+</p>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Restaurants</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-black">12k</p>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Dish Reviews</p>
                        </div>
                    </div>
                </div>

                {/* Right Visuals */}
                <div className="relative group">
                    {/* Decorative Blur */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
          
                    {/* Main Image Frame */}
                    <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border-[12px] border-white transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
                        <img 
                            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2000&auto=format&fit=crop" 
                            alt="Fresh healthy meal"
                            className="w-full h-[650px] object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                        />
            
                        {/* Floating Review Card */}
                        <div className="absolute top-10 -left-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-50 max-w-[220px] -rotate-3 group-hover:rotate-0 transition-all">
                            <div className="flex gap-1 text-orange-400 mb-2">
                                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">"The best Quinoa bowl I've had in Cincy!"</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">— @bhargav_r</p>
                        </div>

                        {/* Bottom Floating Stats */}
                        <div className="absolute bottom-10 inset-x-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                                        9.8
                                    </div>
                                <div>
                                    <p className="font-black text-slate-900 text-lg leading-none">Harvest Grain Bowl</p>
                                    <p className="text-sm text-slate-500 font-medium mt-1">Whole Foods Kitchen</p>
                                </div>
                            </div>
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                Trending
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Footer / Trust Section */}
        <footer className="bg-slate-50 py-16 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-slate-400 font-bold text-sm">© 2026 Meal Share</p>
                <div className="flex gap-8">
                    <Link to="/about" className="text-slate-400 hover:text-black font-bold text-sm transition-colors">About</Link>
                    <Link to="/privacy" className="text-slate-400 hover:text-black font-bold text-sm transition-colors">Privacy</Link>
                    <Link to="/contact" className="text-slate-400 hover:text-black font-bold text-sm transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    </div>
    );
}