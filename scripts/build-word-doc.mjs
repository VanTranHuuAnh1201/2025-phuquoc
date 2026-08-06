import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType
} from 'docx';

const mdPath = path.resolve('resources/docs/briefs/client-sales-proposal-scope.md');
const outPath = path.resolve('resources/docs/briefs/client-sales-proposal-scope.docx');

const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Color Palette
const COLOR_PRIMARY = '1B365D'; // Navy
const COLOR_SECONDARY = '2B579A';
const COLOR_TEXT = '222222';
const COLOR_BG_LIGHT = 'F4F6F8';
const COLOR_BORDER = 'D1D5DB';

function parseCellRuns(text) {
  // Parse markdown bold **text** and linebreaks <br>
  const parts = text.split(/<br\s*\/?>/i);
  const paragraphs = [];

  for (const part of parts) {
    const runs = [];
    const tokens = part.split(/(\*\*.*?\*\*|`.*?`)/g);
    for (const token of tokens) {
      if (!token) continue;
      if (token.startsWith('**') && token.endsWith('**')) {
        runs.push(new TextRun({ text: token.slice(2, -2), bold: true, color: COLOR_TEXT, size: 20 }));
      } else if (token.startsWith('`') && token.endsWith('`')) {
        runs.push(new TextRun({ text: token.slice(1, -1), color: COLOR_SECONDARY, size: 20, font: 'Consolas' }));
      } else {
        runs.push(new TextRun({ text: token, color: COLOR_TEXT, size: 20 }));
      }
    }
    paragraphs.push(new Paragraph({ children: runs, spacing: { after: 60 } }));
  }
  return paragraphs;
}

function buildTable(rowsData, colWidths = [2000, 3500, 3500]) {
  const tableRows = [];

  rowsData.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    const cells = row.map((cellText, colIndex) => {
      const isFirstCol = colIndex === 0;
      return new TableCell({
        width: { size: colWidths[colIndex] || 2500, type: WidthType.DXA },
        shading: {
          fill: isHeader ? COLOR_PRIMARY : (rowIndex % 2 === 1 ? 'FFFFFF' : COLOR_BG_LIGHT),
          type: ShadingType.CLEAR,
        },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        },
        children: isHeader
          ? [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({ text: cellText.replace(/\*\*/g, ''), bold: true, color: 'FFFFFF', size: 20 })]
            })]
          : parseCellRuns(cellText)
      });
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
}

function processMarkdown(content) {
  const lines = content.split('\n');
  const docElements = [];
  let inBlockquote = false;
  let blockquoteText = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      // Determine column widths
      const colCount = tableRows[0].length;
      let widths = [2500, 3500, 3500];
      if (colCount === 4) widths = [2200, 2600, 2600, 2600];
      docElements.push(buildTable(tableRows, widths));
      docElements.push(new Paragraph({ spacing: { after: 200 } }));
      tableRows = [];
    }
    inTable = false;
  };

  const flushBlockquote = () => {
    if (blockquoteText.length > 0) {
      const runs = [];
      blockquoteText.forEach((line, idx) => {
        const clean = line.replace(/^>\s*/, '');
        const parts = clean.split(/(\*\*.*?\*\*|`.*?`)/g);
        for (const part of parts) {
          if (part.startsWith('**') && part.endsWith('**')) {
            runs.push(new TextRun({ text: part.slice(2, -2), bold: true, color: COLOR_PRIMARY, size: 20 }));
          } else if (part.startsWith('`') && part.endsWith('`')) {
            runs.push(new TextRun({ text: part.slice(1, -1), font: 'Consolas', color: COLOR_SECONDARY, size: 20 }));
          } else {
            runs.push(new TextRun({ text: part, color: COLOR_TEXT, size: 20 }));
          }
        }
        if (idx < blockquoteText.length - 1) {
          runs.push(new TextRun({ text: '\n' }));
        }
      });

      docElements.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9000, type: WidthType.DXA },
                shading: { fill: COLOR_BG_LIGHT, type: ShadingType.CLEAR },
                margins: { top: 140, bottom: 140, left: 200, right: 200 },
                borders: {
                  left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_PRIMARY },
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                children: [new Paragraph({ children: runs })]
              })
            ]
          })
        ]
      }));
      docElements.push(new Paragraph({ spacing: { after: 200 } }));
      blockquoteText = [];
    }
    inBlockquote = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table handling
    if (line.startsWith('|') && line.endsWith('|')) {
      if (inBlockquote) flushBlockquote();
      if (line.includes('---|') || line.includes(':---')) continue; // skip separator row
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blockquote handling
    if (line.startsWith('>')) {
      blockquoteText.push(line);
      inBlockquote = true;
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    if (!line) {
      continue;
    }

    // Horizontal Rule
    if (line === '---') {
      docElements.push(new Paragraph({
        borderBottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
        spacing: { before: 160, after: 200 }
      }));
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      docElements.push(new Paragraph({
        text: line.slice(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 140 }
      }));
      continue;
    }

    if (line.startsWith('## ')) {
      docElements.push(new Paragraph({
        text: line.slice(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 }
      }));
      continue;
    }

    if (line.startsWith('### ')) {
      docElements.push(new Paragraph({
        text: line.slice(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }));
      continue;
    }

    // Lists / Checklists / Bullets
    if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('- [ ]')) {
      const clean = line.replace(/^[\*\-]\s*(\[\s*\]\s*)?/, line.includes('[ ]') ? '☐ ' : '• ');
      const runs = [];
      const parts = clean.split(/(\*\*.*?\*\*|`.*?`)/g);
      for (const part of parts) {
        if (!part) continue;
        if (part.startsWith('**') && part.endsWith('**')) {
          runs.push(new TextRun({ text: part.slice(2, -2), bold: true, color: COLOR_TEXT, size: 21 }));
        } else if (part.startsWith('`') && part.endsWith('`')) {
          runs.push(new TextRun({ text: part.slice(1, -1), font: 'Consolas', color: COLOR_SECONDARY, size: 20 }));
        } else {
          runs.push(new TextRun({ text: part, color: COLOR_TEXT, size: 21 }));
        }
      }
      docElements.push(new Paragraph({
        children: runs,
        indent: { left: 360 },
        spacing: { after: 80 }
      }));
      continue;
    }

    // Normal Paragraph
    const runs = [];
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    for (const part of parts) {
      if (!part) continue;
      if (part.startsWith('**') && part.endsWith('**')) {
        runs.push(new TextRun({ text: part.slice(2, -2), bold: true, color: COLOR_TEXT, size: 21 }));
      } else if (part.startsWith('`') && part.endsWith('`')) {
        runs.push(new TextRun({ text: part.slice(1, -1), font: 'Consolas', color: COLOR_SECONDARY, size: 20 }));
      } else {
        runs.push(new TextRun({ text: part, color: COLOR_TEXT, size: 21 }));
      }
    }
    docElements.push(new Paragraph({
      children: runs,
      spacing: { after: 120 }
    }));
  }

  if (inBlockquote) flushBlockquote();
  if (inTable) flushTable();

  return docElements;
}

async function generateWordDoc() {
  const children = processMarkdown(mdContent);

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: { font: 'Calibri', size: 36, bold: true, color: COLOR_PRIMARY },
          paragraph: { spacing: { before: 360, after: 160 } }
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { font: 'Calibri', size: 28, bold: true, color: COLOR_PRIMARY },
          paragraph: { spacing: { before: 280, after: 120 } }
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          run: { font: 'Calibri', size: 24, bold: true, color: COLOR_SECONDARY },
          paragraph: { spacing: { before: 200, after: 100 } }
        },
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: 'Calibri', size: 22, color: COLOR_TEXT },
          paragraph: { spacing: { after: 120 } }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(outPath, buffer);
    console.log(`Successfully generated Word Document at: ${outPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackPath = path.resolve('resources/docs/briefs/client-sales-proposal-scope-v2.docx');
      fs.writeFileSync(fallbackPath, buffer);
      console.log(`Primary file locked. Successfully generated Word Document at fallback: ${fallbackPath}`);
    } else {
      throw err;
    }
  }
}

generateWordDoc().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
