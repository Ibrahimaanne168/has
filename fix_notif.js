const fs = require('fs');  
const content = fs.readFileSync('src/lib/useNotifications.ts', 'utf8');  
const fixed = content.replace(/renotify: true,[\s\S]{0,80}vibrate: \[200, 100, 200\],/, 'data: {url},').replace('data: { url },\n      data: {url},', 'data: { url },');  
fs.writeFileSync('src/lib/useNotifications.ts', fixed, 'utf8');  
console.log('done');  
