import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type OwnerView = 'overview' | 'menu' | 'suggestions';

export default function OwnerDashboardPage() {
    const navigate = useNavigate();
    
    const [view, setView] = useState<OwnerView>('overview');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Track the dish we are currently editing (null means new dish)
    const [editingDish, setEditingDish] = useState<any | null>(null);

    // Data fetched directly from Supabase
    const [myMenu, setMyMenu] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    // Fetch Menu & Suggestions on Load
    useEffect(() => {
        fetchMenu();
        fetchSuggestions();
    }, []);

    const fetchMenu = async () => {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) console.error("Error fetching menu:", error);
        else setMyMenu(data || []);
    };

    const fetchSuggestions = async () => {
        const { data, error } = await supabase
            .from('suggestions')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) console.error("Error fetching suggestions:", error);
        else setSuggestions(data || []);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col hidden md:flex z-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-xl">M</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight leading-none">Owner Portal</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Local Kitchen</p>
                    </div>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => setView('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${view === 'overview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        📊 Overview
                    </button>
                    <button 
                        onClick={() => setView('menu')}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${view === 'menu' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        📝 Manage Menu
                    </button>
                    <button 
                        onClick={() => setView('suggestions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${view === 'suggestions' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        💡 Suggestions
                        <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{suggestions.length}</span>
                    </button>
                </nav>

                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 font-bold hover:bg-white/5 rounded-xl transition-colors mt-auto"
                >
                    Sign Out
                </button>
            </aside>

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        {view === 'overview' && (
                            <>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Dashboard</h1>
                                <p className="text-slate-500 font-medium">Here is how your restaurant is performing today.</p>
                            </>
                        )}
                        {view === 'menu' && (
                            <>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Manage Menu</h1>
                                <p className="text-slate-500 font-medium">Update your dishes and pricing.</p>
                            </>
                        )}
                        {view === 'suggestions' && (
                            <>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Community Inbox</h1>
                                <p className="text-slate-500 font-medium">See what local diners are requesting from your kitchen.</p>
                            </>
                        )}
                    </div>

                    {view === 'menu' && (
                        <button 
                            onClick={() => {
                                setEditingDish(null);
                                setIsAddModalOpen(true);
                            }}
                            className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                        >
                            <span>➕</span> Add New Dish
                        </button>
                    )}
                </header>

                {view === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Menu Views</p>
                                <p className="text-5xl font-black text-slate-900">1,248</p>
                                <p className="text-sm font-bold text-green-500 mt-4">↑ 12% this week</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-8xl opacity-5">❤️</div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Saves</p>
                                <p className="text-5xl font-black text-orange-500">441</p>
                                <p className="text-sm font-bold text-slate-500 mt-4">Across {myMenu.length} active dishes</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Top Dish</p>
                                <p className="text-2xl font-black text-slate-900 leading-tight">Spicy Chicken Sandwich</p>
                                <p className="text-sm font-bold text-slate-500 mt-4">210 saves</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'menu' && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Dish Name</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myMenu.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                                            No items on your menu yet. Click "Add New Dish" to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    myMenu.map(meal => (
                                        <tr key={meal.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-6">
                                                <p className="font-bold text-slate-900 text-lg">{meal.name}</p>
                                                <p className="text-sm text-slate-500 font-medium">❤️ {meal.saves || 0} saves</p>
                                            </td>
                                            <td className="p-6 text-slate-600 font-bold">${parseFloat(meal.price).toFixed(2)}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${meal.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {meal.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingDish(meal);
                                                        setIsAddModalOpen(true);
                                                    }}
                                                    className="text-slate-400 hover:text-black font-bold text-sm transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    Edit Dish
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'suggestions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {suggestions.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xl text-slate-500 font-medium">No community suggestions yet!</p>
                            </div>
                        ) : (
                            suggestions.map(suggestion => (
                                <div key={suggestion.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            💬
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">{suggestion.status}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">"{suggestion.restaurant_name}"</h3>
                                    <p className="text-sm font-medium text-slate-500">— Suggested in {suggestion.neighborhood}</p>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3">
                                        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">Dismiss</button>
                                        <button 
                                            onClick={() => { setView('menu'); setIsAddModalOpen(true); }}
                                            className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                                        >
                                            Add to Database
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        {editingDish ? 'Edit Dish' : 'Add New Dish'}
                                    </h3>
                                    <p className="text-slate-500 font-medium mt-1">
                                        {editingDish ? 'Update your menu item details.' : 'Publish a new item to your menu.'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingDish(null);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form 
                                className="space-y-5"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setIsSaving(true);
                                    
                                    const formData = new FormData(e.currentTarget);
                                    const dishData = {
                                        name: String(formData.get("name")),
                                        price: parseFloat(String(formData.get("price"))),
                                        description: String(formData.get("description")),
                                    };

                                    if (editingDish) {
                                        const { error } = await supabase
                                            .from('menu_items')
                                            .update(dishData)
                                            .eq('id', editingDish.id);
                                            
                                        if (error) console.error(error);
                                    } else {
                                        const { error } = await supabase
                                            .from('menu_items')
                                            .insert([dishData]);
                                            
                                        if (error) console.error(error);
                                    }

                                    setIsSaving(false);
                                    setIsAddModalOpen(false);
                                    setEditingDish(null);
                                    fetchMenu(); 
                                }}
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Dish Name</label>
                                    <input 
                                        name="name"
                                        required
                                        defaultValue={editingDish?.name || ''}
                                        type="text" 
                                        placeholder="e.g. Classic Smashburger"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                                    <input 
                                        name="price"
                                        required
                                        defaultValue={editingDish?.price || ''}
                                        type="number" 
                                        step="0.01"
                                        placeholder="12.99"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea 
                                        name="description"
                                        rows={3} 
                                        defaultValue={editingDish?.description || ''}
                                        placeholder="What makes this dish special?"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setEditingDish(null);
                                        }}
                                        className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className={`flex-1 bg-black text-white font-bold py-4 rounded-xl transition-all ${isSaving ? 'opacity-70' : 'hover:bg-slate-800'}`}
                                    >
                                        {isSaving ? 'Saving...' : (editingDish ? 'Save Changes' : 'Publish Dish')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}