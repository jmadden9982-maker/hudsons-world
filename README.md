# Hudson's World

A premium children's adventure game built with Phaser 3 and Capacitor.

## Development

```bash
npm install
npm run dev
```

## Build for Web

```bash
npm run build
```

## Build Android APK

### Local

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Then build the APK in Android Studio.

### Using GitHub Actions

Push to `main` branch. The workflow will automatically build a debug APK and upload it as an artifact.

## Project Structure

- `src/main.js` - Game entry point
- `src/scenes/` - All game scenes
- `src/systems/` - Audio, Haptics, Reward Juice, Golden Douglas, etc.
- `.github/workflows/build-apk.yml` - Automatic APK build

## Status

This is a buildable foundation for Hudson's World (V6.0+). 
Real audio assets, full gameplay, and polish are being added iteratively.