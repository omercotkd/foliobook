import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  connectAuthEmulator,
  // @ts-expect-error -- exported at runtime in firebase/auth ≥ v10.12
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import googleServices from "../../google-services.json";

const client = googleServices.client[0];

const firebaseConfig = {
  apiKey: client.api_key[0].current_key,
  authDomain: `${googleServices.project_info.project_id}.firebaseapp.com`,
  projectId: googleServices.project_info.project_id,
  storageBucket: googleServices.project_info.storage_bucket,
  messagingSenderId: googleServices.project_info.project_number,
  appId: client.client_info.mobilesdk_app_id,
};

const isNew = getApps().length === 0;
const app = isNew ? initializeApp(firebaseConfig) : getApps()[0];

// initializeAuth must only be called once per app instance.
// On subsequent evaluations (fast-refresh / hot-reload) fall back to getAuth.
const auth = isNew
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : getAuth(app);

// Emulator is OPT-IN — set EXPO_PUBLIC_USE_EMULATOR=true in .env.local to enable.
// Without this flag, all auth traffic goes to real Firebase (emails are delivered).
// connectAuthEmulator must only be called once; the isNew guard prevents duplicate
// calls on fast-refresh cycles.
if (__DEV__) {
  console.log("[firebase] EXPO_PUBLIC_USE_EMULATOR =", process.env.EXPO_PUBLIC_USE_EMULATOR);
}
if (__DEV__ && isNew && process.env.EXPO_PUBLIC_USE_EMULATOR === "true") {
  // Android emulator: 10.0.2.2 → host machine localhost
  // iOS Simulator / real device on same network: set EXPO_PUBLIC_AUTH_EMULATOR_HOST
  const emulatorHost =
    process.env.EXPO_PUBLIC_AUTH_EMULATOR_HOST ?? "10.0.2.2";
  connectAuthEmulator(auth, `http://${emulatorHost}:9099`, {
    disableWarnings: false,
  });
}

/** Web Client ID (oauth_client with client_type 3) for Google Sign-In */
const webClientId = client.oauth_client.find(
  (c: { client_type: number }) => c.client_type === 3
)?.client_id;

export { app, auth, webClientId };
