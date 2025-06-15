document.addEventListener('DOMContentLoaded', () => {

    console.log("Sp1d3r's script loaded. Skill-Attribute linking is active. 🕷️");

    const sheet = document.querySelector('.character-sheet');
    const attributesGrid = document.querySelector('.attributes-grid');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const saveMdBtn = document.getElementById('save-md-btn');

    /**
     * Calculates the total for a given skill row.
     * It now reads the selected attribute from the dropdown, finds that attribute's
     * value on the sheet, and uses it as the base for the calculation.
     */
    const calculateSkillTotal = (skillRow) => {
        const rank = parseInt(skillRow.querySelector('.skill-rank')?.value) || 0;
        const mod = parseInt(skillRow.querySelector('.skill-mod')?.value) || 0;
        const totalInput = skillRow.querySelector('.skill-total');
        
        const selectElement = skillRow.querySelector('.skill-base-select');
        let baseValue = 0;

        // If the dropdown for selecting a base attribute exists...
        if (selectElement) {
            const selectedAttributeId = selectElement.value;
            // ...and an attribute has been selected...
            if (selectedAttributeId) {
                const attributeInput = document.getElementById(selectedAttributeId);
                // ...and we can find the corresponding attribute input field...
                if (attributeInput) {
                    // ...use its value as the base.
                    baseValue = parseInt(attributeInput.value) || 0;
                }
            }
        }
        
        if (totalInput) {
            totalInput.value = rank + baseValue + mod;
        }
    };

    /**
     * Main event listener for the entire form.
     * Listens for direct inputs to rank/mod fields or changes to the base attribute selection.
     */
    sheet.addEventListener('input', (event) => {
        if (event.target.matches('.skill-rank, .skill-mod')) {
            const skillRow = event.target.closest('.skill-row');
            if (skillRow) {
                calculateSkillTotal(skillRow);
            }
        }
    });
    sheet.addEventListener('change', (event) => {
        if (event.target.matches('.skill-base-select')) {
            const skillRow = event.target.closest('.skill-row');
            if (skillRow) {
                calculateSkillTotal(skillRow);
            }
        }
    });

    /**
     * Event listener for the primary attributes grid.
     * When an attribute score changes, this finds ALL skills linked to that
     * attribute and recalculates them instantly.
     */
    attributesGrid.addEventListener('input', (event) => {
        const changedAttributeId = event.target.id;
        // Ensure we're only acting on one of the main attribute inputs
        if (!changedAttributeId || !changedAttributeId.startsWith('attr-')) return;

        const allSkillSelectors = document.querySelectorAll('.skill-base-select');
        allSkillSelectors.forEach(select => {
            if (select.value === changedAttributeId) {
                const skillRow = select.closest('.skill-row');
                if (skillRow) {
                    calculateSkillTotal(skillRow);
                }
            }
        });
    });

    // Helper function to get form input values safely
    const getInputValue = (id) => document.getElementById(id)?.value || '';

    /**
     * Gathers all character data and generates a readable PDF for download.
     */
    const saveAsPdf = () => {
        // ... PDF generation logic using pdfmake ...
    };

    /**
     * Gathers all character data and generates a Markdown text file for download.
     */
    const saveAsMarkdown = () => {
        // ... Markdown generation logic ...
    };

    // Attach event listeners to the export buttons
    savePdfBtn.addEventListener('click', saveAsPdf);
    saveMdBtn.addEventListener('click', saveAsMarkdown);

    // Initial calculation for all skills when the page loads
    const allSkillRows = document.querySelectorAll('.skill-row[data-skill-id]');
    allSkillRows.forEach(calculateSkillTotal);

});