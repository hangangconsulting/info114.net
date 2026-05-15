import fs from 'fs';
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="style\.css(\?v=\d+)?"/, 'href="style.css?v=' + Date.now() + '"');
    fs.writeFileSync(f, content);
}
console.log('Cache busters added');
