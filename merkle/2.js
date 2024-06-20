(function() {
    'use strict';

    // Mapping of full names to their co-owner designations
    const coOwnerMapping = {
        'EMEA Sprint Tickets - Merkle Team': 'EMEA Sprint Tickets - Merkle Team',
        'Robin Band': 'Robin Band FR co-owner',
        'Jan Pauw': 'UK co-owner',
        'Pieter van Kasteren': 'DE co-owner',
        'Geert van den Berg': 'UK,FR,DE backup',
        'Cretien Buis': 'CH_DE,CH_FR',
        'Jasper Tonn': 'NL,BE_NL',
        'Yuliya Doronina': 'CA_FR,SE',
        'Eliandra Marins': 'PT,PL',
        'Jan Murdzik': 'DK,NO',
        'Rossella Brederode': 'BE_FR,LU_FR',
        'Rachael Iyokho': 'ES',
        'Andreja Brokeviciute': 'AT,LU_DE',
        'Natasha Alonso': 'TR,CA'
    };

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        GM_setClipboard(text);
    }

    // Function to get table content as text with custom formatting
    function getTableText(table) {
        let tableText = '';
        const dashboardTitleElement = table.closest('.gadget').querySelector('.dashboard-item-title');
        if (dashboardTitleElement) {
            const dashboardTitle = dashboardTitleElement.innerText;
            let match = dashboardTitle.match(/Filter Results: ([\w\s]+).* Status Report/);
            let name = match ? match[1].trim() : "";

            // Add missing titles if present in the dashboard title
            if (dashboardTitle.includes('EMEA Sprint Tickets - Merkle Team')) {
                tableText += 'EMEA Sprint Tickets - Merkle Team\n\n';
                name = '';
            }
            if (dashboardTitle.includes('EMEAMP & G11N - EMEA Resource Pages and Events')) {
                tableText += 'EMEAMP & G11N - EMEA Resource Pages and Events\n\n';
                name = '';
            }

            if (name) {
                const coOwner = coOwnerMapping[name] || 'Unknown co-owner';
                tableText += `${name}\n(${coOwner})\n`;
            }
        }

        const rows = table.querySelectorAll('tr');
        if (rows.length === 1) {
            tableText += '--PTO\n'; // Add --PTO if table is empty (only header row exists)
        } else {
            rows.forEach((row, rowIndex) => {
                if (rowIndex === 0) return; // Skip header row
                const rowText = Array.from(row.cells).map((cell, cellIndex) => {
                    if (cellIndex === 0) {
                        return `-- ${cell.innerText.replace("Actions", "").trim()}\t`; // Prepend `--`, remove "Actions" and add tab spacing
                    }
                    return cell.innerText.replace("Actions", "").trim();
                }).join('\t');
                tableText += rowText + '\n';
            });
        }
        return tableText;
    }

    // Function to add copy buttons to each table header
    function addCopyButtons() {
        const tables = document.querySelectorAll('.issue-table');
        tables.forEach(table => {
            const header = table.querySelector('th');
            if (header) {
                const copyButton = document.createElement('button');
                copyButton.innerText = 'Copy Table';
                copyButton.style.marginLeft = '10px';
                copyButton.onclick = () => {
                    const tableText = getTableText(table);
                    copyToClipboard(tableText);
                };
                header.appendChild(copyButton);
            }
        });
    }

    // Function to add a global copy button below the specified <h1>
    function addGlobalCopyButton() {
        const header = document.querySelector('.aui-page-header-inner .aui-page-header-main h1');
        if (header) {
            const copyAllButton = document.createElement('button');
            copyAllButton.innerText = 'Copy All Tables';
            copyAllButton.style.display = 'block';
            copyAllButton.style.marginTop = '10px';
            copyAllButton.onclick = () => {
                let allTablesText = '';
                const tables = document.querySelectorAll('.issue-table');
                tables.forEach(table => {
                    allTablesText += getTableText(table) + '\n\n';
                });
                copyToClipboard(allTablesText);
            };
            header.parentNode.insertBefore(copyAllButton, header.nextSibling);
        }
    }

    // Wait for the document to fully load before adding buttons
    window.addEventListener('load', () => {
        // Check periodically for dynamically loaded content
        const intervalId = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(intervalId);
                addCopyButtons();
                addGlobalCopyButton();
            }
        }, 1000);
    });

})();
