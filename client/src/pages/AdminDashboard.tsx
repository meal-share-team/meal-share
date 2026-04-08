import { useState } from 'react';

// Imports mapped to your subfolders
import CustomerHomePage from './customer/CustomerHomePage';
import OwnerDashboardPage from './owner/OwnerDashboardPage';
import SuperAdminDashboard from './SuperAdminDashboard'; // <-- Import the new Admin interface

// Added 'admin' to the ViewMode
type ViewMode = 'customer' | 'owner' | 'admin';

export default function AdminDashboard() {
    const [mode, setMode] = useState<ViewMode>('customer');

    return (
        <div className="relative w-full min-h-screen">
            
            {/* --- The Rendered Dashboard --- */}
            {mode === 'customer' && <CustomerHomePage />}
            {mode === 'owner' && <OwnerDashboardPage />}
            {mode === 'admin' && <SuperAdminDashboard />}

            {/* --- The Floating Admin Switcher --- */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-1 border border-slate-700/50 animate-in slide-in-from-bottom-5">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest pl-4 pr-2">
                    Testing View
                </span>
                
                <button 
                    onClick={() => setMode('customer')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        mode === 'customer' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    Customer
                </button>
                
                <button 
                    onClick={() => setMode('owner')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        mode === 'owner' 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    Owner
                </button>

                <button 
                    onClick={() => setMode('admin')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        mode === 'admin' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    Admin Database
                </button>
            </div>

        </div>
    );
}
