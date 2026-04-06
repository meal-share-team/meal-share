import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    status: string;
    restaurant_id: string;
}

export default function OwnerMenuItemsPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ownerRestaurantId, setOwnerRestaurantId] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState("Your Restaurant");

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const initializeOwnerData = async () => {
            setLoading(true);
            
            // 1. Get the logged-in user's info
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Update Name from Metadata 
            if (user.user_metadata?.display_name) {
                setRestaurantName(user.user_metadata.display_name);
            }

            // 2. Find the restaurant ID that matches this owner
            // This assumes the 'restaurants' table has an 'owner_id' or matches by name
            const { data: restaurantData } = await supabase
                .from('restaurants')
                .select('id')
                .eq('name', user.user_metadata?.display_name) // Matches the Account Name 
                .single();

            if (restaurantData) {
                setOwnerRestaurantId(restaurantData.id);
                fetchOwnerMenu(restaurantData.id);
            } else {
                setLoading(false);
            }
        };

        initializeOwnerData();
    }, []);

    const fetchOwnerMenu = async (restaurantId: string) => {
        // 3. Filter menu items to only show those belonging to this restaurant 
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });

        if (!error && data) setMenuItems(data);
        setLoading(false);
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !ownerRestaurantId) return;
        setIsSubmitting(true);

        const { error } = await supabase
            .from('menu_items')
            .insert([{ 
                name, 
                price: parseFloat(price), 
                description, 
                restaurant_id: ownerRestaurantId, // Associate with the correct restaurant
                status: 'Active' 
            }]);

        if (!error) {
            setName('');
            setPrice('');
            setDescription('');
            fetchOwnerMenu(ownerRestaurantId);
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (!error && ownerRestaurantId) fetchOwnerMenu(ownerRestaurantId);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 p-8 lg:p-16">
            <div className="max-w-6xl mx-auto space-y-12">
                
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                        {restaurantName} Inventory
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter text-black leading-[0.85]">
                        Manage <br/><span className="text-orange-500 italic">Your Menu.</span>
                    </h1>
                </header>

                {/* Grid layout matching Customer Page  */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(n => <div key={n} className="bg-slate-200 animate-pulse h-80 rounded-[2.5rem]" />)
                    ) : (
                        menuItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col relative border-b-4 border-b-slate-50 hover:border-b-orange-500">
                                <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                                    <span className="text-5xl transform group-hover:scale-125 transition-transform duration-700">🍽️</span>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xl shadow-lg hover:bg-red-50 hover:text-red-500 transition-all z-10 border border-slate-50"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-black text-xl tracking-tighter text-black mb-2 leading-tight uppercase group-hover:text-orange-500 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                            {item.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-sm font-black px-4 py-2 bg-black text-white rounded-xl shadow-lg shadow-black/20">
                                            ${Number(item.price).toFixed(2)}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest italic ${item.status === 'Active' ? 'text-orange-500' : 'text-slate-400'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Item Form */}
                <section className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-slate-100 p-10 max-w-2xl mx-auto">
                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-8">
                        Add <span className="text-orange-500 italic">New Dish</span>
                    </h3>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Dish Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold"
                        />
                        <input 
                            type="number" 
                            step="0.01" 
                            placeholder="Price" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold"
                        />
                        <textarea 
                            placeholder="Description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold resize-none"
                            rows={3}
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !ownerRestaurantId}
                            className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/20 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Publish to Menu'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}