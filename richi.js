class Richi {
    #id;
    #settings;
    #cursor_path;
    #tmpRange;

    constructor(id, settings) {
        this.#id = id;
        this.#settings = (settings === undefined) ? {
            //debug: false,
            components: {
                heading: 'simple',
                bold: true,
                italic: true,
                underline: true,
                link: true,
                clear: true,
                code: true
            },
            placeholder: '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            theme: 'default'
        } : {
            //debug: [true, false].includes(settings.debug) ? settings.debug : false,
            components: (settings.components === undefined) ? {
                heading: 'simple',
                bold: true,
                italic: true,
                underline: true,
                link: true,
                clear: true,
                code: true
            } : {
                heading: [false, 'simple'/*,'advanced'*/].includes(settings.components.heading) ? settings.components.heading : 'simple',
                bold: [true, false].includes(settings.components.bold) ? settings.components.bold : true,
                italic: [true, false].includes(settings.components.italic) ? settings.components.italic : true,
                underline: [true, false].includes(settings.components.underline) ? settings.components.underline : true,
                link: [true, false].includes(settings.components.link) ? settings.components.link : true,
                clear: [true, false].includes(settings.components.clear) ? settings.components.clear : true,
                code: [true, false].includes(settings.components.code) ? settings.components.code : true
            },
            placeholder: settings.placeholder || '<p>Richi Richtext...</p>',
            //readOnly: settings.readonly || false,
            theme: ["default", 'dark', 'janis'].includes(settings.theme) ? settings.theme : 'default',
        }
        this.#cursor_path = [];

        this.#init();
    }

    #init() {
        //console.log(this.#id);
        const el = document.getElementById(this.#id);
        this.#settings.placeholder = el.innerHTML.replace(/  +/g, '') || this.#settings.placeholder;
        el.innerHTML = null;
        el.classList.add("richi");
        el.classList.add("ri-th-" + this.#settings.theme);

        let richiCSS = 'richiCSS';
        if (!document.getElementById(richiCSS)) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.id = richiCSS;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            //link.href = 'https://cdn.jsdelivr.net/gh/janis-5/Richi_RichText@latest/richi.css';
            link.href = 'richi.css';
            head.appendChild(link);
        }

        let richiTheme = 'richiTheme_' + this.#settings.theme;
        if (!document.getElementById(richiTheme)) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.id = richiTheme;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            //link.href = 'https://cdn.jsdelivr.net/gh/janis-5/Richi_RichText@latest/themes/' + this.#settings.theme + '.css';
            link.href = 'themes/' + this.#settings.theme + '.css';
            head.appendChild(link);
        }

        el.appendChild(this.#richiHeader());
        el.appendChild(this.#richiText());
        el.appendChild(this.#richiLink());
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
            /* case 'advanced':
                 //Dropdown H1 - H6
                 const richi_btn_h = document.createElement("SELECT");
                 richi_btn_h.onchange = function () {
                     //console.log(this.value);
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
                 break;*/
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

        if (this.#settings.components.link) {
            //Button Remove Format
            const richi_btn_link = document.createElement("BUTTON");
            richi_btn_link.className = 'richi-link';
            richi_btn_link.dataset.richi = "a";
            richi_btn_link.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAzElEQVRIie2TMQrCQBBFHx4jabyItoqC3kZjkyaC59FaRQweR8FgEwiJxY6wDJu4WinsgyHw989nd4ZAIPB3zIADUACNVbnDe1GeG7ADhm3hG9Vg19nhz1u8NZBo81wOS2ABRN0PddIHMqCSrJF9eBJx+UWwJpWsvS0+RIyVWc/ZVXo/kegFQE/ERn1f1B431j06E4CjCKlH4DtWOEY0FrEC1piFfUos4aVkTbQhwYzEZ87QvZ+s7RYDYAtcVYPPf3DHjGXa/dBA4Od4Ah34WosKz1B5AAAAAElFTkSuQmCC"/>';
            richi_btn_link.addEventListener('click', () => { this.#showLinkBox() });
            richi_header.appendChild(richi_btn_link);
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

        richi_text.addEventListener('click', () => {
            let linkBox = document.getElementById(this.#id).getElementsByClassName("richi-box-link")[0];
            linkBox.style.display = "none";
        });

        return richi_text;
    }

    #richiLink() {
        let richi_link = document.createElement("div");
        richi_link.className = "richi-box-link";
        richi_link.style.display = "none";

        let richi_link_setting_box = document.createElement("div");
        richi_link_setting_box.className = "richi-link-setting";
        richi_link_setting_box.style.display = "none";

        let richi_link_setting_tab_label = document.createElement("label");
        richi_link_setting_tab_label.innerText = "open in new tab";

        let richi_link_setting_tab = document.createElement("input");
        richi_link_setting_tab.type = "checkbox";
        richi_link_setting_tab_label.appendChild(richi_link_setting_tab);

        
        richi_link_setting_box.appendChild(richi_link_setting_tab_label);

        richi_link.appendChild(richi_link_setting_box);

        let richi_link_setting = document.createElement("button");
        richi_link_setting.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABP0lEQVRIieXVvUoDQRQF4E/tEg34U9oLsdWglYWF2olB7dTWwryElYWVoJ2+ge+QN1Bs0gUUQcQySWksdoNxmVkjiYV44MLO7LnnzM6dO8t/wRZa6KbRwuYgieMDGuyj2DcupnMjwSKaPlffiybK3yWPBcYXmMMt1nAc4PXQxRXq2MEbTtL5II4CK/1pHMbEJ/E8AoMXlEIGtZykR1QxlcY2Gjn8WshgFe2I+EyAP52+y/LbWIltUwWdTEI1RsZuhttJNXLR31BdyZbEUMpwW1nCoI0WQ+z4Rg0qgbn1nPyNgF50i2JFbkgKmsUsngL8L0XuX+0yCgGhBdxLClpKYw93mA/wC7Gv+PVGI2nzYQ0O+gUnMgYPkouuiVO8Ykn8tLzjEufpcx1nci67EMqGuK4HxU3A4HpU4gzxy/z7+ABsuKy+qDOyAQAAAABJRU5ErkJggg=="/>';
        richi_link_setting.addEventListener("click", () => {
            this.#toggleLinkSetting(richi_link_setting, richi_link_setting_box);
        })
        richi_link.appendChild(richi_link_setting);

        let richi_link_input = document.createElement("input");
        richi_link_input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                richi_link_save.click();
            }
        });
        richi_link.appendChild(richi_link_input);

        let richi_link_save = document.createElement("button");
        richi_link_save.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAbUlEQVRIie2SMQqAMAxF3yUUvf9JnERaFzt4HB3aocQWB1MokgdZQnh8wgfD6IkR2IGllTwAF7BpywfgSPITmEzev3wFPLEZkrwtoXLziqsIVOTwfMFc2H3+uUyrklySp27SFohpXRq15MbPuAEcIC00f9uqxwAAAABJRU5ErkJggg=="/>';
        richi_link_save.addEventListener("click", () => {
            this.#addOrUpdateLink();
        })
        richi_link.appendChild(richi_link_save);

        let richi_link_remove = document.createElement("button");
        richi_link_remove.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAq0lEQVRIieWVUQqCQBCGvzpND9s98kbmU4/eK7rE+qZBsN6heplgGVfUQaXshwH5Hf5v1hGFf9EFeKkqrWG3RNjYuuqwfQLwtE4mkI1p1+Nbj9rJS+1gVn0FwAMF0EZeC+RAZQXH73YungOClBOvUL0mQBzo1HWYA/CBHKP7B+CR6Oto8SX3adVHtPiSPXBW0wbx/BBgu5+KuyGrmdKcATXj/2Q1cDIM9QN6A0KVZNfyr7QUAAAAAElFTkSuQmCC"/>';
        richi_link_remove.addEventListener("click", () => {
            this.#removeLink();
        })
        richi_link.appendChild(richi_link_remove);

        return richi_link;
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

        this.#cursor_path = path;

        /*for (let i of path) {
            this.#cursor_path.push(i.tagName);
        }*/

        console.log(this.#cursor_path);
        this.#updateNav();
    }

    #autoResize(el, add = 0) {
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
    }

    #getNodes(tag) {
        const sel = window.getSelection();

        let list = [];
        if (sel != 0 && tag != "") {
            let range = sel.getRangeAt(0).cloneRange();
            let rangeContent = range.cloneContents();

            list = rangeContent.querySelectorAll(tag);
        }
        return [...list].concat([...this.#cursor_path]);
    }

    #getTags(tag) {
        let nodeList = this.#getNodes(tag);
        let tagList = [];

        for (let node of [...nodeList]) {
            tagList.push(node.tagName);
        }

        tagList = tagList.filter(e => e !== 'DIV')

        console.log(tagList);
        return tagList;
    }

    #checkTag(tag) {
        return this.#getTags(tag).includes(tag.toUpperCase());
    }

    #getFullNodes() {
        function nextNode(node) {
            if (node.hasChildNodes()) {
                return node.firstChild;
            } else {
                while (node && !node.nextSibling) {
                    node = node.parentNode;
                }
                if (!node) {
                    return null;
                }
                return node.nextSibling;
            }
        }

        function getRangeSelectedNodes(range) {
            let node = range.startContainer;
            let endNode = range.endContainer;

            // Special case for a range that is contained within a single node
            if (node == endNode) {
                return [node];
            }

            // Iterate nodes until we hit the end container
            let rangeNodes = [];
            while (node && node != endNode) {
                rangeNodes.push(node = nextNode(node));
            }

            // Add partially selected nodes at the start of the range
            node = range.startContainer;
            while (node && node != range.commonAncestorContainer) {
                rangeNodes.unshift(node);
                node = node.parentNode;
            }

            return rangeNodes;
        }

        function getSelectedNodes() {
            if (window.getSelection) {
                let sel = window.getSelection();
                if (!sel.isCollapsed) {
                    return getRangeSelectedNodes(sel.getRangeAt(0));
                }
            }
            return [];
        }

        return getSelectedNodes();
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

            //console.log(node);
            range.selectNode(node);
        }
    }

    #showLinkBox() {
        const sel = window.getSelection();
        let linkBox = document.getElementById(this.#id).getElementsByClassName("richi-box-link")[0];
        let linkInput = linkBox.getElementsByTagName("input")[1];
        let linkCheckBox = linkBox.getElementsByTagName("input")[0];
        linkInput.value = "";

        let range = sel.getRangeAt(0);
        let nodes = this.#getFullNodes();
        let node = this.#cursor_path.find(n => n.nodeName === "A");

        if (!node) {
            node = nodes.find(n => n.nodeName === "A");
        }
        //console.log(node);

        if (node) {
            range.selectNode(node);
            linkInput.value = node.getAttribute("href");
            if (node.target === "_blank") {
                linkCheckBox.checked = true;
            }
        }

        let pos = range.getBoundingClientRect();
        //console.log(pos);

        linkBox.style.display = "flex";
        linkBox.style.left = pos.left + "px";
        linkBox.style.top = pos.top + pos.height + "px";
        //console.log(linkBox)
        this.#tmpRange = range;
    }

    #addOrUpdateLink() {
        const sel = document.getSelection()
        sel.removeAllRanges();
        sel.addRange(this.#tmpRange);

        //console.log(sel);
        let linkBox = document.getElementById(this.#id).getElementsByClassName("richi-box-link")[0];
        let linkInput = linkBox.getElementsByTagName("input")[1];
        let linkCheckBox = linkBox.getElementsByTagName("input")[0];

        let selChilds = sel.anchorNode.childNodes;
        let node = [...selChilds].find(n => n.nodeName === "A");

        if (linkInput.value) {
            if (node) {
                node.href = linkInput.value;
                if (linkCheckBox.checked === true) {
                    node.target = "_blank";
                }else{
                    node.removeAttribute("target");
                }
            }
            else {
                document.execCommand('createLink', false, linkInput.value);
                if (linkCheckBox.checked === true) {
                    sel.anchorNode.parentElement.target = '_blank';
                }
            }
        } else {
            this.#removeLink();
        }
        linkBox.style.display = "none";
    }

    #removeLink() {
        const sel = document.getSelection()
        let linkBox = document.getElementById(this.#id).getElementsByClassName("richi-box-link")[0];
        sel.removeAllRanges();
        sel.addRange(this.#tmpRange);
        document.execCommand('unLink');
        linkBox.style.display = "none";
    }

    #toggleLinkSetting(btn, box) {
        if (box.style.display === "none") {
            box.style.display = "flex";
            btn.classList.add('richi-active');
        } else {
            box.style.display = "none";
            btn.classList.remove('richi-active');
        }
    }

    #updateNav() {
        const el = document.getElementById(this.#id);
        let header = el.getElementsByClassName("richi-header")[0];
        let tags = [...header.getElementsByTagName("button")];

        tags.forEach(item => {
            if (item.dataset.richi) {
                let tag = item.dataset.richi;
                if (this.#checkTag(tag)) {
                    if (!item.classList.contains('richi-active')) {
                        item.classList.add('richi-active');
                    }
                } else {
                    item.classList.remove('richi-active');
                }
            }
        })

        if (this.#settings.components.heading === "advanced") {
            let selected = [...header.getElementsByTagName("option")];
            let s_tags = [];
            selected.forEach(item => {
                if (item.value) {
                    if (this.#checkTag(item.value)) {
                        s_tags.push(item.value);
                    }
                }
            })

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