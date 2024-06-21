function checkSidekickLoaded() {
    var sidekick = document.querySelector("body > helix-sidekick");

    if (sidekick) {
        var pluginContainer = sidekick.shadowRoot.querySelector('div.hlx-sk > div.plugin-container');
        if (pluginContainer) {
            // URL mapping
            const urlMapping = {
                "https://main--bacom--adobecom.hlx.page": "https://adobe.sharepoint.com/sites/adobecom/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x012000F36D5B4C46F81741BCAC9F03FA9F93D1&id=%2Fsites%2Fadobecom%2FShared%20Documents%2Fbacom",
                "https://main--homepage--adobecom.hlx.page": "https://adobe.sharepoint.com/sites/adobecom/Shared%20Documents/Forms/AllItems.aspx?ga=1&id=%2Fsites%2Fadobecom%2FShared%20Documents%2Fhomepage",
                "https://main--cc--adobecom.hlx.page": "https://adobe.sharepoint.com/sites/adobecom/CC/Forms/AllItems.aspx?id=%2Fsites%2Fadobecom%2FCC%2Fwww",
                "https://main--dc--adobecom.hlx.page": "https://adobe.sharepoint.com/sites/adobecom/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x012000F36D5B4C46F81741BCAC9F03FA9F93D1&id=%2Fsites%2Fadobecom%2FShared%20Documents%2Fdc",
                "https://main--express--adobecom.hlx.page": "https://adobe.sharepoint.com/sites/adobecom/Express/Forms/AllItems.aspx?ga=1&id=%2Fsites%2Fadobecom%2FExpress%2Fwebsite"
            };

            // Function to get the SharePoint URL based on the current URL
            function getSharePointUrl(currentUrl) {
                for (const [key, value] of Object.entries(urlMapping)) {
                    if (currentUrl.includes(key)) {
                        return value;
                    }
                }
                return null;
            }

            // Function to insert a clickable link in the Sidekick
            function insertLinkInSidekick(url, linkText) {
                const container = document.querySelector("body > helix-sidekick").shadowRoot.querySelector("div.hlx-sk > div.plugin-container");

                if (container) {
                    const linkHtml = `<div id="miloFolderInfo" style="width: 50%; margin: auto;">
                                        <a href="${url}" target="_blank" style="color: red; text-decoration-line: none;">${linkText}</a>
                                      </div>`;
                    container.insertAdjacentHTML("beforeend", linkHtml);
                } else {
                    console.error("Target container not found.");
                }
            }

            try {
                const currentUrl = window.location.href;
                const sharePointBaseUrl = getSharePointUrl(currentUrl);

                if (sharePointBaseUrl) {
                    const url = new URL(currentUrl);
                    const pathSegments = url.pathname.split("/").filter(segment => segment); // Remove empty segments
                    pathSegments.pop(); // Remove the last segment (actual page)

                    const dynamicPath = pathSegments.join("/");
                    const completeSharePointUrl = `${sharePointBaseUrl}/${dynamicPath}`;
                    const linkText = `/${dynamicPath}`;

                    insertLinkInSidekick(completeSharePointUrl, linkText);
                    console.log(`Mapped SharePoint URL: ${completeSharePointUrl}`);
                } else {
                    console.error("No matching SharePoint URL found for this page.");
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    } else {
        setTimeout(checkSidekickLoaded, 7000);
    }
}

// Call checkSidekickLoaded initially
checkSidekickLoaded();
