Objective: Validate that we can capture user conviction and monitor it against market reality using a manual-first approach.

The "Vibe" Prototype (1-Week Build)
Infrastructure: Firebase (Blaze Plan) + Expo (React Native).

Data Source: Use a free-tier API like Alpha Vantage or Yahoo Finance for stock price tracking (manual ticker entry).

Core Logic: 1.  User enters ticker + price + "Why".
2.  Firebase Function runs every 4 hours to check current price against the "Why" targets.
3.  If Target/Stop hit, trigger Firebase Cloud Message (FCM).

Success Metric: Can a user record a thesis in under 30 seconds?