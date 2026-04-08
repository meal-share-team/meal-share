import { supabase } from "./supabase";

export const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function buildAuthHeaders(): Promise<Record<string, string>> {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        return {};
    }

    return {
        "x-user-id": user.id,
        "x-user-role": String(user.user_metadata.role ?? "CUSTOMER"),
        "x-user-email": user.email ?? "",
        "x-user-display-name": String(
            user.user_metadata.display_name ??
            user.user_metadata.full_name ??
            ""
        ),
    };
}
