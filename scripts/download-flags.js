const fs = require('fs');
const path = require('path');
const https = require('https');

const flags = [
  // Major European leagues
  { code: 'gb-eng', name: 'England' },
  { code: 'es', name: 'Spain' },
  { code: 'de', name: 'Germany' },
  { code: 'it', name: 'Italy' },
  { code: 'fr', name: 'France' },
  
  // Other significant European leagues
  { code: 'pt', name: 'Portugal' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'gb-sct', name: 'Scotland' },
  { code: 'be', name: 'Belgium' },
  { code: 'ch', name: 'Switzerland' },
  
  // Additional European leagues
  { code: 'at', name: 'Austria' },
  { code: 'dk', name: 'Denmark' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'fi', name: 'Finland' },
  { code: 'pl', name: 'Poland' },
  { code: 'cz', name: 'Czech Republic' },
  { code: 'sk', name: 'Slovakia' },
  { code: 'hu', name: 'Hungary' },
  { code: 'ro', name: 'Romania' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'hr', name: 'Croatia' },
  { code: 'rs', name: 'Serbia' },
  { code: 'gr', name: 'Greece' },
  { code: 'tr', name: 'Turkey' },
  
  // South American leagues
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
  { code: 'pe', name: 'Peru' },
  { code: 'uy', name: 'Uruguay' },
  { code: 've', name: 'Venezuela' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'py', name: 'Paraguay' },
  { code: 'bo', name: 'Bolivia' },
  
  // Other major leagues worldwide
  { code: 'us', name: 'United States' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'cn', name: 'China' },
  { code: 'au', name: 'Australia' },
  { code: 'ru', name: 'Russia' },
  { code: 'il', name: 'Israel' },
  { code: 'za', name: 'South Africa' },
  { code: 'eg', name: 'Egypt' },
  { code: 'mx', name: 'Mexico' }
];

const competitionLogos = [
  'uefa', 'fifa', 'conmebol', 'afc', 'caf', 'concacaf', 'ofc'
];

const downloadFile = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const downloadFlags = async () => {
  const flagsDir = path.join(__dirname, '../public/flags');
  if (!fs.existsSync(flagsDir)) {
    fs.mkdirSync(flagsDir, { recursive: true });
  }

  // Create a mapping file for country codes to names
  const mapping = {};

  // Download country flags
  for (const flag of flags) {
    const url = `https://hatscripts.github.io/circle-flags/flags/${flag.code}.svg`;
    const filepath = path.join(flagsDir, `${flag.code}.svg`);
    try {
      await downloadFile(url, filepath);
      console.log(`Downloaded ${flag.code}.svg`);
      mapping[flag.code] = flag.name;
    } catch (err) {
      console.error(`Failed to download ${flag.code}.svg:`, err);
    }
  }

  // Save the mapping file
  fs.writeFileSync(
    path.join(flagsDir, 'mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  // Download competition logos
  for (const logo of competitionLogos) {
    const url = `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${logo}.svg`;
    const filepath = path.join(flagsDir, `${logo}.svg`);
    try {
      await downloadFile(url, filepath);
      console.log(`Downloaded ${logo}.svg`);
    } catch (err) {
      console.error(`Failed to download ${logo}.svg:`, err);
    }
  }
};

downloadFlags().catch(console.error); 