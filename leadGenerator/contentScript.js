let anchors = document.getElementsByTagName('a');
console.log("Yooooo.... Iam Working", anchors.length);

// adding a blue tab over there
var ele = document.getElementsByClassName('top-center-stack')[0];

// adding the CSS in string
let lead_gen_tab_CSS = `
    .find_lead_tab{
        background-color: blue;
        border-radius: 10px;
        font-family: 'Poppins',sans-serif;
        padding: 20px;
        margin: 30px;
        margin-top: 100px;
        width: 400px;
    }

    .find_lead_head{
        font-weight: 600;
        font-size: 15px;
        background-color: white;
        padding:10px;
        color: 'black';
        border-radius: 30px;
        text-align: center;
    }

    #lead_counter{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        margin-top: 20px;
        border-bottom: 2px solid white;
        padding-bottom: 20px;
    }

    #num_of_leads{
        width: 80px;
        height: 80px;
        color: white;
        border-radius: 100%;
        border: 6px solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 23px;
        border-style: dotted;
    }

    #num_of_leads_head{
        font-weight: 700;
        color: white;
    }

    #lead_starter{
        display: flex;
        gap:15px;
        margin-top: 20px;
    }

    #get_leads{
        outline: none;
        border: none;
        background-color: white;
        color: black;
        flex: 1;
        height: 55px;
        font-weight: 700;
        border-radius: 30px;
        cursor: pointer;
    }

    #export_leads{
        outline: none;
        border: 2px solid white;
        background-color: blue;
        color: white;
        flex: 1;
        height: 55px;
        font-weight: 700;
        border-radius: 30px;
        cursor: pointer;
    }
`

// Regular expressions for matching Instagram and Facebook profile URLs
const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_]+/;
const facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9_]+/;
const twitterRegex = /(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+/;

const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

function sendMessageAsync(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

async function get_website_data(website_html) {
    let url_data_object = {
        website_emails: [],
        website_status: undefined,
        website_socials: {
            instagram: [],
            facebook: [],
            twitter: []
        }
    };

    if (!website_html) {
        url_data_object.website_status = false;
        return url_data_object;
    }

    let website_dek = document.createElement('div')
    website_dek.classList.add('lead_gen_web_data');
    website_dek.innerHTML = website_html;
    // scraping the possible emails
    let all_emails = website_dek.innerHTML.toString().match(emailRegex);
    url_data_object.website_emails = (all_emails == null) ? [] : all_emails;
    const allLinks = website_dek.getElementsByTagName('a');
    // getting social media account URLS
    const instagramLinks = [];
    const facebookLinks = [];
    const twitterLinks = [];

    // Iterate through all links and check if they match the regex patterns
    for (const link of allLinks) {
        const href = link.href;
        if (instagramRegex.test(href)) {
            instagramLinks.push(href);
        } else if (facebookRegex.test(href)) {
            facebookLinks.push(href);
        } else if (twitterRegex.test(href)) {
            twitterLinks.push(href);
        }
    }

    url_data_object.website_socials.instagram = instagramLinks;
    url_data_object.website_socials.facebook = facebookLinks;
    url_data_object.website_socials.twitter = twitterLinks;

    return url_data_object;
}

var class_list = [
    'qBF1Pd fontHeadlineSmall',
    'MW4etd',
    'UY7F9',
    'UsdlK',
    'lcr4fd S9kvJb'
]

async function get_div_data(div_doc) {
    let div_doc_data_list = [];
    for (let i = 0; i < class_list.length; i++) {
        let dat = div_doc.getElementsByClassName(class_list[i])[0];
        if (dat == undefined) {
            div_doc_data_list.push("")
            continue;
        }
        if (i == (class_list.length - 1)) {
            div_doc_data_list.push(dat.href);
            continue;
        }
        div_doc_data_list.push(dat.innerText);
    }
    return div_doc_data_list
}

function download(file) {
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

async function start_export_leads() {
    // getting the latest leads data
    let all_data = (await chrome.storage.session.get("latest_leads")).latest_leads;
    let web_file_data = []
    console.log("Broos", all_data);
    Array.from(all_data).forEach((ele, index) => {
        // creating a by default blob here
        let a_blob = `${String(ele[0])},${String(ele[1])},${String(ele[2])},${String(ele[3])},${String(ele[4])}`;

        // getting the websites details
        let a_blob_web_dets = Object.values(ele[5]);
        let web_emails = a_blob_web_dets[0].join(' ');
        let social_media_links = Object.values(a_blob_web_dets[1]).join(' +++ ');
        a_blob += `${String(a_blob_web_dets[0])},${String(a_blob_web_dets[1])},${String(a_blob_web_dets[2])},${String(web_emails)},${String(social_media_links)}`;

        // pushing data to blob base
        console.log(a_blob);
        web_file_data.push(a_blob);
    })
    console.log("Process ended...");
    let data_file = new File(web_file_data, 'leads.csv', {
        type: 'text/plain'
    })
    download(data_file);
}

async function start_getting_leads() {
    let dock_data = document.getElementById('num_of_leads');
    dock_data.innerText = "0";

    let all_results_parent = document.getElementsByClassName('m6QErb DxyBCb kA9KIf dS8AEf ecceSd');
    let all_data_divs = all_results_parent[0].children[0].children;
    let real_data = [];
    Array.from(all_data_divs).forEach((ele) => {
        if (ele.classList.length == 0) {
            real_data.push(ele)
        }
    })

    // after that getting the business names here
    let all_leads_data = [];
    var port = chrome.runtime.connect({ name: "knockknock" });
    real_data.forEach(async (ele, idx) => {
        let web_data = await get_div_data(ele);
        all_leads_data.push(web_data);
        port.postMessage({
            action: 'makeRequest',
            index: idx,
            url: web_data[web_data.length - 1]
        });
    });
    port.onMessage.addListener(async function (msg) {
        if (msg.action == "urlData") {
            let web_dat = await get_website_data(msg.web_body);

            // updating the count in frontend
            let dock_data = document.getElementById('num_of_leads');
            dock_data.innerText = String(parseInt(dock_data.innerText) + 1);

            // adding the details in databases;
            all_leads_data[parseInt(msg.index)].push(web_dat);
            await chrome.storage.session.set({
                latest_leads: all_leads_data
            })
            console.log("GOT OF", msg.url);
        }
    });

}

function creatingTab() {
    if (document.getElementsByClassName('find_lead_tab').length == 0) {
        let tabHTML = `
            <div class="find_lead_tab">
                <div class="find_lead_head">Find Leads</div>
                <div id="lead_counter">
                    <div id="num_of_leads">
                        0
                    </div>
                    <div id="num_of_leads_head">
                        Leads Founded
                    </div>
                </div>
                <div id="lead_starter">
                    <button id="get_leads">
                        start getting leads
                    </button>
                    <button id="export_leads">
                        export leads
                    </button>
                </div>
            </div>
        `
        let domParser = new DOMParser();
        let doc = domParser.parseFromString(tabHTML, 'text/html');
        ele.insertBefore(doc.body.firstChild, ele.firstChild);
        document.getElementById('get_leads').addEventListener('click', start_getting_leads)
        document.getElementById('export_leads').addEventListener('click', start_export_leads)

        // gettng the leads tab
        let lead_tab_style_sheet = document.createElement('style');
        lead_tab_style_sheet.innerHTML = lead_gen_tab_CSS;
        document.head.appendChild(lead_tab_style_sheet);
    }
    // creating a tab here
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // getting the message
    if (request.action === 'createTab') {
        // Array.from(anchors).forEach((ele)=>{
        //     ele.style.backgroundColor = 'red';
        //     ele.style.color = 'white';
        // })

        creatingTab()
        // sending response
        sendResponse({
            'data': true
        })
    }
})