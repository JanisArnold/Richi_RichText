console.log("Richi is running");
const richis = document.getElementsByClassName('richi');
const richi_start_tag = "<richi-tmp>";
const richi_end_tag = "</richi-tmp>";
var cursor_path = [];

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
    richi_btn_h.onchange = function(){
        console.log(this.value);
        textAddOrRemoveTag(this.parentNode.parentNode, [this.value])
    };

    let richi_btn_hEmpty = document.createElement("option");
    richi_btn_hEmpty.value = "Empty";
    richi_btn_hEmpty.style.display = "none";
    richi_btn_h.appendChild(richi_btn_hEmpty);

    let richi_btn_hText = document.createElement("option");
    richi_btn_hText.value = "P";
    richi_btn_hText.innerText = "Text";
    richi_btn_hText.selected = true;
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
    richi_btn_bold.id = "btn_strong";
    richi_btn_bold.innerHTML = "B";
    richi_btn_bold.onclick = function () {
        textAddOrRemoveTag(this.parentNode.parentNode, ["strong"]);
    };
    richi_header.appendChild(richi_btn_bold);

    //Button Italic
    const richi_btn_italic = document.createElement("BUTTON");
    richi_btn_italic.id = "btn_i";
    richi_btn_italic.innerHTML = "I";
    richi_btn_italic.onclick = function () {
        textAddOrRemoveTag(this.parentNode.parentNode, ["i"]);
    };
    richi_header.appendChild(richi_btn_italic);

    //Button Remove Format
    const richi_btn_remove = document.createElement("BUTTON");
    richi_btn_remove.innerHTML = "Remove";
    richi_btn_remove.onclick = function () {
        textRemoveFormats(this.parentNode.parentNode, ["strong", "i", "h1", "h2", "h3", "h4", "h5", "h6"]);
    };
    richi_header.appendChild(richi_btn_remove);

    //Button HTML
    const richi_btn_html = document.createElement("BUTTON");
    richi_btn_html.innerHTML = "<>";
    richi_btn_html.onclick = function () {
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
    let richi_text = document.createElement("DIV");
    richi_text.className = "richi-text";
    richi_text.innerHTML = "<h2>Test</h2><p>test <strong>test</strong> test<br>test test test</p><p>test <i>test</i> test</p><h1>Test</h1>";
    richi_text.contentEditable = "true";
    document.execCommand('defaultParagraphSeparator', false, 'p');

    richi_text.addEventListener("keydown", function (e) {
        if (richi_text.innerHTML === "<p><br></p>" && e.key === "Backspace") {
            e.preventDefault();
        }
    });

    richi_text.addEventListener('keyup', () => cursorMove());
    richi_text.addEventListener('click', () => cursorMove());

    function cursorMove() {
        let sel = window.getSelection();
        let node = sel.baseNode;
        let path = [];

        do {
            path.push(node.parentNode);
            node = node.parentNode;
        } while (path[path.length - 1] !== richi_text);

        cursor_path = [];

        for (let i of path) {
            cursor_path.push(i.tagName);
        }

        updateNav(path[path.length - 1].parentNode);
    }

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

function textAddHeading(selection) {
    console.log(selection);
    //console.log(element);
}

function checkTag(tag) {
    const sel = window.getSelection();
    let nodeList = [];
    if (sel != 0 && tag != "") {
        let range = sel.getRangeAt(0).cloneRange();
        let rangeContent = range.cloneContents();
        let richiTmp = document.createElement('richi-tmp');
        richiTmp.appendChild(rangeContent);

        let content = richiTmp.querySelectorAll(tag);
        //console.log(content);
        for (node of [...content]) {
            nodeList.push(node.tagName);
        }
        //console.log(nodeList);
        //console.log(nodeList.includes(tag.toUpperCase()));
    }
    return cursor_path.includes(tag.toUpperCase()) || nodeList.includes(tag.toUpperCase());
}

function checkTags(tag) {
    const sel = window.getSelection();
    let nodeList = [];
    if (sel != 0 && tag != "") {
        let range = sel.getRangeAt(0).cloneRange();
        let rangeContent = range.cloneContents();
        let richiTmp = document.createElement('richi-tmp');
        richiTmp.appendChild(rangeContent);

        let content = richiTmp.querySelectorAll(tag);
        //console.log(content);
        for (node of [...content]) {
            nodeList.push(node.tagName);
        }
        //console.log(nodeList);
        //console.log(nodeList.includes(tag.toUpperCase()));
    }
    //console.log(nodeList);
    //console.log(cursor_path);
    let i = cursor_path;
    i = i.filter(e => e !== 'DIV')

    return nodeList.concat(i);
    //return cursor_path.includes(tag.toUpperCase()) || nodeList.includes(tag.toUpperCase());
}

function textAddOrRemoveTag(element, tag) {
    let check = checkTag(tag[0]);
    const sel = window.getSelection();
    //console.log(check);
    if (sel != 0) {
        let range = sel.getRangeAt(0).cloneRange();
        let rangeContent = range.extractContents();
        let richiTmp = document.createElement('richi-tmp');

        richiTmp.appendChild(rangeContent);
        range.insertNode(richiTmp);

        if (check) {
            textRemoveTags(element, tag);
        } else {
            textAddTag(element, tag);
        }

        cleanCode(element, tag);
    }
}

function textRemoveFormats(element, tags) {
    const sel = window.getSelection();
    console.log(sel);
    if (sel != 0) {
        let range = sel.getRangeAt(0).cloneRange();
        let rangeContent = range.extractContents();
        let richiTmp = document.createElement('richi-tmp');

        richiTmp.appendChild(rangeContent);
        range.insertNode(richiTmp);

        textRemoveTags(element, tags);
        cleanCode(element, tags);
    }
}

function textAddTag(element, tag) {
    let content = element.getElementsByClassName("richi-text")[0];
    let tmpText = content.innerHTML;

    tmpText = tmpText.replace(richi_start_tag, "<" + tag + ">");
    tmpText = tmpText.replace(richi_end_tag, "</" + tag + ">");

    content.innerHTML = tmpText;
}

function textRemoveTags(element, tags) {
    let content = element.getElementsByClassName("richi-text")[0];
    console.log(tags);

    tags.forEach(tag => {
        let contentText;
        let richiTmpBefore = content.innerHTML.slice(0, content.innerHTML.search(richi_start_tag));
        let richiTmp = content.innerHTML.slice(content.innerHTML.search(richi_start_tag), content.innerHTML.search(richi_end_tag) + richi_end_tag.length);
        let richiTmpAfter = content.innerHTML.slice(content.innerHTML.search(richi_end_tag) + richi_end_tag.length);

        let tmp = content.innerHTML.slice(content.innerHTML.search(richi_end_tag));
        let startTag = tmp.search("<" + tag + ">");
        let endTag = tmp.search("</" + tag + ">");

        if (startTag > endTag || (startTag === -1 && endTag > 0)) {
            richiTmpAfter = "<" + tag + ">" + richiTmpAfter;
        }

        richiTmp = richiTmp.replace(new RegExp("<" + tag + ">", "g"), "");
        richiTmp = richiTmp.replace(new RegExp("</" + tag + ">", "g"), "");

        contentText = richiTmpBefore + "</" + tag + ">" + richiTmp + richiTmpAfter;

        content.innerHTML = contentText;
    });
}

function cleanCode(element, tags) {
    const content = element.getElementsByClassName("richi-text")[0];
    let text = content.innerHTML;

    tags.forEach(tag => {
        text = text.replace(new RegExp("</p><" + tag + "><p>", "g"), "<" + tag + ">");
        text = text.replace(new RegExp("</p></" + tag + "><p>", "g"), "</" + tag + ">");
        text = text.replace(new RegExp("<" + tag + "></" + tag + ">", "g"), "");
    });

    text = text.replace(new RegExp("</p>" + richi_start_tag + "<p>", "g"), "");
    text = text.replace(new RegExp(richi_start_tag, "g"), "");
    text = text.replace(new RegExp("</p>" + richi_end_tag + "<p>", "g"), "");
    text = text.replace(new RegExp(richi_end_tag, "g"), "");

    content.innerHTML = text;
}

function cleanHeadings() {
    console.log(checkTags("p"));
}

function updateNav(element) {
    let header = element.getElementsByClassName("richi-header")[0];
    //console.log(header.getElementsByTagName("button"));
    let tags = [...header.getElementsByTagName("button")];
    //console.log(tags);
    tags.forEach(item => {
        if (item.id) {
            let tag = item.id.slice(4);
            //console.log(item, tag);
            if (checkTag(tag)) {
                item.style = "font-weight: bold";
            } else {
                item.style = "font-weight: normal";
            }
        }
    })

    let selected = [...header.getElementsByTagName("option")];
    console.log(selected);
    let s_tags = [];
    selected.forEach(item => {
        console.log(item.value);
        if (item.value) {
            if (checkTags(item.value).includes(item.value)) {
                s_tags.push(item.value);
            }
            //s_tags.push(checkTags(item.value))
        }
    })
    //console.log(s_tags);
    switch (s_tags.length) {
        case 0:
            header.getElementsByTagName("select")[0].value = "Text";
            break;
        case 1:
            header.getElementsByTagName("select")[0].value = s_tags[0];
            break;
        default:
            header.getElementsByTagName("select")[0].value = "Empty";
            break;
    }
    //cleanHeadings();
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

//Function to set the value of The Richtext content
function setRichiValue(id, value) {
    const element = document.getElementById(id);
    if (element && element.className.includes("richi")) {
        element.getElementsByClassName("richi-text")[0].innerHTML = value;
    }
}