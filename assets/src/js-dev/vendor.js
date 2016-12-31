                                                                /* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript+bash+git+go+handlebars+jade+json+markdown+nginx+python+jsx+stylus */

var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self: {}

,
Prism=function() {
    var e=/\blang(?: uage)?-(\w+)\b/i, t=0, n=_self.Prism= {
        util: {
            encode:function(e) {
                return e instanceof a?new a(e.type, n.util.encode(e.content), e.alias): "Array"===n.util.type(e)?e.map(n.util.encode): e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
            }
            ,
            type:function(e) {
                return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
            }
            ,
            objId:function(e) {
                return e.__id||Object.defineProperty(e, "__id", {
                    value: ++t
                }
                ),
                e.__id
            }
            ,
            clone:function(e) {
                var t=n.util.type(e);
                switch(t) {
                    case"Object":var a= {}
                    ;
                    for(var r in e)e.hasOwnProperty(r)&&(a[r]=n.util.clone(e[r]));
                    return a;
                    case"Array":return e.map&&e.map(function(e) {
                        return n.util.clone(e)
                    }
                    )
                }
                return e
            }
        }
        ,
        languages: {
            extend:function(e, t) {
                var a=n.util.clone(n.languages[e]);
                for(var r in t)a[r]=t[r];
                return a
            }
            ,
            insertBefore:function(e, t, a, r) {
                r=r||n.languages;
                var i=r[e];
                if(2==arguments.length) {
                    a=arguments[1];
                    for(var l in a)a.hasOwnProperty(l)&&(i[l]=a[l]);
                    return i
                }
                var o= {}
                ;
                for(var s in i)if(i.hasOwnProperty(s)) {
                    if(s==t)for(var l in a)a.hasOwnProperty(l)&&(o[l]=a[l]);
                    o[s]=i[s]
                }
                return n.languages.DFS(n.languages, function(t, n) {
                    n===r[e]&&t!=e&&(this[t]=o)
                }
                ),
                r[e]=o
            }
            ,
            DFS:function(e, t, a, r) {
                r=r|| {}
                ;
                for(var i in e)e.hasOwnProperty(i)&&(t.call(e, i, e[i], a||i), "Object"!==n.util.type(e[i])||r[n.util.objId(e[i])]?"Array"!==n.util.type(e[i])||r[n.util.objId(e[i])]||(r[n.util.objId(e[i])]=!0, n.languages.DFS(e[i], t, i, r)): (r[n.util.objId(e[i])]=!0, n.languages.DFS(e[i], t, null, r)))
            }
        }
        ,
        plugins: {}
        ,
        highlightAll:function(e, t) {
            var a= {
                callback: t, selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            }
            ;
            n.hooks.run("before-highlightall", a);
            for(var r, i=a.elements||document.querySelectorAll(a.selector), l=0;
            r=i[l++];
            )n.highlightElement(r, e===!0, a.callback)
        }
        ,
        highlightElement:function(t, a, r) {
            for(var i, l, o=t;
            o&&!e.test(o.className);
            )o=o.parentNode;
            o&&(i=(o.className.match(e)||[, ""])[1].toLowerCase(), l=n.languages[i]),
            t.className=t.className.replace(e, "").replace(/\s+/g, " ")+" language-"+i,
            o=t.parentNode,
            /pre/i.test(o.nodeName)&&(o.className=o.className.replace(e, "").replace(/\s+/g, " ")+" language-"+i);
            var s=t.textContent,
            u= {
                element: t, language: i, grammar: l, code: s
            }
            ;
            if(n.hooks.run("before-sanity-check", u), !u.code||!u.grammar)return u.code&&(u.element.textContent=u.code),
            n.hooks.run("complete", u),
            void 0;
            if(n.hooks.run("before-highlight", u), a&&_self.Worker) {
                var g=new Worker(n.filename);
                g.onmessage=function(e) {
                    u.highlightedCode=e.data,
                    n.hooks.run("before-insert", u),
                    u.element.innerHTML=u.highlightedCode,
                    r&&r.call(u.element),
                    n.hooks.run("after-highlight", u),
                    n.hooks.run("complete", u)
                }
                ,
                g.postMessage(JSON.stringify( {
                    language: u.language, code: u.code, immediateClose: !0
                }
                ))
            }
            else u.highlightedCode=n.highlight(u.code, u.grammar, u.language),
            n.hooks.run("before-insert", u),
            u.element.innerHTML=u.highlightedCode,
            r&&r.call(t),
            n.hooks.run("after-highlight", u),
            n.hooks.run("complete", u)
        }
        ,
        highlight:function(e, t, r) {
            var i=n.tokenize(e, t);
            return a.stringify(n.util.encode(i), r)
        }
        ,
        tokenize:function(e, t) {
            var a=n.Token,
            r=[e],
            i=t.rest;
            if(i) {
                for(var l in i)t[l]=i[l];
                delete t.rest
            }
            e:for(var l in t)if(t.hasOwnProperty(l)&&t[l]) {
                var o=t[l];
                o="Array"===n.util.type(o)?o: [o];
                for(var s=0;
                s<o.length;
                ++s) {
                    var u=o[s],
                    g=u.inside,
                    c=!!u.lookbehind,
                    h=!!u.greedy,
                    f=0,
                    d=u.alias;
                    if(h&&!u.pattern.global) {
                        var p=u.pattern.toString().match(/[imuy]*$/)[0];
                        u.pattern=RegExp(u.pattern.source, p+"g")
                    }
                    u=u.pattern||u;
                    for(var m=0, y=0;
                    m<r.length;
                    y+=r[m].length, ++m) {
                        var v=r[m];
                        if(r.length>e.length)break e;
                        if(!(v instanceof a)) {
                            u.lastIndex=0;
                            var b=u.exec(v),
                            k=1;
                            if(!b&&h&&m!=r.length-1) {
                                if(u.lastIndex=y, b=u.exec(e), !b)break;
                                for(var w=b.index+(c?b[1].length: 0), _=b.index+b[0].length, A=m, P=y, j=r.length;
                                j>A&&_>P;
                                ++A)P+=r[A].length,
                                w>=P&&(++m, y=P);
                                if(r[m]instanceof a||r[A-1].greedy)continue;
                                k=A-m,
                                v=e.slice(y, P),
                                b.index-=y
                            }
                            if(b) {
                                c&&(f=b[1].length);
                                var w=b.index+f,
                                b=b[0].slice(f),
                                _=w+b.length,
                                x=v.slice(0, w),
                                O=v.slice(_),
                                S=[m,
                                k];
                                x&&S.push(x);
                                var N=new a(l, g?n.tokenize(b, g): b, d, b, h);
                                S.push(N),
                                O&&S.push(O),
                                Array.prototype.splice.apply(r, S)
                            }
                        }
                    }
                }
            }
            return r
        }
        ,
        hooks: {
            all: {}
            ,
            add:function(e, t) {
                var a=n.hooks.all;
                a[e]=a[e]||[],
                a[e].push(t)
            }
            ,
            run:function(e, t) {
                var a=n.hooks.all[e];
                if(a&&a.length)for(var r, i=0;
                r=a[i++];
                )r(t)
            }
        }
    }
    ,
    a=n.Token=function(e, t, n, a, r) {
        this.type=e,
        this.content=t,
        this.alias=n,
        this.length=0|(a||"").length,
        this.greedy=!!r
    }
    ;
    if(a.stringify=function(e, t, r) {
        if("string"==typeof e)return e;
        if("Array"===n.util.type(e))return e.map(function(n) {
            return a.stringify(n, t, e)
        }
        ).join("");
        var i= {
            type:e.type, content:a.stringify(e.content, t, r), tag:"span", classes:["token", e.type], attributes: {}
            , language: t, parent: r
        }
        ;
        if("comment"==i.type&&(i.attributes.spellcheck="true"), e.alias) {
            var l="Array"===n.util.type(e.alias)?e.alias: [e.alias];
            Array.prototype.push.apply(i.classes, l)
        }
        n.hooks.run("wrap", i);
        var o=Object.keys(i.attributes).map(function(e) {
            return e+'="'+(i.attributes[e]||"").replace(/"/g,"&quot;
            ")+'"'}).join(" ");return"<"+i.tag+' class="'+i.classes.join(" ")+'"'+(o?" "+o:"")+">"+i.content+"</"+i.tag+">"},!_self.document)return _self.addEventListener?(_self.addEventListener("message",function(e){var t=JSON.parse(e.data),a=t.language,r=t.code,i=t.immediateClose;_self.postMessage(n.highlight(r,n.languages[a],a)),i&&_self.close()},!1),_self.Prism):_self.Prism;var r=document.currentScript||[].slice.call(document.getElementsByTagName("script")).pop();return r&&(n.filename=r.src,document.addEventListener&&!r.hasAttribute("data-manual")&&("loading"!==document.readyState?window.requestAnimationFrame?window.requestAnimationFrame(n.highlightAll):window.setTimeout(n.highlightAll,16):document.addEventListener("DOMContentLoaded",n.highlightAll))),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
 Prism.languages.markup= {
                comment:/<!--[\w\W]*?-->/, prolog:/<\?[\w\W]+?\?>/, doctype:/<!DOCTYPE[\w\W]+?>/i, cdata:/<!\[CDATA\[[\w\W]*?]]>/i, tag: {
                    pattern:/<\/?(?!\d)[^\s>\/=$<]+(?: \s+[^\s>\/=]+(?: =(?: ("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i, inside: {
                        tag: {
                            pattern:/^<\/?[^\s>\/]+/i, inside: {
                                punctuation: /^<\/?/, namespace: /^[^\s>\/: ]+: /
                            }
                        }
                        , "attr-value": {
                            pattern:/=(?: ('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/
                        }
                    }
                    , punctuation:/\/?>/, "attr-name": {
                        pattern:/[^\s>\/]+/, inside: {
                            namespace: /^[^\s>\/: ]+: /
                        }
                    }
                }
            }
            , entity:/&#?[\da-z] {
                1, 8
            }
            ;
            /i
        }
        , Prism.hooks.add("wrap", function(a) {
            "entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;
            /, "&"))
        }
        ), Prism.languages.xml=Prism.languages.markup, Prism.languages.html=Prism.languages.markup, Prism.languages.mathml=Prism.languages.markup, Prism.languages.svg=Prism.languages.markup;
        Prism.languages.css= {
            comment:/\/\*[\w\W]*?\*\ //,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:{pattern:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,greedy:!0},property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,"function":/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},Prism.languages.css.atrule.inside.rest=Prism.util.clone(Prism.languages.css),Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,lookbehind:!0,inside:Prism.languages.css,alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));
            Prism.languages.clike= {
                comment:[ {
                    pattern: /(^|[^\\])\/\*[\w\W]*?\*\ //,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:{pattern:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,"boolean":/\b(true|false)\b/,"function":/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};
                    Prism.languages.javascript=Prism.languages.extend("clike", {
                        keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/, number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/, "function":/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i, operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\. {
                            3
                        }
                        /
                    }
                    ), Prism.languages.insertBefore("javascript", "keyword", {
                        regex: {
                            pattern:/(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu] {
                                0, 5
                            }
                            (?=\s*($|[\r\n, .;
                        }
                        )]))/, lookbehind:!0, greedy:!0
                    }
                }
                ), Prism.languages.insertBefore("javascript", "string", {
                    "template-string": {
                        pattern:/`(?: \\\\|\\?[^\\])*?`/, greedy:!0, inside: {
                            interpolation: {
                                pattern:/\$\ {
                                    [^
                                }
                                ]+\
                            }
                            /, inside: {
                                "interpolation-punctuation": {
                                    pattern:/^\$\ {
                                        |\
                                    }
                                    $/, alias:"punctuation"
                                }
                                , rest:Prism.languages.javascript
                            }
                        }
                        , string:/[\s\S]+/
                    }
                }
            }
            ), Prism.languages.markup&&Prism.languages.insertBefore("markup", "tag", {
                script: {
                    pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i, lookbehind: !0, inside: Prism.languages.javascript, alias: "language-javascript"
                }
            }
            ), Prism.languages.js=Prism.languages.javascript;
            !function(e) {
                var t= {
                    variable:[ {
                        pattern:/\$?\(\([\w\W]+?\)\)/, inside: {
                            variable:[ {
                                pattern: /(^\$\(\([\w\W]+)\)\)/, lookbehind: !0
                            }
                            , /^\$\(\(/], number:/\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/, operator:/--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/, punctuation:/\(\(?|\)\)?|, |;
                            /
                        }
                    }
                    , {
                        pattern: /\$\([^)]+\)|`[^`]+`/, inside: {
                            variable: /^\$\(|^`|\)$|`$/
                        }
                    }
                    , /\$(?:[a-z0-9_#\?\*!@]+|\ {
                        [^
                    }
                    ]+\
                }
                )/i]
            }
            ;
            e.languages.bash= {
                shebang: {
                    pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: "important"
                }
                , comment: {
                    pattern:/(^|[^"{\\])#.*/,lookbehind:!0},string:[{pattern:/((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?: [\s\S])*?\r?\n\2/g, lookbehind: !0, greedy: !0, inside: t
                }
                , {
                    pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g,greedy:!0,inside:t}],variable:t.variable,"function":{pattern:/(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,lookbehind:!0},keyword:{pattern:/(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,lookbehind:!0},"boolean":{pattern:/(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,lookbehind:!0},operator:/&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];]/};var a=t.variable[1].inside;a["function"]=e.languages.bash["function"],a.keyword=e.languages.bash.keyword,a.boolean=e.languages.bash.boolean,a.operator=e.languages.bash.operator,a.punctuation=e.languages.bash.punctuation}(Prism);
 Prism.languages.git= {
                        comment:/^#.*/m, deleted:/^[-–].*/m, inserted:/^\+.*/m, string:/("|')(\\?.)*?\1/m,command:{pattern:/^.*\$ git .*$/m,inside:{parameter:/\s(--|-)\w+/m}},coord:/^@@.*@@$/m,commit_sha1:/^commit \w{40}$/m};
 Prism.languages.go=Prism.languages.extend("clike", {
                            keyword: /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/, builtin: /\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/, "boolean": /\b(_|iota|nil|true|false)\b/, operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?: =|&|\^=?)?|>(?: >=?|=)?|<(?: <=?|=|-)?|: =|\.\.\./, number: /\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/i, string: /("|'|`)(\\?.|\r|\n)*?\1/}),delete Prism.languages.go["class-name"];
 !function(e) {
                                var a=/\ {
                                    \ {
                                        \ {
                                            [\w\W]+?\
                                        }
                                        \
                                    }
                                    \
                                }
                                |\ {
                                    \ {
                                        [\w\W]+?\
                                    }
                                    \
                                }
                                /g;
                                e.languages.handlebars=e.languages.extend("markup", {
                                    handlebars: {
                                        pattern:a, inside: {
                                            delimiter: {
                                                pattern:/^\ {
                                                    \ {
                                                        \ {
                                                            ?|\
                                                        }
                                                        \
                                                    }
                                                    \
                                                }
                                                ?$/i, alias:"punctuation"
                                            }
                                            , string:/(["'])(\\?.)*?\1/,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/,"boolean":/\b(true|false)\b/,block:{pattern:/^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,lookbehind:!0,alias:"keyword"},brackets:{pattern:/\[[^\]]+\]/,inside:{punctuation:/\[|\]/,variable:/[\w\W]+/}},punctuation:/[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,variable:/[^!"#%&'()*+, .\/;
                                            <=>@\[\\\]^` {
                                                |
                                            }
                                            ~\s]+/
                                        }
                                    }
                                }
                                ), e.languages.insertBefore("handlebars", "tag", {
                                    "handlebars-comment": {
                                        pattern:/\ {
                                            \ {
                                                ![\w\W]*?\
                                            }
                                            \
                                        }
                                        /, alias:["handlebars", "comment"]
                                    }
                                }
                                ), e.hooks.add("before-highlight", function(e) {
                                    "handlebars"===e.language&&(e.tokenStack=[], e.backupCode=e.code, e.code=e.code.replace(a, function(a) {
                                        return e.tokenStack.push(a), "___HANDLEBARS"+e.tokenStack.length+"___"
                                    }
                                    ))
                                }
                                ), e.hooks.add("before-insert", function(e) {
                                    "handlebars"===e.language&&(e.code=e.backupCode, delete e.backupCode)
                                }
                                ), e.hooks.add("after-highlight", function(a) {
                                    if("handlebars"===a.language) {
                                        for(var n, t=0;
                                        n=a.tokenStack[t];
                                        t++)a.highlightedCode=a.highlightedCode.replace("___HANDLEBARS"+(t+1)+"___", e.highlight(n, a.grammar, "handlebars").replace(/\$/g, "$$$$"));
                                        a.element.innerHTML=a.highlightedCode
                                    }
                                }
                                )
                            }
                            (Prism);
                            !function(e) {
                                e.languages.jade= {
                                    comment: {
                                        pattern: /(^([\t]*))\/\/.*((?: \r?\n|\r)\2[\t]+.+)*/m, lookbehind: !0
                                    }
                                    , "multiline-script": {
                                        pattern:/(^([\t]*)script\b.*\.[\t]*)((?: \r?\n|\r(?!\n))(?: \2[\t]+.+|\s*?(?=\r?\n|\r)))+/m, lookbehind:!0, inside: {
                                            rest: e.languages.javascript
                                        }
                                    }
                                    , filter: {
                                        pattern:/(^([\t]*)):.+((?: \r?\n|\r(?!\n))(?: \2[\t]+.+|\s*?(?=\r?\n|\r)))+/m, lookbehind:!0, inside: {
                                            "filter-name": {
                                                pattern: /^: [\w-]+/, alias: "variable"
                                            }
                                        }
                                    }
                                    , "multiline-plain-text": {
                                        pattern: /(^([\t]*)[\w\-#.]+\.[\t]*)((?: \r?\n|\r(?!\n))(?: \2[\t]+.+|\s*?(?=\r?\n|\r)))+/m, lookbehind: !0
                                    }
                                    , markup: {
                                        pattern:/(^[\t]*)<.+/m, lookbehind:!0, inside: {
                                            rest: e.languages.markup
                                        }
                                    }
                                    , doctype: {
                                        pattern: /((?: ^|\n)[\t]*)doctype(?: .+)?/, lookbehind: !0
                                    }
                                    , "flow-control": {
                                        pattern:/(^[\t]*)(?: if|unless|else|case|when|default|each|while)\b(?: .+)?/m, lookbehind:!0, inside: {
                                            each: {
                                                pattern:/^each .+? in\b/, inside: {
                                                    keyword: /\b(?: each|in)\b/, punctuation: /, /
                                                }
                                            }
                                            , branch: {
                                                pattern: /^(?: if|unless|else|case|when|default|while)\b/, alias: "keyword"
                                            }
                                            , rest:e.languages.javascript
                                        }
                                    }
                                    , keyword: {
                                        pattern: /(^[\t]*)(?: block|extends|include|append|prepend)\b.+/m, lookbehind: !0
                                    }
                                    , mixin:[ {
                                        pattern:/(^[\t]*)mixin .+/m, lookbehind:!0, inside: {
                                            keyword: /^mixin/, "function": /\w+(?=\s*\(|\s*$)/, punctuation: /[(), .]/
                                        }
                                    }
                                    , {
                                        pattern:/(^[\t]*)\+.+/m, lookbehind:!0, inside: {
                                            name: {
                                                pattern: /^\+\w+/, alias: "function"
                                            }
                                            , rest:e.languages.javascript
                                        }
                                    }
                                    ], script: {
                                        pattern:/(^[\t]*script(?: (?: &[^(]+)?\([^)]+\))*[\t]+).+/m, lookbehind:!0, inside: {
                                            rest: e.languages.javascript
                                        }
                                    }
                                    , "plain-text": {
                                        pattern: /(^[\t]*(?!-)[\w\-#.]*[\w\-](?: (?: &[^(]+)?\([^)]+\))*\/?[\t]+).+/m, lookbehind: !0
                                    }
                                    , tag: {
                                        pattern:/(^[\t]*)(?!-)[\w\-#.]*[\w\-](?: (?: &[^(]+)?\([^)]+\))*\/?:?/m, lookbehind:!0, inside: {
                                            attributes:[ {
                                                pattern:/&[^(]+\([^)]+\)/, inside: {
                                                    rest: e.languages.javascript
                                                }
                                            }
                                            , {
                                                pattern: /\([^)]+\)/, inside: {
                                                    "attr-value": {
                                                        pattern:/(=\s*)(?:\ {
                                                            [^
                                                        }
                                                        ]*\
                                                    }
                                                    |[^, )\r\n]+)/, lookbehind:!0, inside: {
                                                        rest: e.languages.javascript
                                                    }
                                                }
                                                , "attr-name":/[\w-]+(?=\s*!?=|\s*[, )])/, punctuation:/[!=(), ]+/
                                            }
                                        }
                                        ], punctuation:/:/
                                    }
                                }
                                , code:[ {
                                    pattern:/(^[\t]*(?: -|!?=)).+/m, lookbehind:!0, inside: {
                                        rest: e.languages.javascript
                                    }
                                }
                                ], punctuation:/[.\-!=|]+/
                            }
                            ;
                            for(var t="(^([\\t ]*)):{{filter_name}}((?:\\r?\\n|\\r(?!\\n))(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+", n=[ {
                                filter: "atpl", language: "twig"
                            }
                            , {
                                filter: "coffee", language: "coffeescript"
                            }
                            , "ejs", "handlebars", "hogan", "less", "livescript", "markdown", "mustache", "plates", {
                                filter: "sass", language: "scss"
                            }
                            , "stylus", "swig"], a= {}
                            , i=0, r=n.length;
                            r>i;
                            i++) {
                                var s=n[i];
                                s="string"==typeof s? {
                                    filter: s, language: s
                                }
                                :s, e.languages[s.language]&&(a["filter-"+s.filter]= {
                                    pattern:RegExp(t.replace("{{filter_name}}", s.filter), "m"), lookbehind:!0, inside: {
                                        "filter-name": {
                                            pattern: /^: [\w-]+/, alias: "variable"
                                        }
                                        , rest:e.languages[s.language]
                                    }
                                }
                                )
                            }
                            e.languages.insertBefore("jade", "filter", a)
                        }
                        (Prism);
                        Prism.languages.json= {
                            property:/"(?:\\.|[^|"])*"(?=\s*:)/gi,string:/"(?!: )(?: \\.|[^|"])*"(?!: )/g, number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g, punctuation:/[ {}
                            [\]);
                            , ]/g, operator: /: /g, "boolean": /\b(true|false)\b/gi, "null": /\bnull\b/gi
                        }
                        , Prism.languages.jsonp=Prism.languages.json;
                        Prism.languages.markdown=Prism.languages.extend("markup", {}
                        ), Prism.languages.insertBefore("markdown", "prolog", {
                            blockquote: {
                                pattern: /^>(?: [\t]*>)*/m, alias: "punctuation"
                            }
                            , code:[ {
                                pattern:/^(?: {
                                    4
                                }
                                |\t).+/m, alias:"keyword"
                            }
                            , {
                                pattern: /``.+?``|`[^`\n]+`/, alias: "keyword"
                            }
                            ], title:[ {
                                pattern:/\w+.*(?: \r?\n|\r)(?: ==+|--+)/, alias:"important", inside: {
                                    punctuation: /==+$|--+$/
                                }
                            }
                            , {
                                pattern:/(^\s*)#+.+/m, lookbehind:!0, alias:"important", inside: {
                                    punctuation: /^#+|#+$/
                                }
                            }
                            ], hr: {
                                pattern:/(^\s*)([*-])([\t]*\2) {
                                    2,
                                }
                                (?=\s*$)/m, lookbehind:!0, alias:"punctuation"
                            }
                            , list: {
                                pattern: /(^\s*)(?: [*+-]|\d+\.)(?=[\t].)/m, lookbehind: !0, alias: "punctuation"
                            }
                            , "url-reference": {
                                pattern: /!?\[[^\]]+\]: [\t]+(?: \S+|<(?: \\.|[^>\\])+>)(?: [\t]+(?: "(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?: \\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold);
 Prism.languages.nginx=Prism.languages.extend("clike", {
                                    comment: {
                                        pattern:/(^|[^"{\\])#.*/,lookbehind:!0},keyword:/\b(?:CONTENT_|DOCUMENT_|GATEWAY_|HTTP_|HTTPS|if_not_empty|PATH_|QUERY_|REDIRECT_|REMOTE_|REQUEST_|SCGI|SCRIPT_|SERVER_|http|server|events|location|include|accept_mutex|accept_mutex_delay|access_log|add_after_body|add_before_body|add_header|addition_types|aio|alias|allow|ancient_browser|ancient_browser_value|auth|auth_basic|auth_basic_user_file|auth_http|auth_http_header|auth_http_timeout|autoindex|autoindex_exact_size|autoindex_localtime|break|charset|charset_map|charset_types|chunked_transfer_encoding|client_body_buffer_size|client_body_in_file_only|client_body_in_single_buffer|client_body_temp_path|client_body_timeout|client_header_buffer_size|client_header_timeout|client_max_body_size|connection_pool_size|create_full_put_path|daemon|dav_access|dav_methods|debug_connection|debug_points|default_type|deny|devpoll_changes|devpoll_events|directio|directio_alignment|disable_symlinks|empty_gif|env|epoll_events|error_log|error_page|expires|fastcgi_buffer_size|fastcgi_buffers|fastcgi_busy_buffers_size|fastcgi_cache|fastcgi_cache_bypass|fastcgi_cache_key|fastcgi_cache_lock|fastcgi_cache_lock_timeout|fastcgi_cache_methods|fastcgi_cache_min_uses|fastcgi_cache_path|fastcgi_cache_purge|fastcgi_cache_use_stale|fastcgi_cache_valid|fastcgi_connect_timeout|fastcgi_hide_header|fastcgi_ignore_client_abort|fastcgi_ignore_headers|fastcgi_index|fastcgi_intercept_errors|fastcgi_keep_conn|fastcgi_max_temp_file_size|fastcgi_next_upstream|fastcgi_no_cache|fastcgi_param|fastcgi_pass|fastcgi_pass_header|fastcgi_read_timeout|fastcgi_redirect_errors|fastcgi_send_timeout|fastcgi_split_path_info|fastcgi_store|fastcgi_store_access|fastcgi_temp_file_write_size|fastcgi_temp_path|flv|geo|geoip_city|geoip_country|google_perftools_profiles|gzip|gzip_buffers|gzip_comp_level|gzip_disable|gzip_http_version|gzip_min_length|gzip_proxied|gzip_static|gzip_types|gzip_vary|if|if_modified_since|ignore_invalid_headers|image_filter|image_filter_buffer|image_filter_jpeg_quality|image_filter_sharpen|image_filter_transparency|imap_capabilities|imap_client_buffer|include|index|internal|ip_hash|keepalive|keepalive_disable|keepalive_requests|keepalive_timeout|kqueue_changes|kqueue_events|large_client_header_buffers|limit_conn|limit_conn_log_level|limit_conn_zone|limit_except|limit_rate|limit_rate_after|limit_req|limit_req_log_level|limit_req_zone|limit_zone|lingering_close|lingering_time|lingering_timeout|listen|location|lock_file|log_format|log_format_combined|log_not_found|log_subrequest|map|map_hash_bucket_size|map_hash_max_size|master_process|max_ranges|memcached_buffer_size|memcached_connect_timeout|memcached_next_upstream|memcached_pass|memcached_read_timeout|memcached_send_timeout|merge_slashes|min_delete_depth|modern_browser|modern_browser_value|mp4|mp4_buffer_size|mp4_max_buffer_size|msie_padding|msie_refresh|multi_accept|open_file_cache|open_file_cache_errors|open_file_cache_min_uses|open_file_cache_valid|open_log_file_cache|optimize_server_names|override_charset|pcre_jit|perl|perl_modules|perl_require|perl_set|pid|pop3_auth|pop3_capabilities|port_in_redirect|post_action|postpone_output|protocol|proxy|proxy_buffer|proxy_buffer_size|proxy_buffering|proxy_buffers|proxy_busy_buffers_size|proxy_cache|proxy_cache_bypass|proxy_cache_key|proxy_cache_lock|proxy_cache_lock_timeout|proxy_cache_methods|proxy_cache_min_uses|proxy_cache_path|proxy_cache_use_stale|proxy_cache_valid|proxy_connect_timeout|proxy_cookie_domain|proxy_cookie_path|proxy_headers_hash_bucket_size|proxy_headers_hash_max_size|proxy_hide_header|proxy_http_version|proxy_ignore_client_abort|proxy_ignore_headers|proxy_intercept_errors|proxy_max_temp_file_size|proxy_method|proxy_next_upstream|proxy_no_cache|proxy_pass|proxy_pass_error_message|proxy_pass_header|proxy_pass_request_body|proxy_pass_request_headers|proxy_read_timeout|proxy_redirect|proxy_redirect_errors|proxy_send_lowat|proxy_send_timeout|proxy_set_body|proxy_set_header|proxy_ssl_session_reuse|proxy_store|proxy_store_access|proxy_temp_file_write_size|proxy_temp_path|proxy_timeout|proxy_upstream_fail_timeout|proxy_upstream_max_fails|random_index|read_ahead|real_ip_header|recursive_error_pages|request_pool_size|reset_timedout_connection|resolver|resolver_timeout|return|rewrite|root|rtsig_overflow_events|rtsig_overflow_test|rtsig_overflow_threshold|rtsig_signo|satisfy|satisfy_any|secure_link_secret|send_lowat|send_timeout|sendfile|sendfile_max_chunk|server|server_name|server_name_in_redirect|server_names_hash_bucket_size|server_names_hash_max_size|server_tokens|set|set_real_ip_from|smtp_auth|smtp_capabilities|so_keepalive|source_charset|split_clients|ssi|ssi_silent_errors|ssi_types|ssi_value_length|ssl|ssl_certificate|ssl_certificate_key|ssl_ciphers|ssl_client_certificate|ssl_crl|ssl_dhparam|ssl_engine|ssl_prefer_server_ciphers|ssl_protocols|ssl_session_cache|ssl_session_timeout|ssl_verify_client|ssl_verify_depth|starttls|stub_status|sub_filter|sub_filter_once|sub_filter_types|tcp_nodelay|tcp_nopush|timeout|timer_resolution|try_files|types|types_hash_bucket_size|types_hash_max_size|underscores_in_headers|uninitialized_variable_warn|upstream|use|user|userid|userid_domain|userid_expires|userid_name|userid_p3p|userid_path|userid_service|valid_referers|variables_hash_bucket_size|variables_hash_max_size|worker_connections|worker_cpu_affinity|worker_priority|worker_processes|worker_rlimit_core|worker_rlimit_nofile|worker_rlimit_sigpending|working_directory|xclient|xml_entities|xslt_entities|xslt_stylesheet|xslt_types)\b/i}),Prism.languages.insertBefore("nginx","keyword",{variable:/\$[a-z_]+/i});
 Prism.languages.python= {
                                            "triple-quoted-string": {
                                                pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/, alias: "string"
                                            }
                                            , comment: {
                                                pattern: /(^|[^\\])#.*/, lookbehind: !0
                                            }
                                            , string: {
                                                pattern: /("|')(?:\\\\|\\?[^\\\r\n])*?\1/,greedy:!0},"function":{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)[a-z0-9_]+/i,lookbehind:!0},keyword:/\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,"boolean":/\b(?:True|False)\b/,number:/\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,operator:/[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,punctuation:/[{}[\];(),.:]/};
 !function(a) {
                                                    var e=a.util.clone(a.languages.javascript);
                                                    a.languages.jsx=a.languages.extend("markup", e), a.languages.jsx.tag.pattern=/<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\ {
                                                        [\w\W]*?\
                                                    }
                                                    )))?\s*)*\/?>/i, a.languages.jsx.tag.inside["attr-value"].pattern=/=[^\ {
                                                        ](?: ('|")[\w\W]*?(\1)|[^\s>]+)/i;var s=a.util.clone(a.languages.jsx);delete s.punctuation,s=a.languages.insertBefore("jsx","operator",{punctuation:/=(?={)|[{}[\];(),.:]/},{jsx:s}),a.languages.insertBefore("inside","attr-value",{script:{pattern:/=(\{(?:\{[^}]*\}|[^}])+\})/i,inside:s,alias:"language-javascript"}},a.languages.jsx.tag)}(Prism);
 !function(n) {
                                                            var t= {
                                                                url:/url\((["']?).*?\1\)/i,string:/("|')(?:[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,interpolation:null,func:null,important:/\B!(?:important|optional)\b/i,keyword:{pattern:/(^|\s+)(?:(?:if|else|for|return|unless)(?=\s+|$)|@[\w-]+)/,lookbehind:!0},hexcode:/#[\da-f]{3,6}/i,number:/\b\d+(?:\.\d+)?%?/,"boolean":/\b(?:true|false)\b/,operator:[/~|[+!\/%<>?=]=?|[-:]=|\*[*=]?|\.+|&&|\|\||\B-\B|\b(?:and|in|is(?: a| defined| not|nt)?|not|or)\b/],punctuation:/[{}()\[\];:,]/};t.interpolation={pattern:/\{[^\r\n}:]+\}/,alias:"variable",inside:n.util.clone(t)},t.func={pattern:/[\w-]+\([^)]*\).*/,inside:{"function":/^[^(]+/,rest:n.util.clone(t)}},n.languages.stylus={comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*)/,lookbehind:!0},"atrule-declaration":{pattern:/(^\s*)@.+/m,lookbehind:!0,inside:{atrule:/^@[\w-]+/,rest:t}},"variable-declaration":{pattern:/(^[ \t]*)[\w$-]+\s*.?=[ \t]*(?:(?:\{[^}]*\}|.+)|$)/m,lookbehind:!0,inside:{variable:/^\S+/,rest:t}},statement:{pattern:/(^[ \t]*)(?:if|else|for|return|unless)[ \t]+.+/m,lookbehind:!0,inside:{keyword:/^\S+/,rest:t}},"property-declaration":{pattern:/((?:^|\{)([ \t]*))(?:[\w-]|\{[^}\r\n]+\})+(?:\s*:\s*|[ \t]+)[^{\r\n]*(?:;|[^{\r\n,](?=$)(?!(\r?\n|\r)(?:\{|\2[ \t]+)))/m,lookbehind:!0,inside:{property:{pattern:/^[^\s:]+/,inside:{interpolation:t.interpolation}},rest:t}},selector:{pattern:/(^[ \t]*)(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)(?:(?:\r?\n|\r)(?:\1(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)))*(?:,$|\{|(?=(?:\r?\n|\r)(?:\{|\1[ \t]+)))/m,lookbehind:!0,inside:{interpolation:t.interpolation,punctuation:/[{},]/}},func:t.func,string:t.string,interpolation:t.interpolation,punctuation:/[{}()\[\];:.]/}}(Prism);