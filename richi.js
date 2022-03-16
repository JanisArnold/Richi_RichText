const richi_start_tag = "<richi-tmp>";
const richi_end_tag = "</richi-tmp>";

class Richi {
    #id;
    #settings;
    #cursor_path;

    constructor(id, settings) {
        this.#id = id;
        this.#settings = (settings === undefined) ? {
            //debug: false,
            components: {
                heading: 'simple',
                bold: true,
                italic: true,
                clear: true,
                code: true
            },
            placeholder: '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            //theme: settings.theme || 'default'
        } : {
            //debug: [true, false].includes(settings.debug) ? settings.debug : false,
            components: (settings.components === undefined) ? {
                heading: 'simple',
                bold: true,
                italic: true,
                clear: true,
                code: true
            } : {
                heading: [false, 'simple', 'advanced'].includes(settings.components.heading) ? settings.components.heading : 'simple',
                bold: [true, false].includes(settings.components.bold) ? settings.components.bold : true,
                italic: [true, false].includes(settings.components.italic) ? settings.components.italic : true,
                clear: [true, false].includes(settings.components.clear) ? settings.components.clear : true,
                code: [true, false].includes(settings.components.code) ? settings.components.code : true
            },
            placeholder: settings.placeholder || '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            //theme: settings.theme || 'default'
        }
        this.#cursor_path = [];

        this.#init();
        this.test();
    }

    test() {
        console.log(this);
    }

    #init() {
        console.log(this.#id);
        const el = document.getElementById(this.#id);
        console.log(el.innerHTML);
        this.#settings.placeholder = el.innerHTML || this.#settings.placeholder;
        el.innerHTML = null;

        console.log(el);
        el.appendChild(this.#richiHeader());
        el.appendChild(this.#richiText());
        el.appendChild(this.#richiHTML());
    }

    #richiHeader() {
        const richi_header = document.createElement("DIV");
        richi_header.className = "richi-header";

        switch (this.#settings.components.heading) {
            case 'simple':
                //Button Heading
                const richi_btn_hs = document.createElement("BUTTON");
                richi_btn_hs.id = "richi-btn-h3";
                richi_btn_hs.innerHTML = '<img src="icons/icons8-header-48.png" />';
                richi_btn_hs.addEventListener('click', () => { this.#textAddOrRemoveTag(["H3"]) });
                richi_header.appendChild(richi_btn_hs);
                break;
            case 'advanced':
                //Dropdown H1 - H6
                const richi_btn_h = document.createElement("SELECT");
                richi_btn_h.onchange = function () {
                    console.log(this.value);
                    this.#textAddOrRemoveTag([this.value])
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

        if (this.#settings.components.bold) {
            //Button Bold
            const richi_btn_bold = document.createElement("BUTTON");
            richi_btn_bold.id = "richi-btn-strong";
            richi_btn_bold.innerHTML = '<img src="icons/icons8-bold-48.png" />';
            richi_btn_bold.addEventListener('click', () => { this.#textAddOrRemoveTag(["strong"]) });
            richi_header.appendChild(richi_btn_bold);
        }


        if (this.#settings.components.italic) {
            //Button Italic
            const richi_btn_italic = document.createElement("BUTTON");
            richi_btn_italic.id = "richi-btn-i";
            richi_btn_italic.innerHTML = '<img src="icons/icons8-italic-48.png"/>';
            richi_btn_italic.addEventListener('click', () => { this.#textAddOrRemoveTag(["i"]) });
            richi_header.appendChild(richi_btn_italic);
        }


        if (this.#settings.components.clear) {
            //Button Remove Format
            const richi_btn_clear = document.createElement("BUTTON");
            richi_btn_clear.id = 'richi-btn-clear';
            richi_btn_clear.innerHTML = '<img src="icons/icons8-clear-formatting-48.png" />';
            richi_btn_clear.addEventListener('click', () => { this.#textRemoveFormats(["strong", "i", "h1", "h2", "h3", "h4", "h5", "h6"]) });
            richi_header.appendChild(richi_btn_clear);
        }

        if (this.#settings.components.code) {
            //Button HTML
            const richi_btn_code = document.createElement("BUTTON");
            richi_btn_code.id = 'richi-btn-code';
            richi_btn_code.innerHTML = '<img src="icons/icons8-source-code-48.png" />';
            richi_btn_code.addEventListener('click', () => { this.#switchDisplay() });
            richi_header.appendChild(richi_btn_code);
        }


        /*const richi_btn_update = document.createElement("BUTTON");
        richi_btn_update.innerHTML = "update";
        richi_btn_update.onclick = function() {
            update(this.parentNode.parentNode.id);
        };
        richi_header.appendChild(richi_btn_update);*/

        return richi_header;
    }

    #richiText() {
        let richi_text = document.createElement("DIV");
        richi_text.className = "richi-text";
        richi_text.innerHTML = this.#settings.placeholder;
        richi_text.contentEditable = "true";
        document.execCommand('defaultParagraphSeparator', false, 'p');

        richi_text.addEventListener("keydown", function (e) {
            if (richi_text.innerHTML === "<p><br></p>" && e.key === "Backspace") {
                e.preventDefault();
            }
        });

        richi_text.addEventListener('keyup', () => this.#cursorMove());
        richi_text.addEventListener('click', () => this.#cursorMove());

        return richi_text;
    }

    #richiHTML() {
        var richi_html = document.createElement("textarea");
        richi_html.className = "richi-html";
        richi_html.style.display = "none";

        return richi_html;
    }

    #cursorMove() {
        const el = document.getElementById(this.#id).getElementsByClassName("richi-text")[0];
        let sel = window.getSelection();
        let node = sel.baseNode;
        let path = [];

        do {
            path.push(node.parentNode);
            node = node.parentNode;
        } while (path[path.length - 1] !== el);

        this.#cursor_path = [];

        for (let i of path) {
            this.#cursor_path.push(i.tagName);
        }

        console.log(this.#cursor_path)
        this.#updateNav();
    }

    #switchDisplay() {
        const el = document.getElementById(this.#id);
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

    //return all nodes from selection or element
    #getPath(el) {
        let path = [];
        let value = repeatPath(el);
        value = value.map((i) => { return i.nodeName });
        return [...new Set(value)];

        function repeatPath(el, i = 0) {
            //console.log(el);
            path = path.concat(...el.childNodes);
            let tmp = path.slice(i)
            //console.log(tmp);
            for (let p of tmp) {
                if (p.childNodes.lengh !== 0) {
                    repeatPath(p, path.length);
                }
            }
            return path;
        }
    }

    #getTags(tag) {
        const sel = window.getSelection();
        let nodeList = [];
        if (sel != 0 && tag != "") {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.cloneContents();
            let richiTmp = document.createElement('richi-tmp');
            richiTmp.appendChild(rangeContent);
            console.log(range);

            let content = richiTmp.querySelectorAll(tag);
            console.log(content);
            for (let node of [...content]) {
                nodeList.push(node.tagName);
            }
            console.log(nodeList);
            //console.log(nodeList.includes(tag.toUpperCase()));
        }
        //console.log(nodeList);
        //console.log(cursor_path);
        let i = this.#cursor_path;
        i = i.filter(e => e !== 'DIV')

        console.log(i);
        return nodeList.concat(i);
        //return cursor_path.includes(tag.toUpperCase()) || nodeList.includes(tag.toUpperCase());
    }

    #checkTag(tag) {
        return this.#getTags(tag).includes(tag.toUpperCase());
    }

    #textAddOrRemoveTag(tag) {
        const el = document.getElementById(this.#id);
        let check = this.#checkTag(tag[0]);
        const sel = window.getSelection();
        //console.log(check);
        if (sel != 0) {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.extractContents();
            let richiTmp = document.createElement('richi-tmp');

            richiTmp.appendChild(rangeContent);
            range.insertNode(richiTmp);

            if (check) {
                this.#textRemoveTags(el, tag);
            } else {
                this.#textAddTag(el, tag);
            }

            this.#cleanCode(el, tag);
        }
    }

    #textRemoveFormats(tags) {
        const el = document.getElementById(this.#id);
        const sel = window.getSelection();
        console.log(sel);
        if (sel != 0) {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.extractContents();
            let richiTmp = document.createElement('richi-tmp');

            richiTmp.appendChild(rangeContent);
            range.insertNode(richiTmp);

            this.#textRemoveTags(el, tags);
            this.#cleanCode(el, tags);
        }
    }

    #textAddTag(element, tag) {
        let content = element.getElementsByClassName("richi-text")[0];
        let tmpText = content.innerHTML;

        tmpText = tmpText.replace(richi_start_tag, "<" + tag + ">");
        tmpText = tmpText.replace(richi_end_tag, "</" + tag + ">");

        content.innerHTML = tmpText;
    }

    #textRemoveTags(element, tags) {
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

    #cleanCode(element, tags) {
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

    #updateNav() {
        const el = document.getElementById(this.#id);
        let header = el.getElementsByClassName("richi-header")[0];
        //console.log(header.getElementsByTagName("button"));
        let tags = [...header.getElementsByTagName("button")];
        //console.log(tags);
        tags.forEach(item => {
            if (item.id) {
                let tag = item.id.slice(10);
                //console.log(item, tag);
                if (this.#checkTag(tag)) {
                    item.style = "background-color: red";
                } else {
                    item.style = "background-color: none";
                }
            }
        })

        if (this.#settings.components.heading === "advanced") {
            let selected = [...header.getElementsByTagName("option")];
            //console.log(selected);
            let s_tags = [];
            selected.forEach(item => {
                //console.log(item.value);
                if (item.value) {
                    if (this.#checkTag(item.value)) {
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

    //Function to get the value of The Richtext content
    getValue() {
        const el = document.getElementById(this.#id);
        if (el) {
            return el.getElementsByClassName("richi-text")[0].innerHTML;
        }
    }

    //Function to set the value of The Richtext content
    setValue(value) {
        const el = document.getElementById(this.#id);
        if (el) {
            el.getElementsByClassName("richi-text")[0].innerHTML = value;
        }
    }
}