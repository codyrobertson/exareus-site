/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
    // Helper vars and functions.
    const extend = function(a, b) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    };

    // from http://www.quirksmode.org/js/events_properties.html#position
    const getMousePos = function(ev) {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
    };

    const TiltObj = function(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.DOM = {};
        this.DOM.img = this.el.querySelector('.content__img');
        this.DOM.title = this.el.querySelector('.content__title');
        this._initEvents();
    }

    TiltObj.prototype.options = {
        movement: {
            img: { translation: { x: -40, y: -40 } },
            title: { translation: { x: 20, y: 20 } },
        }
    };

    TiltObj.prototype._initEvents = function() {
        this.mouseenterFn = (ev) => {
            anime.remove(this.DOM.img);
            anime.remove(this.DOM.title);
        };

        this.mousemoveFn = (ev) => {
            requestAnimationFrame(() => this._layout(ev));
        };

        this.mouseleaveFn = (ev) => {
            requestAnimationFrame(() => {
                anime({
                    targets: [this.DOM.img, this.DOM.title],
                    duration: 1500,
                    easing: 'easeOutElastic',
                    elasticity: 400,
                    translateX: 0,
                    translateY: 0
                });
            });
        };

        this.el.addEventListener('mousemove', this.mousemoveFn);
        this.el.addEventListener('mouseleave', this.mouseleaveFn);
        this.el.addEventListener('mouseenter', this.mouseenterFn);
    };

    TiltObj.prototype._layout = function(ev) {
        // Mouse position relative to the document.
        const mousepos = getMousePos(ev);
        // Document scrolls.
        const docScrolls = { left: document.body.scrollLeft + document.documentElement.scrollLeft, top: document.body.scrollTop + document.documentElement.scrollTop };
        const bounds = this.el.getBoundingClientRect();
        // Mouse position relative to the main element (this.DOM.el).
        const relmousepos = { x: mousepos.x - bounds.left - docScrolls.left, y: mousepos.y - bounds.top - docScrolls.top };

        // Movement settings for the animatable elements.
        const t = {
            img: this.options.movement.img.translation,
            title: this.options.movement.title.translation,
        };

        const transforms = {
            img: {
                x: (-1 * t.img.x - t.img.x) / bounds.width * relmousepos.x + t.img.x,
                y: (-1 * t.img.y - t.img.y) / bounds.height * relmousepos.y + t.img.y
            },
            title: {
                x: (-1 * t.title.x - t.title.x) / bounds.width * relmousepos.x + t.title.x,
                y: (-1 * t.title.y - t.title.y) / bounds.height * relmousepos.y + t.title.y
            }
        };
        this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
        this.DOM.title.style.WebkitTransform = this.DOM.title.style.transform = 'translateX(' + transforms.title.x + 'px) translateY(' + transforms.title.y + 'px)';
    };

    const DOM = {};
    DOM.svg = document.querySelector('.morph');
    DOM.shapeEl = DOM.svg.querySelector('path');
    DOM.contentElems = Array.from(document.querySelectorAll('.content-wrap'));
    DOM.contentLinks = Array.from(document.querySelectorAll('.content__link'));
    DOM.footer = document.querySelector('.content--related');
    const contentElemsTotal = DOM.contentElems.length;
    const shapes = [{
            path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            scaleX: 1.7,
            scaleY: 1.9,
            rotate: 70,
            tx: 0,
            ty: -100,
            fill: {
                color: '#F5B243',
                duration: 500,
                easing: 'linear',
            },
            animation: {
                path: {
                    duration: 1000,
                    easing: 'easeInOutQuad',
                },
                svg: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        },
        {
            path: 'M 415.6,206.3 C 407.4,286.6 438.1,373.6 496.2,454.8 554.3,536.1 497,597.2 579.7,685.7 662.4,774.1 834.3,731.7 898.5,653.4 962.3,575 967.1,486 937.7,370 909.3,253.9 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
            pathAlt: 'M 415.6,206.3 C 407.4,286.6 415.5,381.7 473.6,462.9 531.7,544.2 482.5,637.6 579.7,685.7 676.9,733.8 826.2,710.7 890.4,632.4 954.2,554 926.8,487.6 937.7,370 948.6,252.4 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
            scaleX: 1.9,
            scaleY: 1,
            rotate: 0,
            tx: 0,
            ty: 100,
            fill: {
                color: '#D34295',
                duration: 500,
                easing: 'linear'
            },
            animation: {
                path: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                },
                svg: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        },
        {
            path: 'M 383.8,163.4 C 335.8,352.3 591.6,317.1 608.7,420.8 625.8,524.5 580.5,626 647.3,688 714,750 837.1,760.5 940.9,661.5 1044,562.3 1041,455.8 975.8,393.6 909.8,331.5 854.2,365.4 784.4,328.1 714.6,290.8 771.9,245.2 733.1,132.4 694.2,19.52 431.9,-25.48 383.8,163.4 Z',
            pathAlt: 'M 383.8,163.4 C 345.5,324.9 591.6,317.1 608.7,420.8 625.8,524.5 595.1,597 647.3,688 699.5,779 837.1,760.5 940.9,661.5 1044,562.3 1068,444.4 975.8,393.6 884,342.8 854.2,365.4 784.4,328.1 714.6,290.8 820.3,237.2 733.1,132.4 645.9,27.62 422.1,1.919 383.8,163.4 Z',
            scaleX: 1.9,
            scaleY: 1.1,
            rotate: 40,
            tx: -100,
            ty: 200,
            fill: {
                color: '#F27B46',
                duration: 500,
                easing: 'linear'
            },
            animation: {
                path: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                },
                svg: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        },
        {
            path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            scaleX: 1.5,
            scaleY: 2,
            rotate: -20,
            tx: 0,
            ty: -50,
            fill: {
                color: '#7642BB',
                duration: 500,
                easing: 'linear'
            },
            animation: {
                path: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                },
                svg: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        },
        {
            path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
            scaleX: 1.3,
            scaleY: 1,
            rotate: -70,
            tx: 0,
            ty: 150,
            fill: {
                color: '#D34295',
                duration: 500,
                easing: 'linear'
            },
            animation: {
                path: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                },
                svg: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        },
        {
            path: 'M 415.6,206.3 C 407.4,286.6 438.1,373.6 496.2,454.8 554.3,536.1 497,597.2 579.7,685.7 662.4,774.1 834.3,731.7 898.5,653.4 962.3,575 967.1,486 937.7,370 909.3,253.9 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
            pathAlt: 'M 415.6,206.3 C 407.4,286.6 415.5,381.7 473.6,462.9 531.7,544.2 482.5,637.6 579.7,685.7 676.9,733.8 826.2,710.7 890.4,632.4 954.2,554 926.8,487.6 937.7,370 948.6,252.4 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
            scaleX: 2,
            scaleY: 1,
            rotate: 0,
            tx: 0,
            ty: 100,
            fill: {
                color: '#44C5AF',
                duration: 500,
                easing: 'linear'
            },
            animation: {
                path: {
                    duration: 2000,
                    easing: 'easeOutElastic',
                    elasticity: 400
                },
                svg: {
                    duration: 2000,
                    easing: 'easeOutQuad'
                }
            }
        }
    ];
    let step;

    const initShapeLoop = function(pos) {
        pos = pos || 0;
        anime.remove(DOM.shapeEl);
        anime({
            targets: DOM.shapeEl,
            easing: 'linear',
            d: [{ value: shapes[pos].pathAlt, duration: 1500 }, { value: shapes[pos].path, duration: 1500 }],
            loop: true,
            fill: {
                value: shapes[pos].fill.color,
                duration: shapes[pos].fill.duration,
                easing: shapes[pos].fill.easing
            },
            direction: 'alternate'
        });
    };

    const initShapeEl = function() {
        anime.remove(DOM.svg);
        anime({
            targets: DOM.svg,
            duration: 1,
            easing: 'linear',
            scaleX: shapes[0].scaleX,
            scaleY: shapes[0].scaleY,
            translateX: shapes[0].tx + 'px',
            translateY: shapes[0].ty + 'px',
            rotate: shapes[0].rotate + 'deg'
        });

        initShapeLoop();
    };

    const createScrollWatchers = function() {
        DOM.contentElems.forEach((el, pos) => {
            const scrollElemToWatch = pos ? DOM.contentElems[pos] : DOM.footer;
            pos = pos ? pos : contentElemsTotal;
            const watcher = scrollMonitor.create(scrollElemToWatch, -350);

            watcher.enterViewport(function() {
                step = pos;
                anime.remove(DOM.shapeEl);
                anime({
                    targets: DOM.shapeEl,
                    duration: shapes[pos].animation.path.duration,
                    easing: shapes[pos].animation.path.easing,
                    elasticity: shapes[pos].animation.path.elasticity || 0,
                    d: shapes[pos].path,
                    fill: {
                        value: shapes[pos].fill.color,
                        duration: shapes[pos].fill.duration,
                        easing: shapes[pos].fill.easing
                    },
                    complete: function() {
                        initShapeLoop(pos);
                    }
                });

                anime.remove(DOM.svg);
                anime({
                    targets: DOM.svg,
                    duration: shapes[pos].animation.svg.duration,
                    easing: shapes[pos].animation.svg.easing,
                    elasticity: shapes[pos].animation.svg.elasticity || 0,
                    scaleX: shapes[pos].scaleX,
                    scaleY: shapes[pos].scaleY,
                    translateX: shapes[pos].tx + 'px',
                    translateY: shapes[pos].ty + 'px',
                    rotate: shapes[pos].rotate + 'deg'
                });
            });

            watcher.exitViewport(function() {
                const idx = !watcher.isAboveViewport ? pos - 1 : pos + 1;

                if (idx <= contentElemsTotal && step !== idx) {
                    step = idx;
                    anime.remove(DOM.shapeEl);
                    anime({
                        targets: DOM.shapeEl,
                        duration: shapes[idx].animation.path.duration,
                        easing: shapes[idx].animation.path.easing,
                        elasticity: shapes[idx].animation.path.elasticity || 0,
                        d: shapes[idx].path,
                        fill: {
                            value: shapes[idx].fill.color,
                            duration: shapes[idx].fill.duration,
                            easing: shapes[idx].fill.easing
                        },
                        complete: function() {
                            initShapeLoop(idx);
                        }
                    });

                    anime.remove(DOM.svg);
                    anime({
                        targets: DOM.svg,
                        duration: shapes[idx].animation.svg.duration,
                        easing: shapes[idx].animation.svg.easing,
                        elasticity: shapes[idx].animation.svg.elasticity || 0,
                        scaleX: shapes[idx].scaleX,
                        scaleY: shapes[idx].scaleY,
                        translateX: shapes[idx].tx + 'px',
                        translateY: shapes[idx].ty + 'px',
                        rotate: shapes[idx].rotate + 'deg'
                    });
                }
            });
        });
    };

    const init = function() {
        imagesLoaded(document.body, () => {
            initShapeEl();
            createScrollWatchers();
            Array.from(document.querySelectorAll('.content--layout')).forEach(el => new TiltObj(el));
            // Remove loading class from body
            document.body.classList.remove('loading');
        });
    }

    init();

    var lineDrawing = anime({
        targets: '#i-heart .inline path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: function(el, i) { return i * 250 },
        direction: 'alternate',
        loop: true
    });

};

/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-MessageChannel-appearance-backgroundblendmode-backgroundcliptext-bgrepeatspace_bgrepeatround-bgsizecover-canvas-canvasblending-canvastext-canvaswinding-checked-contenteditable-contextmenu-cors-cssanimations-csscalc-csscolumns-cssescape-cssgradients-csshyphens_softhyphens_softhyphensfind-cssmask-csspointerevents-csspositionsticky-csspseudoanimations-csspseudotransitions-cssreflections-cssremunit-cssresize-cubicbezierrange-customevent-dataview-ellipsis-emoji-eventlistener-fontface-fullscreen-generatedcontent-geolocation-hairline-history-hsla-htmlimports-ie8compat-input-inputtypes-json-ligatures-mediaqueries-multiplebgs-notification-nthchild-objectfit-opacity-overflowscrolling-pagevisibility-queryselector-regions-rgba-scrollsnappoints-shapes-subpixelfont-supports-svg-target-textalignlast-textshadow-touchevents-userselect-xdomainrequest-addtest-atrule-domprefixes-hasevent-mq-prefixed-prefixedcss-prefixedcssvalue-prefixes-printshiv-setclasses-testallprops-testprop-teststyles !*/
! function(e, t, n) {
    function i(e, t) { return typeof e === t }

    function r() {
        var e, t, n, r, o, a, s;
        for (var l in T)
            if (T.hasOwnProperty(l)) {
                if (e = [], t = T[l], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                    for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
                for (r = i(t.fn, "function") ? t.fn() : t.fn, o = 0; o < e.length; o++) a = e[o], s = a.split("."), 1 === s.length ? Modernizr[s[0]] = r : (!Modernizr[s[0]] || Modernizr[s[0]] instanceof Boolean || (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])), Modernizr[s[0]][s[1]] = r), x.push((r ? "" : "no-") + s.join("-"))
            }
    }

    function o(e) {
        var t = z.className,
            n = Modernizr._config.classPrefix || "";
        if (_ && (t = t.baseVal), Modernizr._config.enableJSClass) {
            var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
            t = t.replace(i, "$1" + n + "js$2")
        }
        Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n), _ ? z.className.baseVal = t : z.className = t)
    }

    function a(e, t) {
        if ("object" == typeof e)
            for (var n in e) R(e, n) && a(n, e[n]);
        else {
            e = e.toLowerCase();
            var i = e.split("."),
                r = Modernizr[i[0]];
            if (2 == i.length && (r = r[i[1]]), "undefined" != typeof r) return Modernizr;
            t = "function" == typeof t ? t() : t, 1 == i.length ? Modernizr[i[0]] = t : (!Modernizr[i[0]] || Modernizr[i[0]] instanceof Boolean || (Modernizr[i[0]] = new Boolean(Modernizr[i[0]])), Modernizr[i[0]][i[1]] = t), o([(t && 0 != t ? "" : "no-") + i.join("-")]), Modernizr._trigger(e, t)
        }
        return Modernizr
    }

    function s(e) { return e.replace(/([a-z])-([a-z])/g, function(e, t, n) { return t + n.toUpperCase() }).replace(/^-/, "") }

    function l() { return "function" != typeof t.createElement ? t.createElement(arguments[0]) : _ ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments) }

    function d(e, t) { return !!~("" + e).indexOf(t) }

    function u() { var e = t.body; return e || (e = l(_ ? "svg" : "body"), e.fake = !0), e }

    function c(e, n, i, r) {
        var o, a, s, d, c = "modernizr",
            f = l("div"),
            p = u();
        if (parseInt(i, 10))
            for (; i--;) s = l("div"), s.id = r ? r[i] : c + (i + 1), f.appendChild(s);
        return o = l("style"), o.type = "text/css", o.id = "s" + c, (p.fake ? p : f).appendChild(o), p.appendChild(f), o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(t.createTextNode(e)), f.id = c, p.fake && (p.style.background = "", p.style.overflow = "hidden", d = z.style.overflow, z.style.overflow = "hidden", z.appendChild(p)), a = n(f, e), p.fake ? (p.parentNode.removeChild(p), z.style.overflow = d, z.offsetHeight) : f.parentNode.removeChild(f), !!a
    }

    function f(e, t) { return function() { return e.apply(t, arguments) } }

    function p(e, t, n) {
        var r;
        for (var o in e)
            if (e[o] in t) return n === !1 ? e[o] : (r = t[e[o]], i(r, "function") ? f(r, n || t) : r);
        return !1
    }

    function m(e) { return e.replace(/([A-Z])/g, function(e, t) { return "-" + t.toLowerCase() }).replace(/^ms-/, "-ms-") }

    function h(t, n, i) {
        var r;
        if ("getComputedStyle" in e) {
            r = getComputedStyle.call(e, t, n);
            var o = e.console;
            if (null !== r) i && (r = r.getPropertyValue(i));
            else if (o) {
                var a = o.error ? "error" : "log";
                o[a].call(o, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
            }
        } else r = !n && t.currentStyle && t.currentStyle[i];
        return r
    }

    function g(t, i) {
        var r = t.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; r--;)
                if (e.CSS.supports(m(t[r]), i)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in e) { for (var o = []; r--;) o.push("(" + m(t[r]) + ":" + i + ")"); return o = o.join(" or "), c("@supports (" + o + ") { #modernizr { position: absolute; } }", function(e) { return "absolute" == h(e, null, "position") }) }
        return n
    }

    function v(e, t, r, o) {
        function a() { c && (delete $.style, delete $.modElem) }
        if (o = i(o, "undefined") ? !1 : o, !i(r, "undefined")) { var u = g(e, r); if (!i(u, "undefined")) return u }
        for (var c, f, p, m, h, v = ["modernizr", "tspan", "samp"]; !$.style && v.length;) c = !0, $.modElem = l(v.shift()), $.style = $.modElem.style;
        for (p = e.length, f = 0; p > f; f++)
            if (m = e[f], h = $.style[m], d(m, "-") && (m = s(m)), $.style[m] !== n) { if (o || i(r, "undefined")) return a(), "pfx" == t ? m : !0; try { $.style[m] = r } catch (y) {} if ($.style[m] != h) return a(), "pfx" == t ? m : !0 }
        return a(), !1
    }

    function y(e, t, n, r, o) {
        var a = e.charAt(0).toUpperCase() + e.slice(1),
            s = (e + " " + q.join(a + " ") + a).split(" ");
        return i(t, "string") || i(t, "undefined") ? v(s, t, r, o) : (s = (e + " " + N.join(a + " ") + a).split(" "), p(s, t, n))
    }

    function b(e, t, i) { return y(e, n, n, t, i) }
    var x = [],
        T = [],
        C = {
            _version: "3.5.0",
            _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
            _q: [],
            on: function(e, t) {
                var n = this;
                setTimeout(function() { t(n[e]) }, 0)
            },
            addTest: function(e, t, n) { T.push({ name: e, fn: t, options: n }) },
            addAsyncTest: function(e) { T.push({ name: null, fn: e }) }
        },
        Modernizr = function() {};
    Modernizr.prototype = C, Modernizr = new Modernizr, Modernizr.addTest("cors", "XMLHttpRequest" in e && "withCredentials" in new XMLHttpRequest), Modernizr.addTest("customevent", "CustomEvent" in e && "function" == typeof e.CustomEvent), Modernizr.addTest("dataview", "undefined" != typeof DataView && "getFloat64" in DataView.prototype), Modernizr.addTest("eventlistener", "addEventListener" in e), Modernizr.addTest("geolocation", "geolocation" in navigator), Modernizr.addTest("history", function() { var t = navigator.userAgent; return -1 === t.indexOf("Android 2.") && -1 === t.indexOf("Android 4.0") || -1 === t.indexOf("Mobile Safari") || -1 !== t.indexOf("Chrome") || -1 !== t.indexOf("Windows Phone") || "file:" === location.protocol ? e.history && "pushState" in e.history : !1 }), Modernizr.addTest("ie8compat", !e.addEventListener && !!t.documentMode && 7 === t.documentMode), Modernizr.addTest("json", "JSON" in e && "parse" in JSON && "stringify" in JSON), Modernizr.addTest("messagechannel", "MessageChannel" in e), Modernizr.addTest("notification", function() { if (!e.Notification || !e.Notification.requestPermission) return !1; if ("granted" === e.Notification.permission) return !0; try { new e.Notification("") } catch (t) { if ("TypeError" === t.name) return !1 } return !0 }), Modernizr.addTest("queryselector", "querySelector" in t && "querySelectorAll" in t), Modernizr.addTest("svg", !!t.createElementNS && !!t.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect), Modernizr.addTest("xdomainrequest", "XDomainRequest" in e);
    var S = e.CSS;
    Modernizr.addTest("cssescape", S ? "function" == typeof S.escape : !1);
    var k = "CSS" in e && "supports" in e.CSS,
        w = "supportsCSS" in e;
    Modernizr.addTest("supports", k || w), Modernizr.addTest("target", function() { var t = e.document; if (!("querySelectorAll" in t)) return !1; try { return t.querySelectorAll(":target"), !0 } catch (n) { return !1 } });
    var E = C._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    C._prefixes = E;
    var z = t.documentElement;
    Modernizr.addTest("contextmenu", "contextMenu" in z && "HTMLMenuItemElement" in e);
    var _ = "svg" === z.nodeName.toLowerCase();
    _ || ! function(e, t) {
        function n(e, t) {
            var n = e.createElement("p"),
                i = e.getElementsByTagName("head")[0] || e.documentElement;
            return n.innerHTML = "x<style>" + t + "</style>", i.insertBefore(n.lastChild, i.firstChild)
        }

        function i() { var e = k.elements; return "string" == typeof e ? e.split(" ") : e }

        function r(e, t) { var n = k.elements; "string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), k.elements = n + " " + e, d(t) }

        function o(e) { var t = S[e[T]]; return t || (t = {}, C++, e[T] = C, S[C] = t), t }

        function a(e, n, i) {
            if (n || (n = t), g) return n.createElement(e);
            i || (i = o(n));
            var r;
            return r = i.cache[e] ? i.cache[e].cloneNode() : x.test(e) ? (i.cache[e] = i.createElem(e)).cloneNode() : i.createElem(e), !r.canHaveChildren || b.test(e) || r.tagUrn ? r : i.frag.appendChild(r)
        }

        function s(e, n) {
            if (e || (e = t), g) return e.createDocumentFragment();
            n = n || o(e);
            for (var r = n.frag.cloneNode(), a = 0, s = i(), l = s.length; l > a; a++) r.createElement(s[a]);
            return r
        }

        function l(e, t) { t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) { return k.shivMethods ? a(n, e, t) : t.createElem(n) }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + i().join().replace(/[\w\-:]+/g, function(e) { return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")' }) + ");return n}")(k, t.frag) }

        function d(e) { e || (e = t); var i = o(e); return !k.shivCSS || h || i.hasCSS || (i.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), g || l(e, i), e }

        function u(e) { for (var t, n = e.getElementsByTagName("*"), r = n.length, o = RegExp("^(?:" + i().join("|") + ")$", "i"), a = []; r--;) t = n[r], o.test(t.nodeName) && a.push(t.applyElement(c(t))); return a }

        function c(e) { for (var t, n = e.attributes, i = n.length, r = e.ownerDocument.createElement(E + ":" + e.nodeName); i--;) t = n[i], t.specified && r.setAttribute(t.nodeName, t.nodeValue); return r.style.cssText = e.style.cssText, r }

        function f(e) { for (var t, n = e.split("{"), r = n.length, o = RegExp("(^|[\\s,>+~])(" + i().join("|") + ")(?=[[\\s,>+~#.:]|$)", "gi"), a = "$1" + E + "\\:$2"; r--;) t = n[r] = n[r].split("}"), t[t.length - 1] = t[t.length - 1].replace(o, a), n[r] = t.join("}"); return n.join("{") }

        function p(e) { for (var t = e.length; t--;) e[t].removeNode() }

        function m(e) {
            function t() { clearTimeout(a._removeSheetTimer), i && i.removeNode(!0), i = null }
            var i, r, a = o(e),
                s = e.namespaces,
                l = e.parentWindow;
            return !z || e.printShived ? e : ("undefined" == typeof s[E] && s.add(E), l.attachEvent("onbeforeprint", function() {
                t();
                for (var o, a, s, l = e.styleSheets, d = [], c = l.length, p = Array(c); c--;) p[c] = l[c];
                for (; s = p.pop();)
                    if (!s.disabled && w.test(s.media)) { try { o = s.imports, a = o.length } catch (m) { a = 0 } for (c = 0; a > c; c++) p.push(o[c]); try { d.push(s.cssText) } catch (m) {} }
                d = f(d.reverse().join("")), r = u(e), i = n(e, d)
            }), l.attachEvent("onafterprint", function() { p(r), clearTimeout(a._removeSheetTimer), a._removeSheetTimer = setTimeout(t, 500) }), e.printShived = !0, e)
        }
        var h, g, v = "3.7.3",
            y = e.html5 || {},
            b = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
            x = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
            T = "_html5shiv",
            C = 0,
            S = {};
        ! function() {
            try {
                var e = t.createElement("a");
                e.innerHTML = "<xyz></xyz>", h = "hidden" in e, g = 1 == e.childNodes.length || function() { t.createElement("a"); var e = t.createDocumentFragment(); return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement }()
            } catch (n) { h = !0, g = !0 }
        }();
        var k = { elements: y.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video", version: v, shivCSS: y.shivCSS !== !1, supportsUnknownElements: g, shivMethods: y.shivMethods !== !1, type: "default", shivDocument: d, createElement: a, createDocumentFragment: s, addElements: r };
        e.html5 = k, d(t);
        var w = /^$|\b(?:all|print)\b/,
            E = "html5shiv",
            z = !g && function() { var n = t.documentElement; return !("undefined" == typeof t.namespaces || "undefined" == typeof t.parentWindow || "undefined" == typeof n.applyElement || "undefined" == typeof n.removeNode || "undefined" == typeof e.attachEvent) }();
        k.type += " print", k.shivPrint = m, m(t), "object" == typeof module && module.exports && (module.exports = k)
    }("undefined" != typeof e ? e : this, t);
    var j = "Moz O ms Webkit",
        N = C._config.usePrefixes ? j.toLowerCase().split(" ") : [];
    C._domPrefixes = N;
    var R;
    ! function() {
        var e = {}.hasOwnProperty;
        R = i(e, "undefined") || i(e.call, "undefined") ? function(e, t) { return t in e && i(e.constructor.prototype[t], "undefined") } : function(t, n) { return e.call(t, n) }
    }(), C._l = {}, C.on = function(e, t) { this._l[e] || (this._l[e] = []), this._l[e].push(t), Modernizr.hasOwnProperty(e) && setTimeout(function() { Modernizr._trigger(e, Modernizr[e]) }, 0) }, C._trigger = function(e, t) {
        if (this._l[e]) {
            var n = this._l[e];
            setTimeout(function() { var e, i; for (e = 0; e < n.length; e++)(i = n[e])(t) }, 0), delete this._l[e]
        }
    }, Modernizr._q.push(function() { C.addTest = a });
    var q = C._config.usePrefixes ? j.split(" ") : [];
    C._cssomPrefixes = q;
    var M = function(t) {
        var i, r = E.length,
            o = e.CSSRule;
        if ("undefined" == typeof o) return n;
        if (!t) return !1;
        if (t = t.replace(/^@/, ""), i = t.replace(/-/g, "_").toUpperCase() + "_RULE", i in o) return "@" + t;
        for (var a = 0; r > a; a++) {
            var s = E[a],
                l = s.toUpperCase() + "_" + i;
            if (l in o) return "@-" + s.toLowerCase() + "-" + t
        }
        return !1
    };
    C.atRule = M, Modernizr.addTest("canvas", function() { var e = l("canvas"); return !(!e.getContext || !e.getContext("2d")) }), Modernizr.addTest("canvastext", function() { return Modernizr.canvas === !1 ? !1 : "function" == typeof l("canvas").getContext("2d").fillText }), Modernizr.addTest("contenteditable", function() { if ("contentEditable" in z) { var e = l("div"); return e.contentEditable = !0, "true" === e.contentEditable } }), Modernizr.addTest("emoji", function() {
        if (!Modernizr.canvastext) return !1;
        var t = e.devicePixelRatio || 1,
            n = 12 * t,
            i = l("canvas"),
            r = i.getContext("2d");
        return r.fillStyle = "#f00", r.textBaseline = "top", r.font = "32px Arial", r.fillText("🐨", 0, 0), 0 !== r.getImageData(n, n, 1, 1).data[0]
    }), a("htmlimports", "import" in l("link")), Modernizr.addTest("canvasblending", function() { if (Modernizr.canvas === !1) return !1; var e = l("canvas").getContext("2d"); try { e.globalCompositeOperation = "screen" } catch (t) {} return "screen" === e.globalCompositeOperation }), Modernizr.addTest("canvaswinding", function() { if (Modernizr.canvas === !1) return !1; var e = l("canvas").getContext("2d"); return e.rect(0, 0, 10, 10), e.rect(2, 2, 6, 6), e.isPointInPath(5, 5, "evenodd") === !1 }), Modernizr.addTest("csscalc", function() {
        var e = "width:",
            t = "calc(10px);",
            n = l("a");
        return n.style.cssText = e + E.join(t + e), !!n.style.length
    }), Modernizr.addTest("cubicbezierrange", function() { var e = l("a"); return e.style.cssText = E.join("transition-timing-function:cubic-bezier(1,0,0,1.1); "), !!e.style.length }), Modernizr.addTest("cssgradients", function() {
        for (var e, t = "background-image:", n = "gradient(linear,left top,right bottom,from(#9f9),to(white));", i = "", r = 0, o = E.length - 1; o > r; r++) e = 0 === r ? "to " : "", i += t + E[r] + "linear-gradient(" + e + "left top, #9f9, white);";
        Modernizr._config.usePrefixes && (i += t + "-webkit-" + n);
        var a = l("a"),
            s = a.style;
        return s.cssText = i, ("" + s.backgroundImage).indexOf("gradient") > -1
    }), Modernizr.addTest("multiplebgs", function() { var e = l("a").style; return e.cssText = "background:url(https://),url(https://),red url(https://)", /(url\s*\(.*?){3}/.test(e.background) }), Modernizr.addTest("opacity", function() { var e = l("a").style; return e.cssText = E.join("opacity:.55;"), /^0.55$/.test(e.opacity) }), Modernizr.addTest("csspointerevents", function() { var e = l("a").style; return e.cssText = "pointer-events:auto", "auto" === e.pointerEvents }), Modernizr.addTest("csspositionsticky", function() {
        var e = "position:",
            t = "sticky",
            n = l("a"),
            i = n.style;
        return i.cssText = e + E.join(t + ";" + e).slice(0, -e.length), -1 !== i.position.indexOf(t)
    }), Modernizr.addTest("cssremunit", function() { var e = l("a").style; try { e.fontSize = "3rem" } catch (t) {} return /rem/.test(e.fontSize) }), Modernizr.addTest("rgba", function() { var e = l("a").style; return e.cssText = "background-color:rgba(150,255,150,.5)", ("" + e.backgroundColor).indexOf("rgba") > -1 });
    var A = l("input"),
        P = "autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),
        B = {};
    Modernizr.input = function(t) { for (var n = 0, i = t.length; i > n; n++) B[t[n]] = !!(t[n] in A); return B.list && (B.list = !(!l("datalist") || !e.HTMLDataListElement)), B }(P);
    var L = "search tel url email datetime date month week time datetime-local number range color".split(" "),
        O = {};
    Modernizr.inputtypes = function(e) { for (var i, r, o, a = e.length, s = "1)", l = 0; a > l; l++) A.setAttribute("type", i = e[l]), o = "text" !== A.type && "style" in A, o && (A.value = s, A.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(i) && A.style.WebkitAppearance !== n ? (z.appendChild(A), r = t.defaultView, o = r.getComputedStyle && "textfield" !== r.getComputedStyle(A, null).WebkitAppearance && 0 !== A.offsetHeight, z.removeChild(A)) : /^(search|tel)$/.test(i) || (o = /^(url|email)$/.test(i) ? A.checkValidity && A.checkValidity() === !1 : A.value != s)), O[e[l]] = !!o; return O }(L), Modernizr.addTest("hsla", function() { var e = l("a").style; return e.cssText = "background-color:hsla(120,40%,100%,.5)", d(e.backgroundColor, "rgba") || d(e.backgroundColor, "hsla") });
    var H = function() { var t = e.matchMedia || e.msMatchMedia; return t ? function(e) { var n = t(e); return n && n.matches || !1 } : function(t) { var n = !1; return c("@media " + t + " { #modernizr { position: absolute; } }", function(t) { n = "absolute" == (e.getComputedStyle ? e.getComputedStyle(t, null) : t.currentStyle).position }), n } }();
    C.mq = H, Modernizr.addTest("mediaqueries", H("only all"));
    var F = C.testStyles = c;
    Modernizr.addTest("touchevents", function() {
        var n;
        if ("ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch) n = !0;
        else {
            var i = ["@media (", E.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
            F(i, function(e) { n = 9 === e.offsetTop })
        }
        return n
    }), Modernizr.addTest("checked", function() { return F("#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}", function(e) { var t = l("input"); return t.setAttribute("type", "checkbox"), t.setAttribute("checked", "checked"), e.appendChild(t), 20 === t.offsetLeft }) });
    var D = function() {
        var e = navigator.userAgent,
            t = e.match(/w(eb)?osbrowser/gi),
            n = e.match(/windows phone/gi) && e.match(/iemobile\/([0-9])+/gi) && parseFloat(RegExp.$1) >= 9;
        return t || n
    }();
    D ? Modernizr.addTest("fontface", !1) : F('@font-face {font-family:"font";src:url("https://")}', function(e, n) {
        var i = t.getElementById("smodernizr"),
            r = i.sheet || i.styleSheet,
            o = r ? r.cssRules && r.cssRules[0] ? r.cssRules[0].cssText : r.cssText || "" : "",
            a = /src/i.test(o) && 0 === o.indexOf(n.split(" ")[0]);
        Modernizr.addTest("fontface", a)
    }), F('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function(e) { Modernizr.addTest("generatedcontent", e.offsetHeight >= 6) }), Modernizr.addTest("hairline", function() { return F("#modernizr {border:.5px solid transparent}", function(e) { return 1 === e.offsetHeight }) }), F("#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}", function(e) {
        for (var t = e.getElementsByTagName("div"), n = !0, i = 0; 5 > i; i++) n = n && t[i].offsetWidth === i % 2 + 1;
        Modernizr.addTest("nthchild", n)
    }, 5), F("#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}", function(t) {
        var n = t.firstChild;
        n.innerHTML = "This is a text written in Arial", Modernizr.addTest("subpixelfont", e.getComputedStyle ? "44px" !== e.getComputedStyle(n, null).getPropertyValue("width") : !1)
    }, 1, ["subpixel"]);
    var V = { elem: l("modernizr") };
    Modernizr._q.push(function() { delete V.elem });
    var $ = { style: V.elem.style };
    Modernizr._q.unshift(function() { delete $.style });
    var W = C.testProp = function(e, t, i) { return v([e], n, t, i) };
    Modernizr.addTest("textshadow", W("textShadow", "1px 1px")), C.testAllProps = y;
    var I = C.prefixed = function(e, t, n) { return 0 === e.indexOf("@") ? M(e) : (-1 != e.indexOf("-") && (e = s(e)), t ? y(e, t, n) : y(e, "pfx")) };
    Modernizr.addTest("fullscreen", !(!I("exitFullscreen", t, !1) && !I("cancelFullScreen", t, !1))), Modernizr.addTest("pagevisibility", !!I("hidden", t, !1)), Modernizr.addTest("backgroundblendmode", I("backgroundBlendMode", "text")), Modernizr.addTest("objectfit", !!I("objectFit"), { aliases: ["object-fit"] }), Modernizr.addTest("regions", function() {
            if (_) return !1;
            var e = I("flowFrom"),
                t = I("flowInto"),
                i = !1;
            if (!e || !t) return i;
            var r = l("iframe"),
                o = l("div"),
                a = l("div"),
                s = l("div"),
                d = "modernizr_flow_for_regions_check";
            a.innerText = "M", o.style.cssText = "top: 150px; left: 150px; padding: 0px;", s.style.cssText = "width: 50px; height: 50px; padding: 42px;", s.style[e] = d, o.appendChild(a), o.appendChild(s), z.appendChild(o);
            var u, c, f = a.getBoundingClientRect();
            return a.style[t] = d, u = a.getBoundingClientRect(), c = parseInt(u.left - f.left, 10), z.removeChild(o), 42 == c ? i = !0 : (z.appendChild(r), f = r.getBoundingClientRect(), r.style[t] = d, u = r.getBoundingClientRect(), f.height > 0 && f.height !== u.height && 0 === u.height && (i = !0)), a = s = o = r = n, i
        }), C.testAllProps = b, Modernizr.addTest("ligatures", b("fontFeatureSettings", '"liga" 1')), Modernizr.addTest("cssanimations", b("animationName", "a", !0)), Modernizr.addTest("csspseudoanimations", function() { var t = !1; if (!Modernizr.cssanimations || !e.getComputedStyle) return t; var n = ["@", Modernizr._prefixes.join("keyframes csspseudoanimations { from { font-size: 10px; } }@").replace(/\@$/, ""), '#modernizr:before { content:" "; font-size:5px;', Modernizr._prefixes.join("animation:csspseudoanimations 1ms infinite;"), "}"].join(""); return Modernizr.testStyles(n, function(n) { t = "10px" === e.getComputedStyle(n, ":before").getPropertyValue("font-size") }), t }), Modernizr.addTest("appearance", b("appearance")), Modernizr.addTest("backgroundcliptext", function() { return b("backgroundClip", "text") }), Modernizr.addTest("bgrepeatround", b("backgroundRepeat", "round")), Modernizr.addTest("bgrepeatspace", b("backgroundRepeat", "space")), Modernizr.addTest("bgsizecover", b("backgroundSize", "cover")),
        function() {
            Modernizr.addTest("csscolumns", function() {
                var e = !1,
                    t = b("columnCount");
                try { e = !!t, e && (e = new Boolean(e)) } catch (n) {}
                return e
            });
            for (var e, t, n = ["Width", "Span", "Fill", "Gap", "Rule", "RuleColor", "RuleStyle", "RuleWidth", "BreakBefore", "BreakAfter", "BreakInside"], i = 0; i < n.length; i++) e = n[i].toLowerCase(), t = b("column" + n[i]), ("breakbefore" === e || "breakafter" === e || "breakinside" == e) && (t = t || b(n[i])), Modernizr.addTest("csscolumns." + e, t)
        }(), Modernizr.addTest("ellipsis", b("textOverflow", "ellipsis")), Modernizr.addAsyncTest(function() {
            function n() {
                function r() {
                    try {
                        var e = l("div"),
                            n = l("span"),
                            i = e.style,
                            r = 0,
                            o = 0,
                            a = !1,
                            s = t.body.firstElementChild || t.body.firstChild;
                        return e.appendChild(n), n.innerHTML = "Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.", t.body.insertBefore(e, s), i.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;", r = n.offsetHeight, o = n.offsetWidth, i.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;" + E.join("hyphens:auto; "), a = n.offsetHeight != r || n.offsetWidth != o, t.body.removeChild(e), e.removeChild(n), a
                    } catch (d) { return !1 }
                }

                function o(e, n) {
                    try {
                        var i = l("div"),
                            r = l("span"),
                            o = i.style,
                            a = 0,
                            s = !1,
                            d = !1,
                            u = !1,
                            c = t.body.firstElementChild || t.body.firstChild;
                        return o.cssText = "position:absolute;top:0;left:0;overflow:visible;width:1.25em;", i.appendChild(r), t.body.insertBefore(i, c), r.innerHTML = "mm", a = r.offsetHeight, r.innerHTML = "m" + e + "m", d = r.offsetHeight > a, n ? (r.innerHTML = "m<br />m", a = r.offsetWidth, r.innerHTML = "m" + e + "m", u = r.offsetWidth > a) : u = !0, d === !0 && u === !0 && (s = !0), t.body.removeChild(i), i.removeChild(r), s
                    } catch (f) { return !1 }
                }

                function s(n) {
                    try {
                        var i, r = l("input"),
                            o = l("div"),
                            a = "lebowski",
                            s = !1,
                            d = t.body.firstElementChild || t.body.firstChild;
                        o.innerHTML = a + n + a, t.body.insertBefore(o, d), t.body.insertBefore(r, o), r.setSelectionRange ? (r.focus(), r.setSelectionRange(0, 0)) : r.createTextRange && (i = r.createTextRange(), i.collapse(!0), i.moveEnd("character", 0), i.moveStart("character", 0), i.select());
                        try { e.find ? s = e.find(a + a) : (i = e.self.document.body.createTextRange(), s = i.findText(a + a)) } catch (u) { s = !1 }
                        return t.body.removeChild(o), t.body.removeChild(r), s
                    } catch (u) { return !1 }
                }
                return t.body || t.getElementsByTagName("body")[0] ? (a("csshyphens", function() { if (!b("hyphens", "auto", !0)) return !1; try { return r() } catch (e) { return !1 } }), a("softhyphens", function() { try { return o("&#173;", !0) && o("&#8203;", !1) } catch (e) { return !1 } }), void a("softhyphensfind", function() { try { return s("&#173;") && s("&#8203;") } catch (e) { return !1 } })) : void setTimeout(n, i)
            }
            var i = 300;
            setTimeout(n, i)
        }), Modernizr.addTest("cssmask", b("maskRepeat", "repeat-x", !0)), Modernizr.addTest("overflowscrolling", b("overflowScrolling", "touch", !0)), Modernizr.addTest("cssreflections", b("boxReflect", "above", !0)), Modernizr.addTest("cssresize", b("resize", "both", !0)), Modernizr.addTest("scrollsnappoints", b("scrollSnapType")), Modernizr.addTest("shapes", b("shapeOutside", "content-box", !0)), Modernizr.addTest("textalignlast", b("textAlignLast")), Modernizr.addTest("userselect", b("userSelect", "none", !0)), Modernizr.addTest("csstransitions", b("transition", "all", !0)), Modernizr.addTest("csspseudotransitions", function() { var t = !1; if (!Modernizr.csstransitions || !e.getComputedStyle) return t; var n = '#modernizr:before { content:" "; font-size:5px;' + Modernizr._prefixes.join("transition:0s 100s;") + "}#modernizr.trigger:before { font-size:10px; }"; return Modernizr.testStyles(n, function(n) { e.getComputedStyle(n, ":before").getPropertyValue("font-size"), n.className += "trigger", t = "5px" === e.getComputedStyle(n, ":before").getPropertyValue("font-size") }), t });
    var U = (C.prefixedCSS = function(e) { var t = I(e); return t && m(t) }, function() {
        function e(e, t) { var r; return e ? (t && "string" != typeof t || (t = l(t || "div")), e = "on" + e, r = e in t, !r && i && (t.setAttribute || (t = l("div")), t.setAttribute(e, ""), r = "function" == typeof t[e], t[e] !== n && (t[e] = n), t.removeAttribute(e)), r) : !1 }
        var i = !("onblur" in t.documentElement);
        return e
    }());
    C.hasEvent = U;
    var J = function(e, t) {
        var n = !1,
            i = l("div"),
            r = i.style;
        if (e in r) { var o = N.length; for (r[e] = t, n = r[e]; o-- && !n;) r[e] = "-" + N[o] + "-" + t, n = r[e] }
        return "" === n && (n = !1), n
    };
    C.prefixedCSSValue = J, r(), o(x), delete C.addTest, delete C.addAsyncTest;
    for (var X = 0; X < Modernizr._q.length; X++) Modernizr._q[X]();
    e.Modernizr = Modernizr
}(window, document);