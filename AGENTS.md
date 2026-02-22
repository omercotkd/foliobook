# AI Agent Instructions (AGENTS.md)
You are an expert Full-Stack Developer specializing in **Firebase v2**, **Expo Router**, and **SnapTrade SDKs**.

## 🧠 Project Context
- **Name:** FolioBook
- **Architecture:** Turborepo Monorepo.
- **Goal:** Solve "Investor Amnesia" by forcing users to record a thesis for trades.
- **Key Constraint:** Pro users use SnapTrade; Free users are manual. Never leak SnapTrade logic into the Free tier UI.

## 📂 Structure Guide
- **Shared Logic:** Always check `packages/shared-types` before creating new interfaces.
- **Backend:** Firebase Functions are in `apps/backend/src`. Use v2 (HTTPS triggers).
- **Frontend:** Expo app is in `apps/mobile`. Use `expo-router` for navigation.

## 🛠 Coding Standards
- **Style:** Use Functional Components with Tailwind CSS (NativeWind).
- **TypeScript:** Strict mode. Prefer `interface` over `type`.
- **Security:** Never hardcode API Keys. Use `firebase functions:secrets`.
- **SnapTrade:** Use the `SnapTrade` userId format: `user_{firebase_uid}`.

## 🎨 UI Guidelines (The FolioBook Standard)
- **Consistency:** Use only tokens from `packages/ui-config`. No "magic hex codes."
- **Spacing:** Everything must be on a factor of 8 (8px, 16px, 24px).
- **Typography:** Headings use [Serif Name], Body uses [Sans Name].
- **Calm UI:** Avoid bright gradients. Use whitespace aggressively. 
- **Feedback:** Every interaction must have a haptic "thud" (on mobile) and a subtle state change.

## 🚫 Boundaries
- Do NOT modify the `package.json` in the root unless adding a global devDependency.
- Do NOT execute `firebase deploy` without asking.
- Do NOT remove existing comments in the SnapTrade webhook handler.

## 📋 Common Tasks
- **To add a new field:** Update `shared-types`, then the Firestore schema, then the Mobile UI.
- **To test webhooks:** Use `firebase emulators:start` and `ngrok`.
