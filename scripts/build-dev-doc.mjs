import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const mdPath = path.resolve('resources/docs/briefs/dev-execution-roadmap-tickets.md');
const outPath = path.resolve('resources/docs/briefs/dev-execution-roadmap-tickets.docx');

const mdContent = fs.readFileSync(mdPath, 'utf-8');
const lines = mdContent.split('\n');
const elements = [];

for (const line of lines) {
  const clean = line.trim();
  if (!clean) continue;
  if (clean.startsWith('# ')) {
    elements.push(new Paragraph({ text: clean.slice(2), heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }));
  } else if (clean.startsWith('## ')) {
    elements.push(new Paragraph({ text: clean.slice(3), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 } }));
  } else if (clean.startsWith('### ')) {
    elements.push(new Paragraph({ text: clean.slice(4), heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 80 } }));
  } else if (clean.startsWith('#### ')) {
    elements.push(new Paragraph({ children: [new TextRun({ text: clean.slice(5), bold: true, color: '1B365D', size: 22 })], spacing: { before: 140, after: 60 } }));
  } else if (clean.startsWith('* ') || clean.startsWith('- ')) {
    const text = clean.slice(2).replace(/\*\*/g, '');
    elements.push(new Paragraph({ children: [new TextRun({ text: '• ' + text, size: 20 })], indent: { left: 280 }, spacing: { after: 60 } }));
  } else {
    const text = clean.replace(/\*\*/g, '');
    elements.push(new Paragraph({ children: [new TextRun({ text, size: 20 })], spacing: { after: 100 } }));
  }
}

const doc = new Document({ sections: [{ children: elements }] });
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log(`Word doc generated at: ${outPath}`);
