// adding the onClick event listener to all buttons
var tabNames = ["London", "Paris", "Tokyo"];

var all_tab_links = document.getElementsByClassName('tablinks');
Array.from(all_tab_links).forEach((ele, idx) => {
    ele.addEventListener('click', (e)=>{
        openCity(e, tabNames[idx]);
    })
})

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// adding Button Click Listeners
var open_maps_but = document.getElementById('open_maps_but');
open_maps_but.addEventListener('click', (e)=>{
    // opening google maps
    chrome.tabs.create({'url':'https://www.google.com/maps'})
})