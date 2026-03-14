import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../clients/Supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);

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

    const Login=async ({email,password})=>{
        const { data,error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
         return { data: data, error:error?.message };
    }

    const getUser = async (userId) => {
        const { data, error } = await supabase.from('User').select('*').eq('id', userId).single();
        if (error) {
            console.error(`User id ${userId} Profile fetch error:`, error.message);
            setUser(null);
        }
        setUser(data);
    }

    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            getUser(session?.user?.id);
        });
        
        
        supabase.auth.onAuthStateChange((_event, session) => { 
            setSession(session);
            getUser(session?.user?.id);
        });


    }, []);

    const Logout = async () => {
        const {error} = await supabase.auth.signOut();
        return { data: null, error:error?.message };
    }

    return (
        <AuthContext.Provider value={{ session, user, signUp, Logout, Login }}>
            {children}
        </AuthContext.Provider>
    );
    
};

export const useAuth = () => {
    return useContext(AuthContext);
};