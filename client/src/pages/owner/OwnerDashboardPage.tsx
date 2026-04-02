// Page for owners to view the review statistics for their menu items and restaurant
// Can access ... 
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Review {
    id: string;
    dish_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function OwnerDashboardPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState("Owner"); // Fallback title

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);

            // 1. Fetch User Data (to get the Restaurant Name)
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.display_name) {
                setRestaurantName(user.user_metadata.display_name);
            }

            // 2. Fetch Review Stats
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setReviews(data);
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    // Derived Statistics
    const averageRating = reviews.length 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "0.0";
    
    const trendingDish = reviews.length > 0 ? reviews[0].dish_name : "N/A";

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
                            {/* Updated title to use the dynamic name */}
                            {restaurantName} <span className="text-orange-500 italic">Dashboard.</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                        Last updated: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Reviews" value={reviews.length.toString()} sub="Lifetime" />
                    <StatCard title="Avg. Rating" value={`${averageRating} ★`} sub="Out of 5.0" highlight />
                    <StatCard title="Trending Dish" value={trendingDish} sub="Based on recent activity" />
                </div>

                {/* Review Table / Feed */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100 overflow-hidden">
                    <div className="px-8 py-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tight">Recent Dish Reviews</h3>
                        <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dish Name</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rating</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Comment</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-8 py-10 text-center font-bold text-slate-300">Loading metrics...</td></tr>
                                ) : reviews.length === 0 ? (
                                    <tr><td colSpan={4} className="px-8 py-10 text-center font-bold text-slate-300">No reviews found yet.</td></tr>
                                ) : (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-6 font-bold text-black">{review.dish_name}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-black text-white text-xs font-black rounded-lg">
                                                    {review.rating} ★
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 font-medium max-w-xs truncate">{review.comment}</td>
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
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${highlight ? 'text-orange-400' : 'text-slate-400'}`}>
                {title}
            </p>
            <p className="text-5xl font-black tracking-tighter mb-2">{value}</p>
            <p className={`text-xs font-bold ${highlight ? 'text-slate-400' : 'text-slate-300'}`}>{sub}</p>
        </div>
    );
}