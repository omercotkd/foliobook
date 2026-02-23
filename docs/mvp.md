# Minimum Viable Product (MVP) Documentation

**Objective:** A polished, secure app that manages "Investor Amnesia" and offers a premium automated experience.

## 1. User Tiers & Feature Matrix

| Feature | Free (Zen) | Pro ($5/mo) |
| :--- | :--- | :--- |
| **Trade Entry** | Manual Only | Automated (SnapTrade) |
| **Max Portfolios** | 2 | Unlimited |
| **Sync Frequency** | N/A | Near Real-Time (Webhooks) |
| **Thesis Limit** | Unlimited | Unlimited |
| **Notifications** | Price Alerts & Review Reminders | "New Trade Detection" + Alerts |
| **Retention** | Manual Disconnect | Auto-disconnect on cancel |

## 2. Technical Architecture

* **Frontend (Expo):** Use the `snaptrade-react-native` SDK for the "Connect Account" flow in the Pro tier.
* **Backend (Cloud Functions):**
  * `manualTradeHandler`: Saves user-inputted trades.
  * `snaptradeWebhook`: Listens for `ACCOUNT_HOLDINGS_UPDATED`. When a new BUY transaction is parsed, it triggers the "Why?" push notification.
  * `subscriptionMonitor`: A daily cron job that checks Stripe/App Store receipts. If a subscription is revoked, it hits SnapTrade's `/authorizations/{id}` DELETE endpoint to stop the $2/mo billing.

## 3. The "Accountability" Logic

The app's value isn't just the data; it's the State Machine for a trade:

* **Pending:** Trade detected, but no "Why" recorded yet. (Nudge user daily).
* **Active:** Thesis recorded. Monitoring price.
* **Tested:** Price is near the Stop-Loss. (Nudge: "Is your thesis still valid?")
* **Closed:** User sold. (Ask: "Did you stick to your plan? Why/Why not?")
