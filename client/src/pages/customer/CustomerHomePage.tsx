import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type ViewState = 'discover' | 'saved';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    restaurant_id: string;
}

interface Restaurant {
    id: string;
    name: string;
    neighborhood: string;
    status: string;
}

export default function CustomerHomePage() {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [view, setView] = useState<ViewState>('discover');
    const [savedMeals, setSavedMeals] = useState<MenuItem[]>([]);
    const [citySearch, setCitySearch] = useState('');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [restaurantMenu, setRestaurantMenu] = useState<MenuItem[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
    const [isDishModalOpen, setIsDishModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- NEW: Persistent Load Logic ---
    useEffect(() => {
        fetchSavedMeals();
    }, []);

    const fetchSavedMeals = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('saved_meals')
            .select(`
                menu_items (
                    id, name, price, description, restaurant_id
                )
            `)
            .eq('user_id', user.id);

        if (data && !error) {
            // Flatten the nested join result from Supabase
            const flattenedMeals = data.map((item: any) => item.menu_items);
            setSavedMeals(flattenedMeals);
        }
    };

    // --- Logic Functions ---
    const handleCitySearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const searchVal = citySearch.trim();
        if (!searchVal) return;
        setIsLoading(true);
        setLocationError(null);
        setSelectedRestaurant(null);

        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .ilike('neighborhood', `%${searchVal}%`)
            .eq('status', 'Active'); 

        if (error || !data || data.length === 0) {
            setLocationError(`We couldn't find any community spots in "${searchVal}" yet.`);
            setRestaurants([]);
        } else {
            setRestaurants(data);
        }
        setIsLoading(false);
    };

    const handleRestaurantClick = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsLoading(true);
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .eq('status', 'Active') 
            .order('created_at', { ascending: false });

        if (!error) setRestaurantMenu(data || []);
        setIsLoading(false);
    };

    // --- UPDATED: Persistent Toggle Logic ---
    const toggleSaveMeal = async (meal: MenuItem) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isCurrentlySaved = savedMeals.some(m => m.id === meal.id);

        if (isCurrentlySaved) {
            // Remove from Database
            const { error } = await supabase
                .from('saved_meals')
                .delete()
                .eq('user_id', user.id)
                .eq('meal_id', meal.id);

            if (!error) {
                setSavedMeals(prev => prev.filter(m => m.id !== meal.id));
            }
        } else {
            // Add to Database
            const { error } = await supabase
                .from('saved_meals')
                .insert([{ user_id: user.id, meal_id: meal.id }]);

            if (!error) {
                setSavedMeals(prev => [...prev, meal]);
            }
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // --- Render Helpers ---
    const renderMealGrid = (mealList: MenuItem[], emptyMessage: string) => {
        return (
            <div className="space-y-8">
                {mealList.length === 0 && !isLoading ? (
                    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-black/5">
                        <p className="text-xl text-slate-400 font-bold italic tracking-tight">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mealList.map((meal) => {
                            const isSaved = savedMeals.some(m => m.id === meal.id);
                            return (
                                <div key={meal.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col relative border-b-4 border-b-slate-50 hover:border-b-orange-500">
                                    <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                                        <span className="text-5xl transform group-hover:scale-125 transition-transform duration-700">🍽️</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSaveMeal(meal); }}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-all z-10 border border-slate-50"
                                    >
                                        {isSaved ? '🧡' : '🤍'}
                                    </button>
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-xl tracking-tighter text-black mb-2 leading-tight uppercase group-hover:text-orange-500 transition-colors">{meal.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">{meal.description || "No description provided."}</p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-sm font-black px-4 py-2 bg-black text-white rounded-xl shadow-lg shadow-black/20">
                                                ${Number(meal.price).toFixed(2)}
                                            </span>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Community Dish</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 font-sans text-slate-900">
            <aside className="hidden md:flex w-80 flex-col bg-white border-r border-slate-200 p-8 z-20">
                <nav className="flex-1 space-y-4">
                    <button 
                        onClick={() => { setView('discover'); setSelectedRestaurant(null); }}
                        className={`w-full flex items-center gap-4 px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all ${view === 'discover' ? 'bg-black text-white shadow-xl shadow-black/20 scale-[1.02]' : 'text-slate-400 hover:bg-slate-50 hover:text-black'}`}
                    >
                        Discover
                    </button>
                    <button 
                        onClick={() => setView('saved')}
                        className={`w-full flex items-center gap-4 px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all ${view === 'saved' ? 'bg-black text-white shadow-xl shadow-black/20 scale-[1.02]' : 'text-slate-400 hover:bg-slate-50 hover:text-black'}`}
                    >
                        Saved ({savedMeals.length})
                    </button>
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-16">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-16">
                        {view === 'discover' && !selectedRestaurant && (
                            <div className="space-y-8">
                                {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>
                                    Explore Neighborhoods
                                </div> */}
                                <h1 className="text-7xl font-black tracking-tighter text-black leading-[0.85]">Discover <br/><span className="text-orange-500 italic">Local Spots</span></h1>
                                
                                <form onSubmit={handleCitySearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl pt-4">
                                    <input 
                                        type="text" 
                                        placeholder="Cincinnati, OTR, Clifton..."
                                        value={citySearch}
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        className="flex-1 px-8 py-5 rounded-[1.5rem] bg-white border-2 border-transparent focus:border-black transition-all text-lg font-bold shadow-xl shadow-black/5 outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isLoading || !citySearch.trim()}
                                        className="bg-black text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-black/20"
                                    >
                                        {isLoading ? '...' : 'Search'}
                                    </button>
                                </form>
                            </div>
                        )}
                        
                        {view === 'discover' && selectedRestaurant && (
                            <div className="space-y-4">
                                <button 
                                    onClick={() => setSelectedRestaurant(null)}
                                    className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2 transition-colors mb-4"
                                >
                                    &larr; Back to Results
                                </button>
                                <h1 className="text-6xl font-black tracking-tighter text-black uppercase leading-none">{selectedRestaurant.name}</h1>
                                <p className="text-2xl text-slate-400 font-bold italic tracking-tight">{selectedRestaurant.neighborhood}</p>
                            </div>
                        )}

                        {view === 'saved' && (
                            <div className="space-y-2">
                                <h1 className="text-6xl font-black tracking-tighter text-black">Saved <span className="text-orange-500 italic">Meals</span></h1>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Your personal curated dish collection</p>
                            </div>
                        )}
                    </header>

                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {[1, 2, 3].map(n => <div key={n} className="bg-slate-200 animate-pulse h-80 rounded-[2.5rem]"></div>)}
                        </div>
                    )}

                    {!isLoading && view === 'discover' && !selectedRestaurant && (
                        <div className="mt-8 space-y-12">
                            {locationError && (
                                <div className="bg-orange-500 text-white px-8 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-orange-500/20">
                                    {locationError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {restaurants.map(res => (
                                    <div 
                                        key={res.id} 
                                        onClick={() => handleRestaurantClick(res)}
                                        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-orange-400 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:bg-orange-500 transition-colors duration-500"></div>
                                        <div className="relative z-10">
                                            {/* <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition-transform">🍽️</div> */}
                                            <h3 className="font-black text-3xl mb-2 text-black tracking-tighter leading-none uppercase">{res.name}</h3>
                                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">{res.neighborhood}</p>
                                        </div>
                                    </div>
                                ))}
                                
                                <div 
                                    onClick={() => setIsSpotModalOpen(true)}
                                    className="bg-white p-10 rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm hover:border-orange-500 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center min-h-[250px]"
                                >
                                    {/* <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all"></div> */}
                                    <h3 className="font-black text-lg mb-1 text-slate-400 group-hover:text-black uppercase tracking-tight">Missing a Spot?</h3>
                                    <p className="text-slate-300 font-bold text-xs uppercase tracking-widest group-hover:text-slate-400">Suggest it here</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="mt-8">
                            {view === 'discover' && selectedRestaurant && renderMealGrid(restaurantMenu, "No dishes verified yet")}
                            {view === 'saved' && renderMealGrid(savedMeals, "No saved plates")}
                        </div>
                    )}

                    {selectedRestaurant && view === 'discover' && (
                        <div className="flex justify-center pt-8 border-t border-slate-200 mt-12 mb-12">
                            <div className="text-center">
                                <p className="text-slate-400 mb-4 font-black text-[10px] uppercase tracking-[0.2em]">Don't see your favorite dish from {selectedRestaurant.name}?</p>
                                <button 
                                    onClick={() => setIsDishModalOpen(true)}
                                    className="px-8 py-4 bg-white border-2 border-dashed border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all hover:scale-[1.02]"
                                >
                                    Suggest a Menu Item
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals - Branded and Functional */}
            {isDishModalOpen && selectedRestaurant && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 border border-slate-100">
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black tracking-tighter uppercase">Suggest <span className="text-orange-500 italic">Dish</span></h3>
                            <button onClick={() => setIsDishModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors font-bold">✕</button>
                         </div>
                         
                         <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const formData = new FormData(e.currentTarget);
                            const { error } = await supabase.from('menu_items').insert([{
                                restaurant_id: selectedRestaurant.id,
                                name: String(formData.get("name")),
                                price: parseFloat(String(formData.get("price"))),
                                description: String(formData.get("description")),
                                status: 'Pending'
                            }]);
                            setIsSubmitting(false);
                            if (!error) {
                                setIsDishModalOpen(false);
                                alert("Success!");
                            }
                         }}>
                            <div className="space-y-4">
                                <input name="name" required placeholder="Dish Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold" />
                                <input name="price" type="number" step="0.01" required placeholder="Price" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold" />
                                <textarea name="description" placeholder="Description" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold resize-none" rows={3}></textarea>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest">{isSubmitting ? 'Sending...' : 'Submit Suggestion'}</button>
                            </div>
                         </form>
                    </div>
                </div>
            )}

            {isSpotModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black tracking-tighter uppercase">Suggest <span className="text-orange-500 italic">Spot</span></h3>
                            <button onClick={() => setIsSpotModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors font-bold">✕</button>
                         </div>
                         <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const fd = new FormData(e.currentTarget);
                            await supabase.from('suggestions').insert([{ restaurant_name: String(fd.get("name")), neighborhood: String(fd.get("neighborhood")) }]);
                            setIsSubmitting(false);
                            setIsSpotModalOpen(false);
                            alert("Spot suggested!");
                         }}>
                            <div className="space-y-4">
                                <input name="name" required placeholder="Restaurant Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold" />
                                <input name="neighborhood" required placeholder="Neighborhood" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-black outline-none font-bold" />
                                <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest">Submit Spot</button>
                            </div>
                         </form>
                    </div>
                </div>
            )}
        </div>
    );
}