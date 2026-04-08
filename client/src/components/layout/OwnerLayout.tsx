import { Link, Outlet } from "react-router-dom";

function OwnerLayout() {
  return (
        <div>
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
                        <Link 
                            to="/owner" 
                            className="text-sm font-bold text-slate-900 hover:opacity-70 transition-opacity uppercase tracking-widest"
                        >
                            Dashboard
                        </Link>
                        
                        <Link 
                            to="/owner/menu-items" 
                            className="text-sm font-bold text-slate-900 hover:opacity-70 transition-opacity uppercase tracking-widest"
                        >
                            Menu Items
                        </Link>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default OwnerLayout;
