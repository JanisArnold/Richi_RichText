const richi_start_tag = "<richi-tmp>";
const richi_end_tag = "</richi-tmp>";

class Richi {
    constructor(id, settings) {
        this.id = id;
        this.settings = (settings === undefined) ? {
            //debug: false,
            modules: {
                heading: 'simple',
                bold: true,
                italic: true,
                clear: true,
                html: true
            },
            placeholder: '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            //theme: settings.theme || 'default'
        } : {
            //debug: [true, false].includes(settings.debug) ? settings.debug : false,
            modules: (settings.modules === undefined) ? {
                heading: 'simple',
                bold: true,
                italic: true,
                clear: true,
                html: true
            } : {
                heading: [false, 'simple', 'advanced'].includes(settings.modules.heading) ? settings.modules.heading : 'simple',
                bold: [true, false].includes(settings.modules.bold) ? settings.modules.bold : true,
                italic: [true, false].includes(settings.modules.italic) ? settings.modules.italic : true,
                clear: [true, false].includes(settings.modules.clear) ? settings.modules.clear : true,
                html: [true, false].includes(settings.modules.html) ? settings.modules.html : true
            },
            placeholder: settings.placeholder || '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            //theme: settings.theme || 'default'
        }
        this.cursor_path = [];

        this.init();
        this.test();
    }

    test() {
        console.log(this);
    }

    init() {
        console.log(this.id);
        const el = document.getElementById(this.id);
        console.log(el.innerHTML);
        this.settings.placeholder = el.innerHTML || this.settings.placeholder;
        el.innerHTML = null;

        console.log(el);
        el.appendChild(this.richiHeader());
        el.appendChild(this.richiText());
        el.appendChild(this.richiHTML());
    }

    richiHeader() {
        const richi_header = document.createElement("DIV");
        richi_header.className = "richi-header";

        switch (this.settings.modules.heading) {
            case 'simple':
                //Button Heading
                const richi_btn_hs = document.createElement("BUTTON");
                richi_btn_hs.id = "btn_h";
                richi_btn_hs.innerHTML = "Heading";
                richi_btn_hs.addEventListener('click', () => {this.textAddOrRemoveTag(["h3"])});
                richi_header.appendChild(richi_btn_hs);
                break;
            case 'advanced':
                //Dropdown H1 - H6
                const richi_btn_h = document.createElement("SELECT");
                richi_btn_h.onchange = function () {
                    console.log(this.value);
                    this.textAddOrRemoveTag([this.value])
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
                break;
        }

        if (this.settings.modules.bold) {
            //Button Bold
            const richi_btn_bold = document.createElement("BUTTON");
            richi_btn_bold.id = "btn_strong";
            richi_btn_bold.innerHTML = "B";
            richi_btn_bold.addEventListener('click', () => {this.textAddOrRemoveTag(["strong"])});
            richi_header.appendChild(richi_btn_bold);
        }


        if (this.settings.modules.italic) {
            //Button Italic
            const richi_btn_italic = document.createElement("BUTTON");
            richi_btn_italic.id = "btn_i";
            richi_btn_italic.innerHTML = "I";
            richi_btn_italic.addEventListener('click', () => {this.textAddOrRemoveTag(["i"])});
            richi_header.appendChild(richi_btn_italic);
        }


        if (this.settings.modules.clear) {
            //Button Remove Format
            const richi_btn_remove = document.createElement("BUTTON");
            richi_btn_remove.innerHTML = "Remove";
            richi_btn_remove.addEventListener('click', () => {this.textRemoveFormats(["strong", "i", "h1", "h2", "h3", "h4", "h5", "h6"])});
            richi_header.appendChild(richi_btn_remove);
        }

        if (this.settings.modules.html) {
            //Button HTML
            const richi_btn_html = document.createElement("BUTTON");
            richi_btn_html.innerHTML = "<>";
            richi_btn_html.addEventListener('click', () => {this.switchDisplay()});
            richi_header.appendChild(richi_btn_html);
        }


        /*const richi_btn_update = document.createElement("BUTTON");
        richi_btn_update.innerHTML = "update";
        richi_btn_update.onclick = function() {
            update(this.parentNode.parentNode.id);
        };
        richi_header.appendChild(richi_btn_update);*/

        return richi_header;
    }

    richiText() {
        let richi_text = document.createElement("DIV");
        richi_text.className = "richi-text";
        richi_text.innerHTML = this.settings.placeholder;
        richi_text.contentEditable = "true";
        document.execCommand('defaultParagraphSeparator', false, 'p');

        richi_text.addEventListener("keydown", function (e) {
            if (richi_text.innerHTML === "<p><br></p>" && e.key === "Backspace") {
                e.preventDefault();
            }
        });

        richi_text.addEventListener('keyup', () => this.cursorMove());
        richi_text.addEventListener('click', () => this.cursorMove());

        return richi_text;
    }

    richiHTML() {
        var richi_html = document.createElement("textarea");
        richi_html.className = "richi-html";
        richi_html.style.display = "none";

        return richi_html;
    }

    cursorMove() {
        const el = document.getElementById(this.id).getElementsByClassName("richi-text")[0];
        let sel = window.getSelection();
        let node = sel.baseNode;
        let path = [];

        do {
            path.push(node.parentNode);
            node = node.parentNode;
        } while (path[path.length - 1] !== el);

        this.cursor_path = [];

        for (let i of path) {
            this.cursor_path.push(i.tagName);
        }

        this.updateNav();
    }

    switchDisplay() {
        const el = document.getElementById(this.id);
        let text = el.getElementsByClassName("richi-text")[0];
        let html = el.getElementsByClassName("richi-html")[0];
    
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

    checkTag(tag) {
        const sel = window.getSelection();
        let nodeList = [];
        if (sel != 0 && tag != "") {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.cloneContents();
            let richiTmp = document.createElement('richi-tmp');
            richiTmp.appendChild(rangeContent);
    
            let content = richiTmp.querySelectorAll(tag);
            //console.log(content);
            for (let node of [...content]) {
                nodeList.push(node.tagName);
            }
            //console.log(nodeList);
            //console.log(nodeList.includes(tag.toUpperCase()));
        }
        return this.cursor_path.includes(tag.toUpperCase()) || nodeList.includes(tag.toUpperCase());
    }
    
    checkTags(tag) {
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
        let i = this.cursor_path;
        i = i.filter(e => e !== 'DIV')
    
        return nodeList.concat(i);
        //return cursor_path.includes(tag.toUpperCase()) || nodeList.includes(tag.toUpperCase());
    }

    textAddOrRemoveTag(tag) {
        const el = document.getElementById(this.id);
        let check = this.checkTag(tag[0]);
        const sel = window.getSelection();
        //console.log(check);
        if (sel != 0) {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.extractContents();
            let richiTmp = document.createElement('richi-tmp');
    
            richiTmp.appendChild(rangeContent);
            range.insertNode(richiTmp);
    
            if (check) {
                this.textRemoveTags(el, tag);
            } else {
                this.textAddTag(el, tag);
            }
    
            this.cleanCode(el, tag);
        }
    }
    
    textRemoveFormats(tags) {
        const el = document.getElementById(this.id);
        const sel = window.getSelection();
        console.log(sel);
        if (sel != 0) {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.extractContents();
            let richiTmp = document.createElement('richi-tmp');
    
            richiTmp.appendChild(rangeContent);
            range.insertNode(richiTmp);
    
            this.textRemoveTags(el, tags);
            this.cleanCode(el, tags);
        }
    }
    
    textAddTag(element, tag) {
        let content = element.getElementsByClassName("richi-text")[0];
        let tmpText = content.innerHTML;
    
        tmpText = tmpText.replace(richi_start_tag, "<" + tag + ">");
        tmpText = tmpText.replace(richi_end_tag, "</" + tag + ">");
    
        content.innerHTML = tmpText;
    }
    
    textRemoveTags(element, tags) {
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
    
    cleanCode(element, tags) {
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

    updateNav() {
        const el = document.getElementById(this.id);
        let header = el.getElementsByClassName("richi-header")[0];
        //console.log(header.getElementsByTagName("button"));
        let tags = [...header.getElementsByTagName("button")];
        //console.log(tags);
        tags.forEach(item => {
            if (item.id) {
                let tag = item.id.slice(4);
                //console.log(item, tag);
                if (this.checkTag(tag)) {
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
                if (this.checkTags(item.value).includes(item.value)) {
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
}