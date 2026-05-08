/**
 * This JavaScript was automatically generated from a source file.
 * Editing this file directly isn't recommended; if you want to modify the functionality of this module,
 * make a clone, contact the original developer for support, or make an external js file and attach it to the
 * page or module.
 */

!function(e,n){"function"==typeof define&&define.amd?define([],n):"undefined"!=typeof exports?n():(n(),e.moduleSrc={})}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,function(){"use strict";var n,e,t;n=window.Accordion.default,e=document.querySelectorAll(".timeline-event"),t=new IntersectionObserver(function(e){e.forEach(function(e){e.target.classList.toggle("visible",e.isIntersecting)})},{rootMargin:"0px",threshold:.33}),e.forEach(function(e){t.observe(e);e=e.querySelector("details");e&&new n(e)})});