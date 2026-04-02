import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Review {
    id: string;
    dish_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface PendingDish {
    id: string;
    name: string;
    price: number;
    description: string;
}

export default function OwnerDashboardPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [pendingDishes, setPendingDishes] = useState<PendingDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState("Owner");

    const fetchDashboardData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.user_metadata?.display_name) {
            setRestaurantName(user.user_metadata.display_name);
        }

        // 1. Fetch Reviews
        const { data: reviewData } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        // 2. Fetch Pending Suggestions from Customers
        const { data: dishData } = await supabase
            .from('menu_items')
            .select('id, name, price, description')
            .eq('status', 'Pending'); // Filter for items suggested by customers

        if (reviewData) setReviews(reviewData);
        if (dishData) setPendingDishes(dishData);
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApprove = async (id: string) => {
        const { error } = await supabase
            .from('menu_items')
            .update({ status: 'Active' })
            .eq('id', id);

        if (!error) fetchDashboardData(); // Refresh list
    };

    const handleDismiss = async (id: string) => {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (!error) fetchDashboardData(); // Refresh list
    };

    const averageRating = reviews.length 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "0.0";

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Live Analytics
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-black">
                            {restaurantName} <span className="text-orange-500 italic">Dashboard.</span>
                        </h1>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Reviews" value={reviews.length.toString()} sub="Lifetime" />
                    <StatCard title="Avg. Rating" value={`${averageRating} ★`} sub="Out of 5.0" highlight />
                    <StatCard title="Pending Suggs." value={pendingDishes.length.toString()} sub="Action Required" />
                </div>

                {/* NEW: Pending Suggestions Section */}
                {pendingDishes.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500 ml-2">Customer Suggestions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingDishes.map((dish) => (
                                <div key={dish.id} className="bg-white p-6 rounded-[2rem] border-2 border-orange-100 shadow-xl shadow-orange-500/5 space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Dish Suggestion</p>
                                        <h4 className="text-xl font-black tracking-tight">{dish.name}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-2">{dish.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleApprove(dish.id)}
                                            className="flex-1 bg-black text-white text-[10px] font-black uppercase py-3 rounded-xl hover:bg-orange-500 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleDismiss(dish.id)}
                                            className="px-4 border border-slate-100 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Review Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100 overflow-hidden">
                    <div className="px-8 py-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tight">Recent Dish Reviews</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dish Name</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rating</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={3} className="px-8 py-10 text-center font-bold text-slate-300">Loading...</td></tr>
                                ) : (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-6 font-bold text-black">{review.dish_name}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-black text-white text-xs font-black rounded-lg">{review.rating} ★</span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-sm font-bold">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, highlight = false }: { title: string, value: string, sub: string, highlight?: boolean }) {
    return (
        <div className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.02] ${highlight ? 'bg-black text-white border-black' : 'bg-white text-slate-900 border-slate-100 shadow-lg shadow-black/5'}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${highlight ? 'text-orange-400' : 'text-slate-400'}`}>{title}</p>
            <p className="text-5xl font-black tracking-tighter mb-2">{value}</p>
            <p className={`text-xs font-bold ${highlight ? 'text-slate-400' : 'text-slate-300'}`}>{sub}</p>
        </div>
    );
}