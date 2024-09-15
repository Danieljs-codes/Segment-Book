import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "~lib/supabase";

export interface AuthContextType {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	updateSession: (session: Session | null) => void;
	// Add other auth methods as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const setData = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) console.log(error);
			else {
				setSession(session);
				setUser(session?.user ?? null);
			}
			setIsLoading(false);
		};

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setUser(session?.user ?? null);
				setIsLoading(false);
			},
		);

		setData();

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	const value = {
		session,
		user,
		isLoading,
		signIn: async (email: string, password: string) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;
		},
		signOut: async () => {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		},
		updateSession: (newSession: Session | null) => {
			setSession(newSession);
			setUser(newSession?.user ?? null);
		},
	};

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
