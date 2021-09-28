console.log("Richi is running");
const richis = document.getElementsByClassName('richi')
var id = 0;

for (const richi of richis) {
    richi.appendChild(richiHeader());
    richi.appendChild(richiText());
    richi.appendChild(richiHTML());
    richi.id = "richi_" + id;
    console.log("id", id);
    id += 1;
}

function richiHeader() {
    const richi_header = document.createElement("DIV");
    richi_header.className = "richi-header"

    //Button Bold
    const richi_btn_bold = document.createElement("BUTTON");
    richi_btn_bold.innerHTML = "B";
    richi_btn_bold.onclick = function() {
        textAddTag("strong");
    };
    richi_header.appendChild(richi_btn_bold);

    const richi_btn_bold_remove = document.createElement("BUTTON");
    richi_btn_bold_remove.innerHTML = "B remove";
    richi_btn_bold_remove.onclick = function() {
        textRemoveTag("strong", this.parentNode.parentNode.id);
    };
    richi_header.appendChild(richi_btn_bold_remove);

    const richi_btn_html = document.createElement("BUTTON");
    richi_btn_html.innerHTML = "<>";
    richi_btn_html.onclick = function() {
        switchDisplay(this.parentNode.parentNode.id);
    };
    richi_header.appendChild(richi_btn_html);

    /*const richi_btn_update = document.createElement("BUTTON");
    richi_btn_update.innerHTML = "update";
    richi_btn_update.onclick = function() {
        update(this.parentNode.parentNode.id);
    };
    richi_header.appendChild(richi_btn_update);*/

    return richi_header;
}

function richiText() {
    var richi_text = document.createElement("DIV");
    richi_text.className = "richi-text";
    richi_text.innerHTML = "<p>test <strong>test</strong> test</p>";
    richi_text.contentEditable = "true";

    richi_text.addEventListener("keydown", function(e) {
        if (richi_text.innerHTML === "<p><br></p>" && e.key === "Backspace") {
            e.preventDefault();
        }
        //console.log(richi_text.innerHTML);
    });

    /*richi_text.addEventListener("keydown", function(e) {
        if (richi_text.innerHTML === "") {
            e.preventDefault();
            richi_text.innerHTML = "<p><br></p>";
        }
    });*/

    return richi_text;
}

function richiHTML() {
    var richi_html = document.createElement("textarea");
    richi_html.className = "richi-html";
    richi_html.style.display = "none";

    return richi_html;
}

function switchDisplay(id) {
    const element = document.getElementById(id);
    let text = element.getElementsByClassName("richi-text")[0];
    let html = element.getElementsByClassName("richi-html")[0];

    if (html.style.display === "none") {
        html.style.display = "block";
        text.style.display = "none";

        html.value = text.innerHTML;
    } else {
        html.style.display = "none";
        text.style.display = "block";

        if (!html.value) {
            html.value = "<p><br></p>";
        }

        text.innerHTML = html.value;

    }
    //console.log(text);
    //console.log(html);
}

/*function getSelectedText(text1) {

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
}*/

function textAddTag(tag) {
    //const element = document.getElementById(id);

    let sel = window.getSelection();
    console.log(sel.toString());
    let range = sel.getRangeAt(0).cloneRange();

    /*let test = range.cloneContents();
    let div = document.createElement('div');
    div.appendChild(test);
    console.log(div.innerHTML);*/

    let markerTextChar = range.extractContents();
    let markerEl = document.createElement(tag);

    markerEl.appendChild(markerTextChar);

    range.insertNode(markerEl);
}

function textRemoveTag(tag, id) {
    let sel = window.getSelection();
    let range = sel.getRangeAt(0).cloneRange();

    let markerTextChar = range.extractContents();
    let span = document.createElement('span');
    span.appendChild(markerTextChar);
    span.className = "richi-tmp";
    //console.log(span.innerHTML);

    span.innerHTML = span.innerHTML.replace(new RegExp("<" + tag + ">", "g"), "");
    span.innerHTML = span.innerHTML.replace(new RegExp("</" + tag + ">", "g"), "");

    //span.innerHTML = "<" + tag + ">" + "</" + tag + ">" + span.innerHTML + "<" + tag + ">"
    //console.log(span.innerHTML);

    range.insertNode(span);

    cleanCode(id, tag);
}

function cleanCode(id, tag) {
    const element = document.getElementById(id);
    let text = element.getElementsByClassName("richi-text")[0].innerHTML;

    text = text.replace('<span class="richi-tmp">', "</" + tag + ">");

    let i = text.search('</span>');
    let tmp = text.slice(i);
    let startTag = tmp.search("<" + tag + ">");
    let endTag = tmp.search("</" + tag + ">");
    //console.log(tmp);
    //console.log(startTag);
    //console.log(endTag);
    if (startTag > endTag || (startTag === -1 && endTag > 0)) {
        text = text.replace('</span>', "<" + tag + ">");
    }

    text = text.replace(new RegExp("<" + tag + "></" + tag + ">", "g"), "");
    console.log(text);
    element.getElementsByClassName("richi-text")[0].innerHTML = text;
}

/*function update(id) {
    console.log("parent node id", id);

    const element = document.getElementById(id);
    let text = element.lastElementChild.innerHTML;
    console.log(text);

    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");

    element.lastElementChild.innerHTML = text;

    console.log(text);
}*/