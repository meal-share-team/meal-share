const API_URL = import.meta.env.VITE_API_URL;

export const suggestionService = {
    async listOpen() {
        const res = await fetch(`${API_URL}/suggestions`);
        if (!res.ok) throw new Error("Failed to load suggestions");
        return res.json();
    },
};
