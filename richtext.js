console.log("Richi is running");
const richis = document.getElementsByClassName('richi')
var id = 0;


for (const richi of richis) {
    richi.appendChild(richiHeader());
    richi.appendChild(richiContent());
    richi.id = "richi_" + id;
    console.log("id", id);
    id += 1;
}

function richiHeader() {
    const richi_header = document.createElement("DIV");
    richi_header.className = "richi-header"

    const richi_btn_bold = document.createElement("BUTTON");
    richi_btn_bold.innerHTML = "Bold";
    richi_btn_bold.onclick = function() {
        textBold(this.parentNode.parentNode.id);
    };

    const richi_btn_update = document.createElement("BUTTON");
    richi_btn_update.innerHTML = "update";
    richi_btn_update.onclick = function() {
        update(this.parentNode.parentNode.id);
    };
    richi_header.appendChild(richi_btn_bold);
    richi_header.appendChild(richi_btn_update);

    return richi_header;
}

function richiContent() {
    var richi_content = document.createElement("DIV");
    richi_content.className = "richi-content";
    richi_content.innerHTML = "<p><br></p>";
    richi_content.contentEditable = "true";

    richi_content.addEventListener("keydown", function(e) {
        if (richi_content.innerHTML === "<p><br></p>" && e.key === "Backspace") {
            e.preventDefault();
        }
        //console.log(richi_content.innerHTML);
    })

    return richi_content;
}

function getSelectedText(text1) {

    let sel = window.getSelection();
    let range = sel.getRangeAt(0).cloneRange();
    let markerTextChar = range.extractContents();

    //let selectedIndex = text1.indexOf(markerTextChar.textContent);
    //console.log("selected from ", selectedIndex, "length: ", markerTextChar.textContent.length)
    //var markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);
    let markerEl = document.createElement("strong");
    //markerEl.id = markerId;

    markerEl.appendChild(markerTextChar);

    range.insertNode(markerEl);

    //console.log(window.getSelection);
}

function textBold(id) {
    //const element = document.getElementById(id);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0).cloneRange();
    let markerTextChar = range.extractContents();
    console.log(range);

    let markerEl = document.createElement("strong");

    markerEl.appendChild(markerTextChar);

    range.insertNode(markerEl);
}

function update(id) {
    console.log("parent node id", id);

    const element = document.getElementById(id);
    let text = element.lastElementChild.innerHTML;
    console.log(text);

    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");

    element.lastElementChild.innerHTML = text;

    console.log(text);
}