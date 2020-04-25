/* PrismJS 1.20.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+bash+css-extras+git+go+graphql+handlebars+js-extras+js-templates+json+liquid+markdown+markup-templating+nginx+python+jsx+tsx+regex+typescript+vim+wasm&plugins=line-highlight */
var _self =
    typeof window !== "undefined"
        ? window // if in browser
        : typeof WorkerGlobalScope !== "undefined" &&
          self instanceof WorkerGlobalScope
            ? self // if in worker
            : {}; // if in node js

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(_self) {
    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;

    var _ = {
        manual: _self.Prism && _self.Prism.manual,
        disableWorkerMessageHandler:
            _self.Prism && _self.Prism.disableWorkerMessageHandler,
        util: {
            encode: function encode(tokens) {
                if (tokens instanceof Token) {
                    return new Token(
                        tokens.type,
                        encode(tokens.content),
                        tokens.alias
                    );
                } else if (Array.isArray(tokens)) {
                    return tokens.map(encode);
                } else {
                    return tokens
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/\u00a0/g, " ");
                }
            },

            type: function(o) {
                return Object.prototype.toString.call(o).slice(8, -1);
            },

            objId: function(obj) {
                if (!obj["__id"]) {
                    Object.defineProperty(obj, "__id", { value: ++uniqueId });
                }
                return obj["__id"];
            },

            // Deep clone a language definition (e.g. to extend it)
            clone: function deepClone(o, visited) {
                var clone,
                    id,
                    type = _.util.type(o);
                visited = visited || {};

                switch (type) {
                    case "Object":
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = {};
                        visited[id] = clone;

                        for (var key in o) {
                            if (o.hasOwnProperty(key)) {
                                clone[key] = deepClone(o[key], visited);
                            }
                        }

                        return clone;

                    case "Array":
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = [];
                        visited[id] = clone;

                        o.forEach(function(v, i) {
                            clone[i] = deepClone(v, visited);
                        });

                        return clone;

                    default:
                        return o;
                }
            },

            /**
             * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
             *
             * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
             *
             * @param {Element} element
             * @returns {string}
             */
            getLanguage: function(element) {
                while (element && !lang.test(element.className)) {
                    element = element.parentElement;
                }
                if (element) {
                    return (element.className.match(lang) || [
                        ,
                        "none",
                    ])[1].toLowerCase();
                }
                return "none";
            },

            /**
             * Returns the script element that is currently executing.
             *
             * This does __not__ work for line script element.
             *
             * @returns {HTMLScriptElement | null}
             */
            currentScript: function() {
                if (typeof document === "undefined") {
                    return null;
                }
                if ("currentScript" in document) {
                    return document.currentScript;
                }

                // IE11 workaround
                // we'll get the src of the current script by parsing IE11's error stack trace
                // this will not work for inline scripts

                try {
                    throw new Error();
                } catch (err) {
                    // Get file src url from stack. Specifically works with the format of stack traces in IE.
                    // A stack will look like this:
                    //
                    // Error
                    //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
                    //    at Global code (http://localhost/components/prism-core.js:606:1)

                    var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) ||
                        [])[1];
                    if (src) {
                        var scripts = document.getElementsByTagName("script");
                        for (var i in scripts) {
                            if (scripts[i].src == src) {
                                return scripts[i];
                            }
                        }
                    }
                    return null;
                }
            },
        },

        languages: {
            extend: function(id, redef) {
                var lang = _.util.clone(_.languages[id]);

                for (var key in redef) {
                    lang[key] = redef[key];
                }

                return lang;
            },

            /**
             * Insert a token before another token in a language literal
             * As this needs to recreate the object (we cannot actually insert before keys in object literals),
             * we cannot just provide an object, we need an object and a key.
             * @param inside The key (or language id) of the parent
             * @param before The key to insert before.
             * @param insert Object with the key/value pairs to insert
             * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
             */
            insertBefore: function(inside, before, insert, root) {
                root = root || _.languages;
                var grammar = root[inside];
                var ret = {};

                for (var token in grammar) {
                    if (grammar.hasOwnProperty(token)) {
                        if (token == before) {
                            for (var newToken in insert) {
                                if (insert.hasOwnProperty(newToken)) {
                                    ret[newToken] = insert[newToken];
                                }
                            }
                        }

                        // Do not insert token which also occur in insert. See #1525
                        if (!insert.hasOwnProperty(token)) {
                            ret[token] = grammar[token];
                        }
                    }
                }

                var old = root[inside];
                root[inside] = ret;

                // Update references in other language definitions
                _.languages.DFS(_.languages, function(key, value) {
                    if (value === old && key != inside) {
                        this[key] = ret;
                    }
                });

                return ret;
            },

            // Traverse a language definition with Depth First Search
            DFS: function DFS(o, callback, type, visited) {
                visited = visited || {};

                var objId = _.util.objId;

                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        callback.call(o, i, o[i], type || i);

                        var property = o[i],
                            propertyType = _.util.type(property);

                        if (
                            propertyType === "Object" &&
                            !visited[objId(property)]
                        ) {
                            visited[objId(property)] = true;
                            DFS(property, callback, null, visited);
                        } else if (
                            propertyType === "Array" &&
                            !visited[objId(property)]
                        ) {
                            visited[objId(property)] = true;
                            DFS(property, callback, i, visited);
                        }
                    }
                }
            },
        },
        plugins: {},

        highlightAll: function(async, callback) {
            _.highlightAllUnder(document, async, callback);
        },

        highlightAllUnder: function(container, async, callback) {
            var env = {
                callback: callback,
                container: container,
                selector:
                    'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
            };

            _.hooks.run("before-highlightall", env);

            env.elements = Array.prototype.slice.apply(
                env.container.querySelectorAll(env.selector)
            );

            _.hooks.run("before-all-elements-highlight", env);

            for (var i = 0, element; (element = env.elements[i++]); ) {
                _.highlightElement(element, async === true, env.callback);
            }
        },

        highlightElement: function(element, async, callback) {
            // Find language
            var language = _.util.getLanguage(element);
            var grammar = _.languages[language];

            // Set language on the element, if not present
            element.className =
                element.className.replace(lang, "").replace(/\s+/g, " ") +
                " language-" +
                language;

            // Set language on the parent, for styling
            var parent = element.parentNode;
            if (parent && parent.nodeName.toLowerCase() === "pre") {
                parent.className =
                    parent.className.replace(lang, "").replace(/\s+/g, " ") +
                    " language-" +
                    language;
            }

            var code = element.textContent;

            var env = {
                element: element,
                language: language,
                grammar: grammar,
                code: code,
            };

            function insertHighlightedCode(highlightedCode) {
                env.highlightedCode = highlightedCode;

                _.hooks.run("before-insert", env);

                env.element.innerHTML = env.highlightedCode;

                _.hooks.run("after-highlight", env);
                _.hooks.run("complete", env);
                callback && callback.call(env.element);
            }

            _.hooks.run("before-sanity-check", env);

            if (!env.code) {
                _.hooks.run("complete", env);
                callback && callback.call(env.element);
                return;
            }

            _.hooks.run("before-highlight", env);

            if (!env.grammar) {
                insertHighlightedCode(_.util.encode(env.code));
                return;
            }

            if (async && _self.Worker) {
                var worker = new Worker(_.filename);

                worker.onmessage = function(evt) {
                    insertHighlightedCode(evt.data);
                };

                worker.postMessage(
                    JSON.stringify({
                        language: env.language,
                        code: env.code,
                        immediateClose: true,
                    })
                );
            } else {
                insertHighlightedCode(
                    _.highlight(env.code, env.grammar, env.language)
                );
            }
        },

        highlight: function(text, grammar, language) {
            var env = {
                code: text,
                grammar: grammar,
                language: language,
            };
            _.hooks.run("before-tokenize", env);
            env.tokens = _.tokenize(env.code, env.grammar);
            _.hooks.run("after-tokenize", env);
            return Token.stringify(_.util.encode(env.tokens), env.language);
        },

        tokenize: function(text, grammar) {
            var rest = grammar.rest;
            if (rest) {
                for (var token in rest) {
                    grammar[token] = rest[token];
                }

                delete grammar.rest;
            }

            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text);

            matchGrammar(text, tokenList, grammar, tokenList.head, 0);

            return toArray(tokenList);
        },

        hooks: {
            all: {},

            add: function(name, callback) {
                var hooks = _.hooks.all;

                hooks[name] = hooks[name] || [];

                hooks[name].push(callback);
            },

            run: function(name, env) {
                var callbacks = _.hooks.all[name];

                if (!callbacks || !callbacks.length) {
                    return;
                }

                for (var i = 0, callback; (callback = callbacks[i++]); ) {
                    callback(env);
                }
            },
        },

        Token: Token,
    };

    _self.Prism = _;

    function Token(type, content, alias, matchedStr, greedy) {
        this.type = type;
        this.content = content;
        this.alias = alias;
        // Copy of the full string this token was created from
        this.length = (matchedStr || "").length | 0;
        this.greedy = !!greedy;
    }

    Token.stringify = function stringify(o, language) {
        if (typeof o == "string") {
            return o;
        }
        if (Array.isArray(o)) {
            var s = "";
            o.forEach(function(e) {
                s += stringify(e, language);
            });
            return s;
        }

        var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: "span",
            classes: ["token", o.type],
            attributes: {},
            language: language,
        };

        var aliases = o.alias;
        if (aliases) {
            if (Array.isArray(aliases)) {
                Array.prototype.push.apply(env.classes, aliases);
            } else {
                env.classes.push(aliases);
            }
        }

        _.hooks.run("wrap", env);

        var attributes = "";
        for (var name in env.attributes) {
            attributes +=
                " " +
                name +
                '="' +
                (env.attributes[name] || "").replace(/"/g, "&quot;") +
                '"';
        }

        return (
            "<" +
            env.tag +
            ' class="' +
            env.classes.join(" ") +
            '"' +
            attributes +
            ">" +
            env.content +
            "</" +
            env.tag +
            ">"
        );
    };

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {boolean} [oneshot=false]
     * @param {string} [target]
     */
    function matchGrammar(
        text,
        tokenList,
        grammar,
        startNode,
        startPos,
        oneshot,
        target
    ) {
        for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }

            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
                if (target && target == token + "," + j) {
                    return;
                }

                var pattern = patterns[j],
                    inside = pattern.inside,
                    lookbehind = !!pattern.lookbehind,
                    greedy = !!pattern.greedy,
                    lookbehindLength = 0,
                    alias = pattern.alias;

                if (greedy && !pattern.pattern.global) {
                    // Without the global flag, lastIndex won't work
                    var flags = pattern.pattern
                        .toString()
                        .match(/[imsuy]*$/)[0];
                    pattern.pattern = RegExp(
                        pattern.pattern.source,
                        flags + "g"
                    );
                }

                pattern = pattern.pattern || pattern;

                for (
                    // iterate the token list and keep track of the current token/string position
                    var currentNode = startNode.next, pos = startPos;
                    currentNode !== tokenList.tail;
                    pos += currentNode.value.length,
                        currentNode = currentNode.next
                ) {
                    var str = currentNode.value;

                    if (tokenList.length > text.length) {
                        // Something went terribly wrong, ABORT, ABORT!
                        return;
                    }

                    if (str instanceof Token) {
                        continue;
                    }

                    var removeCount = 1; // this is the to parameter of removeBetween

                    if (greedy && currentNode != tokenList.tail.prev) {
                        pattern.lastIndex = pos;
                        var match = pattern.exec(text);
                        if (!match) {
                            break;
                        }

                        var from =
                            match.index +
                            (lookbehind && match[1] ? match[1].length : 0);
                        var to = match.index + match[0].length;
                        var p = pos;

                        // find the node that contains the match
                        p += currentNode.value.length;
                        while (from >= p) {
                            currentNode = currentNode.next;
                            p += currentNode.value.length;
                        }
                        // adjust pos (and p)
                        p -= currentNode.value.length;
                        pos = p;

                        // the current node is a Token, then the match starts inside another Token, which is invalid
                        if (currentNode.value instanceof Token) {
                            continue;
                        }

                        // find the last node which is affected by this match
                        for (
                            var k = currentNode;
                            k !== tokenList.tail &&
                            (p < to ||
                                (typeof k.value === "string" &&
                                    !k.prev.value.greedy));
                            k = k.next
                        ) {
                            removeCount++;
                            p += k.value.length;
                        }
                        removeCount--;

                        // replace with the new match
                        str = text.slice(pos, p);
                        match.index -= pos;
                    } else {
                        pattern.lastIndex = 0;

                        var match = pattern.exec(str);
                    }

                    if (!match) {
                        if (oneshot) {
                            break;
                        }

                        continue;
                    }

                    if (lookbehind) {
                        lookbehindLength = match[1] ? match[1].length : 0;
                    }

                    var from = match.index + lookbehindLength,
                        match = match[0].slice(lookbehindLength),
                        to = from + match.length,
                        before = str.slice(0, from),
                        after = str.slice(to);

                    var removeFrom = currentNode.prev;

                    if (before) {
                        removeFrom = addAfter(tokenList, removeFrom, before);
                        pos += before.length;
                    }

                    removeRange(tokenList, removeFrom, removeCount);

                    var wrapped = new Token(
                        token,
                        inside ? _.tokenize(match, inside) : match,
                        alias,
                        match,
                        greedy
                    );
                    currentNode = addAfter(tokenList, removeFrom, wrapped);

                    if (after) {
                        addAfter(tokenList, currentNode, after);
                    }

                    if (removeCount > 1)
                        matchGrammar(
                            text,
                            tokenList,
                            grammar,
                            currentNode.prev,
                            pos,
                            true,
                            token + "," + j
                        );

                    if (oneshot) break;
                }
            }
        }
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     */

    /**
     * @template T
     */
    function LinkedList() {
        /** @type {LinkedListNode<T>} */
        var head = { value: null, prev: null, next: null };
        /** @type {LinkedListNode<T>} */
        var tail = { value: null, prev: head, next: null };
        head.next = tail;

        /** @type {LinkedListNode<T>} */
        this.head = head;
        /** @type {LinkedListNode<T>} */
        this.tail = tail;
        this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
        // assumes that node != list.tail && values.length >= 0
        var next = node.next;

        var newNode = { value: value, prev: node, next: next };
        node.next = newNode;
        next.prev = newNode;
        list.length++;

        return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
        var next = node.next;
        for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
        }
        node.next = next;
        next.prev = node;
        list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
        var array = [];
        var node = list.head.next;
        while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
        }
        return array;
    }

    if (!_self.document) {
        if (!_self.addEventListener) {
            // in Node.js
            return _;
        }

        if (!_.disableWorkerMessageHandler) {
            // In worker
            _self.addEventListener(
                "message",
                function(evt) {
                    var message = JSON.parse(evt.data),
                        lang = message.language,
                        code = message.code,
                        immediateClose = message.immediateClose;

                    _self.postMessage(
                        _.highlight(code, _.languages[lang], lang)
                    );
                    if (immediateClose) {
                        _self.close();
                    }
                },
                false
            );
        }

        return _;
    }

    //Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
        _.filename = script.src;

        if (script.hasAttribute("data-manual")) {
            _.manual = true;
        }
    }

    function highlightAutomaticallyCallback() {
        if (!_.manual) {
            _.highlightAll();
        }
    }

    if (!_.manual) {
        // If the document state is "loading", then we'll use DOMContentLoaded.
        // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
        // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
        // might take longer one animation frame to execute which can create a race condition where only some plugins have
        // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
        // See https://github.com/PrismJS/prism/issues/2102
        var readyState = document.readyState;
        if (
            readyState === "loading" ||
            (readyState === "interactive" && script && script.defer)
        ) {
            document.addEventListener(
                "DOMContentLoaded",
                highlightAutomaticallyCallback
            );
        } else {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(highlightAutomaticallyCallback);
            } else {
                window.setTimeout(highlightAutomaticallyCallback, 16);
            }
        }
    }

    return _;
})(_self);

if (typeof module !== "undefined" && module.exports) {
    module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== "undefined") {
    global.Prism = Prism;
}
Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: true,
    },
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
        greedy: true,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/,
                },
            },
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                inside: {
                    punctuation: [
                        /^=/,
                        {
                            pattern: /^(\s*)["']|["']$/,
                            lookbehind: true,
                        },
                    ],
                },
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/,
                },
            },
        },
    },
    entity: /&#?[\da-z]{1,8};/i,
};

Prism.languages.markup["tag"].inside["attr-value"].inside["entity"] =
    Prism.languages.markup["entity"];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add("wrap", function(env) {
    if (env.type === "entity") {
        env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
});

Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
        var includedCdataInside = {};
        includedCdataInside["language-" + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism.languages[lang],
        };
        includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;

        var inside = {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: includedCdataInside,
            },
        };
        inside["language-" + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[lang],
        };

        var def = {};
        def[tagName] = {
            pattern: RegExp(
                /(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                    /__/g,
                    function() {
                        return tagName;
                    }
                ),
                "i"
            ),
            lookbehind: true,
            greedy: true,
            inside: inside,
        };

        Prism.languages.insertBefore("markup", "cdata", def);
    },
});

Prism.languages.xml = Prism.languages.extend("markup", {});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

(function(Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    Prism.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                    lookbehind: true,
                    alias: "selector",
                },
                // See rest below
            },
        },
        url: {
            pattern: RegExp(
                "url\\((?:" + string.source + "|[^\n\r()]*)\\)",
                "i"
            ),
            greedy: true,
            inside: {
                function: /^url/i,
                punctuation: /^\(|\)$/,
            },
        },
        selector: RegExp(
            "[^{}\\s](?:[^{};\"']|" + string.source + ")*?(?=\\s*\\{)"
        ),
        string: {
            pattern: string,
            greedy: true,
        },
        property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
        important: /!important\b/i,
        function: /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:,]/,
    };

    Prism.languages.css["atrule"].inside.rest = Prism.languages.css;

    var markup = Prism.languages.markup;
    if (markup) {
        markup.tag.addInlined("style", "css");

        Prism.languages.insertBefore(
            "inside",
            "attr-value",
            {
                "style-attr": {
                    pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                    inside: {
                        "attr-name": {
                            pattern: /^\s*style/i,
                            inside: markup.tag.inside,
                        },
                        punctuation: /^\s*=\s*['"]|['"]\s*$/,
                        "attr-value": {
                            pattern: /.+/i,
                            inside: Prism.languages.css,
                        },
                    },
                    alias: "language-css",
                },
            },
            markup.tag
        );
    }
})(Prism);

Prism.languages.clike = {
    comment: [
        {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
        },
        {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true,
        },
    ],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
    },
    "class-name": {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: true,
        inside: {
            punctuation: /[.\\]/,
        },
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
};

Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
        Prism.languages.clike["class-name"],
        {
            pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
            lookbehind: true,
        },
    ],
    keyword: [
        {
            pattern: /((?:^|})\s*)(?:catch|finally)\b/,
            lookbehind: true,
        },
        {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true,
        },
    ],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/,
});

Prism.languages.javascript[
    "class-name"
][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: true,
        greedy: true,
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
        pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function",
    },
    parameter: [
        {
            pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
            lookbehind: true,
            inside: Prism.languages.javascript,
        },
        {
            pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
            inside: Prism.languages.javascript,
        },
        {
            pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: Prism.languages.javascript,
        },
        {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: Prism.languages.javascript,
        },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
});

Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
        greedy: true,
        inside: {
            "template-punctuation": {
                pattern: /^`|`$/,
                alias: "string",
            },
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                lookbehind: true,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation",
                    },
                    rest: Prism.languages.javascript,
                },
            },
            string: /[\s\S]+/,
        },
    },
});

if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined("script", "javascript");
}

Prism.languages.js = Prism.languages.javascript;

(function(Prism) {
    // $ set | grep '^[A-Z][^[:space:]]*=' | cut -d= -f1 | tr '\n' '|'
    // + LC_ALL, RANDOM, REPLY, SECONDS.
    // + make sure PS1..4 are here as they are not always set,
    // - some useless things.
    var envVars =
        "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b";
    var insideString = {
        environment: {
            pattern: RegExp("\\$" + envVars),
            alias: "constant",
        },
        variable: [
            // [0]: Arithmetic Environment
            {
                pattern: /\$?\(\([\s\S]+?\)\)/,
                greedy: true,
                inside: {
                    // If there is a $ sign at the beginning highlight $(( and )) as variable
                    variable: [
                        {
                            pattern: /(^\$\(\([\s\S]+)\)\)/,
                            lookbehind: true,
                        },
                        /^\$\(\(/,
                    ],
                    number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                    // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
                    operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                    // If there is no $ sign at the beginning highlight (( and )) as punctuation
                    punctuation: /\(\(?|\)\)?|,|;/,
                },
            },
            // [1]: Command Substitution
            {
                pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
                greedy: true,
                inside: {
                    variable: /^\$\(|^`|\)$|`$/,
                },
            },
            // [2]: Brace expansion
            {
                pattern: /\$\{[^}]+\}/,
                greedy: true,
                inside: {
                    operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                    punctuation: /[\[\]]/,
                    environment: {
                        pattern: RegExp("(\\{)" + envVars),
                        lookbehind: true,
                        alias: "constant",
                    },
                },
            },
            /\$(?:\w+|[#?*!@$])/,
        ],
        // Escape sequences from echo and printf's manuals, and escaped quotes.
        entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|x[0-9a-fA-F]{1,2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/,
    };

    Prism.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/.*/,
            alias: "important",
        },
        comment: {
            pattern: /(^|[^"{\\$])#.*/,
            lookbehind: true,
        },
        "function-name": [
            // a) function foo {
            // b) foo() {
            // c) function foo() {
            // but not “foo {”
            {
                // a) and c)
                pattern: /(\bfunction\s+)\w+(?=(?:\s*\(?:\s*\))?\s*\{)/,
                lookbehind: true,
                alias: "function",
            },
            {
                // b)
                pattern: /\b\w+(?=\s*\(\s*\)\s*\{)/,
                alias: "function",
            },
        ],
        // Highlight variable names as variables in for and select beginnings.
        "for-or-select": {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: "variable",
            lookbehind: true,
        },
        // Highlight variable names as variables in the left-hand part
        // of assignments (“=” and “+=”).
        "assign-left": {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
            inside: {
                environment: {
                    pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + envVars),
                    lookbehind: true,
                    alias: "constant",
                },
            },
            alias: "variable",
            lookbehind: true,
        },
        string: [
            // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
            {
                pattern: /((?:^|[^<])<<-?\s*)(\w+?)\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\2/,
                lookbehind: true,
                greedy: true,
                inside: insideString,
            },
            // Here-document with quotes around the tag
            // → No expansion (so no “inside”).
            {
                pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\3/,
                lookbehind: true,
                greedy: true,
            },
            // “Normal” string
            {
                pattern: /(^|[^\\](?:\\\\)*)(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\2)[^\\])*\2/,
                lookbehind: true,
                greedy: true,
                inside: insideString,
            },
        ],
        environment: {
            pattern: RegExp("\\$?" + envVars),
            alias: "constant",
        },
        variable: insideString.variable,
        function: {
            pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|aptitude|apt-cache|apt-get|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
            lookbehind: true,
        },
        keyword: {
            pattern: /(^|[\s;|&]|[<>]\()(?:if|then|else|elif|fi|for|while|in|case|esac|function|select|do|done|until)(?=$|[)\s;|&])/,
            lookbehind: true,
        },
        // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
        builtin: {
            pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|break|cd|continue|eval|exec|exit|export|getopts|hash|pwd|readonly|return|shift|test|times|trap|umask|unset|alias|bind|builtin|caller|command|declare|echo|enable|help|let|local|logout|mapfile|printf|read|readarray|source|type|typeset|ulimit|unalias|set|shopt)(?=$|[)\s;|&])/,
            lookbehind: true,
            // Alias added to make those easier to distinguish from strings.
            alias: "class-name",
        },
        boolean: {
            pattern: /(^|[\s;|&]|[<>]\()(?:true|false)(?=$|[)\s;|&])/,
            lookbehind: true,
        },
        "file-descriptor": {
            pattern: /\B&\d\b/,
            alias: "important",
        },
        operator: {
            // Lots of redirections here, but not just that.
            pattern: /\d?<>|>\||\+=|==?|!=?|=~|<<[<-]?|[&\d]?>>|\d?[<>]&?|&[>&]?|\|[&|]?|<=?|>=?/,
            inside: {
                "file-descriptor": {
                    pattern: /^\d/,
                    alias: "important",
                },
            },
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
            pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
            lookbehind: true,
        },
    };

    /* Patterns in command substitution. */
    var toBeCopied = [
        "comment",
        "function-name",
        "for-or-select",
        "assign-left",
        "string",
        "environment",
        "function",
        "keyword",
        "builtin",
        "boolean",
        "file-descriptor",
        "operator",
        "punctuation",
        "number",
    ];
    var inside = insideString.variable[1].inside;
    for (var i = 0; i < toBeCopied.length; i++) {
        inside[toBeCopied[i]] = Prism.languages.bash[toBeCopied[i]];
    }

    Prism.languages.shell = Prism.languages.bash;
})(Prism);

(function(Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    var selectorInside;

    Prism.languages.css.selector = {
        pattern: Prism.languages.css.selector,
        inside: (selectorInside = {
            "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
            "pseudo-class": /:[-\w]+/,
            class: /\.[-:.\w]+/,
            id: /#[-:.\w]+/,
            attribute: {
                pattern: RegExp("\\[(?:[^[\\]\"']|" + string.source + ")*\\]"),
                greedy: true,
                inside: {
                    punctuation: /^\[|\]$/,
                    "case-sensitivity": {
                        pattern: /(\s)[si]$/i,
                        lookbehind: true,
                        alias: "keyword",
                    },
                    namespace: {
                        pattern: /^(\s*)[-*\w\xA0-\uFFFF]*\|(?!=)/,
                        lookbehind: true,
                        inside: {
                            punctuation: /\|$/,
                        },
                    },
                    attribute: {
                        pattern: /^(\s*)[-\w\xA0-\uFFFF]+/,
                        lookbehind: true,
                    },
                    value: [
                        string,
                        {
                            pattern: /(=\s*)[-\w\xA0-\uFFFF]+(?=\s*$)/,
                            lookbehind: true,
                        },
                    ],
                    operator: /[|~*^$]?=/,
                },
            },
            "n-th": [
                {
                    pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
                    lookbehind: true,
                    inside: {
                        number: /[\dn]+/,
                        operator: /[+-]/,
                    },
                },
                {
                    pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
                    lookbehind: true,
                },
            ],
            punctuation: /[()]/,
        }),
    };

    Prism.languages.css["atrule"].inside[
        "selector-function-argument"
    ].inside = selectorInside;

    Prism.languages.insertBefore("css", "property", {
        variable: {
            pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
            lookbehind: true,
        },
    });

    var unit = {
        pattern: /(\d)(?:%|[a-z]+)/,
        lookbehind: true,
    };
    // 123 -123 .123 -.123 12.3 -12.3
    var number = {
        pattern: /(^|[^\w.-])-?\d*\.?\d+/,
        lookbehind: true,
    };

    Prism.languages.insertBefore("css", "function", {
        operator: {
            pattern: /(\s)[+\-*\/](?=\s)/,
            lookbehind: true,
        },
        // CAREFUL!
        // Previewers and Inline color use hexcode and color.
        hexcode: {
            pattern: /\B#(?:[\da-f]{1,2}){3,4}\b/i,
            alias: "color",
        },
        color: [
            /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
            {
                pattern: /\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
                inside: {
                    unit: unit,
                    number: number,
                    function: /[\w-]+(?=\()/,
                    punctuation: /[(),]/,
                },
            },
        ],
        entity: /\\[\da-f]{1,8}/i,
        unit: unit,
        number: number,
    });
})(Prism);

Prism.languages.git = {
    /*
     * A simple one line comment like in a git status command
     * For instance:
     * $ git status
     * # On branch infinite-scroll
     * # Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
     * # and have 1 and 2 different commits each, respectively.
     * nothing to commit (working directory clean)
     */
    comment: /^#.*/m,

    /*
     * Regexp to match the changed lines in a git diff output. Check the example below.
     */
    deleted: /^[-–].*/m,
    inserted: /^\+.*/m,

    /*
     * a string (double and simple quote)
     */
    string: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/m,

    /*
     * a git command. It starts with a random prompt finishing by a $, then "git" then some other parameters
     * For instance:
     * $ git add file.txt
     */
    command: {
        pattern: /^.*\$ git .*$/m,
        inside: {
            /*
             * A git command can contain a parameter starting by a single or a double dash followed by a string
             * For instance:
             * $ git diff --cached
             * $ git log -p
             */
            parameter: /\s--?\w+/m,
        },
    },

    /*
     * Coordinates displayed in a git diff command
     * For instance:
     * $ git diff
     * diff --git file.txt file.txt
     * index 6214953..1d54a52 100644
     * --- file.txt
     * +++ file.txt
     * @@ -1 +1,2 @@
     * -Here's my tetx file
     * +Here's my text file
     * +And this is the second line
     */
    coord: /^@@.*@@$/m,

    /*
     * Match a "commit [SHA1]" line in a git log output.
     * For instance:
     * $ git log
     * commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
     * Author: lgiraudel
     * Date:   Mon Feb 17 11:18:34 2014 +0100
     *
     *     Add of a new line
     */
    commit_sha1: /^commit \w{40}$/m,
};

Prism.languages.go = Prism.languages.extend("clike", {
    keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    builtin: /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
    boolean: /\b(?:_|iota|nil|true|false)\b/,
    operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
    string: {
        pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: true,
    },
});
delete Prism.languages.go["class-name"];

Prism.languages.graphql = {
    comment: /#.*/,
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: true,
    },
    number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    boolean: /\b(?:true|false)\b/,
    variable: /\$[a-z_]\w*/i,
    directive: {
        pattern: /@[a-z_]\w*/i,
        alias: "function",
    },
    "attr-name": {
        pattern: /[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
        greedy: true,
    },
    "class-name": {
        pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+)[a-zA-Z_]\w*/,
        lookbehind: true,
    },
    fragment: {
        pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
        lookbehind: true,
        alias: "function",
    },
    keyword: /\b(?:enum|fragment|implements|input|interface|mutation|on|query|scalar|schema|type|union)\b/,
    operator: /[!=|]|\.{3}/,
    punctuation: /[!(){}\[\]:=,]/,
    constant: /\b(?!ID\b)[A-Z][A-Z_\d]*\b/,
};

(function(Prism) {
    /**
     * Returns the placeholder for the given language id and index.
     *
     * @param {string} language
     * @param {string|number} index
     * @returns {string}
     */
    function getPlaceholder(language, index) {
        return "___" + language.toUpperCase() + index + "___";
    }

    Object.defineProperties((Prism.languages["markup-templating"] = {}), {
        buildPlaceholders: {
            /**
             * Tokenize all inline templating expressions matching `placeholderPattern`.
             *
             * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
             * `true` will be replaced.
             *
             * @param {object} env The environment of the `before-tokenize` hook.
             * @param {string} language The language id.
             * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
             * @param {(match: string) => boolean} [replaceFilter]
             */
            value: function(env, language, placeholderPattern, replaceFilter) {
                if (env.language !== language) {
                    return;
                }

                var tokenStack = (env.tokenStack = []);

                env.code = env.code.replace(placeholderPattern, function(
                    match
                ) {
                    if (
                        typeof replaceFilter === "function" &&
                        !replaceFilter(match)
                    ) {
                        return match;
                    }
                    var i = tokenStack.length;
                    var placeholder;

                    // Check for existing strings
                    while (
                        env.code.indexOf(
                            (placeholder = getPlaceholder(language, i))
                        ) !== -1
                    )
                        ++i;

                    // Create a sparse array
                    tokenStack[i] = match;

                    return placeholder;
                });

                // Switch the grammar to markup
                env.grammar = Prism.languages.markup;
            },
        },
        tokenizePlaceholders: {
            /**
             * Replace placeholders with proper tokens after tokenizing.
             *
             * @param {object} env The environment of the `after-tokenize` hook.
             * @param {string} language The language id.
             */
            value: function(env, language) {
                if (env.language !== language || !env.tokenStack) {
                    return;
                }

                // Switch the grammar back
                env.grammar = Prism.languages[language];

                var j = 0;
                var keys = Object.keys(env.tokenStack);

                function walkTokens(tokens) {
                    for (var i = 0; i < tokens.length; i++) {
                        // all placeholders are replaced already
                        if (j >= keys.length) {
                            break;
                        }

                        var token = tokens[i];
                        if (
                            typeof token === "string" ||
                            (token.content && typeof token.content === "string")
                        ) {
                            var k = keys[j];
                            var t = env.tokenStack[k];
                            var s =
                                typeof token === "string"
                                    ? token
                                    : token.content;
                            var placeholder = getPlaceholder(language, k);

                            var index = s.indexOf(placeholder);
                            if (index > -1) {
                                ++j;

                                var before = s.substring(0, index);
                                var middle = new Prism.Token(
                                    language,
                                    Prism.tokenize(t, env.grammar),
                                    "language-" + language,
                                    t
                                );
                                var after = s.substring(
                                    index + placeholder.length
                                );

                                var replacement = [];
                                if (before) {
                                    replacement.push.apply(
                                        replacement,
                                        walkTokens([before])
                                    );
                                }
                                replacement.push(middle);
                                if (after) {
                                    replacement.push.apply(
                                        replacement,
                                        walkTokens([after])
                                    );
                                }

                                if (typeof token === "string") {
                                    tokens.splice.apply(
                                        tokens,
                                        [i, 1].concat(replacement)
                                    );
                                } else {
                                    token.content = replacement;
                                }
                            }
                        } else if (
                            token.content /* && typeof token.content !== 'string' */
                        ) {
                            walkTokens(token.content);
                        }
                    }

                    return tokens;
                }

                walkTokens(env.tokens);
            },
        },
    });
})(Prism);

(function(Prism) {
    Prism.languages.handlebars = {
        comment: /\{\{![\s\S]*?\}\}/,
        delimiter: {
            pattern: /^\{\{\{?|\}\}\}?$/i,
            alias: "punctuation",
        },
        string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
        boolean: /\b(?:true|false)\b/,
        block: {
            pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
            lookbehind: true,
            alias: "keyword",
        },
        brackets: {
            pattern: /\[[^\]]+\]/,
            inside: {
                punctuation: /\[|\]/,
                variable: /[\s\S]+/,
            },
        },
        punctuation: /[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,
        variable: /[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/,
    };

    Prism.hooks.add("before-tokenize", function(env) {
        var handlebarsPattern = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
        Prism.languages["markup-templating"].buildPlaceholders(
            env,
            "handlebars",
            handlebarsPattern
        );
    });

    Prism.hooks.add("after-tokenize", function(env) {
        Prism.languages["markup-templating"].tokenizePlaceholders(
            env,
            "handlebars"
        );
    });
})(Prism);

(function(Prism) {
    Prism.languages.insertBefore("javascript", "function-variable", {
        "method-variable": {
            pattern: RegExp(
                "(\\.\\s*)" +
                    Prism.languages.javascript["function-variable"].pattern
                        .source
            ),
            lookbehind: true,
            alias: [
                "function-variable",
                "method",
                "function",
                "property-access",
            ],
        },
    });

    Prism.languages.insertBefore("javascript", "function", {
        method: {
            pattern: RegExp(
                "(\\.\\s*)" + Prism.languages.javascript["function"].source
            ),
            lookbehind: true,
            alias: ["function", "property-access"],
        },
    });

    Prism.languages.insertBefore("javascript", "constant", {
        "known-class-name": [
            {
                // standard built-ins
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
                pattern: /\b(?:(?:(?:Uint|Int)(?:8|16|32)|Uint8Clamped|Float(?:32|64))?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|(?:Weak)?(?:Set|Map)|WebAssembly)\b/,
                alias: "class-name",
            },
            {
                // errors
                pattern: /\b(?:[A-Z]\w*)Error\b/,
                alias: "class-name",
            },
        ],
    });

    Prism.languages.javascript["keyword"].unshift(
        {
            pattern: /\b(?:as|default|export|from|import)\b/,
            alias: "module",
        },
        {
            pattern: /\bnull\b/,
            alias: ["null", "nil"],
        },
        {
            pattern: /\bundefined\b/,
            alias: "nil",
        }
    );

    Prism.languages.insertBefore("javascript", "operator", {
        spread: {
            pattern: /\.{3}/,
            alias: "operator",
        },
        arrow: {
            pattern: /=>/,
            alias: "operator",
        },
    });

    Prism.languages.insertBefore("javascript", "punctuation", {
        "property-access": {
            pattern: /(\.\s*)#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
            lookbehind: true,
        },
        "maybe-class-name": {
            pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
            lookbehind: true,
        },
        dom: {
            // this contains only a few commonly used DOM variables
            pattern: /\b(?:document|location|navigator|performance|(?:local|session)Storage|window)\b/,
            alias: "variable",
        },
        console: {
            pattern: /\bconsole(?=\s*\.)/,
            alias: "class-name",
        },
    });

    // add 'maybe-class-name' to tokens which might be a class name
    var maybeClassNameTokens = [
        "function",
        "function-variable",
        "method",
        "method-variable",
        "property-access",
    ];

    for (var i = 0; i < maybeClassNameTokens.length; i++) {
        var token = maybeClassNameTokens[i];
        var value = Prism.languages.javascript[token];

        // convert regex to object
        if (Prism.util.type(value) === "RegExp") {
            value = Prism.languages.javascript[token] = {
                pattern: value,
            };
        }

        // keep in mind that we don't support arrays

        var inside = value.inside || {};
        value.inside = inside;

        inside["maybe-class-name"] = /^[A-Z][\s\S]*/;
    }
})(Prism);

(function(Prism) {
    var templateString = Prism.languages.javascript["template-string"];

    // see the pattern in prism-javascript.js
    var templateLiteralPattern = templateString.pattern.source;
    var interpolationObject = templateString.inside["interpolation"];
    var interpolationPunctuationObject =
        interpolationObject.inside["interpolation-punctuation"];
    var interpolationPattern = interpolationObject.pattern.source;

    /**
     * Creates a new pattern to match a template string with a special tag.
     *
     * This will return `undefined` if there is no grammar with the given language id.
     *
     * @param {string} language The language id of the embedded language. E.g. `markdown`.
     * @param {string} tag The regex pattern to match the tag.
     * @returns {object | undefined}
     * @example
     * createTemplate('css', /\bcss/.source);
     */
    function createTemplate(language, tag) {
        if (!Prism.languages[language]) {
            return undefined;
        }

        return {
            pattern: RegExp("((?:" + tag + ")\\s*)" + templateLiteralPattern),
            lookbehind: true,
            greedy: true,
            inside: {
                "template-punctuation": {
                    pattern: /^`|`$/,
                    alias: "string",
                },
                "embedded-code": {
                    pattern: /[\s\S]+/,
                    alias: language,
                },
            },
        };
    }

    Prism.languages.javascript["template-string"] = [
        // styled-jsx:
        //   css`a { color: #25F; }`
        // styled-components:
        //   styled.h1`color: red;`
        createTemplate(
            "css",
            /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
                .source
        ),

        // html`<p></p>`
        // div.innerHTML = `<p></p>`
        createTemplate("html", /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),

        // svg`<path fill="#fff" d="M55.37 ..."/>`
        createTemplate("svg", /\bsvg/.source),

        // md`# h1`, markdown`## h2`
        createTemplate("markdown", /\b(?:md|markdown)/.source),

        // gql`...`, graphql`...`, graphql.experimental`...`
        createTemplate(
            "graphql",
            /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source
        ),

        // vanilla template string
        templateString,
    ].filter(Boolean);

    /**
     * Returns a specific placeholder literal for the given language.
     *
     * @param {number} counter
     * @param {string} language
     * @returns {string}
     */
    function getPlaceholder(counter, language) {
        return "___" + language.toUpperCase() + "_" + counter + "___";
    }

    /**
     * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
     *
     * @param {string} code
     * @param {any} grammar
     * @param {string} language
     * @returns {(string|Token)[]}
     */
    function tokenizeWithHooks(code, grammar, language) {
        var env = {
            code: code,
            grammar: grammar,
            language: language,
        };
        Prism.hooks.run("before-tokenize", env);
        env.tokens = Prism.tokenize(env.code, env.grammar);
        Prism.hooks.run("after-tokenize", env);
        return env.tokens;
    }

    /**
     * Returns the token of the given JavaScript interpolation expression.
     *
     * @param {string} expression The code of the expression. E.g. `"${42}"`
     * @returns {Token}
     */
    function tokenizeInterpolationExpression(expression) {
        var tempGrammar = {};
        tempGrammar[
            "interpolation-punctuation"
        ] = interpolationPunctuationObject;

        /** @type {Array} */
        var tokens = Prism.tokenize(expression, tempGrammar);
        if (tokens.length === 3) {
            /**
             * The token array will look like this
             * [
             *     ["interpolation-punctuation", "${"]
             *     "..." // JavaScript expression of the interpolation
             *     ["interpolation-punctuation", "}"]
             * ]
             */

            var args = [1, 1];
            args.push.apply(
                args,
                tokenizeWithHooks(
                    tokens[1],
                    Prism.languages.javascript,
                    "javascript"
                )
            );

            tokens.splice.apply(tokens, args);
        }

        return new Prism.Token(
            "interpolation",
            tokens,
            interpolationObject.alias,
            expression
        );
    }

    /**
     * Tokenizes the given code with support for JavaScript interpolation expressions mixed in.
     *
     * This function has 3 phases:
     *
     * 1. Replace all JavaScript interpolation expression with a placeholder.
     *    The placeholder will have the syntax of a identify of the target language.
     * 2. Tokenize the code with placeholders.
     * 3. Tokenize the interpolation expressions and re-insert them into the tokenize code.
     *    The insertion only works if a placeholder hasn't been "ripped apart" meaning that the placeholder has been
     *    tokenized as two tokens by the grammar of the embedded language.
     *
     * @param {string} code
     * @param {object} grammar
     * @param {string} language
     * @returns {Token}
     */
    function tokenizeEmbedded(code, grammar, language) {
        // 1. First filter out all interpolations

        // because they might be escaped, we need a lookbehind, so we use Prism
        /** @type {(Token|string)[]} */
        var _tokens = Prism.tokenize(code, {
            interpolation: {
                pattern: RegExp(interpolationPattern),
                lookbehind: true,
            },
        });

        // replace all interpolations with a placeholder which is not in the code already
        var placeholderCounter = 0;
        /** @type {Object<string, string>} */
        var placeholderMap = {};
        var embeddedCode = _tokens
            .map(function(token) {
                if (typeof token === "string") {
                    return token;
                } else {
                    var interpolationExpression = token.content;

                    var placeholder;
                    while (
                        code.indexOf(
                            (placeholder = getPlaceholder(
                                placeholderCounter++,
                                language
                            ))
                        ) !== -1
                    ) {}
                    placeholderMap[placeholder] = interpolationExpression;
                    return placeholder;
                }
            })
            .join("");

        // 2. Tokenize the embedded code

        var embeddedTokens = tokenizeWithHooks(embeddedCode, grammar, language);

        // 3. Re-insert the interpolation

        var placeholders = Object.keys(placeholderMap);
        placeholderCounter = 0;

        /**
         *
         * @param {(Token|string)[]} tokens
         * @returns {void}
         */
        function walkTokens(tokens) {
            for (var i = 0; i < tokens.length; i++) {
                if (placeholderCounter >= placeholders.length) {
                    return;
                }

                var token = tokens[i];

                if (
                    typeof token === "string" ||
                    typeof token.content === "string"
                ) {
                    var placeholder = placeholders[placeholderCounter];
                    var s =
                        typeof token === "string"
                            ? token
                            : /** @type {string} */ (token.content);

                    var index = s.indexOf(placeholder);
                    if (index !== -1) {
                        ++placeholderCounter;

                        var before = s.substring(0, index);
                        var middle = tokenizeInterpolationExpression(
                            placeholderMap[placeholder]
                        );
                        var after = s.substring(index + placeholder.length);

                        var replacement = [];
                        if (before) {
                            replacement.push(before);
                        }
                        replacement.push(middle);
                        if (after) {
                            var afterTokens = [after];
                            walkTokens(afterTokens);
                            replacement.push.apply(replacement, afterTokens);
                        }

                        if (typeof token === "string") {
                            tokens.splice.apply(
                                tokens,
                                [i, 1].concat(replacement)
                            );
                            i += replacement.length - 1;
                        } else {
                            token.content = replacement;
                        }
                    }
                } else {
                    var content = token.content;
                    if (Array.isArray(content)) {
                        walkTokens(content);
                    } else {
                        walkTokens([content]);
                    }
                }
            }
        }
        walkTokens(embeddedTokens);

        return new Prism.Token(
            language,
            embeddedTokens,
            "language-" + language,
            code
        );
    }

    /**
     * The languages for which JS templating will handle tagged template literals.
     *
     * JS templating isn't active for only JavaScript but also related languages like TypeScript, JSX, and TSX.
     */
    var supportedLanguages = {
        javascript: true,
        js: true,
        typescript: true,
        ts: true,
        jsx: true,
        tsx: true,
    };
    Prism.hooks.add("after-tokenize", function(env) {
        if (!(env.language in supportedLanguages)) {
            return;
        }

        /**
         * Finds and tokenizes all template strings with an embedded languages.
         *
         * @param {(Token | string)[]} tokens
         * @returns {void}
         */
        function findTemplateStrings(tokens) {
            for (var i = 0, l = tokens.length; i < l; i++) {
                var token = tokens[i];

                if (typeof token === "string") {
                    continue;
                }

                var content = token.content;
                if (!Array.isArray(content)) {
                    if (typeof content !== "string") {
                        findTemplateStrings([content]);
                    }
                    continue;
                }

                if (token.type === "template-string") {
                    /**
                     * A JavaScript template-string token will look like this:
                     *
                     * ["template-string", [
                     *     ["template-punctuation", "`"],
                     *     (
                     *         An array of "string" and "interpolation" tokens. This is the simple string case.
                     *         or
                     *         ["embedded-code", "..."] This is the token containing the embedded code.
                     *                                  It also has an alias which is the language of the embedded code.
                     *     ),
                     *     ["template-punctuation", "`"]
                     * ]]
                     */

                    var embedded = content[1];
                    if (
                        content.length === 3 &&
                        typeof embedded !== "string" &&
                        embedded.type === "embedded-code"
                    ) {
                        // get string content
                        var code = stringContent(embedded);

                        var alias = embedded.alias;
                        var language = Array.isArray(alias) ? alias[0] : alias;

                        var grammar = Prism.languages[language];
                        if (!grammar) {
                            // the embedded language isn't registered.
                            continue;
                        }

                        content[1] = tokenizeEmbedded(code, grammar, language);
                    }
                } else {
                    findTemplateStrings(content);
                }
            }
        }

        findTemplateStrings(env.tokens);
    });

    /**
     * Returns the string content of a token or token stream.
     *
     * @param {string | Token | (string | Token)[]} value
     * @returns {string}
     */
    function stringContent(value) {
        if (typeof value === "string") {
            return value;
        } else if (Array.isArray(value)) {
            return value.map(stringContent).join("");
        } else {
            return stringContent(value.content);
        }
    }
})(Prism);

Prism.languages.json = {
    property: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        greedy: true,
    },
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: true,
    },
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    number: /-?\d+\.?\d*(?:e[+-]?\d+)?/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: {
        pattern: /\bnull\b/,
        alias: "keyword",
    },
};

Prism.languages.liquid = {
    keyword: /\b(?:comment|endcomment|if|elsif|else|endif|unless|endunless|for|endfor|case|endcase|when|in|break|assign|continue|limit|offset|range|reversed|raw|endraw|capture|endcapture|tablerow|endtablerow)\b/,
    number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp-]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
    operator: {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
        lookbehind: true,
    },
    function: {
        pattern: /(^|[\s;|&])(?:append|prepend|capitalize|cycle|cols|increment|decrement|abs|at_least|at_most|ceil|compact|concat|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode|include|paginate)(?=$|[\s;|&])/,
        lookbehind: true,
    },
};

(function(Prism) {
    // Allow only one line break
    var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?!\n|\r\n?))/.source;

    /**
     * This function is intended for the creation of the bold or italic pattern.
     *
     * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
     *
     * _Note:_ Keep in mind that this adds a capturing group.
     *
     * @param {string} pattern
     * @param {boolean} starAlternative Whether to also add an alternative where all `_`s are replaced with `*`s.
     * @returns {RegExp}
     */
    function createInline(pattern, starAlternative) {
        pattern = pattern.replace(/<inner>/g, function() {
            return inner;
        });
        if (starAlternative) {
            pattern = pattern + "|" + pattern.replace(/_/g, "\\*");
        }
        return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + pattern + ")");
    }

    var tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/
        .source;
    var tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|$)/.source.replace(
        /__/g,
        function() {
            return tableCell;
        }
    );
    var tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
        .source;

    Prism.languages.markdown = Prism.languages.extend("markup", {});
    Prism.languages.insertBefore("markdown", "prolog", {
        blockquote: {
            // > ...
            pattern: /^>(?:[\t ]*>)*/m,
            alias: "punctuation",
        },
        table: {
            pattern: RegExp(
                "^" + tableRow + tableLine + "(?:" + tableRow + ")*",
                "m"
            ),
            inside: {
                "table-data-rows": {
                    pattern: RegExp(
                        "^(" + tableRow + tableLine + ")(?:" + tableRow + ")*$"
                    ),
                    lookbehind: true,
                    inside: {
                        "table-data": {
                            pattern: RegExp(tableCell),
                            inside: Prism.languages.markdown,
                        },
                        punctuation: /\|/,
                    },
                },
                "table-line": {
                    pattern: RegExp("^(" + tableRow + ")" + tableLine + "$"),
                    lookbehind: true,
                    inside: {
                        punctuation: /\||:?-{3,}:?/,
                    },
                },
                "table-header-row": {
                    pattern: RegExp("^" + tableRow + "$"),
                    inside: {
                        "table-header": {
                            pattern: RegExp(tableCell),
                            alias: "important",
                            inside: Prism.languages.markdown,
                        },
                        punctuation: /\|/,
                    },
                },
            },
        },
        code: [
            {
                // Prefixed by 4 spaces or 1 tab and preceded by an empty line
                pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
                lookbehind: true,
                alias: "keyword",
            },
            {
                // `code`
                // ``code``
                pattern: /``.+?``|`[^`\r\n]+`/,
                alias: "keyword",
            },
            {
                // ```optional language
                // code block
                // ```
                pattern: /^```[\s\S]*?^```$/m,
                greedy: true,
                inside: {
                    "code-block": {
                        pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                        lookbehind: true,
                    },
                    "code-language": {
                        pattern: /^(```).+/,
                        lookbehind: true,
                    },
                    punctuation: /```/,
                },
            },
        ],
        title: [
            {
                // title 1
                // =======

                // title 2
                // -------
                pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
                alias: "important",
                inside: {
                    punctuation: /==+$|--+$/,
                },
            },
            {
                // # title 1
                // ###### title 6
                pattern: /(^\s*)#+.+/m,
                lookbehind: true,
                alias: "important",
                inside: {
                    punctuation: /^#+|#+$/,
                },
            },
        ],
        hr: {
            // ***
            // ---
            // * * *
            // -----------
            pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: true,
            alias: "punctuation",
        },
        list: {
            // * item
            // + item
            // - item
            // 1. item
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: true,
            alias: "punctuation",
        },
        "url-reference": {
            // [id]: http://example.com "Optional title"
            // [id]: http://example.com 'Optional title'
            // [id]: http://example.com (Optional title)
            // [id]: <http://example.com> "Optional title"
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: true,
                },
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/,
            },
            alias: "url",
        },
        bold: {
            // **strong**
            // __strong__

            // allow one nested instance of italic text using the same delimiter
            pattern: createInline(
                /__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__/.source,
                true
            ),
            lookbehind: true,
            greedy: true,
            inside: {
                content: {
                    pattern: /(^..)[\s\S]+(?=..$)/,
                    lookbehind: true,
                    inside: {}, // see below
                },
                punctuation: /\*\*|__/,
            },
        },
        italic: {
            // *em*
            // _em_

            // allow one nested instance of bold text using the same delimiter
            pattern: createInline(
                /_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_/.source,
                true
            ),
            lookbehind: true,
            greedy: true,
            inside: {
                content: {
                    pattern: /(^.)[\s\S]+(?=.$)/,
                    lookbehind: true,
                    inside: {}, // see below
                },
                punctuation: /[*_]/,
            },
        },
        strike: {
            // ~~strike through~~
            // ~strike~
            pattern: createInline(/(~~?)(?:(?!~)<inner>)+?\2/.source, false),
            lookbehind: true,
            greedy: true,
            inside: {
                content: {
                    pattern: /(^~~?)[\s\S]+(?=\1$)/,
                    lookbehind: true,
                    inside: {}, // see below
                },
                punctuation: /~~?/,
            },
        },
        url: {
            // [example](http://example.com "Optional title")
            // [example][id]
            // [example] [id]
            pattern: createInline(
                /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[(?:(?!\])<inner>)+\])/
                    .source,
                false
            ),
            lookbehind: true,
            greedy: true,
            inside: {
                variable: {
                    pattern: /(\[)[^\]]+(?=\]$)/,
                    lookbehind: true,
                },
                content: {
                    pattern: /(^!?\[)[^\]]+(?=\])/,
                    lookbehind: true,
                    inside: {}, // see below
                },
                string: {
                    pattern: /"(?:\\.|[^"\\])*"(?=\)$)/,
                },
            },
        },
    });

    ["url", "bold", "italic", "strike"].forEach(function(token) {
        ["url", "bold", "italic", "strike"].forEach(function(inside) {
            if (token !== inside) {
                Prism.languages.markdown[token].inside.content.inside[inside] =
                    Prism.languages.markdown[inside];
            }
        });
    });

    Prism.hooks.add("after-tokenize", function(env) {
        if (env.language !== "markdown" && env.language !== "md") {
            return;
        }

        function walkTokens(tokens) {
            if (!tokens || typeof tokens === "string") {
                return;
            }

            for (var i = 0, l = tokens.length; i < l; i++) {
                var token = tokens[i];

                if (token.type !== "code") {
                    walkTokens(token.content);
                    continue;
                }

                /*
                 * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
                 * is optional. But the grammar is defined so that there is only one case we have to handle:
                 *
                 * token.content = [
                 *     <span class="punctuation">```</span>,
                 *     <span class="code-language">xxxx</span>,
                 *     '\n', // exactly one new lines (\r or \n or \r\n)
                 *     <span class="code-block">...</span>,
                 *     '\n', // exactly one new lines again
                 *     <span class="punctuation">```</span>
                 * ];
                 */

                var codeLang = token.content[1];
                var codeBlock = token.content[3];

                if (
                    codeLang &&
                    codeBlock &&
                    codeLang.type === "code-language" &&
                    codeBlock.type === "code-block" &&
                    typeof codeLang.content === "string"
                ) {
                    // this might be a language that Prism does not support

                    // do some replacements to support C++, C#, and F#
                    var lang = codeLang.content
                        .replace(/\b#/g, "sharp")
                        .replace(/\b\+\+/g, "pp");
                    // only use the first word
                    lang = (/[a-z][\w-]*/i.exec(lang) || [""])[0].toLowerCase();
                    var alias = "language-" + lang;

                    // add alias
                    if (!codeBlock.alias) {
                        codeBlock.alias = [alias];
                    } else if (typeof codeBlock.alias === "string") {
                        codeBlock.alias = [codeBlock.alias, alias];
                    } else {
                        codeBlock.alias.push(alias);
                    }
                }
            }
        }

        walkTokens(env.tokens);
    });

    Prism.hooks.add("wrap", function(env) {
        if (env.type !== "code-block") {
            return;
        }

        var codeLang = "";
        for (var i = 0, l = env.classes.length; i < l; i++) {
            var cls = env.classes[i];
            var match = /language-(.+)/.exec(cls);
            if (match) {
                codeLang = match[1];
                break;
            }
        }

        var grammar = Prism.languages[codeLang];

        if (!grammar) {
            if (codeLang && codeLang !== "none" && Prism.plugins.autoloader) {
                var id =
                    "md-" +
                    new Date().valueOf() +
                    "-" +
                    Math.floor(Math.random() * 1e16);
                env.attributes["id"] = id;

                Prism.plugins.autoloader.loadLanguages(codeLang, function() {
                    var ele = document.getElementById(id);
                    if (ele) {
                        ele.innerHTML = Prism.highlight(
                            ele.textContent,
                            Prism.languages[codeLang],
                            codeLang
                        );
                    }
                });
            }
        } else {
            // reverse Prism.util.encode
            var code = env.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&");

            env.content = Prism.highlight(code, grammar, codeLang);
        }
    });

    Prism.languages.md = Prism.languages.markdown;
})(Prism);

Prism.languages.nginx = Prism.languages.extend("clike", {
    comment: {
        pattern: /(^|[^"{\\])#.*/,
        lookbehind: true,
    },
    keyword: /\b(?:CONTENT_|DOCUMENT_|GATEWAY_|HTTP_|HTTPS|if_not_empty|PATH_|QUERY_|REDIRECT_|REMOTE_|REQUEST_|SCGI|SCRIPT_|SERVER_|http|events|accept_mutex|accept_mutex_delay|access_log|add_after_body|add_before_body|add_header|addition_types|aio|alias|allow|ancient_browser|ancient_browser_value|auth|auth_basic|auth_basic_user_file|auth_http|auth_http_header|auth_http_timeout|autoindex|autoindex_exact_size|autoindex_localtime|break|charset|charset_map|charset_types|chunked_transfer_encoding|client_body_buffer_size|client_body_in_file_only|client_body_in_single_buffer|client_body_temp_path|client_body_timeout|client_header_buffer_size|client_header_timeout|client_max_body_size|connection_pool_size|create_full_put_path|daemon|dav_access|dav_methods|debug_connection|debug_points|default_type|deny|devpoll_changes|devpoll_events|directio|directio_alignment|disable_symlinks|empty_gif|env|epoll_events|error_log|error_page|expires|fastcgi_buffer_size|fastcgi_buffers|fastcgi_busy_buffers_size|fastcgi_cache|fastcgi_cache_bypass|fastcgi_cache_key|fastcgi_cache_lock|fastcgi_cache_lock_timeout|fastcgi_cache_methods|fastcgi_cache_min_uses|fastcgi_cache_path|fastcgi_cache_purge|fastcgi_cache_use_stale|fastcgi_cache_valid|fastcgi_connect_timeout|fastcgi_hide_header|fastcgi_ignore_client_abort|fastcgi_ignore_headers|fastcgi_index|fastcgi_intercept_errors|fastcgi_keep_conn|fastcgi_max_temp_file_size|fastcgi_next_upstream|fastcgi_no_cache|fastcgi_param|fastcgi_pass|fastcgi_pass_header|fastcgi_read_timeout|fastcgi_redirect_errors|fastcgi_send_timeout|fastcgi_split_path_info|fastcgi_store|fastcgi_store_access|fastcgi_temp_file_write_size|fastcgi_temp_path|flv|geo|geoip_city|geoip_country|google_perftools_profiles|gzip|gzip_buffers|gzip_comp_level|gzip_disable|gzip_http_version|gzip_min_length|gzip_proxied|gzip_static|gzip_types|gzip_vary|if|if_modified_since|ignore_invalid_headers|image_filter|image_filter_buffer|image_filter_jpeg_quality|image_filter_sharpen|image_filter_transparency|imap_capabilities|imap_client_buffer|include|index|internal|ip_hash|keepalive|keepalive_disable|keepalive_requests|keepalive_timeout|kqueue_changes|kqueue_events|large_client_header_buffers|limit_conn|limit_conn_log_level|limit_conn_zone|limit_except|limit_rate|limit_rate_after|limit_req|limit_req_log_level|limit_req_zone|limit_zone|lingering_close|lingering_time|lingering_timeout|listen|location|lock_file|log_format|log_format_combined|log_not_found|log_subrequest|map|map_hash_bucket_size|map_hash_max_size|master_process|max_ranges|memcached_buffer_size|memcached_connect_timeout|memcached_next_upstream|memcached_pass|memcached_read_timeout|memcached_send_timeout|merge_slashes|min_delete_depth|modern_browser|modern_browser_value|mp4|mp4_buffer_size|mp4_max_buffer_size|msie_padding|msie_refresh|multi_accept|open_file_cache|open_file_cache_errors|open_file_cache_min_uses|open_file_cache_valid|open_log_file_cache|optimize_server_names|override_charset|pcre_jit|perl|perl_modules|perl_require|perl_set|pid|pop3_auth|pop3_capabilities|port_in_redirect|post_action|postpone_output|protocol|proxy|proxy_buffer|proxy_buffer_size|proxy_buffering|proxy_buffers|proxy_busy_buffers_size|proxy_cache|proxy_cache_bypass|proxy_cache_key|proxy_cache_lock|proxy_cache_lock_timeout|proxy_cache_methods|proxy_cache_min_uses|proxy_cache_path|proxy_cache_use_stale|proxy_cache_valid|proxy_connect_timeout|proxy_cookie_domain|proxy_cookie_path|proxy_headers_hash_bucket_size|proxy_headers_hash_max_size|proxy_hide_header|proxy_http_version|proxy_ignore_client_abort|proxy_ignore_headers|proxy_intercept_errors|proxy_max_temp_file_size|proxy_method|proxy_next_upstream|proxy_no_cache|proxy_pass|proxy_pass_error_message|proxy_pass_header|proxy_pass_request_body|proxy_pass_request_headers|proxy_read_timeout|proxy_redirect|proxy_redirect_errors|proxy_send_lowat|proxy_send_timeout|proxy_set_body|proxy_set_header|proxy_ssl_session_reuse|proxy_store|proxy_store_access|proxy_temp_file_write_size|proxy_temp_path|proxy_timeout|proxy_upstream_fail_timeout|proxy_upstream_max_fails|random_index|read_ahead|real_ip_header|recursive_error_pages|request_pool_size|reset_timedout_connection|resolver|resolver_timeout|return|rewrite|root|rtsig_overflow_events|rtsig_overflow_test|rtsig_overflow_threshold|rtsig_signo|satisfy|satisfy_any|secure_link_secret|send_lowat|send_timeout|sendfile|sendfile_max_chunk|server|server_name|server_name_in_redirect|server_names_hash_bucket_size|server_names_hash_max_size|server_tokens|set|set_real_ip_from|smtp_auth|smtp_capabilities|so_keepalive|source_charset|split_clients|ssi|ssi_silent_errors|ssi_types|ssi_value_length|ssl|ssl_certificate|ssl_certificate_key|ssl_ciphers|ssl_client_certificate|ssl_crl|ssl_dhparam|ssl_engine|ssl_prefer_server_ciphers|ssl_protocols|ssl_session_cache|ssl_session_timeout|ssl_verify_client|ssl_verify_depth|starttls|stub_status|sub_filter|sub_filter_once|sub_filter_types|tcp_nodelay|tcp_nopush|timeout|timer_resolution|try_files|types|types_hash_bucket_size|types_hash_max_size|underscores_in_headers|uninitialized_variable_warn|upstream|use|user|userid|userid_domain|userid_expires|userid_name|userid_p3p|userid_path|userid_service|valid_referers|variables_hash_bucket_size|variables_hash_max_size|worker_connections|worker_cpu_affinity|worker_priority|worker_processes|worker_rlimit_core|worker_rlimit_nofile|worker_rlimit_sigpending|working_directory|xclient|xml_entities|xslt_entities|xslt_stylesheet|xslt_types|ssl_session_tickets|ssl_stapling|ssl_stapling_verify|ssl_ecdh_curve|ssl_trusted_certificate|more_set_headers|ssl_early_data)\b/i,
});

Prism.languages.insertBefore("nginx", "keyword", {
    variable: /\$[a-z_]+/i,
});

Prism.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
    },
    "string-interpolation": {
        pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: true,
        inside: {
            interpolation: {
                // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
                pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
                lookbehind: true,
                inside: {
                    "format-spec": {
                        pattern: /(:)[^:(){}]+(?=}$)/,
                        lookbehind: true,
                    },
                    "conversion-option": {
                        pattern: /![sra](?=[:}]$)/,
                        alias: "punctuation",
                    },
                    rest: null,
                },
            },
            string: /[\s\S]+/,
        },
    },
    "triple-quoted-string": {
        pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]+?\1/i,
        greedy: true,
        alias: "string",
    },
    string: {
        pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: true,
    },
    function: {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: true,
    },
    "class-name": {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: true,
    },
    decorator: {
        pattern: /(^\s*)@\w+(?:\.\w+)*/im,
        lookbehind: true,
        alias: ["annotation", "punctuation"],
        inside: {
            punctuation: /\./,
        },
    },
    keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/,
};

Prism.languages.python["string-interpolation"].inside[
    "interpolation"
].inside.rest =
    Prism.languages.python;

Prism.languages.py = Prism.languages.python;

(function(Prism) {
    var javascript = Prism.util.clone(Prism.languages.javascript);

    Prism.languages.jsx = Prism.languages.extend("markup", javascript);
    Prism.languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:$-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}))?|\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}))*\s*\/?)?>/i;

    Prism.languages.jsx.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/i;
    Prism.languages.jsx.tag.inside[
        "attr-value"
    ].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;
    Prism.languages.jsx.tag.inside["tag"].inside[
        "class-name"
    ] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;

    Prism.languages.insertBefore(
        "inside",
        "attr-name",
        {
            spread: {
                pattern: /\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}/,
                inside: {
                    punctuation: /\.{3}|[{}.]/,
                    "attr-value": /\w+/,
                },
            },
        },
        Prism.languages.jsx.tag
    );

    Prism.languages.insertBefore(
        "inside",
        "attr-value",
        {
            script: {
                // Allow for two levels of nesting
                pattern: /=(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\})/i,
                inside: {
                    "script-punctuation": {
                        pattern: /^=(?={)/,
                        alias: "punctuation",
                    },
                    rest: Prism.languages.jsx,
                },
                alias: "language-javascript",
            },
        },
        Prism.languages.jsx.tag
    );

    // The following will handle plain text inside tags
    var stringifyToken = function(token) {
        if (!token) {
            return "";
        }
        if (typeof token === "string") {
            return token;
        }
        if (typeof token.content === "string") {
            return token.content;
        }
        return token.content.map(stringifyToken).join("");
    };

    var walkTokens = function(tokens) {
        var openedTags = [];
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var notTagNorBrace = false;

            if (typeof token !== "string") {
                if (
                    token.type === "tag" &&
                    token.content[0] &&
                    token.content[0].type === "tag"
                ) {
                    // We found a tag, now find its kind

                    if (token.content[0].content[0].content === "</") {
                        // Closing tag
                        if (
                            openedTags.length > 0 &&
                            openedTags[openedTags.length - 1].tagName ===
                                stringifyToken(token.content[0].content[1])
                        ) {
                            // Pop matching opening tag
                            openedTags.pop();
                        }
                    } else {
                        if (
                            token.content[token.content.length - 1].content ===
                            "/>"
                        ) {
                            // Autoclosed tag, ignore
                        } else {
                            // Opening tag
                            openedTags.push({
                                tagName: stringifyToken(
                                    token.content[0].content[1]
                                ),
                                openedBraces: 0,
                            });
                        }
                    }
                } else if (
                    openedTags.length > 0 &&
                    token.type === "punctuation" &&
                    token.content === "{"
                ) {
                    // Here we might have entered a JSX context inside a tag
                    openedTags[openedTags.length - 1].openedBraces++;
                } else if (
                    openedTags.length > 0 &&
                    openedTags[openedTags.length - 1].openedBraces > 0 &&
                    token.type === "punctuation" &&
                    token.content === "}"
                ) {
                    // Here we might have left a JSX context inside a tag
                    openedTags[openedTags.length - 1].openedBraces--;
                } else {
                    notTagNorBrace = true;
                }
            }
            if (notTagNorBrace || typeof token === "string") {
                if (
                    openedTags.length > 0 &&
                    openedTags[openedTags.length - 1].openedBraces === 0
                ) {
                    // Here we are inside a tag, and not inside a JSX context.
                    // That's plain text: drop any tokens matched.
                    var plainText = stringifyToken(token);

                    // And merge text with adjacent text
                    if (
                        i < tokens.length - 1 &&
                        (typeof tokens[i + 1] === "string" ||
                            tokens[i + 1].type === "plain-text")
                    ) {
                        plainText += stringifyToken(tokens[i + 1]);
                        tokens.splice(i + 1, 1);
                    }
                    if (
                        i > 0 &&
                        (typeof tokens[i - 1] === "string" ||
                            tokens[i - 1].type === "plain-text")
                    ) {
                        plainText = stringifyToken(tokens[i - 1]) + plainText;
                        tokens.splice(i - 1, 1);
                        i--;
                    }

                    tokens[i] = new Prism.Token(
                        "plain-text",
                        plainText,
                        null,
                        plainText
                    );
                }
            }

            if (token.content && typeof token.content !== "string") {
                walkTokens(token.content);
            }
        }
    };

    Prism.hooks.add("after-tokenize", function(env) {
        if (env.language !== "jsx" && env.language !== "tsx") {
            return;
        }
        walkTokens(env.tokens);
    });
})(Prism);

(function(Prism) {
    Prism.languages.typescript = Prism.languages.extend("javascript", {
        "class-name": {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
            lookbehind: true,
            greedy: true,
            inside: null, // see below
        },
        // From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
        keyword: /\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,
        builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
    });

    // doesn't work with TS because TS is too complex
    delete Prism.languages.typescript["parameter"];

    // a version of typescript specifically for highlighting types
    var typeInside = Prism.languages.extend("typescript", {});
    delete typeInside["class-name"];

    Prism.languages.typescript["class-name"].inside = typeInside;

    Prism.languages.insertBefore("typescript", "function", {
        "generic-function": {
            // e.g. foo<T extends "bar" | "baz">( ...
            pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
            greedy: true,
            inside: {
                function: /^#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
                generic: {
                    pattern: /<[\s\S]+/, // everything after the first <
                    alias: "class-name",
                    inside: typeInside,
                },
            },
        },
    });

    Prism.languages.ts = Prism.languages.typescript;
})(Prism);

var typescript = Prism.util.clone(Prism.languages.typescript);
Prism.languages.tsx = Prism.languages.extend("jsx", typescript);
(function(Prism) {
    var specialEscape = {
        pattern: /\\[\\(){}[\]^$+*?|.]/,
        alias: "escape",
    };
    var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|c[a-zA-Z]|0[0-7]{0,2}|[123][0-7]{2}|.)/;
    var charClass = /\\[wsd]|\.|\\p{[^{}]+}/i;

    var rangeChar = "(?:[^\\\\-]|" + escape.source + ")";
    var range = RegExp(rangeChar + "-" + rangeChar);

    // the name of a capturing group
    var groupName = {
        pattern: /(<|')[^<>']+(?=[>']$)/,
        lookbehind: true,
        alias: "variable",
    };

    var backreference = [
        /\\(?![123][0-7]{2})[1-9]/, // a backreference which is not an octal escape
        {
            pattern: /\\k<[^<>']+>/,
            inside: {
                "group-name": groupName,
            },
        },
    ];

    Prism.languages.regex = {
        charset: {
            pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
            lookbehind: true,
            inside: {
                "charset-negation": {
                    pattern: /(^\[)\^/,
                    lookbehind: true,
                },
                "charset-punctuation": /^\[|\]$/,
                range: {
                    pattern: range,
                    inside: {
                        escape: escape,
                        "range-punctuation": /-/,
                    },
                },
                "special-escape": specialEscape,
                charclass: charClass,
                backreference: backreference,
                escape: escape,
            },
        },
        "special-escape": specialEscape,
        charclass: charClass,
        backreference: backreference,
        anchor: /[$^]|\\[ABbGZz]/,
        escape: escape,
        group: [
            {
                // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
                // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs

                // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
                pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
                inside: {
                    "group-name": groupName,
                },
            },
            /\)/,
        ],
        quantifier: /[+*?]|\{(?:\d+,?\d*)\}/,
        alternation: /\|/,
    };

    [
        "actionscript",
        "coffescript",
        "flow",
        "javascript",
        "typescript",
        "vala",
    ].forEach(function(lang) {
        var grammar = Prism.languages[lang];
        if (grammar) {
            grammar["regex"].inside = {
                "regex-flags": /[a-z]+$/,
                "regex-delimiter": /^\/|\/$/,
                "language-regex": {
                    pattern: /[\s\S]+/,
                    inside: Prism.languages.regex,
                },
            };
        }
    });
})(Prism);
Prism.languages.vim = {
    string: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
    comment: /".*/,
    function: /\w+(?=\()/,
    keyword: /\b(?:ab|abbreviate|abc|abclear|abo|aboveleft|al|all|arga|argadd|argd|argdelete|argdo|arge|argedit|argg|argglobal|argl|arglocal|ar|args|argu|argument|as|ascii|bad|badd|ba|ball|bd|bdelete|be|bel|belowright|bf|bfirst|bl|blast|bm|bmodified|bn|bnext|bN|bNext|bo|botright|bp|bprevious|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|br|brewind|bro|browse|bufdo|b|buffer|buffers|bun|bunload|bw|bwipeout|ca|cabbrev|cabc|cabclear|caddb|caddbuffer|cad|caddexpr|caddf|caddfile|cal|call|cat|catch|cb|cbuffer|cc|ccl|cclose|cd|ce|center|cex|cexpr|cf|cfile|cfir|cfirst|cgetb|cgetbuffer|cgete|cgetexpr|cg|cgetfile|c|change|changes|chd|chdir|che|checkpath|checkt|checktime|cla|clast|cl|clist|clo|close|cmapc|cmapclear|cnew|cnewer|cn|cnext|cN|cNext|cnf|cnfile|cNfcNfile|cnorea|cnoreabbrev|col|colder|colo|colorscheme|comc|comclear|comp|compiler|conf|confirm|con|continue|cope|copen|co|copy|cpf|cpfile|cp|cprevious|cq|cquit|cr|crewind|cuna|cunabbrev|cu|cunmap|cw|cwindow|debugg|debuggreedy|delc|delcommand|d|delete|delf|delfunction|delm|delmarks|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|dig|digraphs|di|display|dj|djump|dl|dlist|dr|drop|ds|dsearch|dsp|dsplit|earlier|echoe|echoerr|echom|echomsg|echon|e|edit|el|else|elsei|elseif|em|emenu|endfo|endfor|endf|endfunction|endfun|en|endif|endt|endtry|endw|endwhile|ene|enew|ex|exi|exit|exu|exusage|f|file|files|filetype|fina|finally|fin|find|fini|finish|fir|first|fix|fixdel|fo|fold|foldc|foldclose|folddoc|folddoclosed|foldd|folddoopen|foldo|foldopen|for|fu|fun|function|go|goto|gr|grep|grepa|grepadd|ha|hardcopy|h|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hid|hide|his|history|ia|iabbrev|iabc|iabclear|if|ij|ijump|il|ilist|imapc|imapclear|in|inorea|inoreabbrev|isearch|isp|isplit|iuna|iunabbrev|iu|iunmap|j|join|ju|jumps|k|keepalt|keepj|keepjumps|kee|keepmarks|laddb|laddbuffer|lad|laddexpr|laddf|laddfile|lan|language|la|last|later|lb|lbuffer|lc|lcd|lch|lchdir|lcl|lclose|let|left|lefta|leftabove|lex|lexpr|lf|lfile|lfir|lfirst|lgetb|lgetbuffer|lgete|lgetexpr|lg|lgetfile|lgr|lgrep|lgrepa|lgrepadd|lh|lhelpgrep|l|list|ll|lla|llast|lli|llist|lmak|lmake|lm|lmap|lmapc|lmapclear|lnew|lnewer|lne|lnext|lN|lNext|lnf|lnfile|lNf|lNfile|ln|lnoremap|lo|loadview|loc|lockmarks|lockv|lockvar|lol|lolder|lop|lopen|lpf|lpfile|lp|lprevious|lr|lrewind|ls|lt|ltag|lu|lunmap|lv|lvimgrep|lvimgrepa|lvimgrepadd|lw|lwindow|mak|make|ma|mark|marks|mat|match|menut|menutranslate|mk|mkexrc|mks|mksession|mksp|mkspell|mkvie|mkview|mkv|mkvimrc|mod|mode|m|move|mzf|mzfile|mz|mzscheme|nbkey|new|n|next|N|Next|nmapc|nmapclear|noh|nohlsearch|norea|noreabbrev|nu|number|nun|nunmap|omapc|omapclear|on|only|o|open|opt|options|ou|ounmap|pc|pclose|ped|pedit|pe|perl|perld|perldo|po|pop|popu|popup|pp|ppop|pre|preserve|prev|previous|p|print|P|Print|profd|profdel|prof|profile|promptf|promptfind|promptr|promptrepl|ps|psearch|pta|ptag|ptf|ptfirst|ptj|ptjump|ptl|ptlast|ptn|ptnext|ptN|ptNext|ptp|ptprevious|ptr|ptrewind|pts|ptselect|pu|put|pw|pwd|pyf|pyfile|py|python|qa|qall|q|quit|quita|quitall|r|read|rec|recover|redi|redir|red|redo|redr|redraw|redraws|redrawstatus|reg|registers|res|resize|ret|retab|retu|return|rew|rewind|ri|right|rightb|rightbelow|rub|ruby|rubyd|rubydo|rubyf|rubyfile|ru|runtime|rv|rviminfo|sal|sall|san|sandbox|sa|sargument|sav|saveas|sba|sball|sbf|sbfirst|sbl|sblast|sbm|sbmodified|sbn|sbnext|sbN|sbNext|sbp|sbprevious|sbr|sbrewind|sb|sbuffer|scripte|scriptencoding|scrip|scriptnames|se|set|setf|setfiletype|setg|setglobal|setl|setlocal|sf|sfind|sfir|sfirst|sh|shell|sign|sil|silent|sim|simalt|sla|slast|sl|sleep|sm|smagic|sm|smap|smapc|smapclear|sme|smenu|sn|snext|sN|sNext|sni|sniff|sno|snomagic|snor|snoremap|snoreme|snoremenu|sor|sort|so|source|spelld|spelldump|spe|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|sp|split|spr|sprevious|sre|srewind|sta|stag|startg|startgreplace|star|startinsert|startr|startreplace|stj|stjump|st|stop|stopi|stopinsert|sts|stselect|sun|sunhide|sunm|sunmap|sus|suspend|sv|sview|syncbind|t|tab|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabnew|tabn|tabnext|tabN|tabNext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|ta|tag|tags|tc|tcl|tcld|tcldo|tclf|tclfile|te|tearoff|tf|tfirst|th|throw|tj|tjump|tl|tlast|tm|tm|tmenu|tn|tnext|tN|tNext|to|topleft|tp|tprevious|tr|trewind|try|ts|tselect|tu|tu|tunmenu|una|unabbreviate|u|undo|undoj|undojoin|undol|undolist|unh|unhide|unlet|unlo|unlockvar|unm|unmap|up|update|verb|verbose|ve|version|vert|vertical|vie|view|vim|vimgrep|vimgrepa|vimgrepadd|vi|visual|viu|viusage|vmapc|vmapclear|vne|vnew|vs|vsplit|vu|vunmap|wa|wall|wh|while|winc|wincmd|windo|winp|winpos|win|winsize|wn|wnext|wN|wNext|wp|wprevious|wq|wqa|wqall|w|write|ws|wsverb|wv|wviminfo|X|xa|xall|x|xit|xm|xmap|xmapc|xmapclear|xme|xmenu|XMLent|XMLns|xn|xnoremap|xnoreme|xnoremenu|xu|xunmap|y|yank)\b/,
    builtin: /\b(?:autocmd|acd|ai|akm|aleph|allowrevins|altkeymap|ambiwidth|ambw|anti|antialias|arab|arabic|arabicshape|ari|arshape|autochdir|autoindent|autoread|autowrite|autowriteall|aw|awa|background|backspace|backup|backupcopy|backupdir|backupext|backupskip|balloondelay|ballooneval|balloonexpr|bdir|bdlay|beval|bex|bexpr|bg|bh|bin|binary|biosk|bioskey|bk|bkc|bomb|breakat|brk|browsedir|bs|bsdir|bsk|bt|bufhidden|buflisted|buftype|casemap|ccv|cdpath|cedit|cfu|ch|charconvert|ci|cin|cindent|cink|cinkeys|cino|cinoptions|cinw|cinwords|clipboard|cmdheight|cmdwinheight|cmp|cms|columns|com|comments|commentstring|compatible|complete|completefunc|completeopt|consk|conskey|copyindent|cot|cpo|cpoptions|cpt|cscopepathcomp|cscopeprg|cscopequickfix|cscopetag|cscopetagorder|cscopeverbose|cspc|csprg|csqf|cst|csto|csverb|cuc|cul|cursorcolumn|cursorline|cwh|debug|deco|def|define|delcombine|dex|dg|dict|dictionary|diff|diffexpr|diffopt|digraph|dip|dir|directory|dy|ea|ead|eadirection|eb|ed|edcompatible|ef|efm|ei|ek|enc|encoding|endofline|eol|ep|equalalways|equalprg|errorbells|errorfile|errorformat|esckeys|et|eventignore|expandtab|exrc|fcl|fcs|fdc|fde|fdi|fdl|fdls|fdm|fdn|fdo|fdt|fen|fenc|fencs|fex|ff|ffs|fileencoding|fileencodings|fileformat|fileformats|fillchars|fk|fkmap|flp|fml|fmr|foldcolumn|foldenable|foldexpr|foldignore|foldlevel|foldlevelstart|foldmarker|foldmethod|foldminlines|foldnestmax|foldtext|formatexpr|formatlistpat|formatoptions|formatprg|fp|fs|fsync|ft|gcr|gd|gdefault|gfm|gfn|gfs|gfw|ghr|gp|grepformat|grepprg|gtl|gtt|guicursor|guifont|guifontset|guifontwide|guiheadroom|guioptions|guipty|guitablabel|guitabtooltip|helpfile|helpheight|helplang|hf|hh|hi|hidden|highlight|hk|hkmap|hkmapp|hkp|hl|hlg|hls|hlsearch|ic|icon|iconstring|ignorecase|im|imactivatekey|imak|imc|imcmdline|imd|imdisable|imi|iminsert|ims|imsearch|inc|include|includeexpr|incsearch|inde|indentexpr|indentkeys|indk|inex|inf|infercase|insertmode|isf|isfname|isi|isident|isk|iskeyword|isprint|joinspaces|js|key|keymap|keymodel|keywordprg|km|kmp|kp|langmap|langmenu|laststatus|lazyredraw|lbr|lcs|linebreak|lines|linespace|lisp|lispwords|listchars|loadplugins|lpl|lsp|lz|macatsui|magic|makeef|makeprg|matchpairs|matchtime|maxcombine|maxfuncdepth|maxmapdepth|maxmem|maxmempattern|maxmemtot|mco|mef|menuitems|mfd|mh|mis|mkspellmem|ml|mls|mm|mmd|mmp|mmt|modeline|modelines|modifiable|modified|more|mouse|mousef|mousefocus|mousehide|mousem|mousemodel|mouses|mouseshape|mouset|mousetime|mp|mps|msm|mzq|mzquantum|nf|nrformats|numberwidth|nuw|odev|oft|ofu|omnifunc|opendevice|operatorfunc|opfunc|osfiletype|pa|para|paragraphs|paste|pastetoggle|patchexpr|patchmode|path|pdev|penc|pex|pexpr|pfn|ph|pheader|pi|pm|pmbcs|pmbfn|popt|preserveindent|previewheight|previewwindow|printdevice|printencoding|printexpr|printfont|printheader|printmbcharset|printmbfont|printoptions|prompt|pt|pumheight|pvh|pvw|qe|quoteescape|readonly|remap|report|restorescreen|revins|rightleft|rightleftcmd|rl|rlc|ro|rs|rtp|ruf|ruler|rulerformat|runtimepath|sbo|sc|scb|scr|scroll|scrollbind|scrolljump|scrolloff|scrollopt|scs|sect|sections|secure|sel|selection|selectmode|sessionoptions|sft|shcf|shellcmdflag|shellpipe|shellquote|shellredir|shellslash|shelltemp|shelltype|shellxquote|shiftround|shiftwidth|shm|shortmess|shortname|showbreak|showcmd|showfulltag|showmatch|showmode|showtabline|shq|si|sidescroll|sidescrolloff|siso|sj|slm|smartcase|smartindent|smarttab|smc|smd|softtabstop|sol|spc|spell|spellcapcheck|spellfile|spelllang|spellsuggest|spf|spl|splitbelow|splitright|sps|sr|srr|ss|ssl|ssop|stal|startofline|statusline|stl|stmp|su|sua|suffixes|suffixesadd|sw|swapfile|swapsync|swb|swf|switchbuf|sws|sxq|syn|synmaxcol|syntax|tabline|tabpagemax|tabstop|tagbsearch|taglength|tagrelative|tagstack|tal|tb|tbi|tbidi|tbis|tbs|tenc|term|termbidi|termencoding|terse|textauto|textmode|textwidth|tgst|thesaurus|tildeop|timeout|timeoutlen|title|titlelen|titleold|titlestring|toolbar|toolbariconsize|top|tpm|tsl|tsr|ttimeout|ttimeoutlen|ttm|tty|ttybuiltin|ttyfast|ttym|ttymouse|ttyscroll|ttytype|tw|tx|uc|ul|undolevels|updatecount|updatetime|ut|vb|vbs|vdir|verbosefile|vfile|viewdir|viewoptions|viminfo|virtualedit|visualbell|vop|wak|warn|wb|wc|wcm|wd|weirdinvert|wfh|wfw|whichwrap|wi|wig|wildchar|wildcharm|wildignore|wildmenu|wildmode|wildoptions|wim|winaltkeys|window|winfixheight|winfixwidth|winheight|winminheight|winminwidth|winwidth|wiv|wiw|wm|wmh|wmnu|wmw|wop|wrap|wrapmargin|wrapscan|writeany|writebackup|writedelay|ww|noacd|noai|noakm|noallowrevins|noaltkeymap|noanti|noantialias|noar|noarab|noarabic|noarabicshape|noari|noarshape|noautochdir|noautoindent|noautoread|noautowrite|noautowriteall|noaw|noawa|nobackup|noballooneval|nobeval|nobin|nobinary|nobiosk|nobioskey|nobk|nobl|nobomb|nobuflisted|nocf|noci|nocin|nocindent|nocompatible|noconfirm|noconsk|noconskey|nocopyindent|nocp|nocscopetag|nocscopeverbose|nocst|nocsverb|nocuc|nocul|nocursorcolumn|nocursorline|nodeco|nodelcombine|nodg|nodiff|nodigraph|nodisable|noea|noeb|noed|noedcompatible|noek|noendofline|noeol|noequalalways|noerrorbells|noesckeys|noet|noex|noexpandtab|noexrc|nofen|nofk|nofkmap|nofoldenable|nogd|nogdefault|noguipty|nohid|nohidden|nohk|nohkmap|nohkmapp|nohkp|nohls|noic|noicon|noignorecase|noim|noimc|noimcmdline|noimd|noincsearch|noinf|noinfercase|noinsertmode|nois|nojoinspaces|nojs|nolazyredraw|nolbr|nolinebreak|nolisp|nolist|noloadplugins|nolpl|nolz|noma|nomacatsui|nomagic|nomh|noml|nomod|nomodeline|nomodifiable|nomodified|nomore|nomousef|nomousefocus|nomousehide|nonu|nonumber|noodev|noopendevice|nopaste|nopi|nopreserveindent|nopreviewwindow|noprompt|nopvw|noreadonly|noremap|norestorescreen|norevins|nori|norightleft|norightleftcmd|norl|norlc|noro|nors|noru|noruler|nosb|nosc|noscb|noscrollbind|noscs|nosecure|nosft|noshellslash|noshelltemp|noshiftround|noshortname|noshowcmd|noshowfulltag|noshowmatch|noshowmode|nosi|nosm|nosmartcase|nosmartindent|nosmarttab|nosmd|nosn|nosol|nospell|nosplitbelow|nosplitright|nospr|nosr|nossl|nosta|nostartofline|nostmp|noswapfile|noswf|nota|notagbsearch|notagrelative|notagstack|notbi|notbidi|notbs|notermbidi|noterse|notextauto|notextmode|notf|notgst|notildeop|notimeout|notitle|noto|notop|notr|nottimeout|nottybuiltin|nottyfast|notx|novb|novisualbell|nowa|nowarn|nowb|noweirdinvert|nowfh|nowfw|nowildmenu|nowinfixheight|nowinfixwidth|nowiv|nowmnu|nowrap|nowrapscan|nowrite|nowriteany|nowritebackup|nows|invacd|invai|invakm|invallowrevins|invaltkeymap|invanti|invantialias|invar|invarab|invarabic|invarabicshape|invari|invarshape|invautochdir|invautoindent|invautoread|invautowrite|invautowriteall|invaw|invawa|invbackup|invballooneval|invbeval|invbin|invbinary|invbiosk|invbioskey|invbk|invbl|invbomb|invbuflisted|invcf|invci|invcin|invcindent|invcompatible|invconfirm|invconsk|invconskey|invcopyindent|invcp|invcscopetag|invcscopeverbose|invcst|invcsverb|invcuc|invcul|invcursorcolumn|invcursorline|invdeco|invdelcombine|invdg|invdiff|invdigraph|invdisable|invea|inveb|inved|invedcompatible|invek|invendofline|inveol|invequalalways|inverrorbells|invesckeys|invet|invex|invexpandtab|invexrc|invfen|invfk|invfkmap|invfoldenable|invgd|invgdefault|invguipty|invhid|invhidden|invhk|invhkmap|invhkmapp|invhkp|invhls|invhlsearch|invic|invicon|invignorecase|invim|invimc|invimcmdline|invimd|invincsearch|invinf|invinfercase|invinsertmode|invis|invjoinspaces|invjs|invlazyredraw|invlbr|invlinebreak|invlisp|invlist|invloadplugins|invlpl|invlz|invma|invmacatsui|invmagic|invmh|invml|invmod|invmodeline|invmodifiable|invmodified|invmore|invmousef|invmousefocus|invmousehide|invnu|invnumber|invodev|invopendevice|invpaste|invpi|invpreserveindent|invpreviewwindow|invprompt|invpvw|invreadonly|invremap|invrestorescreen|invrevins|invri|invrightleft|invrightleftcmd|invrl|invrlc|invro|invrs|invru|invruler|invsb|invsc|invscb|invscrollbind|invscs|invsecure|invsft|invshellslash|invshelltemp|invshiftround|invshortname|invshowcmd|invshowfulltag|invshowmatch|invshowmode|invsi|invsm|invsmartcase|invsmartindent|invsmarttab|invsmd|invsn|invsol|invspell|invsplitbelow|invsplitright|invspr|invsr|invssl|invsta|invstartofline|invstmp|invswapfile|invswf|invta|invtagbsearch|invtagrelative|invtagstack|invtbi|invtbidi|invtbs|invtermbidi|invterse|invtextauto|invtextmode|invtf|invtgst|invtildeop|invtimeout|invtitle|invto|invtop|invtr|invttimeout|invttybuiltin|invttyfast|invtx|invvb|invvisualbell|invwa|invwarn|invwb|invweirdinvert|invwfh|invwfw|invwildmenu|invwinfixheight|invwinfixwidth|invwiv|invwmnu|invwrap|invwrapscan|invwrite|invwriteany|invwritebackup|invws|t_AB|t_AF|t_al|t_AL|t_bc|t_cd|t_ce|t_Ce|t_cl|t_cm|t_Co|t_cs|t_Cs|t_CS|t_CV|t_da|t_db|t_dl|t_DL|t_EI|t_F1|t_F2|t_F3|t_F4|t_F5|t_F6|t_F7|t_F8|t_F9|t_fs|t_IE|t_IS|t_k1|t_K1|t_k2|t_k3|t_K3|t_k4|t_K4|t_k5|t_K5|t_k6|t_K6|t_k7|t_K7|t_k8|t_K8|t_k9|t_K9|t_KA|t_kb|t_kB|t_KB|t_KC|t_kd|t_kD|t_KD|t_ke|t_KE|t_KF|t_KG|t_kh|t_KH|t_kI|t_KI|t_KJ|t_KK|t_kl|t_KL|t_kN|t_kP|t_kr|t_ks|t_ku|t_le|t_mb|t_md|t_me|t_mr|t_ms|t_nd|t_op|t_RI|t_RV|t_Sb|t_se|t_Sf|t_SI|t_so|t_sr|t_te|t_ti|t_ts|t_ue|t_us|t_ut|t_vb|t_ve|t_vi|t_vs|t_WP|t_WS|t_xs|t_ZH|t_ZR)\b/,
    number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
    operator: /\|\||&&|[-+.]=?|[=!](?:[=~][#?]?)?|[<>]=?[#?]?|[*\/%?]|\b(?:is(?:not)?)\b/,
    punctuation: /[{}[\](),;:]/,
};
Prism.languages.wasm = {
    comment: [
        /\(;[\s\S]*?;\)/,
        {
            pattern: /;;.*/,
            greedy: true,
        },
    ],
    string: {
        pattern: /"(?:\\[\s\S]|[^"\\])*"/,
        greedy: true,
    },
    keyword: [
        {
            pattern: /\b(?:align|offset)=/,
            inside: {
                operator: /=/,
            },
        },
        {
            pattern: /\b(?:(?:f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))?|memory\.(?:grow|size))\b/,
            inside: {
                punctuation: /\./,
            },
        },
        /\b(?:anyfunc|block|br(?:_if|_table)?|call(?:_indirect)?|data|drop|elem|else|end|export|func|get_(?:global|local)|global|if|import|local|loop|memory|module|mut|nop|offset|param|result|return|select|set_(?:global|local)|start|table|tee_local|then|type|unreachable)\b/,
    ],
    variable: /\$[\w!#$%&'*+\-./:<=>?@\\^_`|~]+/i,
    number: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/,
    punctuation: /[()]/,
};
(function() {
    if (
        typeof self === "undefined" ||
        !self.Prism ||
        !self.document ||
        !document.querySelector
    ) {
        return;
    }

    function $$(expr, con) {
        return Array.prototype.slice.call(
            (con || document).querySelectorAll(expr)
        );
    }

    function hasClass(element, className) {
        className = " " + className + " ";
        return (
            (" " + element.className + " ")
                .replace(/[\n\t]/g, " ")
                .indexOf(className) > -1
        );
    }

    function callFunction(func) {
        func();
    }

    // Some browsers round the line-height, others don't.
    // We need to test for it to position the elements properly.
    var isLineHeightRounded = (function() {
        var res;
        return function() {
            if (typeof res === "undefined") {
                var d = document.createElement("div");
                d.style.fontSize = "13px";
                d.style.lineHeight = "1.5";
                d.style.padding = 0;
                d.style.border = 0;
                d.innerHTML = "&nbsp;<br />&nbsp;";
                document.body.appendChild(d);
                // Browsers that round the line-height should have offsetHeight === 38
                // The others should have 39.
                res = d.offsetHeight === 38;
                document.body.removeChild(d);
            }
            return res;
        };
    })();

    /**
     * Highlights the lines of the given pre.
     *
     * This function is split into a DOM measuring and mutate phase to improve performance.
     * The returned function mutates the DOM when called.
     *
     * @param {HTMLElement} pre
     * @param {string} [lines]
     * @param {string} [classes='']
     * @returns {() => void}
     */
    function highlightLines(pre, lines, classes) {
        lines =
            typeof lines === "string" ? lines : pre.getAttribute("data-line");

        var ranges = lines.replace(/\s+/g, "").split(",");
        var offset = +pre.getAttribute("data-line-offset") || 0;

        var parseMethod = isLineHeightRounded() ? parseInt : parseFloat;
        var lineHeight = parseMethod(getComputedStyle(pre).lineHeight);
        var hasLineNumbers = hasClass(pre, "line-numbers");
        var parentElement = hasLineNumbers
            ? pre
            : pre.querySelector("code") || pre;
        var mutateActions = /** @type {(() => void)[]} */ ([]);

        ranges.forEach(function(currentRange) {
            var range = currentRange.split("-");

            var start = +range[0];
            var end = +range[1] || start;

            var line =
                pre.querySelector(
                    '.line-highlight[data-range="' + currentRange + '"]'
                ) || document.createElement("div");

            mutateActions.push(function() {
                line.setAttribute("aria-hidden", "true");
                line.setAttribute("data-range", currentRange);
                line.className = (classes || "") + " line-highlight";
            });

            // if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers
            if (hasLineNumbers && Prism.plugins.lineNumbers) {
                var startNode = Prism.plugins.lineNumbers.getLine(pre, start);
                var endNode = Prism.plugins.lineNumbers.getLine(pre, end);

                if (startNode) {
                    var top = startNode.offsetTop + "px";
                    mutateActions.push(function() {
                        line.style.top = top;
                    });
                }

                if (endNode) {
                    var height =
                        endNode.offsetTop -
                        startNode.offsetTop +
                        endNode.offsetHeight +
                        "px";
                    mutateActions.push(function() {
                        line.style.height = height;
                    });
                }
            } else {
                mutateActions.push(function() {
                    line.setAttribute("data-start", start);

                    if (end > start) {
                        line.setAttribute("data-end", end);
                    }

                    line.style.top = (start - offset - 1) * lineHeight + "px";

                    line.textContent = new Array(end - start + 2).join(" \n");
                });
            }

            mutateActions.push(function() {
                // allow this to play nicely with the line-numbers plugin
                // need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
                parentElement.appendChild(line);
            });
        });

        return function() {
            mutateActions.forEach(callFunction);
        };
    }

    function applyHash() {
        var hash = location.hash.slice(1);

        // Remove pre-existing temporary lines
        $$(".temporary.line-highlight").forEach(function(line) {
            line.parentNode.removeChild(line);
        });

        var range = (hash.match(/\.([\d,-]+)$/) || [, ""])[1];

        if (!range || document.getElementById(hash)) {
            return;
        }

        var id = hash.slice(0, hash.lastIndexOf(".")),
            pre = document.getElementById(id);

        if (!pre) {
            return;
        }

        if (!pre.hasAttribute("data-line")) {
            pre.setAttribute("data-line", "");
        }

        var mutateDom = highlightLines(pre, range, "temporary ");
        mutateDom();

        document.querySelector(".temporary.line-highlight").scrollIntoView();
    }

    var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

    Prism.hooks.add("before-sanity-check", function(env) {
        var pre = env.element.parentNode;
        var lines = pre && pre.getAttribute("data-line");

        if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
            return;
        }

        /*
         * Cleanup for other plugins (e.g. autoloader).
         *
         * Sometimes <code> blocks are highlighted multiple times. It is necessary
         * to cleanup any left-over tags, because the whitespace inside of the <div>
         * tags change the content of the <code> tag.
         */
        var num = 0;
        $$(".line-highlight", pre).forEach(function(line) {
            num += line.textContent.length;
            line.parentNode.removeChild(line);
        });
        // Remove extra whitespace
        if (num && /^( \n)+$/.test(env.code.slice(-num))) {
            env.code = env.code.slice(0, -num);
        }
    });

    Prism.hooks.add("complete", function completeHook(env) {
        var pre = env.element.parentNode;
        var lines = pre && pre.getAttribute("data-line");

        if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
            return;
        }

        clearTimeout(fakeTimer);

        var hasLineNumbers = Prism.plugins.lineNumbers;
        var isLineNumbersLoaded = env.plugins && env.plugins.lineNumbers;

        if (
            hasClass(pre, "line-numbers") &&
            hasLineNumbers &&
            !isLineNumbersLoaded
        ) {
            Prism.hooks.add("line-numbers", completeHook);
        } else {
            var mutateDom = highlightLines(pre, lines);
            mutateDom();
            fakeTimer = setTimeout(applyHash, 1);
        }
    });

    window.addEventListener("hashchange", applyHash);
    window.addEventListener("resize", function() {
        var actions = [];
        $$("pre[data-line]").forEach(function(pre) {
            actions.push(highlightLines(pre));
        });
        actions.forEach(callFunction);
    });
})();
