# Challapalle

Cross-platform village community app built with **Expo + React Native**, sharing one UI codebase across web, Android and iOS.

## Run locally

```bash
npm install
npm run web
```

For mobile development:

```bash
npm run android
npm run ios
```

## Architecture

The app uses React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, `StyleSheet`) so the same screens render on web and native. Platform-specific behavior can be introduced with `.web`, `.ios`, and `.android` files when needed.

## Roadmap

1. Village places, history and gallery
2. Community posts and announcements
3. Local business/service directory
4. Events and festivals
5. Authentication and profiles
6. Admin dashboard and moderation
7. PWA/app polish, deep links and notifications
