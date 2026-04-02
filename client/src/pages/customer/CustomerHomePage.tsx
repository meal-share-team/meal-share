import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// --- TypeScript Interfaces ---
interface MenuItem {
  id: number;
  title: string;
  restaurantChain: string;
  image: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: { street: string; city: string; state: string; };
}

type ViewState = 'discover' | 'saved';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [view, setView] = useState<ViewState>('discover');
    const [savedMeals, setSavedMeals] = useState<MenuItem[]>([]);
    
    // Discover (Local) State
    const [citySearch, setCitySearch] = useState('');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [restaurantMenu, setRestaurantMenu] = useState<MenuItem[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Suggestion Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSpotLoading, setNewSpotLoading] = useState(false);

    const API_KEY = 'YOUR_SPOONACULAR_API_KEY'; // *** PASTE KEY HERE ***

    // --- 1. Handle City Search (Mock Database Approach) ---
    const handleCitySearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const searchVal = citySearch.trim().toLowerCase();
        if (!searchVal) return;

        setIsLoading(true);
        setLocationError(null);
        setSelectedRestaurant(null);

        // Simulate network delay for realism
        setTimeout(() => {
            // Our Mock Database
            const cityData: Record<string, Restaurant[]> = {
                "cincinnati": [
                    { _id: "cin1", name: "Melt Revival", address: { street: "4100 Hamilton Ave", city: "Cincinnati", state: "OH" } },
                    { _id: "cin2", name: "Skyline Chili", address: { street: "290 Ludlow Ave", city: "Cincinnati", state: "OH" } },
                    { _id: "cin3", name: "Aladdin's Eatery", address: { street: "3202 Vandercar Way", city: "Cincinnati", state: "OH" } },
                    { _id: "cin4", name: "Ambar India", address: { street: "350 Ludlow Ave", city: "Cincinnati", state: "OH" } }
                ],
                "chicago": [
                    { _id: "chi1", name: "Lou Malnati's", address: { street: "439 N Wells St", city: "Chicago", state: "IL" } },
                    { _id: "chi2", name: "Portillo's", address: { street: "100 W Ontario St", city: "Chicago", state: "IL" } },
                    { _id: "chi3", name: "Girl & the Goat", address: { street: "809 W Randolph St", city: "Chicago", state: "IL" } }
                ],
                "new york": [
                    { _id: "ny1", name: "Joe's Pizza", address: { street: "7 Carmine St", city: "New York", state: "NY" } },
                    { _id: "ny2", name: "Katz's Delicatessen", address: { street: "205 E Houston St", city: "New York", state: "NY" } },
                    { _id: "ny3", name: "Levain Bakery", address: { street: "167 W 74th St", city: "New York", state: "NY" } }
                ]
            };

            // Check if the search matches our database (handles "Cincinnati", "cincinnati, oh", etc.)
            let foundRestaurants: Restaurant[] = [];
            
            if (searchVal.includes("cincinnati")) {
                foundRestaurants = cityData["cincinnati"];
            } else if (searchVal.includes("chicago")) {
                foundRestaurants = cityData["chicago"];
            } else if (searchVal.includes("new york") || searchVal.includes("nyc")) {
                foundRestaurants = cityData["new york"];
            }

            if (foundRestaurants.length > 0) {
                setRestaurants(foundRestaurants);
            } else {
                handleLocationError(`We don't have any community spots in "${citySearch}" yet. Try searching for Cincinnati, Chicago, or New York!`);
            }
            
            setIsLoading(false);
        }, 600); // 600ms delay to feel like a real API
    };

    const handleLocationError = (message: string) => {
        setLocationError(message);
        // Fallback to local spots so the UI never breaks
        setRestaurants([
            { _id: "1", name: "Melt Revival", address: { street: "4100 Hamilton Ave", city: "Cincinnati", state: "OH" } },
            { _id: "2", name: "Skyline Chili", address: { street: "290 Ludlow Ave", city: "Cincinnati", state: "OH" } },
            { _id: "3", name: "Aladdin's Eatery", address: { street: "3202 Vandercar Way", city: "Cincinnati", state: "OH" } },
            { _id: "4", name: "Deep India", address: { street: "311 Ludlow Ave", city: "Cincinnati", state: "OH" } }
        ]);
        setIsLoading(false);
    };

    // --- 2. Fetch Menu for Selected Restaurant ---
    const handleRestaurantClick = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api.spoonacular.com/food/menuItems/search?apiKey=${API_KEY}&restaurantChain=${encodeURIComponent(restaurant.name)}&number=6`
            );
            const data = await response.json();
            setRestaurantMenu(data.menuItems || []);
        } catch (err) {
            console.error("Failed to fetch restaurant menu", err);
            setRestaurantMenu([]); 
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. Save / Unsave Functionality ---
    const toggleSaveMeal = (meal: MenuItem) => {
        setSavedMeals((prev) => {
            const isSaved = prev.some(m => m.id === meal.id);
            if (isSaved) {
                return prev.filter(m => m.id !== meal.id); 
            } else {
                return [...prev, meal]; 
            }
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // --- Render Helpers ---
    const renderMealGrid = (mealList: MenuItem[], emptyMessage: string) => {
        if (mealList.length === 0 && !isLoading) {
            return (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xl text-slate-500 font-medium">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mealList.map((meal) => {
                    const isSaved = savedMeals.some(m => m.id === meal.id);
                    return (
                        <div key={meal.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative">
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                {meal.image ? (
                                    <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Image Provided</div>
                                )}
                            </div>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleSaveMeal(meal); }}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-110 transition-transform z-10"
                            >
                                {isSaved ? '❤️' : '🤍'}
                            </button>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-lg leading-snug mb-1 line-clamp-2 text-slate-900">{meal.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium">{meal.restaurantChain}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-bold px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full">Popular</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex z-10">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">M</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Meal Share</h2>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => { 
                            setView('discover'); 
                            setSelectedRestaurant(null); 
                        }}
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

            {/* Main Content Area */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="mb-10">
                    {view === 'discover' && !selectedRestaurant && (
                        <>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Discover Local Spots</h1>
                            <p className="text-slate-500 font-medium mb-8">Search for a city to find the best dishes around you.</p>
                            
                            {/* NEW: City Search Bar */}
                            <form onSubmit={handleCitySearch} className="flex gap-4 max-w-2xl">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cincinnati, OH"
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
                            <p className="text-slate-500 font-medium">{selectedRestaurant.address.street}, {selectedRestaurant.address.city}</p>
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
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="bg-slate-200 animate-pulse h-64 rounded-3xl"></div>
                        ))}
                    </div>
                )}

                {/* 1. Discover -> List of Restaurants */}
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
                                <p className="text-slate-500 font-medium">Type a city in the search bar above to begin.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {restaurants.map(restaurant => (
                                    <div 
                                        key={restaurant._id} 
                                        onClick={() => handleRestaurantClick(restaurant)}
                                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-black group-hover:text-white transition-colors">
                                                🍽️
                                            </div>
                                            <h3 className="font-bold text-xl mb-1 text-slate-900 leading-tight">{restaurant.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium">{restaurant.address.street}</p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-50">
                                            <span className="text-sm font-bold text-black group-hover:underline decoration-2 underline-offset-4">
                                                View Menu &rarr;
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* The "Suggest a Spot" Card */}
                                <div 
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center min-h-[250px]"
                                >
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform text-slate-400 group-hover:text-orange-500">
                                        💡
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-slate-700 group-hover:text-orange-700">Don't see your favorite?</h3>
                                    <p className="text-slate-500 text-sm font-medium group-hover:text-orange-600">Suggest a local spot for us to contact.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Discover -> Specific Menu Items */}
                {!isLoading && view === 'discover' && selectedRestaurant && (
                    <div className="mt-8">
                        {renderMealGrid(restaurantMenu, `We couldn't find specific menu items for ${selectedRestaurant.name} right now.`)}
                    </div>
                )}

                {/* 3. Saved Meals */}
                {!isLoading && view === 'saved' && (
                    <div className="mt-8">
                        {renderMealGrid(savedMeals, "You haven't saved any meals yet! Head back to Discover to explore.")}
                    </div>
                )}

            </main>

            {/* --- Suggest Spot Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Suggest a Spot</h3>
                                    <p className="text-slate-500 font-medium mt-1">We'll reach out and invite them to Meal Share.</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form 
                                className="space-y-5"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setNewSpotLoading(true);
                                    
                                    // Simulated network request
                                    setTimeout(() => {
                                        setNewSpotLoading(false);
                                        setIsModalOpen(false);
                                        alert("Suggestion sent! Thanks for helping grow the Meal Share community.");
                                    }, 800);
                                }}
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Restaurant Name</label>
                                    <input 
                                        name="name"
                                        required
                                        type="text" 
                                        placeholder="e.g. Ambar India" 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Neighborhood / Area</label>
                                    <input 
                                        name="neighborhood"
                                        required
                                        type="text" 
                                        placeholder="e.g. Clifton / University area" 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={newSpotLoading}
                                        className={`w-full bg-black text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] ${newSpotLoading ? 'opacity-70' : 'hover:bg-slate-800'}`}
                                    >
                                        {newSpotLoading ? 'Sending Suggestion...' : 'Submit Suggestion'}
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