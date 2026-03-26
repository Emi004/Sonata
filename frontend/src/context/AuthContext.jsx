import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../clients/Supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = async ({email,password,username}) => {
        const { data,error } = await supabase.auth.signUp({ 
            email: email, 
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        return { data: data, error:error?.message };
    }

    const Login = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data: data, error: error?.message };
    };
    
    const uploadToStorage = async (file, bucket) => {
        // Prefer Supabase auth UID as folder, fallback to backend user id
        const folderId = session?.user?.id || user?.id;
        if (!folderId) {
            console.error("Cannot upload: missing user/session id");
            return null;
        }

        const fileName = `${folderId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });
        if (error) {
            console.error("Storage upload error:", error);
            return null;
        }

        // Supabase JS v2: getPublicUrl returns { data: { publicUrl } }
        const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return publicData?.publicUrl ?? null;
    };

    const updateUser = async ({ username, avatarUrl, accessToken }) => {
        const updates = {};
        if (username !== undefined) updates.username = username;
        if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { data: null, error: errorText || "Failed to update user" };
        }

        const data = await response.json();
        setUser(data);
        return { data, error: null };
    };

    const getCurrentUser = async (accessToken) => {
        setLoading(true);

        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (_err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            getCurrentUser(session?.access_token);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            getCurrentUser(session?.access_token);
        });
    }, []);

    const Logout = async () => {
        const {error} = await supabase.auth.signOut();
        return { data: null, error:error?.message };
    }

    return (
		<AuthContext.Provider value={{ session, user, loading, signUp, Logout, Login, updateUser, uploadToStorage }}>
            {children}
        </AuthContext.Provider>
    );
    
};

export const useAuth = () => {
    return useContext(AuthContext);
};