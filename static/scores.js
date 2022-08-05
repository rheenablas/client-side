let div;
let xhttp;

document.addEventListener("DOMContentLoaded", init, false);


function init() {
  
    div = document.querySelector('div');
    let button_elements = document.querySelectorAll("nav button");
    for (let b of button_elements) {
        b.addEventListener("click", fetch_content, false);
    }
    fetch_content(null);  
}

function fetch_content(event){
    let button_id;
    if (event === null){
        button_id = "recent";
    } else {
        button_id = event.target.id;
    }
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response2, false);
    xhttp.open("GET", "/~rzb1/cgi-bin/ca2/run.py/" + button_id, true); //~rzb1/cgi-bin/ca2/run.py
    xhttp.send(null);
}

function handle_response2(){
    // Check that the response has fully arrived
    if (xhttp.readyState === 4){
        // Check the request was successful
        if (xhttp.status === 200) {
            div.innerHTML = xhttp.responseText;
        }
    }
}
