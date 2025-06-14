// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Sp1d3r's script loaded. Using pdfmake for high-quality PDFs. 🕷️");

    const sheet = document.querySelector('.character-sheet');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const saveMdBtn = document.getElementById('save-md-btn');

    // --- Helper function to get input values ---
    const getInputValue = (id) => document.getElementById(id)?.value || '';

    // --- Skill Calculation Logic (Unchanged) ---
    const calculateSkillTotal = (skillRow) => {
        const rank = parseInt(skillRow.querySelector('.skill-rank')?.value) || 0;
        const base = parseInt(skillRow.querySelector('.skill-base')?.value) || 0;
        const mod = parseInt(skillRow.querySelector('.skill-mod')?.value) || 0;
        const totalInput = skillRow.querySelector('.skill-total');
        if (totalInput) { totalInput.value = rank + base + mod; }
    };
    sheet.addEventListener('input', (event) => {
        if (event.target.matches('.skill-rank, .skill-base, .skill-mod')) {
            const skillRow = event.target.closest('.skill-row');
            if (skillRow) { calculateSkillTotal(skillRow); }
        }
    });
    document.querySelectorAll('.skill-row[data-skill-id]').forEach(calculateSkillTotal);


    // --- NEW: PDF EXPORT using pdfmake ---
    const saveAsPdf = () => {
        console.log("Generating readable PDF with pdfmake...");
        const charName = getInputValue('char-name');
        const filename = `${charName.replace(/\s+/g, '_') || 'character'}-TANGENT-Sheet.pdf`;

        // This object defines the entire PDF document structure.
        const docDefinition = {
            // Content is an array of objects that will be rendered in order.
            content: [
                // Main Title
                { text: 'TANGENT: Sci-Fi Fantasy RPG', style: 'title' },
                { text: `Character: ${charName}`, style: 'header' },

                // Character Info Section
                { text: 'Character Information', style: 'subheader' },
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                { text: 'Concept: ', bold: true }, `${getInputValue('char-concept')}\n`,
                                { text: 'Species: ', bold: true }, `${getInputValue('char-species')}\n`,
                                { text: 'Faction: ', bold: true }, `${getInputValue('char-faction')}\n`,
                                { text: 'Personality / Motive: ', bold: true }, `${getInputValue('char-motive')}\n`
                            ]
                        },
                        {
                            width: '*',
                             text: [
                                { text: 'Origin: ', bold: true }, `${getInputValue('char-origin')}\n`,
                                { text: 'Occupation: ', bold: true }, `${getInputValue('char-occu')}\n`,
                                { text: 'Age: ', bold: true }, `${getInputValue('char-age')} | `,
                                { text: 'Gender: ', bold: true }, `${getInputValue('char-gender')}\n`,
                                { text: 'Description / Style: ', bold: true }, `${getInputValue('char-style')}\n`
                            ]
                        }
                    ],
                    columnGap: 20
                },
                
                // Attributes Table
                { text: 'Primary Attributes', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        widths: ['*', 'auto', '*', 'auto'],
                        body: [
                            [{text: 'Attribute', style: 'tableHeader'}, {text: 'Value', style: 'tableHeader'}, {text: 'Sub-Stat', style: 'tableHeader'}, {text: 'Value', style: 'tableHeader'}],
                            ['Strength', getInputValue('attr-strength'), 'Might', getInputValue('attr-might')],
                            ['Intellect', getInputValue('attr-intellect'), 'Logic', getInputValue('attr-logic')],
                            ['Agility', getInputValue('attr-agility'), 'Reflex', getInputValue('attr-reflex')],
                            ['Wisdom', getInputValue('attr-wisdom'), 'Will', getInputValue('attr-will')],
                            ['Constitution', getInputValue('attr-constitution'), 'Fortitude', getInputValue('attr-fortitude')],
                            ['Charisma', getInputValue('attr-charisma'), 'Etiquette', getInputValue('attr-etiquette')]
                        ]
                    }
                },

                // Skills Table (Example with one group, easily expandable)
                { text: 'Skills', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                         widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                         body: [
                            [{text: 'Skill', style: 'tableHeader'}, {text: 'Rank', style: 'tableHeader'}, {text: 'Base', style: 'tableHeader'}, {text: 'Mod', style: 'tableHeader'}, {text: 'Total', style: 'tableHeader'}]
                         ]
                    }
                }
            ],

            // Styles define reusable formatting rules.
            styles: {
                title: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, bold: true, margin: [0, 15, 0, 5] },
                table: { margin: [0, 5, 0, 15] },
                tableHeader: { bold: true, fillColor: '#eeeeee' }
            }
        };

        // This part dynamically adds all skill rows to the PDF's skill table
        const skillTableBody = docDefinition.content.find(item => item.table?.body[0][0].text === 'Skill').table.body;
        document.querySelectorAll('.skill-row[data-skill-id]').forEach(row => {
            const label = row.querySelector('label').textContent;
            const rank = row.querySelector('.skill-rank').value || '0';
            const base = row.querySelector('.skill-base').value || '0';
            const mod = row.querySelector('.skill-mod').value || '0';
            const total = row.querySelector('.skill-total').value || '0';
            skillTableBody.push([label, rank, base, mod, {text: total, bold: true}]);
        });
        
        // This creates and downloads the PDF.
        pdfMake.createPdf(docDefinition).download(filename);
    };

    // --- Markdown Export (Unchanged) ---
    const saveAsMarkdown = () => {
        // ... this function remains exactly the same as the previous step
        console.log("Generating Markdown...");
        const charName = getInputValue('char-name');
        const filename = `${charName.replace(/\s+/g, '_') || 'character'}-TANGENT-Sheet.md`;
        let mdContent = `# TANGENT Character: ${charName}\n\n`;
        //... (rest of the markdown generation logic)
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- Attach Event Listeners ---
    savePdfBtn.addEventListener('click', saveAsPdf);
    saveMdBtn.addEventListener('click', saveAsMarkdown);

});