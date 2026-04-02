import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SuperAdminDashboard() {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
    const [restaurantMenu, setRestaurantMenu] = useState<any[]>([]);

    const [isRestModalOpen, setIsRestModalOpen] = useState(false);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [prefillRest, setPrefillRest] = useState({ name: '', neighborhood: '' });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRestaurant) fetchRestaurantMenu(selectedRestaurant.id);
    }, [selectedRestaurant]);

    const fetchData = async () => {
        const [restRes, suggRes] = await Promise.all([
            supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
            supabase.from('suggestions').select('*').eq('status', 'Pending').order('created_at', { ascending: false })
        ]);
        if (restRes.data) setRestaurants(restRes.data);
        if (suggRes.data) setSuggestions(suggRes.data);
    };

    const fetchRestaurantMenu = async (restaurantId: string) => {
        // Fetch ALL menu items for this restaurant (Active AND Pending)
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });
        if (data) setRestaurantMenu(data);
    };

    const handleAddRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        
        const { error } = await supabase.from('restaurants').insert([{
            name: String(formData.get("name")),
            neighborhood: String(formData.get("neighborhood"))
        }]);

        setIsSaving(false);
        if (!error) {
            setIsRestModalOpen(false);
            fetchData(); 
        }
    };

    const handleAddMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        
        // Items added manually by the Admin are instantly Active
        const { error } = await supabase.from('menu_items').insert([{
            restaurant_id: selectedRestaurant.id, 
            name: String(formData.get("name")),
            price: parseFloat(String(formData.get("price"))),
            description: String(formData.get("description")),
            status: 'Active'
        }]);

        setIsSaving(false);
        if (!error) {
            setIsMenuModalOpen(false);
            fetchRestaurantMenu(selectedRestaurant.id); 
        }
    };

    const markSuggestionComplete = async (id: string) => {
        await supabase.from('suggestions').update({ status: 'Added' }).eq('id', id);
        fetchData();
    };

    // --- NEW: Approve Customer Dish ---
    const approveDish = async (dishId: string) => {
        await supabase.from('menu_items').update({ status: 'Active' }).eq('id', dishId);
        fetchRestaurantMenu(selectedRestaurant.id); // Refresh table
    };

    const deleteDish = async (dishId: string) => {
        await supabase.from('menu_items').delete().eq('id', dishId);
        fetchRestaurantMenu(selectedRestaurant.id); // Refresh table
    };

    // Derived states to split the table easily
    const pendingDishes = restaurantMenu.filter(m => m.status === 'Pending');
    const activeDishes = restaurantMenu.filter(m => m.status === 'Active');

    return (
        <div className="min-h-screen bg-slate-100 p-8 lg:p-12 font-sans text-slate-900 pb-32">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">A</div>
                    <h1 className="text-4xl font-extrabold tracking-tight">System Admin</h1>
                </div>
                <p className="text-slate-500 font-medium">Manage global database entries and approve community spots.</p>
            </header>

            {!selectedRestaurant && (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span>📥</span> Pending Spot Suggestions ({suggestions.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {suggestions.map(sugg => (
                                <div key={sugg.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                    <h3 className="font-bold text-lg mb-1">{sugg.restaurant_name}</h3>
                                    <p className="text-slate-500 text-sm mb-6">{sugg.neighborhood}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => markSuggestionComplete(sugg.id)}
                                            className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setPrefillRest({ name: sugg.restaurant_name, neighborhood: sugg.neighborhood });
                                                setIsRestModalOpen(true);
                                                markSuggestionComplete(sugg.id);
                                            }}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Convert to Restaurant
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {suggestions.length === 0 && (
                                <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300">
                                    No pending suggestions right now!
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span>🏢</span> Active Restaurants
                            </h2>
                            <button 
                                onClick={() => { setPrefillRest({ name: '', neighborhood: '' }); setIsRestModalOpen(true); }}
                                className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md"
                            >
                                + Add Restaurant
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {restaurants.map(rest => (
                                <div 
                                    key={rest.id} 
                                    onClick={() => setSelectedRestaurant(rest)}
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 transition-colors">{rest.name}</h3>
                                    <p className="text-slate-500 text-sm">{rest.neighborhood}</p>
                                    <div className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-slate-400 group-hover:text-black transition-colors">
                                        Manage Menu &rarr;
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {selectedRestaurant && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button 
                        onClick={() => setSelectedRestaurant(null)}
                        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-black transition-colors"
                    >
                        &larr; Back to All Restaurants
                    </button>
                    
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black">{selectedRestaurant.name}</h2>
                            <p className="text-slate-500 font-medium">{selectedRestaurant.neighborhood}</p>
                        </div>
                        <button 
                            onClick={() => setIsMenuModalOpen(true)}
                            className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                        >
                            + Add Menu Item
                        </button>
                    </div>

                    {/* NEW: Customer Suggestions Queue */}
                    {pendingDishes.length > 0 && (
                        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                                <span>⚠️</span> Customer Dish Suggestions ({pendingDishes.length})
                            </h3>
                            <div className="grid gap-4">
                                {pendingDishes.map(dish => (
                                    <div key={dish.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm">
                                        <div>
                                            <p className="font-bold text-slate-900">{dish.name} <span className="text-slate-500 font-medium ml-2">${dish.price}</span></p>
                                            <p className="text-sm text-slate-500">{dish.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => deleteDish(dish.id)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">Reject</button>
                                            <button onClick={() => approveDish(dish.id)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors">Approve to Menu</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Standard Menu Table */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-black text-slate-400 uppercase tracking-wider">
                                    <th className="p-6">Active Dish Name</th>
                                    <th className="p-6">Price</th>
                                    <th className="p-6">Description</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activeDishes.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No active menu items yet.</td></tr>
                                ) : (
                                    activeDishes.map(dish => (
                                        <tr key={dish.id} className="hover:bg-slate-50">
                                            <td className="p-6 font-bold text-slate-900">{dish.name}</td>
                                            <td className="p-6 text-slate-600 font-bold">${parseFloat(dish.price).toFixed(2)}</td>
                                            <td className="p-6 text-sm text-slate-500">{dish.description}</td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => deleteDish(dish.id)} className="text-red-400 hover:text-red-600 font-bold text-sm transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Existing Modals stay exactly the same */}
            {isRestModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* ... Rest Modal (No changes) ... */}
                    <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
                        <h3 className="text-2xl font-black mb-6">Add Restaurant</h3>
                        <form onSubmit={handleAddRestaurant} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                                <input required name="name" defaultValue={prefillRest.name} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Neighborhood</label>
                                <input required name="neighborhood" defaultValue={prefillRest.neighborhood} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsRestModalOpen(false)} className="flex-1 bg-slate-100 font-bold py-3 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">{isSaving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isMenuModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* ... Menu Modal (No changes) ... */}
                    <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
                        <h3 className="text-2xl font-black mb-1">Add Dish</h3>
                        <p className="text-slate-500 text-sm mb-6">Adding to {selectedRestaurant?.name}</p>
                        <form onSubmit={handleAddMenuItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Dish Name</label>
                                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Price</label>
                                <input required name="price" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea name="description" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsMenuModalOpen(false)} className="flex-1 bg-slate-100 font-bold py-3 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">{isSaving ? 'Saving...' : 'Save Dish'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}