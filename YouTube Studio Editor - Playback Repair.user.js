// ==UserScript==
// @name         YouTube Studio Editor - Playback Repair
// @namespace    http://tampermonkey.net/
// @version      2026-09-30
// @description  Fixes the recurring YouTube Studio editor bug where the toolbar disappears, the play/pause button stops responding, and the video decoder freezes, without reloading the page and without risking unsaved cuts.
// @author       Alsweider
// @match        https://studio.youtube.com/video/*/editor
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/598040/YouTube%20Studio%20Editor%20-%20Playback%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/598040/YouTube%20Studio%20Editor%20-%20Playback%20Repair.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -- Core repair ------------------------------------------------------

    // Restores the toolbar if YouTube has hidden it via an inline
    // display:none style. Deliberately does not force a value such
    // as 'block', since that disrupts the toolbar's original flexbox
    // layout and shifts it up by roughly one line. Instead, only the
    // offending inline style is removed, letting the original
    // stylesheet take over again.
    function restoreToolbar() {
        const toolbar = document.querySelector('#toolbar');
        if (!toolbar) return false;
        toolbar.style.removeProperty('display');
        return true;
    }

    // Reloads only the video element (not the page) to wake up a frozen
    // decoder. The playback position is saved beforehand and restored
    // afterwards.
    function reloadVideoElement() {
        const video = document.querySelector('video');
        if (!video) return false;

        const savedTime = video.currentTime;

        const restorePosition = () => {
            video.currentTime = savedTime;
            video.removeEventListener('loadedmetadata', restorePosition);
        };
        video.addEventListener('loadedmetadata', restorePosition);

        video.load();
        return true;
    }

    function repairEditor() {
        const toolbarFound = restoreToolbar();
        const videoFound = reloadVideoElement();

        showStatus(
            (toolbarFound ? 'Toolbar restored. ' : 'Toolbar not found. ') +
            (videoFound ? 'Video reloaded.' : 'Video element not found.')
        );
    }

    // -- Status display ----------------------------------------------------

    let statusBox;
    function showStatus(text) {
        if (!statusBox) {
            statusBox = document.createElement('div');
            statusBox.style.cssText = `
                position: fixed;
                bottom: 74px;
                right: 20px;
                z-index: 999999;
                background: #222;
                color: #fff;
                padding: 8px 14px;
                border-radius: 6px;
                font-size: 13px;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                max-width: 260px;
            `;
            document.body.appendChild(statusBox);
        }
        statusBox.textContent = text;
        statusBox.style.display = 'block';
        clearTimeout(statusBox._hideTimer);
        statusBox._hideTimer = setTimeout(() => {
            statusBox.style.display = 'none';
        }, 4000);
    }

    // -- Floating repair button --------------------------------------------

    function addButton() {
        if (document.querySelector('#editor-repair-button')) return;

        const button = document.createElement('button');
        button.id = 'editor-repair-button';
        button.textContent = '⟳ Repair editor';
        button.title = 'Show toolbar and reload the video element (Alt+R)';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: #cc0000;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 10px 16px;
            font-size: 13px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        `;
        button.addEventListener('click', repairEditor);
        document.body.appendChild(button);
    }

    // The editor is a single-page app, so the button must be re-inserted
    // after internal navigation as well.
    const observer = new MutationObserver(() => {
        if (location.pathname.includes('/editor')) {
            addButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addButton();

    // Alt+R as a quicker way to trigger the repair without a mouse click.
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            repairEditor();
        }
    });
})();