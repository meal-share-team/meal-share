import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

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

type ViewState = 'discover' | 'saved';

export default function CustomerHomePage() {
    const navigate = useNavigate();
    
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
            setLocationError(`We couldn't find any community spots in "${searchVal}" yet. Be the first to suggest one below!`);
            setRestaurants([]);
        } else {
            setRestaurants(data);
        }
        
        setIsLoading(false);
    };

    const handleRestaurantClick = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsLoading(true);
        
        // ONLY fetch "Active" items for the public menu
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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const renderMealGrid = (mealList: MenuItem[], emptyMessage: string) => {
        return (
            <div className="space-y-8">
                {mealList.length === 0 && !isLoading ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-xl text-slate-500 font-medium">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mealList.map((meal) => {
                            const isSaved = savedMeals.some(m => m.id === meal.id);
                            return (
                                <div key={meal.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative">
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSaveMeal(meal); }}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-110 transition-transform z-10"
                                    >
                                        {isSaved ? '❤️' : '🤍'}
                                    </button>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg leading-snug mb-1 text-slate-900">{meal.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium line-clamp-2">{meal.description || "No description provided."}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                                                ${Number(meal.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* NEW: The Suggest a Dish Button */}
                {selectedRestaurant && view === 'discover' && (
                    <div className="flex justify-center pt-8 border-t border-slate-200 mt-12">
                        <div className="text-center">
                            <p className="text-slate-500 mb-3 font-medium">Don't see your favorite dish from {selectedRestaurant.name}?</p>
                            <button 
                                onClick={() => setIsDishModalOpen(true)}
                                className="px-6 py-3 bg-white border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:border-black hover:text-black transition-colors"
                            >
                                ➕ Suggest a Menu Item
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex z-10">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">M</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Meal Share</h2>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => { setView('discover'); setSelectedRestaurant(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${view === 'discover' ? 'bg-slate-100 text-black' : 'text-slate-500 hover:bg-slate-50 hover:text-black'}`}
                    >
                        📍 Discover
                    </button>
                    <button 
                        onClick={() => setView('saved')}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${view === 'saved' ? 'bg-slate-100 text-black' : 'text-slate-500 hover:bg-slate-50 hover:text-black'}`}
                    >
                        ❤️ Saved Meals ({savedMeals.length})
                    </button>
                </nav>

                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors mt-auto"
                >
                    Sign Out
                </button>
            </aside>

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="mb-10">
                    {view === 'discover' && !selectedRestaurant && (
                        <>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Discover Local Spots</h1>
                            <p className="text-slate-500 font-medium mb-8">Search for a city or neighborhood to find the best dishes around you.</p>
                            
                            <form onSubmit={handleCitySearch} className="flex gap-4 max-w-2xl">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cincinnati, Clifton, etc."
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-lg shadow-sm"
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading || !citySearch.trim()}
                                    className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </form>
                        </>
                    )}
                    
                    {view === 'discover' && selectedRestaurant && (
                        <div>
                            <button 
                                onClick={() => setSelectedRestaurant(null)}
                                className="text-sm font-bold text-slate-500 hover:text-black mb-4 flex items-center gap-2 transition-colors"
                            >
                                &larr; Back to all restaurants
                            </button>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{selectedRestaurant.name}</h1>
                            <p className="text-slate-500 font-medium">{selectedRestaurant.neighborhood}</p>
                        </div>
                    )}

                    {view === 'saved' && (
                        <>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Saved Meals</h1>
                            <p className="text-slate-500 font-medium">Your personal curated list of dishes to try.</p>
                        </>
                    )}
                </header>

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="bg-slate-200 animate-pulse h-64 rounded-3xl"></div>)}
                    </div>
                )}

                {!isLoading && view === 'discover' && !selectedRestaurant && (
                    <div className="mt-8">
                        {locationError && (
                            <div className="mb-8 bg-orange-50 text-orange-700 px-6 py-4 rounded-2xl border border-orange-100 font-medium flex items-center gap-3">
                                <span>⚠️</span> {locationError}
                            </div>
                        )}

                        {restaurants.length === 0 && !locationError ? (
                            <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                                <div className="text-4xl mb-4">🌍</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Where are you eating today?</h3>
                                <p className="text-slate-500 font-medium">Type a city or neighborhood in the search bar above to begin.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {restaurants.map(restaurant => (
                                    <div 
                                        key={restaurant.id} 
                                        onClick={() => handleRestaurantClick(restaurant)}
                                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-black group-hover:text-white transition-colors">🍽️</div>
                                            <h3 className="font-bold text-xl mb-1 text-slate-900 leading-tight">{restaurant.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium">{restaurant.neighborhood}</p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-50">
                                            <span className="text-sm font-bold text-black group-hover:underline decoration-2 underline-offset-4">View Menu &rarr;</span>
                                        </div>
                                    </div>
                                ))}

                                <div 
                                    onClick={() => setIsSpotModalOpen(true)}
                                    className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center min-h-[250px]"
                                >
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform text-slate-400 group-hover:text-orange-500">💡</div>
                                    <h3 className="font-bold text-lg mb-1 text-slate-700 group-hover:text-orange-700">Don't see your favorite?</h3>
                                    <p className="text-slate-500 text-sm font-medium group-hover:text-orange-600">Suggest a local spot for us to contact.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && view === 'discover' && selectedRestaurant && (
                    <div className="mt-8">
                        {renderMealGrid(restaurantMenu, `${selectedRestaurant.name} hasn't added any menu items yet.`)}
                    </div>
                )}

                {!isLoading && view === 'saved' && (
                    <div className="mt-8">
                        {renderMealGrid(savedMeals, "You haven't saved any meals yet! Head back to Discover to explore.")}
                    </div>
                )}
            </main>

            {/* Existing Suggest SPOT Modal */}
            {isSpotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* ... (Your existing spot modal code stays exactly the same) ... */}
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black">Suggest a Spot</h3>
                                <p className="text-slate-500 font-medium mt-1">We'll reach out and invite them.</p>
                            </div>
                            <button onClick={() => setIsSpotModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 font-bold">✕</button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const fd = new FormData(e.currentTarget);
                            await supabase.from('suggestions').insert([{ restaurant_name: String(fd.get("name")), neighborhood: String(fd.get("neighborhood")) }]);
                            setIsSubmitting(false);
                            setIsSpotModalOpen(false);
                            alert("Suggestion saved!");
                        }}>
                            <input name="name" required placeholder="Restaurant Name" className="w-full px-4 py-3 rounded-xl border mb-4" />
                            <input name="neighborhood" required placeholder="Neighborhood" className="w-full px-4 py-3 rounded-xl border mb-4" />
                            <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-bold py-4 rounded-xl">{isSubmitting ? 'Sending...' : 'Submit Suggestion'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* NEW: Suggest DISH Modal */}
            {isDishModalOpen && selectedRestaurant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Suggest a Dish</h3>
                                <p className="text-slate-500 font-medium mt-1">Help build the menu for {selectedRestaurant.name}.</p>
                            </div>
                            <button onClick={() => setIsDishModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200">✕</button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const formData = new FormData(e.currentTarget);
                            
                            // Insert with status = Pending
                            const { error } = await supabase.from('menu_items').insert([{
                                restaurant_id: selectedRestaurant.id,
                                name: String(formData.get("name")),
                                price: parseFloat(String(formData.get("price"))),
                                description: String(formData.get("description")),
                                status: 'Pending' // <--- The magic happens here
                            }]);

                            setIsSubmitting(false);
                            if (!error) {
                                setIsDishModalOpen(false);
                                alert("Dish submitted! It will appear here once the admin approves it.");
                            } else {
                                alert("Error submitting dish.");
                            }
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Dish Name</label>
                                    <input name="name" required type="text" placeholder="e.g. Garlic Naan" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Price</label>
                                    <input name="price" required type="number" step="0.01" placeholder="4.99" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea name="description" rows={2} placeholder="What is in this dish?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:outline-none resize-none"></textarea>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 disabled:opacity-70 transition-all">
                                    {isSubmitting ? 'Sending to Admin...' : 'Submit Dish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}