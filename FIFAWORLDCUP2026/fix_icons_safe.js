const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find all lucide-react imports
  const lucideMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  if (!lucideMatch) continue;

  const icons = lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  if (icons.length === 0) continue;

  // Replace each icon
  for (const icon of icons) {
    // We want to match <IconName className="... text-primary ..." /> and similar
    // We'll replace text-primary, text-#1e996d with text-gray-500 and add strokeWidth={1}
    const regex = new RegExp(`<${icon}\\b([^>]*?)className=(["'])([^"']*?)\\b(?:text-primary|text-\\#1e996d|text-green-600)\\b([^"']*?)\\2([^>]*?)\\/?>`, 'g');
    content = content.replace(regex, (match, beforeClass, quote, classBefore, classAfter, afterClass) => {
      let newAfterClass = afterClass.replace(/\s*strokeWidth=\{[^}]+\}/g, '');
      let newTag = `<${icon}${beforeClass}className=${quote}${classBefore}text-gray-500${classAfter}${quote} strokeWidth={1}${newAfterClass}`;
      if (match.endsWith('/>')) newTag += '/>';
      else newTag += '>';
      return newTag;
    });
  }

  // Also remove bg-primary/10 (etc) from div wrappers that are purely for icons.
  // We'll look for `<div className="... bg-primary/10 text-primary ...">`
  content = content.replace(/bg-primary\/(?:10|15|20|25|30)\b/g, 'bg-transparent');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}
console.log(`Finished. Updated ${changedFiles} files.`);
