import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export type AppRole = "CUSTOMER" | "OWNER" | "ADMIN";

type AuthUser = {
  id: string;
  email: string;
  role: AppRole;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            const { data } = await supabase.auth.getUser();
            const authUser = data.user;

            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            const role = (authUser.user_metadata.role ?? "CUSTOMER") as AppRole;

            setUser({
                id: authUser.id,
                email: authUser.email ?? "",
                role
            });
            setLoading(false);
        };

        void syncUser();

        const { data: subscription } = supabase.auth.onAuthStateChange(() => {
            void syncUser();
        });

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        signOut: async () => {
            await supabase.auth.signOut();
        }
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}