import { API_URL, buildAuthHeaders } from "../lib/api";

export interface ItemReview {
    id: string;
    menuItemId: string;
    userId: string;
    rating: number;
    caption: string | null;
    createdAt: string;
    user?: {
        id?: string;
        displayName?: string | null;
        email?: string | null;
    };
}

export interface OwnerReview {
    id: string;
    dishName: string;
    restaurantName: string;
    customerName: string;
    rating: number;
    caption: string | null;
    createdAt: string;
}

export interface ReviewItemContext {
    itemName?: string;
    restaurantName?: string;
    description?: string;
    priceCents?: number | null;
}

async function parseJsonResponse(response: Response) {
    if (response.ok) {
        return response.json();
    }

    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.message ?? `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
}

async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
    try {
        const response = await fetch(input, init);
        return await parseJsonResponse(response);
    } catch (error) {
        if (error instanceof TypeError) {
            console.error("Fetch error details:", error);
            console.error("Attempted URL:", input);
            throw new Error(`Review service is unreachable at ${input}. Make sure the API server is running and try again.`);
        }

        throw error;
    }
}

export const reviewService = {
    async listForItem(itemId: string, context?: ReviewItemContext): Promise<ItemReview[]> {
        const params = new URLSearchParams();

        if (context?.itemName) {
            params.set("itemName", context.itemName);
        }

        if (context?.restaurantName) {
            params.set("restaurantName", context.restaurantName);
        }

        const query = params.toString();
        return fetchJson(`${API_URL}/menu-items/${itemId}/reviews${query ? `?${query}` : ""}`);
    },

    async create(itemId: string, input: { rating: number; caption?: string } & ReviewItemContext) {
        const headers = await buildAuthHeaders();
        return fetchJson(`${API_URL}/menu-items/${itemId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(input),
        });
    },

    async listOwnerReviews(): Promise<OwnerReview[]> {
        const headers = await buildAuthHeaders();
        return fetchJson(`${API_URL}/owner/reviews`, {
            headers,
        });
    },
};
