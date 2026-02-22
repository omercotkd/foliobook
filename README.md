# FolioBook 📈

**FolioBook** is a "Zen-style" investment accountability app. It helps long-term investors stick to their strategy by capturing the "Why" behind every trade and nudging them when their thesis is tested.
The inspiration for this app came from a personal pain point: logging into a brokerage account is often stressful. Constantly seeing real-time performance and daily fluctuations can distract from long-term conviction and trigger emotional decisions.

## 🚀 The Hybrid Model
- **Free Tier:** Manual entry of trades + Thesis tracking.
- **Pro Tier ($5.99/mo):** Automated trade detection via **SnapTrade** + Real-time notifications.

## Theoretical pricing breakdown:
- **SnapTrade API:** $2 per user/month
- **Firebase Costs:** Free for now, but could scale with users
- **Play store/App store fees:** 30% of subscription revenue - ~$1.80 per user/month
- **Net Revenue:** ~$2.19 per user/month after costs

## 🛠 Tech Stack
- **Monorepo:** Turborepo
- **Mobile:** Expo (React Native)
- **Backend:** Firebase (Firestore, Functions, Auth)
- **Broker Sync:** SnapTrade API
- **Payments:** Google Play & Apple In-App Purchases

## 📦 Getting Started
1. **Install dependencies:** `npm install`
2. **Setup Firebase:** `firebase init`
3. **Start Dev Mode:** `npx turbo dev`

## 📄 Documentation
Detailed project docs can be found in the `/docs` folder:
- [MVC Document](./docs/mvc.md)
- [POC Document](./docs/poc.md)