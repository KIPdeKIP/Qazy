if(!("qazy" in window))
    window.qazy = {};
if(!("img" in qazy))
    qazy.img = "";
if(!("elems" in qazy))
    qazy.elems = qazy.autoSelect();
// Set to 0 or higher to catch any late images. Elems are overridden every run
if(!("interval" in qazy))
    qazy.interval = -1;

/**
 * Reveal a single element.
 */
qazy.reveal = function(elem) {
	var qazySrcAttribute = elem.getAttribute("data-qazy-src")
	if(typeof qazySrcAttribute === "string")
		elem.src = qazySrcAttribute;
	elem.removeAttribute("data-qazy-src");
}

/**
 * Hide a single element.
 */
qazy.hide = function(elem) {
    if(elem.getAttribute("data-qazy-src") === null) {
        elem.setAttribute("data-qazy-src", elem.src);
        elem.src = qazy.img;
    }
}

/**
 * Returns whether an element is visible to the user.
 */
qazy.isVisible = function(elem) {
    var tempElem = elem;
    while(true) {
        if(tempElem.nodeType !== 1)
            return false;
        if(tempElem.offsetWidth || tempElem.offsetHeight || tempElem.getClientRects().length)
            return false;
        if(window.getComputedStyle) {
            if(document.defaultView.getComputedStyle(tempElem)['opacity'] === '0' || document.defaultView.getComputedStyle(tempElem)['display'] === 'none' || document.defaultView.getComputedStyle(tempElem)['visibility'] === 'hidden')
                return false;
        }
        else {
            if(tempElem.currentStyle['opacity'] === '0' || tempElem.currentStyle['display'] === 'none' || tempElem.currentStyle['visibility'] === 'hidden')
                return false;
        }
        if(tempElem === document.documentElement)
            break;
        if(tempElem.parentNode === null)
            return false;
        tempElem = tempElem.parentNode;
    }
    var elemDomRect = elem.getBoundingClientRect();
    if(elemDomRect.top > window.innerHeight || elemDomRect.left > window.innerWidth || elemDomRect.bottom < 0 || elemDomRect.right < 0)
        return false;
    return true;
}

/**
 * Return a standard list of elements to lazy load.
 */
qazy.autoSelect = function() {
    return document.getElementsByTagName("IMG");
}

/**
 * Scan the given set of elements and reveal the visible elements.
 */
qazy.scan = function(elems) {
    for(var i = 0; i < elems.length; i++) {
        if(qazy.isVisible(elems[i]))
            qazy.reveal(elems[i]);
    }
}

/**
 * Scan the configured list of elements and reveal the visible elements.
 */
qazy.autoReveal = function() {
    qazy.scan(qazy.elems);
}

/**
 * Lazy load the given set of elements.
 */
qazy.lazyLoad = function(elems) {
    for(var i = 0; i < elems.length; i++)
        qazy.hide(elems[i]);
}

/**
 * Hide the configured list of elements.
 */
qazy.autoHide = function() {
    qazy.lazyLoad(qazy.elems);
}

/**
 * Code to be run by the interval object.
 */
qazy.intervalFunction = function() {
    qazy.elems = qazy.autoSelect();
    qazy.autoHide();
}

/**
 * Code to be run when the page is loaded.
 */
qazy.onload = function() {
    if(qazy.interval >= 0) {
        // Run the interval code one last time
        qazy.intervalFunction();
        clearInterval(qazy.intervalObject);
    }
    qazy.autoHide();
    qazy.autoReveal();
}

/**
 * Sets up the listeners to automatically lazy load images.
 */
qazy.setup = function() {
    if(qazy.interval >= 0) {
        qazy.intervalObject = setInterval(qazy.intervalFunction, qazy.interval);
    }
    if(window.addEventListener) {
        window.addEventListener("resize", qazy.autoReveal, false);
        window.addEventListener("scroll", qazy.autoReveal, false);
        window.addEventListener("load", qazy.onload, false);
    }
    else {
        window.attachEvent("onresize", qazy.autoReveal);
        window.attachEvent("onscroll", qazy.autoReveal);
        window.attachEvent("onload", qazy.onload);
    }
}

// Run the setup
qazy.setup();
