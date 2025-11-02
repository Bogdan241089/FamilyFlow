import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { createFamily as serviceCreateFamily } from '../services/firestoreService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth methods
  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    // create user profile in Firestore
    await setDoc(doc(db, 'users', uid), {
      name: displayName || '',
      email,
      role: 'parent',
      createdAt: serverTimestamp()
    });
    return userCredential;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  // Create a family and add current user as owner/member
  async function createFamily(name) {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', uid);

    const familyId = await serviceCreateFamily(db, { name, ownerId: uid });

    // update user's defaultFamilyId
    await setDoc(userDocRef, { defaultFamilyId: familyId }, { merge: true });
    return familyId;
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    createFamily
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>Загрузка...</div> : children}
    </AuthContext.Provider>
  );
}