var corsProxyUrl = 'https://api.allorigins.win/get?url=';

if (window.top === window) {  // Ensure the script is running in the top-level window
    (async function() {
        'use strict';

        // Check if the current URL matches the specified domain and patterns
        var currentUrl = window.location.href;
        var currentDomain = window.location.hostname;
        console.log("Current URL: " + currentUrl);
        console.log("Current Domain: " + currentDomain);
        
        var correctDomain = 'jira.corp.adobe.com';
        var dashboardPattern = /secure\/Dashboard\.jspa/;
        var browsePattern = /browse\/.+/;

        if (currentDomain === correctDomain && (dashboardPattern.test(currentUrl) || browsePattern.test(currentUrl))) {
            console.log("URL matches pattern.");

            // URL of the text file containing your custom message
            var textFileUrl = 'https://main--test--2or65842.hlx.live/message';

            // Append a cache-busting parameter (current timestamp) to the URL
            textFileUrl += '?_=' + new Date().getTime();

            try {
                const response = await fetch(corsProxyUrl + encodeURIComponent(textFileUrl));

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                const customText = (data.contents || '').trim();
                console.log("Custom text fetched: " + customText);

                if (customText) {
                    var textContainer = document.createElement('div');
                    textContainer.classList.add('custom-text-container');
                    textContainer.style.marginTop = '5px';
                    textContainer.style.backgroundColor = '#f0f0f0';
                    textContainer.style.border = '1px solid #ccc';
                    textContainer.style.borderRadius = '5px';
                    textContainer.style.padding = '5px';
                    textContainer.style.fontFamily = 'Arial, sans-serif';
                    textContainer.style.fontSize = '14px';
                    textContainer.style.color = '#333';
                    textContainer.style.display = 'flex'; // Enable flexbox layout
                    textContainer.style.alignItems = 'center'; // Center items vertically in flexbox

                    var content = document.createElement('div');
                    content.innerHTML = customText;
                    textContainer.appendChild(content);

                    var toggleButton = document.createElement('button');
                    toggleButton.textContent = 'Hide';
                    toggleButton.style.marginLeft = 'auto';
                    toggleButton.style.marginTop = '0px';
                    toggleButton.style.padding = '5px 10px';
                    toggleButton.style.backgroundColor = '#4CAF50';
                    toggleButton.style.color = 'white';
                    toggleButton.style.border = 'none';
                    toggleButton.style.cursor = 'pointer';
                    toggleButton.addEventListener('click', function() {
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                        toggleButton.textContent = content.style.display === 'none' ? 'Show' : 'Hide';
                    });
                    textContainer.appendChild(toggleButton);

                    if (dashboardPattern.test(currentUrl)) {
                        console.log("Inserting message into .aui-page-header-main");
                        var pageHeaderMain = document.querySelector('.aui-page-header-main');
                        if (pageHeaderMain) {
                            pageHeaderMain.appendChild(textContainer);
                        } else {
                            console.error("Element .aui-page-header-main not found.");
                        }
                    } else if (browsePattern.test(currentUrl)) {
                        console.log("Inserting message into #viewissuesidebar");
                        var issueSidebar = document.querySelector('#viewissuesidebar');
                        if (issueSidebar) {
                            issueSidebar.appendChild(textContainer);
                        } else {
                            console.error("Element #viewissuesidebar not found.");
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching text file:', error);
            }
        } else {
            console.log("URL does not match any pattern or domain.");
        }
    })();
} else {
    console.log("Script is running inside an iframe, not executing.");
}
