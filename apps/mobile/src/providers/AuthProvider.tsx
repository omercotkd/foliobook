import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from "firebase/auth";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { auth, webClientId } from "@/config/firebase";

// Guard Google Sign-In: the native module is unavailable in Expo Go.
// A custom dev-client build (`expo run:android`) is required for it to work.
let GoogleSignin: typeof import("@react-native-google-signin/google-signin").GoogleSignin | null =
  null;
try {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;
} catch {
  console.warn(
    "RNGoogleSignin native module not found – Google Sign-In disabled. " +
      "Run `npx expo run:android` to build a custom dev client.",
  );
}

const EMAIL_STORAGE_KEY = "@foliobook/emailForSignIn";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  completeMagicLinkSignIn: (url: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure Google Sign-In (only when native module is available)
  useEffect(() => {
    GoogleSignin?.configure({ webClientId });
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // Listen for deep links to handle magic link sign-in
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (isSignInWithEmailLink(auth, event.url)) {
        try {
          await completeMagicLinkSignIn(event.url);
        } catch (error) {
          console.error("Magic link sign-in failed:", error);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if the app was opened via a deep link
    Linking.getInitialURL().then((url) => {
      if (url && isSignInWithEmailLink(auth, url)) {
        completeMagicLinkSignIn(url).catch(console.error);
      }
    });

    return () => subscription.remove();
  }, []);

  const signInWithGoogle = async () => {
    if (!GoogleSignin) {
      Alert.alert(
        "Google Sign-In unavailable",
        "Google Sign-In requires a custom dev-client build.\nRun: npx expo run:android",
      );
      return;
    }

    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (!response.data?.idToken) {
      throw new Error("Google Sign-In failed: no ID token");
    }

    const credential = GoogleAuthProvider.credential(response.data.idToken);
    await signInWithCredential(auth, credential);
  };

  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      url: Linking.createURL("/auth/verify"),
      handleCodeInApp: true,
      android: {
        packageName: "com.foliobook.app",
        installApp: false,
      },
      iOS: {
        bundleId: "com.foliobook.app",
      },
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    await AsyncStorage.setItem(EMAIL_STORAGE_KEY, email);
  };

  const completeMagicLinkSignIn = async (url: string) => {
    const email = await AsyncStorage.getItem(EMAIL_STORAGE_KEY);
    if (!email) {
      throw new Error("No email found. Please enter your email again.");
    }

    await signInWithEmailLink(auth, email, url);
    await AsyncStorage.removeItem(EMAIL_STORAGE_KEY);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        sendMagicLink,
        completeMagicLinkSignIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
