# Applications Hub

## Current State
The app has a Settings page with options for Use Camera, Parental Controls, and Display Name. No background music exists.

## Requested Changes (Diff)

### Add
- Background music using the Casino Night Zone OGG from archive.org
- A "MUSIC" section in Settings that reveals a "BACKGROUND MUSIC" sub-option
- Volume slider (1–100) where 1 = muted
- When volume is 1 (muted), show a speaker-with-X icon; otherwise show a normal speaker icon
- Music plays globally across all pages once enabled; persists via localStorage

### Modify
- SettingsPage: add a Music settings card with expand/collapse to show the background music volume slider
- App.tsx: add a global audio player component that reads volume from shared state/localStorage and plays the track on loop

### Remove
- Nothing removed

## Implementation Plan
1. Create a `useMusicPlayer` custom hook that manages audio state (volume 1–100, muted at 1), persists to localStorage, and controls an HTMLAudioElement with the archive.org OGG URL
2. Add a MusicBar or floating audio controller that mounts once in App.tsx so music continues across page navigations
3. In SettingsPage, add a "🎵 MUSIC" section card. Inside it show a "BACKGROUND MUSIC" row with a volume slider (range 1–100) and the muted/unmuted speaker icon
4. Speaker icon: when volume === 1, render a speaker-with-X (muted); otherwise render a normal speaker icon (using SVG or emoji)
