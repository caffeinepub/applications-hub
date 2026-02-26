# Applications Hub

## Current State
The app already has basic React/TypeScript scaffolding with shadcn UI components, Tailwind CSS, and an InternetIdentity provider. There is no App.tsx yet with actual content beyond the initial scaffold.

## Requested Changes (Diff)

### Add
- Top navigation bar with "APPLICATIONS" label
- "GO TO SCRAMBLER" button linking to https://scrambler-prh.caffeine.xyz/
- "SCRAMBLY" button linking to https://scrambly-08a.caffeine.xyz/
- Sign-in options: Google, Apple, Microsoft, Epic Games, Yahoo, Hotmail
- Registration flow: username, password, date of birth (to verify age 10-18)
- Settings page with "Use Camera" toggle
- Camera verification page: uses webcam, randomly guesses age (10-18), asks if guess is correct
  - If correct: proceed to display name setup
  - If wrong: offer "Continue with ID" option
- "Continue with ID" page: verify via debit/credit card or state ID
- Display name page: after age verification, user types a display name
- Parental controls page/section
- Sonic Mania monitor box button style: buttons styled as Mania TV monitor boxes
- Button press animation: Sonic spindash breaking the monitor, disappearing off screen
- Button release (finger lift) animation: Sonic peelout animation
- Small Sonic sprite on the navigation bar

### Modify
- App.tsx to be the main entry point routing between all pages/screens

### Remove
- Nothing existing to remove

## Implementation Plan
1. Create Sonic sprite animations using CSS keyframes (spindash break, peelout)
2. Build MonitorButton component styled as a Sonic Mania TV monitor box with press/release animations
3. Build pages:
   - HomePage: APPLICATIONS bar, GO TO SCRAMBLER + SCRAMBLY buttons, sign-in options
   - RegisterPage: username, password, date of birth form
   - SettingsPage: Use Camera toggle
   - CameraVerificationPage: webcam feed, random age guess (10-18), confirm/deny flow
   - IDVerificationPage: debit/credit card or state ID form
   - DisplayNamePage: display name input
   - ParentalControlsPage: parental controls options
4. Wire navigation/routing between pages using React state
5. Add small Sonic sprite to navbar

## UX Notes
- Buttons must look like Sonic Mania TV monitor boxes (retro pixel art style)
- On mouse down / touch start: play Sonic spindash animation breaking the box, disappearing off screen
- On mouse up / touch end: play Sonic peelout animation
- Small Sonic character sits on the navigation bar
- Age verification is simulated (random number 10-18)
- Sign-in providers are UI only (no actual OAuth integration)
- Camera verification uses real webcam but age guess is randomized
