import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Define the ViewState type to fix the 'ViewState' not found error
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

    // Modal States
    const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
    const [isDishModalOpen, setIsDishModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setLocationError(`No community spots found in "${searchVal}" yet.`);
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

    const toggleSaveMeal = (meal: MenuItem) => {
        setSavedMeals((prev) => {
            const isSaved = prev.some(m => m.id === meal.id);
            if (isSaved) return prev.filter(m => m.id !== meal.id); 
            else return [...prev, meal]; 
        });
    };

    // --- Render Helpers ---
    const renderMealGrid = (mealList: MenuItem[], emptyMessage: string) => {
        return (
            <div className="space-y-12">
                {mealList.length === 0 && !isLoading ? (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <p className="text-xl text-slate-400 font-bold italic">"{emptyMessage}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mealList.map((meal) => {
                            const isSaved = savedMeals.some(m => m.id === meal.id);
                            return (
                                <div key={meal.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col relative border-b-4 border-b-slate-50 hover:border-b-orange-500">
                                    <div className="relative h-56 bg-slate-50 flex items-center justify-center overflow-hidden">
                                        <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">🍽️</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSaveMeal(meal); }}
                                        className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-all z-10"
                                    >
                                        {isSaved ? '🧡' : '🤍'}
                                    </button>
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-2xl tracking-tighter text-black mb-2 uppercase">{meal.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium line-clamp-2">{meal.description || "No description provided."}</p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-sm font-black px-4 py-2 bg-black text-white rounded-xl shadow-lg shadow-black/20">
                                                ${Number(meal.price).toFixed(2)}
                                            </span>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Trending</span>
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Nav Tabs */}
            <div className="max-w-7xl mx-auto px-8 pt-12 flex gap-4">
                <button 
                    onClick={() => { setView('discover'); setSelectedRestaurant(null); }}
                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${view === 'discover' ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-white text-slate-400 hover:text-black'}`}
                >
                    📍 Discover
                </button>
                <button 
                    onClick={() => setView('saved')}
                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${view === 'saved' ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-white text-slate-400 hover:text-black'}`}
                >
                    🧡 Saved ({savedMeals.length})
                </button>
            </div>

            <main className="max-w-7xl mx-auto p-8 lg:p-12">
                <header className="mb-16">
                    {view === 'discover' && !selectedRestaurant && (
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-100">
                                Community Driven Dining
                            </div>
                            <h1 className="text-7xl font-black tracking-tighter text-black leading-[0.85]">
                                Find your next <br />
                                <span className="text-orange-500 italic">Flavor.</span>
                            </h1>
                            
                            <form onSubmit={handleCitySearch} className="flex gap-4 max-w-2xl pt-4">
                                <input 
                                    type="text" 
                                    placeholder="Enter city or neighborhood..."
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    className="flex-1 px-8 py-5 rounded-[2rem] bg-white border-2 border-transparent focus:border-black transition-all text-lg font-bold shadow-sm outline-none"
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading || !citySearch.trim()}
                                    className="bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? '...' : 'Search'}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {view === 'discover' && selectedRestaurant && (
                        <div className="space-y-6">
                            <button 
                                onClick={() => setSelectedRestaurant(null)}
                                className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2"
                            >
                                &larr; Back to Results
                            </button>
                            <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">{selectedRestaurant.name}</h1>
                            <p className="text-2xl text-slate-400 font-bold italic">{selectedRestaurant.neighborhood}</p>
                        </div>
                    )}

                    {view === 'saved' && (
                        <div className="space-y-2">
                            <h1 className="text-7xl font-black tracking-tighter text-black">Saved <span className="text-orange-500 italic">Meals.</span></h1>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Your personal curated collection</p>
                        </div>
                    )}
                </header>

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => <div key={n} className="bg-slate-200 animate-pulse h-80 rounded-[2.5rem]"></div>)}
                    </div>
                )}

                {!isLoading && view === 'discover' && !selectedRestaurant && (
                    <div className="mt-8">
                        {locationError && (
                            <div className="mb-8 bg-orange-500 text-white px-8 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest">
                                ⚠️ {locationError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {restaurants.map(res => (
                                <div 
                                    key={res.id} 
                                    onClick={() => handleRestaurantClick(res)}
                                    className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🍽️</div>
                                    <h3 className="font-black text-3xl mb-2 text-black tracking-tighter uppercase">{res.name}</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{res.neighborhood}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isLoading && (
                    <div className="mt-8">
                        {view === 'discover' && selectedRestaurant && renderMealGrid(restaurantMenu, `${selectedRestaurant.name} menu is coming soon.`)}
                        {view === 'saved' && renderMealGrid(savedMeals, "You haven't saved any meals yet.")}
                    </div>
                )}
            </main>
        </div>
    );
}