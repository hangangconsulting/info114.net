import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const translateScript = `
    <!-- Google Translate Script -->
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'ko',
                includedLanguages: 'zh-CN,en,fr,ja,ru,es,th,uz,vi',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</body>`;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Group cta-button and google_translate_element into <div class="nav-actions">
    
    // Check if nav-actions already exists
    if (!content.includes('class="nav-actions"')) {
        // Find cta-button and any existing google_translate_element
        const ctaRegex = /(<a href="[^"]+" class="cta-button">[^<]+<\/a>)(?:\s*<div id="google_translate_element"[^>]*><\/div>)?/;
        
        content = content.replace(ctaRegex, (match, cta) => {
            return `<div class="nav-actions">\n                    ${cta}\n                    <div id="google_translate_element"></div>\n                </div>`;
        });
    } else {
        // If nav-actions exists but maybe google_translate_element is still outside? Or already correct.
    }
    
    // Remove old google_translate_element that might be outside (if any leftover)
    // Wait, the regex above consumes it if it's immediately following.
    // If there's an old google_translate_element with inline style somewhere else inside <nav>:
    content = content.replace(/<div id="google_translate_element" style="[^"]+"><\/div>/g, '');
    
    // Make sure we have the nav-actions with both
    if (content.includes('class="nav-actions"') && !content.match(/<div class="nav-actions">[\s\S]*?<div id="google_translate_element"/)) {
        content = content.replace(/(<div class="nav-actions">)([\s\S]*?)(<\/div>)/, '$1$2\n                    <div id="google_translate_element"></div>\n                $3');
    }

    // 2. Add translate script before </body> if not present
    if (!content.includes('googleTranslateElementInit')) {
        content = content.replace(/<\/body>/, translateScript);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
}
