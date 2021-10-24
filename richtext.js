console.log("Richi is running");
const richis = document.getElementsByClassName('richi')

for (const richi of richis) {
    richi.appendChild(richiHeader());
    richi.appendChild(richiText());
    richi.appendChild(richiHTML());
}

function richiHeader() {
    const richi_header = document.createElement("DIV");
    richi_header.className = "richi-header";

    //Dropdown H1 - H6
    const richi_btn_h = document.createElement("SELECT");

    let richi_btn_hText = document.createElement("option");
    richi_btn_hText.innerText = "Text";
    richi_btn_h.appendChild(richi_btn_hText);

    let richi_btn_h1 = document.createElement("option");
    richi_btn_h1.value = "H1";
    richi_btn_h1.innerText = "Heading 1";
    richi_btn_h.appendChild(richi_btn_h1);

    let richi_btn_h2 = document.createElement("option");
    richi_btn_h2.value = "H2";
    richi_btn_h2.innerText = "Heading 2";
    richi_btn_h.appendChild(richi_btn_h2);

    richi_header.appendChild(richi_btn_h);

    //Button Bold
    const richi_btn_bold = document.createElement("BUTTON");
    richi_btn_bold.innerHTML = "B";
    richi_btn_bold.onclick = function() {
        textAddOrRemoveTag(this.parentNode.parentNode, "strong");
    };
    richi_header.appendChild(richi_btn_bold);

    //Button Italic
    const richi_btn_italic = document.createElement("BUTTON");
    richi_btn_italic.innerHTML = "I";
    richi_btn_italic.onclick = function() {
        textAddOrRemoveTag(this.parentNode.parentNode, "i");
    };
    richi_header.appendChild(richi_btn_italic);

    //Button HTML
    const richi_btn_html = document.createElement("BUTTON");
    richi_btn_html.innerHTML = "<>";
    richi_btn_html.onclick = function() {
        switchDisplay(this.parentNode.parentNode);
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

function switchDisplay(element) {
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

function textAddOrRemoveTag(element, tag) {
    const sel = window.getSelection();
    if (sel != 0) {
        let range = sel.getRangeAt(0).cloneRange();
        let rangeContent = range.extractContents();
        let richiTmp = document.createElement('richi-tmp');

        richiTmp.appendChild(rangeContent);
        range.insertNode(richiTmp);

        let content = element.getElementsByClassName("richi-text")[0].innerHTML;

        let tmpRichiText = content.slice(content.search('<richi-tmp>'), content.search('</richi-tmp>'));

        let tmpText = content.slice(0, content.search('<richi-tmp>'));
        let startTag = tmpText.lastIndexOf("<" + tag + ">");
        let endTag = tmpText.lastIndexOf("</" + tag + ">");

        if (tmpRichiText.search('<' + tag + '>') > 0 || (startTag > endTag)) {
            textRemoveTag(element, tag);
        } else {
            textAddTag(element, tag);
        }
    }
}

function textAddTag(element, tag) {
    let content = element.getElementsByClassName("richi-text")[0];
    let tmpText = content.innerHTML;

    tmpText = tmpText.replace("<richi-tmp>", "<" + tag + ">");
    tmpText = tmpText.replace("</richi-tmp>", "</" + tag + ">");

    content.innerHTML = tmpText;
}

function textRemoveTag(element, tag) {
    let content = element.getElementsByClassName("richi-text")[0];

    let richiTmpBefore = content.innerHTML.slice(0, content.innerHTML.search('<richi-tmp>'));
    let richiTmp = content.innerHTML.slice(content.innerHTML.search('<richi-tmp>'), content.innerHTML.search('</richi-tmp>'));
    let richiTmpAfter = content.innerHTML.slice(content.innerHTML.search('</richi-tmp>'));

    richiTmp = richiTmp.replace(new RegExp("<" + tag + ">", "g"), "");
    richiTmp = richiTmp.replace(new RegExp("</" + tag + ">", "g"), "");

    content.innerHTML = richiTmpBefore + richiTmp + richiTmpAfter;

    let contentText = content.innerHTML;
    contentText = contentText.replace('<richi-tmp>', "</" + tag + ">");

    let tmp = contentText.slice(contentText.search('</richi-tmp>'));
    let startTag = tmp.search("<" + tag + ">");
    let endTag = tmp.search("</" + tag + ">");

    if (startTag > endTag || (startTag === -1 && endTag > 0)) {
        contentText = contentText.replace('</richi-tmp>', "<" + tag + ">");
    }
    
    content.innerHTML = contentText;

    cleanCode(element, tag);
}

function cleanCode(element, tag) {
    const content = element.getElementsByClassName("richi-text")[0];
    let text = content.innerHTML;

    text = text.replace(new RegExp("<" + tag + "></" + tag + ">", "g"), "");
    content.innerHTML = text;
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

//Function to get the value of The Richtext content
function getRichiValue(id) {
    const element = document.getElementById(id);
    if (element && element.className.includes("richi")) {
        return element.getElementsByClassName("richi-text")[0].innerHTML;
    }
}