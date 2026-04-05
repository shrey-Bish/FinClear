const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/^ELEVENLABS_API_KEY\s*=\s*(.+)$/m);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.log("No ELEVENLABS_API_KEY found in .env.local");
  process.exit(1);
}

const voiceId = "Sq93GQT4X1lKDXsQcixO";

fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  },
  body: JSON.stringify({
    text: "Testing the Eleven Labs API.",
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  }),
})
.then(async (response) => {
  if (!response.ok) {
    console.error("ElevenLabs API Error HTTP", response.status);
    console.error(await response.text());
  } else {
    console.log("SUCCESS");
  }
})
.catch(console.error);
