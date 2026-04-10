import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { reviewService, type OwnerReview } from "../../services/reviewService";

interface PendingDish {
    id: string;
    name: string;
    price: number;
    description: string;
}

export default function OwnerDashboardPage() {
    const [reviews, setReviews] = useState<OwnerReview[]>([]);
    const [pendingDishes, setPendingDishes] = useState<PendingDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState("Owner");

    const fetchDashboardData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user?.user_metadata?.display_name) {
            setRestaurantName(user.user_metadata.display_name);
        }

        const [reviewData, dishResponse] = await Promise.all([
            reviewService.listOwnerReviews().catch(() => []),
            supabase
                .from('menu_items')
                .select('id, name, price, description')
                .eq('status', 'Pending')
        ]);

        setReviews(reviewData);
        if (dishResponse.data) {
            setPendingDishes(dishResponse.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        void fetchDashboardData();
    }, []);

    const handleApprove = async (id: string) => {
        const { error } = await supabase
            .from('menu_items')
            .update({ status: 'Active' })
            .eq('id', id);

        if (!error) {
            void fetchDashboardData();
        }
    };

    const handleDismiss = async (id: string) => {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (!error) {
            void fetchDashboardData();
        }
    };

    const averageRating = reviews.length
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-10">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Reviews" value={reviews.length.toString()} sub="Lifetime" />
                    <StatCard title="Avg. Rating" value={`${averageRating} ★`} sub="Out of 5.0" highlight />
                    <StatCard title="Pending Suggs." value={pendingDishes.length.toString()} sub="Action Required" />
                </div>

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
                                        <button onClick={() => void handleApprove(dish.id)} className="flex-1 bg-black text-white text-[10px] font-black uppercase py-3 rounded-xl hover:bg-orange-500 transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => void handleDismiss(dish.id)} className="px-4 border border-slate-100 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feedback</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center font-bold text-slate-300">Loading...</td>
                                    </tr>
                                ) : reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-black">{review.dishName}</p>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-300 mt-1">
                                                    {review.customerName} • {review.restaurantName}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-black text-white text-xs font-black rounded-lg">{review.rating} ★</span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 text-sm font-medium max-w-sm">
                                                {review.caption?.trim() || "No written comment."}
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-sm font-bold">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center font-bold text-slate-300">No reviews yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, highlight = false }: { title: string; value: string; sub: string; highlight?: boolean }) {
    return (
        <div className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.02] ${highlight ? 'bg-black text-white border-black' : 'bg-white text-slate-900 border-slate-100 shadow-lg shadow-black/5'}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${highlight ? 'text-orange-400' : 'text-slate-400'}`}>{title}</p>
            <p className="text-5xl font-black tracking-tighter mb-2">{value}</p>
            <p className={`text-xs font-bold ${highlight ? 'text-slate-400' : 'text-slate-300'}`}>{sub}</p>
        </div>
    );
}
