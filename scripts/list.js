const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(r => r.json())
  .then(data => {
    if (data.models) {
      console.log('Available models:');
      data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods.join(', ')));
    } else {
      console.log('Error/Response:', data);
    }
  })
  .catch(console.error);
