# SowSmart QA Test Checklist

Use this document to test all major app features in a repeatable way before demos or releases.

## 1. Test Run Metadata

- Tester:
- Date:
- Build/Branch:
- Environment: local / staging
- Browser(s):
- Device(s):

## 2. Prerequisites

1. Install and run the app:
   - npm install
   - npm run dev
2. Ensure env vars are set in .env:
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - GEMINI_API_KEY (or GOOGLE_API_KEY)
   - ELEVENLABS_API_KEY (for voice playback)
   - Optional: ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID
3. Open http://localhost:3000 in a fresh browser profile (or clear local/session storage).

## 3. High-Level Pass Criteria

A run is PASS if all of the following are true:

- Root route opens landing page first.
- Login success redirects to recommendations dashboard.
- Recommendations page loads profile and shows recommendation cards.
- Chat and voice interactions do not crash and show expected UI feedback.
- Protected route behavior works (unauthenticated users are redirected to login).

## 4. End-to-End User Flows

### Flow A: New User Signup (Text Mode)

1. Open /.
2. Click primary CTA for onboarding.
3. Choose Text mode.
4. Answer all onboarding questions.
5. Create account with new email + password.
6. Confirm redirect to recommendations dashboard.

Expected:

- No dead-end screens.
- Redirect lands on /recommendations.
- Recommendation cards render with title, summary, reason, policy explanation, peer choices.

### Flow B: Existing User Login from Landing

1. Open /.
2. Click Login.
3. Enter valid existing credentials.
4. Submit.

Expected:

- Redirect to /recommendations.
- Greeting appears with user name/email-derived name.
- Logout returns to /login.

### Flow C: Voice Mode Onboarding

1. Open / and start onboarding in Voice mode (or go to /voice).
2. Start conversation.
3. Allow microphone permission.
4. Respond to at least 3 prompts via mic.
5. Complete flow.

Expected:

- Mic state changes visually (idle/listening/speaking).
- Nova speaks prompts (if ElevenLabs credits available).
- Completion redirects to /recommendations.

### Flow D: Unauthenticated Access Guard

1. Log out or use incognito.
2. Open /recommendations directly.

Expected:

- Redirect to /login with callbackUrl set to /recommendations.

## 5. Page-Level Functional Checklist

Mark each as PASS/FAIL and add notes.

### Landing Page (/)

- [ ] Loads first when opening app.
- [ ] CTA to onboarding works.
- [ ] CTA to login works.
- [ ] CTA to voice mode works.

### Login Page (/login)

- [ ] Email step validates format.
- [ ] Password step validates required input.
- [ ] Invalid credentials show error message.
- [ ] Valid login redirects to callbackUrl or /recommendations.
- [ ] Google login button triggers OAuth redirect.

### Onboarding (Text)

- [ ] Questions progress in sequence.
- [ ] Conditional questions behave correctly (for example, car question path).
- [ ] Back navigation works without corrupted state.
- [ ] Signup submit handles:
  - [ ] New account creation
  - [ ] Existing account handoff to login

### Voice Agent (/voice)

- [ ] Start and end controls work.
- [ ] Mute/unmute works.
- [ ] Transcript updates while speaking.
- [ ] Completion callback persists and redirects correctly.

### Recommendations Dashboard (/recommendations)

- [ ] Profile fetch succeeds.
- [ ] Recommendation generation succeeds.
- [ ] Failure state message appears if recommendation API fails.
- [ ] Chat input sends and receives assistant response.
- [ ] Voice input toggle works when browser supports SpeechRecognition.
- [ ] Read-aloud button triggers TTS playback when available.

## 6. API Endpoint Checklist

Use browser devtools Network tab or API client.

### Authentication

- [ ] POST /api/auth/register
  - [ ] 201 for new account
  - [ ] 409 for existing account
- [ ] /api/auth/[...nextauth] credentials sign-in works

### Profile

- [ ] GET /api/profile returns profile for authenticated user
- [ ] POST /api/profile stores/merges profile payload
- [ ] Unauthorized requests return 401

### Recommendations

- [ ] POST /api/recommendations with valid profile returns payload fields:
  - recommendationTitle
  - recommendationSummary
  - reason
  - policyExplanation
  - peerChoices
  - sectionConfidence
  - sourceTitles
  - provider
- [ ] If Gemini fails, fallback payload is still returned

### Chat

- [ ] POST /api/chat returns message and optional suggestions

### Voice

- [ ] POST /api/voice returns audio/mpeg for valid request with working ElevenLabs credits
- [ ] 503 when ELEVENLABS_API_KEY is missing
- [ ] 402 indicates ElevenLabs payment/credits issue (expected external dependency behavior)

## 7. Data Persistence and Session Checks

- [ ] Refresh /recommendations after login; page still renders usable state.
- [ ] Logout clears authenticated access and guard redirects back to login.
- [ ] Pending signup data is consumed correctly after login handoff.

## 8. Error Handling and Recovery Tests

### Recommendations API failure

1. Temporarily break GEMINI key or block network.
2. Open /recommendations.

Expected:

- App shows either fallback recommendation or clear failure message.
- App does not crash.

### Voice API failure

1. Remove/invalid ELEVENLABS_API_KEY or exhaust credits.
2. Trigger voice playback.

Expected:

- UI remains responsive.
- No full page crash.
- Network shows voice endpoint error details.

## 9. Cross-Browser and Responsive Checks

Run at minimum:

- Chrome latest (desktop)
- Safari latest (macOS)
- Mobile viewport 390x844

Validate:

- [ ] No major layout breakage on landing/login/recommendations.
- [ ] Buttons and forms are accessible and clickable.
- [ ] Voice features degrade gracefully when unsupported.

## 10. Regression Smoke Suite (Fast)

Run this 5-minute smoke suite before each push:

1. Open / -> verify landing.
2. Login with test account -> verify redirect to /recommendations.
3. Confirm recommendation cards render.
4. Send one chat message and verify response appears.
5. Click read-aloud once and verify no crash.
6. Logout and verify /recommendations redirects to /login.

## 11. Bug Report Template

- Title:
- Environment:
- Steps to reproduce:
1.
2.
3.
- Expected result:
- Actual result:
- Screenshot/video:
- Network/API evidence (status code + endpoint):
- Severity: blocker / high / medium / low
- Notes:

## 12. Sign-Off

- QA Result: PASS / FAIL
- Blockers found:
- Follow-up owner:
- Re-test date:
