# Défi 90 jours — app mobile

App iOS / Android (Expo, React Native) du défi « disparais 90 jours, reviens méconnaissable ».
Même programme que la version web `/defi` : le contenu vient de `../src/content/defi.ts` et la
logique de `../src/lib/defi-core.ts`. Modifier le programme là-bas met à jour le site **et** l'app.

## Les alarmes

Ce sont des notifications locales programmées par le téléphone (`expo-notifications`, déclencheur
quotidien) : elles sonnent **app fermée et écran verrouillé**, sans serveur. Heures réglables dans
l'onglet « Alarmes ». Elles s'arrêtent d'elles-mêmes après J90.

## Essayer sur ton téléphone (5 minutes)

1. Installe **Expo Go** depuis l'App Store / le Play Store.
2. Sur ton ordinateur :
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. Scanne le QR code affiché (appareil photo sur iPhone, app Expo Go sur Android).

## Installer l'app pour de vrai (sans Expo Go)

Build dans le cloud avec EAS, pas besoin de Xcode ni d'Android Studio :

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview   # APK à installer directement
eas build --platform ios                          # nécessite un compte Apple Developer (99 $/an)
```

## Structure

| Fichier | Rôle |
|---|---|
| `src/app/onboarding.tsx` | Engagement, pourquoi, date de départ |
| `src/app/(tabs)/index.tsx` | Le jour : 3 missions, minuteur, journal, règles |
| `src/app/(tabs)/parcours.tsx` | Grille des 90 jours, série, stats |
| `src/app/(tabs)/idees.tsx` | Vide-tête et tri des idées |
| `src/app/(tabs)/bilans.tsx` | Mesures J1 / J30 / J60 / J90 |
| `src/app/(tabs)/alarmes.tsx` | Heures d'alarme, hardcore, sauvegarde |
| `src/notifications.ts` | Programmation des alarmes |
| `src/store.tsx` | État local (AsyncStorage) |

Vérifications : `npm run typecheck` et `npx expo-doctor`.
