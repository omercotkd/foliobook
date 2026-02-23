# 🗺️ FolioBook User Flow

This document defines the end-to-end user journey for FolioBook, distinguishing between Guest, Authenticated, and Pro (Subscriber) states.

---

## 1. Entry & Authentication
**Goal:** Minimize friction while securing user data.

* **Landing Page:** A minimalist "Editorial" screen featuring the FolioBook logo and mission.
* **Google Login (Primary):** Authenticates via Firebase Auth. Syncs data to Firestore.
* **Guest Mode (Secondary):** * No login required.
    * Data is stored locally using **SQLite**.
    * **Migration Path:** If a Guest later logs in, local data is "hoisted" and merged into the new Firestore account.



---

## 2. The Thesis Loop (Free Tier / Manual)
**Goal:** Solve "Investor Amnesia" through manual discipline.

1.  **Trigger:** User taps the floating `+` button in the "Library."
2.  **Trade Entry:** * User searches for Ticker ($AAPL).
    * User selects **Long** (Green theme) or **Short** (Red theme).
    * User enters **Entry Price** and **Quantity**.
3.  **The Mandate (The "Why"):** * The user must record their thesis.
    * *Constraint:* "Save" is locked until a minimum character count is met.
4.  **Monitoring:** The trade appears in the Library with a "Manual" badge. Performance is updated via a background price API.

---

## 3. The Pro Upgrade (Conversion)
**Goal:** Monetize the convenience of automation.

* **The Hook:** Users seeing the "Connect Broker" lock icon or hitting the manual trade limit.
* **The Pitch:** "Stop entering trades manually. FolioBook Pro detects your buys instantly and nudges you for the 'Why'."
* **Checkout:** Handled via Stripe or In-App Purchases (RevenueCat recommended).
* **SnapTrade Link:** Upon successful payment, the user is redirected to the SnapTrade Link UI to authorize their brokerage (Robinhood, Schwab, etc.).

---

## 4. The Automated Loop (Pro Tier)
**Goal:** Passive detection with active accountability.

1.  **Detection:** User executes a trade in their brokerage app.
2.  **Webhook:** SnapTrade pings the Firebase `snaptradeWebhook` function.
3.  **The Nudge:** Firebase sends a Push Notification (FCM): *"New $TSLA trade detected. Why did you buy?"*
4.  **One-Tap Entry:** Tapping the notification opens FolioBook directly to a pre-filled Thesis form.
5.  **Sync:** The trade is saved with a "Synced" badge.



---

## 5. Subscription Management & Cancellation
**Goal:** Maintain trust and manage developer costs.

* **Cancellation:** User cancels via Settings.
* **Backend Trigger:** Firebase Cloud Function detects the subscription end.
* **Cost Control:** **Immediate Disconnect.** The app calls the SnapTrade `DELETE /authorizations` endpoint to stop the $1.50–$2.00/mo billing for that user.
* **Data Retention:** User keeps all historical data but must return to manual entry for future trades.

---

## 🤖 AI Agent Implementation logic
**Context for the AI Developer:**

- **State Management:** Use a `useUserContext` to track `authStatus` (GUEST | AUTHENTICATED | PRO).
- **Storage Strategy:** Implement a `StorageService` that switches between `LocalStorage` (Guest) and `FirestoreService` (Authenticated).
- **Pro-Guard:** Components related to SnapTrade must be wrapped in a HOC or conditional check that verifies `user.isPro === true`.