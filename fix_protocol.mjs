import fs from 'fs';
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/src="\/\/translate\.google\.com/g, 'src="https://translate.google.com');
    fs.writeFileSync(f, content);
}
console.log('Fixed Google Translate protocol URLs');
