'use client'
import auth from '@/firebase/firebase.config';
import axios from 'axios';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null)



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signUpUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
    }
    // const githubLogin = () => {
    //     const provider = new GithubAuthProvider();
    //     return signInWithPopup(auth, provider)
    // }

    const updateProfileInfo = (name, photo) => {
        return updateProfile(auth.currentUser, { displayName: name, photoURL: photo })
    }

    const logOutUser = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser?.email ) {
                const loggedUser = { email: currentUser?.email };
                axios
                    .post(`${process.env.NEXT_PUBLIC_BASE_URL}/jwt`, loggedUser, { withCredentials: true })
                    .then(res => console.log('Token response:', res.data))
                    .catch(err => console.error('JWT request error:', err));
                setLoading(false);
            } else {
                axios
                    .post(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {},{ withCredentials: true })
                    .then(res => console.log('Logout response:', res.data))
                    .catch(err => console.error('Logout request error:', err));
                setLoading(false);
            }
            setLoading(false)
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    const authInfo = {
        user, setUser, signInUser, signUpUser, googleLogin, updateProfileInfo, logOutUser, loading, setLoading
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;