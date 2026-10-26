# Margin

A calm, offline-friendly notes app built with JavaScript, React Native, and Expo.

## Features

- Create and edit notes with a title, category, and paper color.
- Search note titles, content, and categories.
- Pin notes for quick access, archive notes to tuck them away, or move notes to the trash.
- Restore notes from the trash or permanently delete them.
- Keep notes on the device with AsyncStorage.

## Run the app

1. Use a Node.js version supported by Expo SDK 58: 22.13+, 24.3+, 26+, or 27+.
2. Install the dependencies with `npm install`.
3. Start Expo with `npx expo start`.
4. Open the project in Expo Go SDK 58, an emulator, or a simulator.

## Project structure

- `App.js` — app entry point and screen state.
- `src/screens/` — the notes list and note editor screens.
- `src/components/` — reusable note cards, category filters, and empty/error states.
- `src/hooks/useNotes.js` — note actions and storage state.
- `src/storage/notesStorage.js` — device persistence.
- `src/data/starterNotes.js` — examples shown on first launch.
- `src/theme.js` — colors and categories.