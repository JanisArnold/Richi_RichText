//const richi_start_tag = "<richi-tmp>";
//const richi_end_tag = "</richi-tmp>";

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
                underline: true,
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
                underline: true,
                clear: true,
                code: true
            } : {
                heading: [false, 'simple', 'advanced'].includes(settings.components.heading) ? settings.components.heading : 'simple',
                bold: [true, false].includes(settings.components.bold) ? settings.components.bold : true,
                italic: [true, false].includes(settings.components.italic) ? settings.components.italic : true,
                underline: [true, false].includes(settings.components.underline) ? settings.components.underline : true,
                clear: [true, false].includes(settings.components.clear) ? settings.components.clear : true,
                code: [true, false].includes(settings.components.code) ? settings.components.code : true
            },
            placeholder: settings.placeholder || '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            //theme: settings.theme || 'default'
        }
        this.#cursor_path = [];

        this.#init();
        //this.test();
    }

    /*test() {
        console.log(this);
    }*/

    #init() {
        //console.log(this.#id);
        const el = document.getElementById(this.#id);
        //console.log(el.innerHTML);
        this.#settings.placeholder = el.innerHTML.replace(/  +/g, '') || this.#settings.placeholder;
        el.innerHTML = null;

        let richiCSS = 'richiCSS';  // you could encode the css path itself to generate id..
        if (!document.getElementById(richiCSS)) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.id = richiCSS;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'richi.css';
            head.appendChild(link);
        }

        //console.log(el);
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
                richi_btn_hs.className = "richi-h";
                richi_btn_hs.dataset.richi = "h3";
                richi_btn_hs.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAWklEQVRIiWNgGAVkgqMMDAz/GRgYDlOqlhGHpv9EqCFKLRMBzRSDUQuoYoEwmXIMDAzEpSJSwDBMRbjAfyQshEedMJpaDDCak0ctoJ0FR6A0MRUOKWpHASYAAC/LE38TKClKAAAAAElFTkSuQmCC"/>';
                richi_btn_hs.addEventListener('click', () => { this.#addOrRemoveHeading("h3") });
                richi_header.appendChild(richi_btn_hs);
                break;
            case 'advanced':
                //Dropdown H1 - H6
                const richi_btn_h = document.createElement("SELECT");
                richi_btn_h.onchange = function () {
                    //console.log(this.value);
                    //this.#textAddOrRemoveTag([this.value])
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
            richi_btn_bold.className = "richi-bold";
            richi_btn_bold.dataset.richi = "b";
            richi_btn_bold.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA5klEQVRIie3VsUoDQRRG4U8jWii2NtoINtHK2sTWxxIEC619BV/AyiZvoFjYqJ1phAhiJSISC+8QIpu4O9ntcuAyxf5zDzuzO8OcTI7Qx7CgvnGPY6zlCp4nNP9bd1jPEaQGRSyhi5vInNYtSOxF5rEpwUpkPqaFFnPswU6MLzmTy+zBbWROZhH8V1/YblIwxCsOcwWTaKGNq8gNsFWnILGAy8ieNyGA3cg+NSVYjuxb0cNZ/oPEfozvVSaVfYMWriN7UadgFR30jJZns4qg7HGdPtGDKs35vXCmST7xgDNsVG0+Z4wfqKFtvXOVZBUAAAAASUVORK5CYII="/>';
            richi_btn_bold.addEventListener('click', () => { document.execCommand("bold") });
            richi_header.appendChild(richi_btn_bold);
        }


        if (this.#settings.components.italic) {
            //Button Italic
            const richi_btn_italic = document.createElement("BUTTON");
            richi_btn_italic.className = "richi-i";
            richi_btn_italic.dataset.richi = "i";
            richi_btn_italic.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAmklEQVRIiWNgGAVUAkcZGBj+48CH8WlkItKCf3jk/hNpBlFAGWrgFwYGBkZiNBDrAxhQg9K3GIh0OakWqCJZQBQg14LbtLIAFkQ0t4DoICIFsDMwMPxhgESuEC0s0IYa/oYUTaQEEckpiFQLyAp/cnxAdAoi1QKSkyip4BkDJJINaGE4DwOkRP0HZVMNkF0PwAChOKBbPTCCAQA+oCd+eQtYhAAAAABJRU5ErkJggg=="/>';
            richi_btn_italic.addEventListener('click', () => { document.execCommand("italic") });
            richi_header.appendChild(richi_btn_italic);
        }

        if (this.#settings.components.underline) {
            //Button Underline
            const richi_btn_underline = document.createElement("BUTTON");
            richi_btn_underline.className = "richi-u";
            richi_btn_underline.dataset.richi = "u";
            richi_btn_underline.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAqElEQVRIie2VQQqDMBBFH4W6a+u2vU5P0B5De8tiRZCuStFzuFcXGSGICWZcKX74zCKfvCEhGdiyCiCfkXuLg9WJF+UOGnKIdsAOWDmgkXryZC6jbBDgL/XuyQxrP0/GqRfmC6iAeGI9BmrJJBpABHwtyAM4i5/W5iVw1AAAbhZkyiVw1W4+KAJS4IO5zAbIMMei7nwbynCf/djOieZ7B21AM3Mm30rVA/IQL6bXqrypAAAAAElFTkSuQmCC"/>';
            richi_btn_underline.addEventListener('click', () => { document.execCommand("underline") });
            richi_header.appendChild(richi_btn_underline);
        }


        if (this.#settings.components.clear) {
            //Button Remove Format
            const richi_btn_clear = document.createElement("BUTTON");
            richi_btn_clear.className = 'richi-clear';
            richi_btn_clear.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABW0lEQVRIie3Uv05UQRTH8c9lLSRQmJhY2WIHiTEEaOmwtyMktHbwBPAArg2KLlRG/riJseUBCC9AQUUDNhYSWUMs12LPTcb17u69cEtOMsk9M7/5fe85Mxnuo0K8xHd07zgusVQEuKzBPB8XuWmWALp3qL4oMhir2fS/qAI4xzM8x4/bwEb1dTnRrpfQVwJcYRyP8BCP8acMoGyLPofhCl7hJ77iCHOYxAt8G2Yy7G+mQ3OK4/h+4t9bmMeGii06ifWFZG4q5jI08RvbaCSQ0oDVARVneNen/YIHA/SF5r8wMcC8FZobrOE68v2kkpGAj7H2OvLZyJuJ+WLMzY+CFAH28BRnkU+GthP5Wl9V7WTvQT+kzCM2E9oPkV/rHX6GrQJ9qyrgMLSNaEMOaQ/Qd1JA2ed6M4HsjdC+TQFLFSD5PR8G2VHTa93Apz7z3brMU8h7vfN4U7f50PgLf3DjpoE6xecAAAAASUVORK5CYII="/>';
            richi_btn_clear.addEventListener('click', () => { document.execCommand("removeFormat") });
            richi_header.appendChild(richi_btn_clear);
        }

        if (this.#settings.components.code) {
            //Button HTML
            const richi_btn_code = document.createElement("BUTTON");
            richi_btn_code.className = 'richi-code';
            richi_btn_code.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABH0lEQVRIie2UsU4CQRRFT4iU7A9o7JEa/wAspZBQaAUfYQmlrbSQQMM3GD+BykShsjPwAdgRTdbmTXbz8naYAem4yWY2795372TyZuCEf0YZeANmxwq4AlJgEdpQigy4lPXr0IBrIDHq57KuVT2RnqCAATAHng3uQtaVqg+lZ2CFaPMU+AFuDX4sfE/VW9KT+kKc+S9wX6B5FU3D4O5yIU/7mAMsRVct4M2QLtmxdDzmABvRWgPg0MmFdGPGNJFvA3wH9qTu55HsiB4KxDXRfHgM22S772tyV8iN8C/7mDvkx7SluJ5wY6MvaEx1yETV+57dTUPNHepARdVG2JcM0dZDzYvgLlkzpilmTN1Dp98hL84itO/AFviMCThhJ/4AR81RKde75vMAAAAASUVORK5CYII="/>';
            richi_btn_code.addEventListener('click', () => {
                this.#switchDisplay();
                this.#autoResize(document.getElementById(this.#id).getElementsByClassName("richi-html")[0]);
            });
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
        richi_html.addEventListener("input", () => { this.#autoResize(richi_html) });

        return richi_html;
    }

    #cursorMove() {
        const el = document.getElementById(this.#id).getElementsByClassName("richi-text")[0];
        let sel = window.getSelection();
        let node = sel.anchorNode;
        let path = [];

        do {
            path.push(node.parentNode);
            node = node.parentNode;
        } while (path[path.length - 1] !== el);

        this.#cursor_path = [];

        for (let i of path) {
            this.#cursor_path.push(i.tagName);
        }

        console.log(this.#cursor_path);
        this.#updateNav();
    }

    #autoResize(el, add = 0) {
        //console.log(el.value == "");
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + add + 2 + 'px';
    }

    #switchDisplay() {
        const el = document.getElementById(this.#id);
        let text = el.getElementsByClassName("richi-text")[0];
        let html = el.getElementsByClassName("richi-html")[0];
        let code = el.getElementsByClassName("richi-header")[0].getElementsByClassName("richi-code")[0];

        if (html.style.display === "none") {
            html.style.display = "block";
            text.style.display = "none";
            if (!code.classList.contains('richi-active')) {
                code.classList.add('richi-active');
            }

            html.value = text.innerHTML;
        } else {
            html.style.display = "none";
            text.style.display = "block";
            code.classList.remove('richi-active');

            if (!html.value) {
                html.value = "<p><br></p>";
            }

            text.innerHTML = html.value;
        }
        //console.log(text);
        //console.log(html);
    }

    //return all nodes from selection or element
    /*#getPath(el) {
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
    }*/

    #getTags(tag) {
        const sel = window.getSelection();
        let nodeList = [];
        if (sel != 0 && tag != "") {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.cloneContents();
            let richiTmp = document.createElement('richi-tmp');
            richiTmp.appendChild(rangeContent);
            //console.log(range);

            let content = richiTmp.querySelectorAll(tag);
            //console.log(content);
            for (let node of [...content]) {
                nodeList.push(node.tagName);
            }
            //console.log(nodeList);
            //console.log(nodeList.includes(tag.toUpperCase()));
        }
        //console.log(nodeList);
        //console.log(cursor_path);
        let i = this.#cursor_path;
        i = i.filter(e => e !== 'DIV')

        //console.log(i);
        return nodeList.concat(i);
    }

    #checkTag(tag) {
        return this.#getTags(tag).includes(tag.toUpperCase());
    }

    #addOrRemoveHeading(tag) {
        console.log(tag);
        if (this.#checkTag(tag)) {
            const sel = window.getSelection();
            let range = sel.getRangeAt(0);
            let tmpNodes = [];
            let node = sel.anchorNode.parentNode;

            if (sel.focusNode.parentNode.nodeName === tag.toUpperCase()) {
                node = sel.focusNode.parentNode;
            }

            [...sel.anchorNode.childNodes].forEach(node => {
                node = node.nodeName;
                tmpNodes.push(node);
            });

            if (tmpNodes.includes(tag.toUpperCase())) {
                let i = tmpNodes.indexOf(tag.toUpperCase());
                let nodes = [...sel.anchorNode.childNodes];
                node = nodes[i];
                //console.log("nein");
            }

            //console.log(range);

            //console.log(sel);
            while (node.nodeName !== tag.toUpperCase()) {
                node = node.parentNode;
            }

            range.selectNode(node);

            let frag = range.createContextualFragment(node.innerHTML + "<br>");
            range.deleteContents();
            range.insertNode(frag);

        } else {
            document.execCommand("formatBlock", false, "<h3>");
            const sel = window.getSelection();
            let range = sel.getRangeAt(0);
            let node = sel.anchorNode.parentNode;

            while (node.nodeName !== tag.toUpperCase()) {
                node = node.parentNode;
            }

            console.log(node);

            range.selectNode(node);
            //let frag = range.createContextualFragment(node.innerHTML);
            //range.deleteContents();
            //range.insertNode(frag);
            //range.selectNode(node);
        }
    }

    /*#textAddOrRemoveTag(tag) {
        const el = document.getElementById(this.#id);
        let check = this.#checkTag(tag[0]);
        const sel = window.getSelection();
        //console.log(check);
        if (sel != 0) {
            //let range = sel.getRangeAt(0).cloneRange();
            let range = sel.getRangeAt(0);
            let rangeContent = range.extractContents();
            //console.log(rangeContent);
            //console.log(range.collapse(true));
            //console.log(range);
            //let richiTmp = document.createElement('richi-tmp');

            //richiTmp.appendChild(rangeContent);
            //range.insertNode(richiTmp);

            if (check) {
                //this.#textRemoveTags(el, tag);
                let node = document.createElement("richi-tmp");
                node.appendChild(rangeContent);
                range.insertNode(node);
                //this.#textRemoveTags(el, tag);
                //this.#setSel(tag);


                /*node.appendChild(rangeContent);
                console.log(rangeContent);
                rangeContent = "</"+tag+">" +node.innerHTML + "<"+tag+">";
                //range.insertNode(rangeContent)
                console.log(rangeContent);

                let test = range.createContextualFragment(rangeContent);
                console.log(test);
                range.insertNode(test);*/

    //} else {
    /*let node = document.createElement(tag);
    node.appendChild(rangeContent);
    console.log(rangeContent.innerText)
    console.log(node.innerText);
    range.insertNode(node);*/

    /*let node = document.createElement("richi-tmp");
    //let node2 = document.createElement(tag);
    //node2.appendChild(rangeContent);
    node.appendChild(rangeContent);
    console.log(rangeContent);
    range.insertNode(node);*/

    //this.#textAddTag(el, tag);
    //this.#setSel(tag);
    // }
    //}
    //}

    /*#setSel(tag) {
        //this function schout create a selection where the <richi-tmp> node is and remove the node
        const el = document.getElementById(this.#id);
        let text = el.getElementsByClassName("richi-text")[0];
        //text.innerHTML = text.innerHTML.slice(3);
        let node = text.getElementsByTagName("richi-tmp")[0];

        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
        }

        console.log(node);
        let range = document.createRange();
        //range.setStart(node, 0);
        selection.addRange(range);
        this.#cleanCode(el, tag);

        let content = node.innerHTML;
        console.log(content);
        let frag = range.createContextualFragment(content);
        range.deleteContents();
        range.insertNode(frag);
        //console.log(range);

    }*/

    /*#test() {
        //The new select function to slect all richi-tmp tags and remove them whitaout messing up the p tags
        const el = document.getElementById(this.#id);
        let text = el.getElementsByClassName("richi-text")[0];

        let nodes = text.getElementsByTagName("richi-tmp");

        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
        }

        console.log(nodes);
        let range = document.createRange();

        range.setStart(nodes[0], 0);
        range.setEnd(nodes[nodes.length - 1], 1);
        //selection.addRange(range);

        for (let node of nodes) {
            let range = document.createRange();
            range.selectNode(node);
            console.log(range);
            let frag = range.createContextualFragment(node.innerHTML);
            range.deleteContents();
            range.insertNode(frag);
        }

        selection.addRange(range);
    }*/

    /*#textAddTag(element, tag) {
        let content = element.getElementsByClassName("richi-text")[0];
        let tmpText = content.innerHTML;

        tmpText = tmpText.replace(richi_start_tag, "<" + tag + ">");
        tmpText = tmpText.replace(richi_end_tag, "</" + tag + ">");

        content.innerHTML = tmpText;
    }*/

    /*#textRemoveTags(element, tags) {
        let content = element.getElementsByClassName("richi-text")[0];
        //console.log(tags);

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
    }*/

    /*#cleanCode(element, tags) {
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
    }*/

    #updateNav() {
        const el = document.getElementById(this.#id);
        let header = el.getElementsByClassName("richi-header")[0];
        //console.log(header.getElementsByTagName("button"));
        let tags = [...header.getElementsByTagName("button")];
        //console.log(tags);
        tags.forEach(item => {
            if (item.dataset.richi) {
                let tag = item.dataset.richi;
                //console.log(item, tag);
                if (this.#checkTag(tag)) {
                    if (!item.classList.contains('richi-active')) {
                        item.classList.add('richi-active');
                    }
                } else {
                    item.classList.remove('richi-active');
                    //item.style = "background-color: none";
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