 
const fs = require('fs');  
const t = fs.readFileSync('src/lib/useNotifications.ts', 'utf8');  
const lines = t.split('\n');  
const out = [];  
let skip = 0;  
