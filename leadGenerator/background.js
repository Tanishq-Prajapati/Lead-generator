// giving storage access to all types of contexts
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });


async function get_website_data(URL) {
    if (URL == "") {
        return null;
    }
    let exit = false;
    let res = await fetch(URL).catch((err) => {
        exit = true;
    })
    if (exit) return null;
    if (!res.ok) {
        return null
    }
    return res.text();

}

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function (msg) {
        if (port.name == "knockknock"){
            if (msg.action === "makeRequest") {
                console.log("WOOWW...",msg.url);
                let website_data = await get_website_data(msg.url);
                console.log(website_data);
                port.postMessage({
                    action: "urlData",
                    url: msg.url,
                    index: msg.index,
                    web_body: website_data
                })
            }
        }
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
    if (tab.url && tab.url.includes("google.com/maps/search")) {
        console.log("Valid URL... Hurray it worksss");
        // sending a message to service-worker
        let dek = await chrome.tabs.sendMessage(tabId, {
            action: 'createTab'
        })
        console.log(dek);
    }
})