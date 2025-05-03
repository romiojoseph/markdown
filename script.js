const FindReplace = (function () {
    let editorInstance;
    let triggerSaveCallback;
    let container;
    let findInput;
    let replaceInput;
    let findCount;
    let findNextBtn;
    let findPrevBtn;
    let replaceBtn;
    let replaceAllBtn;
    let closeBtn;
    let findReplaceToolbarButton;

    let matches = [];
    let currentMatchIndex = -1;
    let currentSearchTerm = '';
    let findDebounceTimeout;

    const HIGHLIGHT_TAG = 'SPAN';
    const HIGHLIGHT_CLASS = 'find-match';
    const CURRENT_HIGHLIGHT_CLASS = 'current';

    function init(editorElement, saveCallback) {
        editorInstance = editorElement;
        triggerSaveCallback = saveCallback;

        container = document.querySelector('.find-replace-container');
        findInput = document.getElementById('find-input');
        replaceInput = document.getElementById('replace-input');
        findCount = container?.querySelector('.find-count');
        findNextBtn = document.getElementById('find-next');
        findPrevBtn = document.getElementById('find-prev');
        replaceBtn = document.getElementById('replace-btn');
        replaceAllBtn = document.getElementById('replace-all-btn');
        closeBtn = container?.querySelector('.find-replace-close');
        findReplaceToolbarButton = document.querySelector('button[data-command="findReplace"]');

        if (!editorInstance || !container || !findInput || !replaceInput || !findCount || !findNextBtn || !findPrevBtn || !replaceBtn || !replaceAllBtn || !closeBtn || !findReplaceToolbarButton) {
            console.error("Find/Replace Module: Could not find all required DOM elements. Aborting initialization.");
            return false;
        }

        findReplaceToolbarButton.addEventListener('click', toggleVisibility);
        closeBtn.addEventListener('click', close);

        findInput.addEventListener('input', handleFindInput);
        findInput.addEventListener('keydown', handleFindKeyDown);
        replaceInput.addEventListener('keydown', handleReplaceKeyDown);

        findNextBtn.addEventListener('click', findNext);
        findPrevBtn.addEventListener('click', findPrev);
        replaceBtn.addEventListener('click', replaceCurrent);
        replaceAllBtn.addEventListener('click', replaceAll);

        container.classList.add('hidden');
        return true;
    }

    function positionPopover() {
        const buttonRect = findReplaceToolbarButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        let top = window.scrollY + buttonRect.bottom + 8;
        let left = window.scrollX + buttonRect.left;

        if (left + containerRect.width > window.innerWidth) {
            left = window.innerWidth - containerRect.width - 10;
        }
        if (left < 10) {
            left = 10;
        }
        if (top + containerRect.height > window.innerHeight + window.scrollY) {
            top = window.scrollY + buttonRect.top - containerRect.height - 8;
        }
        if (top < window.scrollY + 10) {
            top = window.scrollY + 10;
        }


        container.style.top = `${top}px`;
        container.style.left = `${left}px`;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.transform = 'none';
    }


    function toggleVisibility() {
        const isHidden = container.classList.toggle('hidden');
        if (!isHidden) {
            positionPopover();
            findInput.focus();
            findInput.select();
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed && editorInstance.contains(selection.anchorNode)) {
                const selectedText = selection.toString();
                if (selectedText && selectedText !== findInput.value) {
                    findInput.value = selectedText;
                    findAndHighlight();
                } else if (matches.length > 0) {
                    highlightCurrent();
                }
            } else if (findInput.value && matches.length === 0) {
                findAndHighlight();
            }
        } else {
            clearHighlight();
        }
    }

    function open() {
        if (container.classList.contains('hidden')) {
            toggleVisibility();
        } else {
            positionPopover();
            findInput.focus();
            findInput.select();
        }
    }

    function close() {
        if (!container.classList.contains('hidden')) {
            container.classList.add('hidden');
            clearHighlight();
            editorInstance.focus();
        }
    }

    function handleFindInput() {
        clearTimeout(findDebounceTimeout);
        findDebounceTimeout = setTimeout(() => {
            findAndHighlight();
        }, 300);
    }

    function handleFindKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                findPrev();
            } else {
                findNext();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    }

    function handleReplaceKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            replaceCurrent();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    }


    function clearHighlight() {
        const currentHighlights = Array.from(editorInstance.querySelectorAll(`${HIGHLIGHT_TAG}.${HIGHLIGHT_CLASS}`));

        currentHighlights.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
                parent.normalize();
            }
        });

        matches = [];
        currentMatchIndex = -1;
        currentSearchTerm = '';
        findCount.textContent = '';
    }

    function findAndHighlight() {
        const searchTerm = findInput.value;

        if (searchTerm !== currentSearchTerm) {
            clearHighlight();
        }

        currentSearchTerm = searchTerm;

        if (!searchTerm) {
            updateCountDisplay();
            return;
        }

        const rangesToHighlight = [];
        try {
            const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
            const walker = document.createTreeWalker(editorInstance, NodeFilter.SHOW_TEXT);
            let node;

            while (node = walker.nextNode()) {
                if (node.parentElement?.closest('script, style, pre, .find-match')) continue;

                let match;
                regex.lastIndex = 0;

                while ((match = regex.exec(node.nodeValue)) !== null) {
                    if (match[0].length === 0) { regex.lastIndex++; continue; }
                    if (node.parentElement?.classList.contains(HIGHLIGHT_CLASS)) continue;

                    const range = document.createRange();
                    try {
                        range.setStart(node, match.index);
                        range.setEnd(node, match.index + match[0].length);
                        rangesToHighlight.push(range);
                    } catch (rangeError) {
                        console.error("Error creating range for match:", rangeError, node, match);
                    }
                }
            }
        } catch (regexError) {
            console.error("Error creating or executing regex:", regexError);
            findCount.textContent = 'Invalid term';
            return;
        }

        const newMatches = [];
        for (let i = rangesToHighlight.length - 1; i >= 0; i--) {
            const range = rangesToHighlight[i];
            if (!editorInstance.contains(range.commonAncestorContainer)) continue;

            try {
                const span = document.createElement(HIGHLIGHT_TAG);
                span.className = HIGHLIGHT_CLASS;
                if (!range.commonAncestorContainer.parentElement?.closest(`.${HIGHLIGHT_CLASS}`)) {
                    range.surroundContents(span);
                    newMatches.push({ element: span, range: range });
                } else {
                    console.warn("Skipping nested highlight wrap.");
                }
            } catch (wrapError) {
                console.error("Error wrapping range with span:", wrapError, range);
            }
        }

        matches = newMatches.reverse();

        if (matches.length > 0) {
            if (searchTerm !== currentSearchTerm || currentMatchIndex === -1 || currentMatchIndex >= matches.length) {
                currentMatchIndex = 0;
            }
            highlightCurrent();
        } else {
            currentMatchIndex = -1;
            updateCountDisplay();
        }
    }

    function highlightCurrent() {
        editorInstance.querySelectorAll(`${HIGHLIGHT_TAG}.${HIGHLIGHT_CLASS}`).forEach(el => {
            el.classList.remove(CURRENT_HIGHLIGHT_CLASS);
        });

        if (currentMatchIndex >= 0 && currentMatchIndex < matches.length) {
            const currentMatch = matches[currentMatchIndex]?.element;
            if (currentMatch && editorInstance.contains(currentMatch)) {
                currentMatch.classList.add(CURRENT_HIGHLIGHT_CLASS);
                currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

                const selection = window.getSelection();
                const range = document.createRange();
                try {
                    range.selectNodeContents(currentMatch);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (selectError) {
                    console.error("Error selecting current match:", selectError);
                }

                findInput.focus();

            } else {
                console.warn("Current match element is invalid, re-finding...");
                findAndHighlight();
                return;
            }
        }
        updateCountDisplay();
    }

    function updateCountDisplay() {
        if (matches.length === 0) {
            findCount.textContent = currentSearchTerm ? '0 matches' : '';
        } else {
            findCount.textContent = `${currentMatchIndex + 1} of ${matches.length}`;
        }
    }

    function findNext() {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        highlightCurrent();
    }

    function findPrev() {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        highlightCurrent();
    }

    function replaceCurrent() {
        if (currentMatchIndex < 0 || currentMatchIndex >= matches.length) {
            findNext();
            return;
        }

        const matchData = matches[currentMatchIndex];
        const elementToReplace = matchData?.element;

        if (!elementToReplace || !editorInstance.contains(elementToReplace)) {
            console.warn("Replace Current: Match element invalid or not found. Re-finding.");
            findAndHighlight();
            return;
        }

        const replacementText = replaceInput.value;
        const replacementNode = document.createTextNode(replacementText);
        const parent = elementToReplace.parentNode;

        if (!parent) {
            console.error("Replace Current: Parent node not found.");
            return;
        }

        try {
            parent.replaceChild(replacementNode, elementToReplace);
            parent.normalize();

            const termToSearchAgain = currentSearchTerm;
            const oldIndex = currentMatchIndex;

            clearHighlight();
            currentSearchTerm = termToSearchAgain;
            findAndHighlight();

            if (matches.length > 0) {
                let nextIndex = oldIndex;
                if (nextIndex >= matches.length) {
                    nextIndex = matches.length > 0 ? 0 : -1;
                }
                if (nextIndex !== -1) {
                    currentMatchIndex = nextIndex;
                    highlightCurrent();
                }
            }

            if (typeof triggerSaveCallback === 'function') {
                triggerSaveCallback();
            }

        } catch (replaceError) {
            console.error("Error replacing current match:", replaceError);
        }
    }

    function replaceAll() {
        const searchTerm = findInput.value;
        const replacementText = replaceInput.value;

        if (!searchTerm) {
            findCount.textContent = "Cannot replace empty text.";
            return;
        }

        let count = 0;
        try {
            const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
            const walker = document.createTreeWalker(editorInstance, NodeFilter.SHOW_TEXT);
            const nodesToProcess = [];
            let node;
            while (node = walker.nextNode()) {
                if (!node.parentElement?.closest('script, style, pre')) {
                    nodesToProcess.push(node);
                }
            }


            nodesToProcess.forEach(node => {
                let match;
                regex.lastIndex = 0;
                let currentIndex = 0;
                let nodeModified = false;
                let originalValue = node.nodeValue;
                let accumulator = '';

                while ((match = regex.exec(originalValue)) !== null) {
                    if (match[0].length === 0) { regex.lastIndex++; continue; }
                    accumulator += originalValue.substring(currentIndex, match.index);
                    accumulator += replacementText;
                    currentIndex = match.index + match[0].length;
                    count++;
                    nodeModified = true;
                }

                if (nodeModified) {
                    accumulator += originalValue.substring(currentIndex);
                    node.nodeValue = accumulator;
                }
            });


            clearHighlight();
            findCount.textContent = `Replaced ${count} time(s)`;
            editorInstance.normalize();

            if (typeof triggerSaveCallback === 'function') {
                triggerSaveCallback();
            }

        } catch (error) {
            console.error("Error during Replace All:", error);
            findCount.textContent = "Error during replace.";
            clearHighlight();
        }
    }


    return {
        init: init,
        open: open,
        close: close,
        isVisibile: function () { return container && !container.classList.contains('hidden'); }
    };
})();


document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const saveIndicator = document.getElementById('save-indicator');
    const modalOverlay = document.getElementById('modal-overlay');
    const linkModal = document.getElementById('link-modal');
    const imageModal = document.getElementById('image-modal');
    const tableModal = document.getElementById('table-modal');
    const importFileInput = document.getElementById('import-file');
    const importButton = document.getElementById('import-btn');
    const exportButton = document.getElementById('export-btn');
    const linkUrlInput = document.getElementById('link-url');
    const imageUrlInput = document.getElementById('image-url');
    const tableRowsInput = document.getElementById('table-rows');
    const tableColsInput = document.getElementById('table-cols');
    const wordCountElement = document.getElementById('word-count');
    const charCountElement = document.getElementById('char-count');
    const modifiedTimeElement = document.getElementById('modified-time');
    const statsContainer = document.querySelector('.stats-container');
    const toolbar = document.querySelector('.toolbar');

    // Storage keys
    const STORAGE_KEY = 'simple-markdown-editor-content';
    const STORAGE_KEY_LAST_MODIFIED = 'simple-markdown-editor-last-modified';
    const STORAGE_KEY_VIEW_MODE = 'simple-markdown-editor-view-mode';

    // App state
    let lastSavedContent = '';
    let saveTimeout = null;
    let currentSelectionRange = null;
    let viewMode = localStorage.getItem(STORAGE_KEY_VIEW_MODE) || 'live'; // 'live' or 'markdown'
    const SAVE_DELAY = 1500;

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '_',
        bulletListMarker: '-',
        hr: '---',
        linkStyle: 'inlined'
    });

    turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: content => '~~' + content + '~~',
    });

    marked.use({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false,
        mangle: false,
        headerIds: false
    });



    function triggerSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, 250);
    }

    function getClosestAncestor(node, selector) {
        if (!node) return null;
        if (node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode;
        }
        if (node && typeof node.closest === 'function') {
            const ancestor = node.closest(selector);
            const boundary = editor || document.body;
            return (ancestor && boundary.contains(ancestor)) ? ancestor : null;
        }

        const tags = selector.toUpperCase().split(',').map(s => s.trim());
        let current = node;
        const boundary = editor || document.body;
        while (current && current !== boundary) {
            if (current.nodeType === Node.ELEMENT_NODE && tags.includes(current.nodeName)) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    }


    function handleCommand(command) {
        editor.focus();

        const blockFormats = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'codeBlock'];
        const customInlineFormats = ['highlight', 'inlineCode'];

        if (blockFormats.includes(command)) {
            handleBlockFormatToggle(command);
        } else if (customInlineFormats.includes(command)) {
            const tagName = command === 'highlight' ? 'MARK' : 'CODE';
            toggleInlineStyle(tagName);
        } else {
            handleOtherCommands(command);
        }

        if (!['createLink', 'insertImage', 'createTable', 'findReplace'].includes(command)) {
            triggerSave();
            updateCounts();
        }
        updateToolbarState();
    }

    function handleBlockFormatToggle(command) {
        restoreSelection();
        if (!currentSelectionRange) return;

        const formatValue = command === 'codeBlock' ? 'PRE' : command.toUpperCase();
        const isActive = isBlockFormatActive(command);

        if (isActive) {
            document.execCommand('formatBlock', false, 'P');
            if (command === 'codeBlock') {
                setTimeout(() => {
                    restoreSelection();
                    if (!currentSelectionRange) return;
                    const pElement = getClosestAncestor(currentSelectionRange.startContainer, 'P');
                    if (pElement && pElement.innerHTML.startsWith('<code>') && pElement.innerHTML.endsWith('</code>')) {
                        pElement.innerHTML = pElement.querySelector('code')?.innerHTML || pElement.innerHTML;
                    }
                    saveSelection();
                }, 0);
            }
        } else {
            document.execCommand('formatBlock', false, formatValue);
            if (command === 'codeBlock') {
                ensureCodeInsidePre();
            }
        }
        saveSelection();
    }

    function handleOtherCommands(command) {
        restoreSelection();
        editor.focus();

        switch (command) {
            case 'bold': document.execCommand('bold', false, null); break;
            case 'italic': document.execCommand('italic', false, null); break;
            case 'strikethrough': document.execCommand('strikeThrough', false, null); break;
            case 'unorderedList': document.execCommand('insertUnorderedList', false, null); break;
            case 'orderedList': document.execCommand('insertOrderedList', false, null); break;
            case 'horizontalRule':
                document.execCommand('insertHorizontalRule', false, null);
                setTimeout(() => {
                    restoreSelection();
                    if (currentSelectionRange && currentSelectionRange.collapsed) {
                        const container = currentSelectionRange.startContainer;
                        const hr = (container.nodeType === Node.ELEMENT_NODE && container.tagName === 'HR')
                            ? container
                            : container.previousSibling;
                        if (hr && hr.tagName === 'HR' && (!hr.nextSibling || hr.nextSibling.tagName === 'HR')) {
                            const p = document.createElement('p');
                            p.innerHTML = '​';
                            hr.parentNode.insertBefore(p, hr.nextSibling);
                            const newRange = document.createRange();
                            newRange.setStart(p.firstChild, 1);
                            newRange.collapse(true);
                            window.getSelection().removeAllRanges();
                            window.getSelection().addRange(newRange);
                            saveSelection();
                        }
                    }
                }, 0);
                break;
            case 'unlink': document.execCommand('unlink', false, null); break;
            case 'clearFormatting': clearAllFormatting(); break;
            case 'undo': document.execCommand('undo', false, null); break;
            case 'redo': document.execCommand('redo', false, null); break;
            case 'createLink': showLinkModal(); break;
            case 'insertImage': showImageModal(); break;
            case 'createTable': showTableModal(); break;
            default: console.warn('Unknown command:', command);
        }
        saveSelection();
    }


    function saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
                currentSelectionRange = range.cloneRange();
            }
        } else {
            currentSelectionRange = null;
        }
    }

    function restoreSelection() {
        if (currentSelectionRange) {
            try {
                if (document.activeElement !== editor && !FindReplace.isVisibile()) {
                }
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(currentSelectionRange);
            } catch (e) {
                console.error("Error restoring selection:", e);
                currentSelectionRange = null;
            }
        } else {
            if (!FindReplace.isVisibile()) {
                editor.focus();
            }
        }
    }

    function isBlockFormatActive(command) {
        if (!currentSelectionRange) return false;
        const formatValue = command === 'codeBlock' ? 'PRE' : command.toUpperCase();
        let node = currentSelectionRange.startContainer;

        while (node && node !== editor) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName === formatValue) return true;
                const displayStyle = getComputedStyle(node).display;
                const isBlockLike = ['block', 'list-item', 'table', 'flex', 'grid'].includes(displayStyle);
                if (isBlockLike && node.nodeName !== 'LI') {
                    return false;
                }
            }
            node = node.parentNode;
        }
        return false;
    }


    function isInlineStyleActive(tagName) {
        if (!currentSelectionRange) return false;
        tagName = tagName.toUpperCase();
        const range = currentSelectionRange;

        if (range.collapsed) {
            let node = range.startContainer;
            if (getClosestAncestor(node, tagName)) return true;
            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === tagName && node.childNodes.length === 0) return true;
            if (node.nodeType === Node.TEXT_NODE) {
                const offset = range.startOffset;
                if (offset === node.length && node.nextSibling?.nodeName === tagName) return true;
                if (offset === 0 && node.previousSibling?.nodeName === tagName) return true;
            }
            return false;
        } else {
            try {
                if (tagName === 'B' || tagName === 'STRONG') return document.queryCommandState('bold');
                if (tagName === 'I' || tagName === 'EM') return document.queryCommandState('italic');
                if (tagName === 'DEL' || tagName === 'S' || tagName === 'STRIKE') return document.queryCommandState('strikeThrough');
                if (tagName === 'A') return !!getClosestAncestor(range.commonAncestorContainer, 'A');
            } catch (e) { console.warn("queryCommandState failed:", e) }

            let node = range.commonAncestorContainer;
            if (getClosestAncestor(node, tagName)) return true;

            const nodes = getNodesInRange(range);
            for (const n of nodes) {
                if (n.nodeType === Node.ELEMENT_NODE && n.nodeName === tagName) return true;
                if (getClosestAncestor(n, tagName)) return true;
            }
            return false;
        }
    }


    function toggleInlineStyle(tagName) {
        restoreSelection();
        if (!currentSelectionRange) return;
        editor.focus();

        tagName = tagName.toUpperCase();
        const isActive = isInlineStyleActive(tagName);

        const commandMap = {
            'B': 'bold', 'STRONG': 'bold',
            'I': 'italic', 'EM': 'italic',
            'DEL': 'strikeThrough', 'S': 'strikeThrough', 'STRIKE': 'strikeThrough',
        };
        const command = commandMap[tagName];

        if (command && tagName !== 'CODE' && tagName !== 'MARK') {
            document.execCommand(command, false, null);
        } else if (tagName === 'CODE' || tagName === 'MARK') {
            if (isActive) {
                const ancestor = getClosestAncestor(currentSelectionRange.commonAncestorContainer, tagName);
                if (ancestor && editor.contains(ancestor)) {
                    const tempRange = document.createRange();
                    try {
                        tempRange.selectNodeContents(ancestor);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(tempRange);
                        document.execCommand('removeFormat', false, null);

                        if (isInlineStyleActive(tagName)) {
                            const parent = ancestor.parentNode;
                            if (parent) {
                                const fragment = document.createDocumentFragment();
                                while (ancestor.firstChild) {
                                    fragment.appendChild(ancestor.firstChild);
                                }
                                parent.replaceChild(fragment, ancestor);
                                currentSelectionRange.selectNodeContents(parent);
                                currentSelectionRange.collapse(false);
                            }
                        }
                    } catch (e) {
                        console.error("Error during manual unwrap:", e);
                    }
                } else {
                    document.execCommand('removeFormat', false, null);
                }
            } else {
                if (currentSelectionRange.collapsed) {
                    const newNode = document.createElement(tagName.toLowerCase());
                    newNode.innerHTML = '​';
                    currentSelectionRange.insertNode(newNode);
                    currentSelectionRange.setStart(newNode.firstChild, 1);
                    currentSelectionRange.collapse(true);
                } else {
                    let containsBlock = false;
                    try {
                        const fragment = currentSelectionRange.cloneContents();
                        const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT);
                        while (walker.nextNode()) {
                            const node = walker.currentNode;
                            const display = getComputedStyle(node).display;
                            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'PRE', 'BLOCKQUOTE', 'LI', 'TABLE', 'HR', 'UL', 'OL'].includes(node.tagName) || display.includes('block') || display.includes('list-item') || display.includes('table')) {
                                if (node.parentNode === fragment) {
                                    containsBlock = true;
                                    break;
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Error checking selection content for block elements:", e);
                        return;
                    }

                    if (containsBlock) {
                        alert(`Cannot apply '${tagName.toLowerCase()}' to a selection containing block elements.`);
                        return;
                    }

                    const newNode = document.createElement(tagName.toLowerCase());
                    try {
                        newNode.appendChild(currentSelectionRange.extractContents());
                        currentSelectionRange.insertNode(newNode);
                        currentSelectionRange.selectNodeContents(newNode);
                    } catch (e) {
                        console.error(`Error wrapping selection with ${tagName}:`, e);
                    }
                }
            }
        } else {
            console.warn(`Unhandled tag for toggleInlineStyle: ${tagName}`);
        }

        saveSelection();
        updateToolbarState();
    }


    function ensureCodeInsidePre() {
        setTimeout(() => {
            restoreSelection();
            if (!currentSelectionRange) return;
            const preElement = getClosestAncestor(currentSelectionRange.startContainer, 'PRE');

            if (preElement && editor.contains(preElement)) {
                if (!preElement.firstElementChild || preElement.firstElementChild.tagName !== 'CODE') {
                    const codeContent = preElement.innerHTML || '​';
                    preElement.innerHTML = `<code>${codeContent}</code>`;
                }
                const codeElement = preElement.querySelector('code');
                if (codeElement) {
                    const range = document.createRange();
                    range.selectNodeContents(codeElement);
                    range.collapse(false);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    saveSelection();
                }
            }
        }, 0);
    }

    function clearAllFormatting() {
        restoreSelection();
        if (!currentSelectionRange) return;
        editor.focus();

        document.execCommand('removeFormat', false, null);

        setTimeout(() => {
            restoreSelection();
            if (!currentSelectionRange) return;

            const nodesToConvert = [];
            const nodesInRange = getNodesInRange(currentSelectionRange);

            nodesInRange.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const blockAncestor = getClosestAncestor(node, 'H1, H2, H3, H4, H5, H6, BLOCKQUOTE, PRE');
                    if (blockAncestor && editor.contains(blockAncestor) && !nodesToConvert.includes(blockAncestor) && currentSelectionRange.intersectsNode(blockAncestor)) {
                        nodesToConvert.push(blockAncestor);
                    }
                }
            });

            nodesToConvert.forEach(block => {
                if (editor.contains(block)) {
                    const p = document.createElement('p');
                    const contentSource = (block.tagName === 'PRE' && block.querySelector('code')) ? block.querySelector('code') : block;
                    p.innerHTML = contentSource.innerHTML || '​';
                    block.parentNode.replaceChild(p, block);
                }
            });

            const inlineSelectors = 'mark, code:not(pre code)';
            editor.querySelectorAll(inlineSelectors).forEach(element => {
                const elementRange = document.createRange();
                elementRange.selectNode(element);
                if (currentSelectionRange.compareBoundaryPoints(Range.END_TO_START, elementRange) < 0 &&
                    currentSelectionRange.compareBoundaryPoints(Range.START_TO_END, elementRange) > 0) {
                    const text = document.createTextNode(element.textContent || '');
                    element.parentNode.replaceChild(text, element);
                }
            });

            editor.normalize();

            saveSelection();
            triggerSave();
            updateCounts();
            updateToolbarState();
        }, 0);
    }

    function getNodesInRange(range) {
        const nodes = [];
        if (!range || !editor.contains(range.commonAncestorContainer)) {
            return nodes;
        }
        const root = range.commonAncestorContainer;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, {
            acceptNode: function (node) {
                const nodeRange = document.createRange();
                try {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        nodeRange.selectNode(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        nodeRange.selectNode(node);
                    } else {
                        return NodeFilter.FILTER_REJECT;
                    }


                    if (range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >= 0 ||
                        range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <= 0) {
                        if (!nodeRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 ||
                            !nodeRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0) {
                            return NodeFilter.FILTER_SKIP;
                        }
                    }
                    return NodeFilter.FILTER_ACCEPT;

                } catch (e) {
                    console.warn("Error processing node during range check:", node, e);
                    return NodeFilter.FILTER_REJECT;
                }
            }
        });

        const rootRange = document.createRange();
        try {
            rootRange.selectNode(root);
            if (!(range.compareBoundaryPoints(Range.END_TO_START, rootRange) >= 0 || range.compareBoundaryPoints(Range.START_TO_END, rootRange) <= 0)) {
                if (root !== editor) nodes.push(root);
            }
        } catch (e) { /* Ignore */ }


        while (walker.nextNode()) {
            if (walker.currentNode !== editor) {
                nodes.push(walker.currentNode);
            }
        }

        return [...new Set(nodes)];
    }


    function updateToolbarState() {
        if (FindReplace.isVisibile()) return;

        if (!currentSelectionRange || !editor.contains(currentSelectionRange.commonAncestorContainer)) {
            toolbar.querySelectorAll('button[data-command]').forEach(btn => btn.classList.remove('active'));
            return;
        }

        toolbar.querySelectorAll('button[data-command]').forEach(btn => btn.classList.remove('active'));

        try {
            if (document.queryCommandState('bold')) toolbar.querySelector('[data-command="bold"]')?.classList.add('active');
            if (document.queryCommandState('italic')) toolbar.querySelector('[data-command="italic"]')?.classList.add('active');
            if (document.queryCommandState('strikeThrough')) toolbar.querySelector('[data-command="strikethrough"]')?.classList.add('active');
            if (document.queryCommandState('insertUnorderedList')) toolbar.querySelector('[data-command="unorderedList"]')?.classList.add('active');
            if (document.queryCommandState('insertOrderedList')) toolbar.querySelector('[data-command="orderedList"]')?.classList.add('active');
        } catch (e) {
            console.error("Error calling queryCommandState:", e);
        }

        if (isBlockFormatActive('h1')) toolbar.querySelector('[data-command="h1"]')?.classList.add('active');
        if (isBlockFormatActive('h2')) toolbar.querySelector('[data-command="h2"]')?.classList.add('active');
        if (isBlockFormatActive('h3')) toolbar.querySelector('[data-command="h3"]')?.classList.add('active');
        if (isBlockFormatActive('h4')) toolbar.querySelector('[data-command="h4"]')?.classList.add('active');
        if (isBlockFormatActive('h5')) toolbar.querySelector('[data-command="h5"]')?.classList.add('active');
        if (isBlockFormatActive('h6')) toolbar.querySelector('[data-command="h6"]')?.classList.add('active');
        if (isBlockFormatActive('blockquote')) toolbar.querySelector('[data-command="blockquote"]')?.classList.add('active');
        if (isBlockFormatActive('codeBlock')) toolbar.querySelector('[data-command="codeBlock"]')?.classList.add('active');

        if (isInlineStyleActive('CODE')) toolbar.querySelector('[data-command="inlineCode"]')?.classList.add('active');
        if (isInlineStyleActive('MARK')) toolbar.querySelector('[data-command="highlight"]')?.classList.add('active');

        if (getClosestAncestor(currentSelectionRange.commonAncestorContainer, 'A')) {
            toolbar.querySelector('[data-command="unlink"]')?.classList.add('active');
            toolbar.querySelector('[data-command="createLink"]')?.classList.add('active');
        }
    }

    function showModal(modalElement) {
        modalOverlay.classList.remove('hidden');
        modalElement.classList.remove('hidden');
        document.body.classList.add('modal-open');
        setTimeout(() => {
            const firstInput = modalElement.querySelector('input:not([type="hidden"]), textarea, select');
            if (firstInput) {
                firstInput.focus();
                if (firstInput.select) firstInput.select();
            }
        }, 50);
    }
    function hideModal(modalElement) {
        modalElement.classList.add('hidden');
        if (linkModal.classList.contains('hidden') &&
            imageModal.classList.contains('hidden') &&
            tableModal.classList.contains('hidden')) {
            modalOverlay.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
        editor.focus();
        restoreSelection();
        updateToolbarState();
    }
    function hideAllModals() {
        [linkModal, imageModal, tableModal].forEach(hideModal);
    }
    function showLinkModal() {
        saveSelection();
        const urlInput = linkModal.querySelector('#link-url');
        const anchor = getClosestAncestor(currentSelectionRange?.commonAncestorContainer, 'A');
        if (anchor && editor.contains(anchor)) {
            urlInput.value = anchor.getAttribute('href') || '';
        } else {
            const selectedText = currentSelectionRange?.toString() || '';
            if (selectedText && (selectedText.startsWith('http://') || selectedText.startsWith('https://') || selectedText.includes('.'))) {
                urlInput.value = selectedText;
            } else {
                urlInput.value = 'https://';
            }
        }
        showModal(linkModal);
        setTimeout(() => urlInput.select(), 50);
    }
    function hideLinkModal() { hideModal(linkModal); }
    function insertLinkFromModal() {
        const url = linkModal.querySelector('#link-url').value.trim();
        restoreSelection();
        if (!currentSelectionRange) {
            editor.focus();
            hideLinkModal();
            return;
        }
        editor.focus();
        restoreSelection();

        const anchor = getClosestAncestor(currentSelectionRange.commonAncestorContainer, 'A');

        if (url && url !== 'https://') {
            if (anchor && editor.contains(anchor)) {
                const linkRange = document.createRange();
                linkRange.selectNode(anchor);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(linkRange);
                document.execCommand('createLink', false, url);
            }
            else if (currentSelectionRange.collapsed) {
                document.execCommand('insertText', false, url);
                const node = currentSelectionRange.startContainer;
                const offset = currentSelectionRange.startOffset;
                if (node.nodeType === Node.TEXT_NODE && offset >= url.length) {
                    const range = document.createRange();
                    range.setStart(node, offset - url.length);
                    range.setEnd(node, offset);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand('createLink', false, url);
                    range.collapse(false);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                }
            }
            else {
                document.execCommand('createLink', false, url);
            }
            saveSelection();
            triggerSave();
            updateCounts();
        } else if (!url || url === 'https://') {
            if (anchor && editor.contains(anchor)) {
                const linkRange = document.createRange();
                linkRange.selectNode(anchor);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(linkRange);
                document.execCommand('unlink', false, null);
                saveSelection();
                triggerSave();
                updateCounts();
            }
        }
        hideLinkModal();
    }
    function showImageModal() { saveSelection(); imageModal.querySelector('#image-url').value = ''; showModal(imageModal); }
    function hideImageModal() { hideModal(imageModal); }
    function insertImageFromModal() {
        const url = imageModal.querySelector('#image-url').value.trim();
        restoreSelection();
        if (url) {
            editor.focus();
            restoreSelection();
            document.execCommand('insertImage', false, url);
            setTimeout(() => {
                restoreSelection();
                if (currentSelectionRange && currentSelectionRange.collapsed) {
                    const container = currentSelectionRange.startContainer;
                    const previousElement = container.nodeType === Node.ELEMENT_NODE ? container : container.previousSibling;
                    if (previousElement && previousElement.tagName === 'IMG') {
                        const p = document.createElement('p');
                        p.innerHTML = '​';
                        editor.insertBefore(p, previousElement.nextSibling);
                        const newRange = document.createRange();
                        newRange.setStart(p.firstChild, 1);
                        newRange.collapse(true);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(newRange);
                        saveSelection();
                    }
                }
                triggerSave();
                updateCounts();
            }, 0);
        }
        hideImageModal();
    }
    function showTableModal() { saveSelection(); tableModal.querySelector('#table-rows').value = 3; tableModal.querySelector('#table-cols').value = 3; showModal(tableModal); }
    function hideTableModal() { hideModal(tableModal); }
    function createTableFromModal() {
        const rows = parseInt(tableModal.querySelector('#table-rows').value, 10);
        const cols = parseInt(tableModal.querySelector('#table-cols').value, 10);
        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
            alert("Please enter valid numbers (at least 1) for rows and columns.");
            return;
        }

        let tableHTML = '<table><thead><tr>';
        for (let j = 0; j < cols; j++) tableHTML += `<th>Header ${j + 1}</th>`;
        tableHTML += '</tr></thead><tbody>';
        for (let i = 0; i < Math.max(0, rows - 1); i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) tableHTML += `<td>Cell</td>`;
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table><p>​</p>';

        restoreSelection();
        editor.focus();
        restoreSelection();

        document.execCommand('insertHTML', false, tableHTML);

        setTimeout(() => {
            const firstCell = editor.querySelector('table:last-of-type th, table:last-of-type td');
            if (firstCell) {
                const range = document.createRange();
                range.selectNodeContents(firstCell);
                range.collapse(true);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                saveSelection();
            } else {
                saveSelection();
            }
            triggerSave();
            updateCounts();
        }, 50);

        hideTableModal();
    }


    function convertHtmlToMarkdown() {
        const clonedEditor = editor.cloneNode(true);

        clonedEditor.innerHTML = clonedEditor.innerHTML.replace(/\u200B/g, '');
        clonedEditor.querySelectorAll('p').forEach(p => {
            if (!p.textContent.trim() && !p.querySelector('img, hr, br, table')) {
                p.remove();
            }
        });
        clonedEditor.querySelectorAll('.find-match').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) { parent.insertBefore(span.firstChild, span); }
                span.remove();
                parent.normalize();
            }
        });
        clonedEditor.querySelectorAll('pre > code').forEach(code => {
            const pre = code.parentNode;
            if (pre && pre.tagName === 'PRE') {
                pre.innerHTML = code.innerHTML;
            }
        });
        clonedEditor.querySelectorAll('mark').forEach(mark => {
            const textContent = mark.textContent;
            if (textContent) {
                mark.parentNode.replaceChild(document.createTextNode(`==${textContent}==`), mark);
            } else {
                mark.remove();
            }
        });


        let htmlContent = clonedEditor.innerHTML;
        let markdown = turndownService.turndown(htmlContent);

        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        markdown = markdown.trim();

        return markdown;
    }

    function preprocessMarkdownForLoading(markdown) {
        let processed = markdown.replace(/(?<!\\)==([^=]+?)==/g, '<mark>$1</mark>');
        processed = processed.replace(/\\==/g, '==');
        return processed;
    }

    function loadMarkdown(markdown) {
        try {
            if (viewMode === 'markdown') {
                // In markdown mode, just show the raw markdown in a single editable area
                // We'll use a textarea-like div instead of pre/code to allow normal editing
                editor.innerHTML = '';
                editor.setAttribute('data-view-mode', 'markdown');
                editor.setAttribute('contenteditable', 'true');
                editor.classList.add('markdown-mode');
                
                // Create a div with white-space: pre-wrap to maintain line breaks
                const markdownDiv = document.createElement('div');
                markdownDiv.className = 'markdown-content';
                markdownDiv.textContent = markdown || '';
                editor.appendChild(markdownDiv);
            } else {
                // In live mode, render the markdown as HTML
                editor.classList.remove('markdown-mode');
                const processedMarkdown = preprocessMarkdownForLoading(markdown || '');
                const htmlContent = marked.parse(processedMarkdown);
                editor.innerHTML = htmlContent;
                editor.setAttribute('data-view-mode', 'live');
                editor.setAttribute('contenteditable', 'true');
                editor.querySelectorAll('pre').forEach(pre => {
                    if (!pre.querySelector('code')) {
                        pre.innerHTML = `<code>${pre.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
                    }
                });
            }
            updateCounts();
            updateToolbarState();
        } catch (error) {
            console.error("Error parsing Markdown:", error);
            editor.innerHTML = '<p>Error loading content.</p>';
        }
    }

    function saveContent() {
        try {
            let markdownContent;
            if (viewMode === 'markdown') {
                // In markdown mode, get the raw markdown from the editor
                const markdownElement = editor.querySelector('.markdown-content');
                if (markdownElement) {
                    markdownContent = markdownElement.textContent;
                } else {
                    // Fallback to any content in the editor
                    markdownContent = editor.textContent;
                }
            } else {
                // In live mode, convert HTML to markdown
                markdownContent = convertHtmlToMarkdown();
            }
            localStorage.setItem(STORAGE_KEY, markdownContent);
            localStorage.setItem(STORAGE_KEY_LAST_MODIFIED, new Date().toISOString());
            showSaveIndicator();
            updateLastModified();
        } catch (error) {
            console.error("Error saving content:", error);
        }
    }

    function loadContent() {
        try {
            const savedMarkdown = localStorage.getItem(STORAGE_KEY);
            if (savedMarkdown !== null) {
                loadMarkdown(savedMarkdown);
            } else {
                loadMarkdown('# Welcome to Your Markdown Editor!\n\nThis is a simple tool to draft README files and other markdown content. No need to install anything.\n\nYou don’t have to remember markdown syntax. Just select text and pick a style headings, bold, lists, links, everything’s built in. You can close or reload the tab anytime. Your work stays saved in your browser unless the cache is cleared.\n\nYou can also import or export your files when needed. Please note that this tool is not well optimized for mobile devices.\n\nStart writing your content...');
                saveContent();
            }
        } catch (error) {
            console.error("Error loading content:", error);
            editor.innerHTML = '<p>Error loading content from local storage.</p>';
        }
        updateLastModified();
    }

    function showSaveIndicator() {
        saveIndicator.classList.remove('hidden');
        saveIndicator.classList.add('visible');
        setTimeout(() => {
            saveIndicator.classList.remove('visible');
            saveIndicator.addEventListener('transitionend', () => {
                saveIndicator.classList.add('hidden');
            }, { once: true });
        }, 1500);
    }

    function exportMarkdown() {
        try {
            const markdownContent = convertHtmlToMarkdown();
            const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 15);
            a.download = `document-${timestamp}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting Markdown:", error);
            alert("Failed to export Markdown.");
        }
    }

    function updateCounts() {
        const text = editor.innerText || '';
        const characters = text.length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;

        charCountElement.textContent = `${characters} character${characters !== 1 ? 's' : ''}`;
        wordCountElement.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    }

    function getSelectedHtml() {
        if (!currentSelectionRange || currentSelectionRange.collapsed) return '';
        try {
            const contents = currentSelectionRange.cloneContents();
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(contents);
            return tempDiv.innerHTML;
        } catch (e) {
            console.error("Error getting selected HTML:", e);
            return '';
        }
    }

    function getClosestBlockElement(node) {
        if (!node || node === editor) return null;
        let current = (node.nodeType === Node.TEXT_NODE) ? node.parentNode : node;

        while (current && current !== editor) {
            if (current.nodeType === Node.ELEMENT_NODE) {
                const displayStyle = getComputedStyle(current).display;
                if (['block', 'list-item', 'table', 'flex', 'grid'].includes(displayStyle) ||
                    ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'PRE', 'BLOCKQUOTE', 'LI', 'TABLE', 'UL', 'OL', 'FIGURE', 'FIGCAPTION'].includes(current.tagName)) {
                    if (!['SPAN', 'A', 'CODE', 'MARK', 'EM', 'STRONG', 'DEL', 'I', 'B', 'SUB', 'SUP'].includes(current.tagName)) {
                        return current;
                    }
                }
            }
            current = current.parentNode;
        }
        return null;
    }


    function updateLastModified() {
        const lastModifiedISO = localStorage.getItem(STORAGE_KEY_LAST_MODIFIED);
        if (lastModifiedISO) {
            const date = new Date(lastModifiedISO);
            const options = {
                hour: '2-digit', minute: '2-digit', hour12: true
            };
            modifiedTimeElement.textContent = `${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} at ${date.toLocaleTimeString('en-US', options)}`;
        } else {
            modifiedTimeElement.textContent = "Not saved yet";
        }
    }

    // Function to toggle between markdown and live view
    function toggleViewMode() {
        // Toggle the view mode
        viewMode = viewMode === 'live' ? 'markdown' : 'live';
        
        // Save the preference
        localStorage.setItem(STORAGE_KEY_VIEW_MODE, viewMode);
        
        // Update the toggle button icon
        updateViewModeButton();
        
        // Reload the content in the new view mode
        const content = localStorage.getItem(STORAGE_KEY);
        if (content) {
            loadMarkdown(content);
        }
    }
    
    // Function to update the view mode button based on current mode
    function updateViewModeButton() {
        const viewModeButton = document.querySelector('button[data-command="toggleViewMode"]');
        if (viewModeButton) {
            const icon = viewModeButton.querySelector('i');
            if (viewMode === 'markdown') {
                icon.className = 'ph ph-monitor';
                viewModeButton.title = 'Switch to Live View';
                viewModeButton.classList.add('active');
            } else {
                icon.className = 'ph ph-eye';
                viewModeButton.title = 'Switch to Markdown View';
                viewModeButton.classList.remove('active');
            }
        }
    }
    
    // Function to show the clear data confirmation popover
    function showClearDataPopover(event) {
        event.stopPropagation(); // Prevent event bubbling
        
        // Create popover if it doesn't exist
        let clearPopover = document.getElementById('clear-data-popover');
        
        if (clearPopover) {
            // If it exists but is hidden, show it
            if (clearPopover.classList.contains('hidden')) {
                positionPopover(clearPopover, event);
                clearPopover.classList.remove('hidden');
            } else {
                clearPopover.classList.add('hidden');
            }
            return;
        }
        
        // Create the popover
        clearPopover = document.createElement('div');
        clearPopover.id = 'clear-data-popover';
        clearPopover.className = 'clear-data-popover';
        clearPopover.innerHTML = `
            <div class="clear-data-content">
                <h3>Clear All Data</h3>
                <p>This will reset everything and open a blank editor. This action cannot be undone.</p>
                <div class="clear-data-actions">
                    <button type="button" id="clear-data-cancel">Cancel</button>
                    <button type="button" id="clear-data-confirm">Clear All Data</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(clearPopover);
        
        // Position the popover near the click position
        positionPopover(clearPopover, event);
        
        // Add event listeners for the buttons
        const cancelButton = document.getElementById('clear-data-cancel');
        const confirmButton = document.getElementById('clear-data-confirm');
        
        // Remove any existing event listeners
        const newCancelButton = cancelButton.cloneNode(true);
        const newConfirmButton = confirmButton.cloneNode(true);
        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
        confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
        
        // Add new event listeners
        newCancelButton.addEventListener('click', (e) => {
            e.stopPropagation();
            clearPopover.classList.add('hidden');
        });
        
        newConfirmButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Clear all stored data
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY_LAST_MODIFIED);
            
            // Reset the editor
            if (viewMode === 'markdown') {
                const markdownDiv = document.createElement('div');
                markdownDiv.className = 'markdown-content';
                editor.innerHTML = '';
                editor.appendChild(markdownDiv);
            } else {
                editor.innerHTML = '';
            }
            
            updateCounts();
            updateLastModified();
            
            // Hide the popover
            clearPopover.classList.add('hidden');
            
            // Show confirmation
            showSaveIndicator();
        });
        
        // Function to position the popover near the click
        function positionPopover(popover, event) {
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Set initial position near the click
            popover.style.left = `${clickX}px`;
            popover.style.top = `${clickY + 20}px`; // 20px below the click
            
            // Make sure the popover is fully visible
            setTimeout(() => {
                const popoverRect = popover.getBoundingClientRect();
                
                // Adjust horizontal position if needed
                if (popoverRect.right > viewportWidth) {
                    popover.style.left = `${viewportWidth - popoverRect.width - 10}px`;
                }
                if (popoverRect.left < 0) {
                    popover.style.left = '10px';
                }
                
                // Adjust vertical position if needed
                if (popoverRect.bottom > viewportHeight) {
                    popover.style.top = `${clickY - popoverRect.height - 10}px`;
                }
                if (popoverRect.top < 0) {
                    popover.style.top = '10px';
                }
            }, 0);
        }
        
        // Close popover when clicking outside
        const handleOutsideClick = (e) => {
            if (clearPopover && !clearPopover.contains(e.target) && e.target !== statsContainer) {
                clearPopover.classList.add('hidden');
                document.removeEventListener('click', handleOutsideClick);
            }
        };
        
        // Add the event listener after a short delay to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
    
    // Add event listener to stats container for clear data option
    statsContainer.addEventListener('click', showClearDataPopover);
    
    // Add event listener for keydown in markdown mode to handle Enter key
    editor.addEventListener('keydown', function(e) {
        if (viewMode === 'markdown' && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            // Get the markdown content element
            const markdownContent = editor.querySelector('.markdown-content');
            if (!markdownContent) return;
            
            // Get current selection
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            
            const range = selection.getRangeAt(0);
            
            // Insert a newline character at the current cursor position
            const newlineNode = document.createTextNode('\n');
            range.insertNode(newlineNode);
            
            // Move the cursor after the inserted newline
            range.setStartAfter(newlineNode);
            range.setEndAfter(newlineNode);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Trigger content save
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, SAVE_DELAY);
        }
    });
    
    loadContent();

    if (!FindReplace.init(editor, triggerSave)) {
        console.error("Failed to initialize Find & Replace module");
        const frButton = toolbar.querySelector('button[data-command="findReplace"]');
        if (frButton) frButton.disabled = true;
    }
    
    // Initialize view mode
    updateViewModeButton();
    
    toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const command = button.dataset.command;

        if (command === 'findReplace') {
            return;
        }

        if (button.id === 'import-btn') { importFileInput.click(); return; }
        if (button.id === 'export-btn') { exportMarkdown(); return; }

        if (command) {
            if (FindReplace.isVisibile()) {
                FindReplace.close();
            }
            saveSelection();
            if (command === 'toggleViewMode') {
                toggleViewMode();
            } else if (viewMode === 'markdown' && !['findReplace', 'toggleViewMode'].includes(command)) {
                // In markdown mode, only allow find/replace and view toggle
                alert('Please switch to Live View to use formatting tools');
            } else {
                handleCommand(command);
            }
        }
    });

    editor.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, SAVE_DELAY);
        updateCounts();
    });

    // Handle paste events to properly process markdown text
    editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text');
        const selection = window.getSelection();

        if (viewMode === 'markdown') {
            // In markdown mode, just insert the text as is
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(pastedData);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else {
            // In live mode, check if it's markdown and render it
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                
                // Check if the pasted content looks like markdown
                if (pastedData.match(/^(#{1,6}\s|>\s|\*\s|\d+\.\s|\-\s|```|\[.*\]\(.*\)|\|.*\|)/m)) {
                    // It looks like markdown, parse it
                    const processedMarkdown = preprocessMarkdownForLoading(pastedData);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = marked.parse(processedMarkdown);
                    
                    // Insert each child of the parsed markdown
                    while (tempDiv.firstChild) {
                        range.insertNode(tempDiv.firstChild);
                        range.collapse(false);
                    }
                } else {
                    // Regular text, insert as is
                    const textNode = document.createTextNode(pastedData);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                }
                
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        triggerSave();
    });

    editor.addEventListener('click', (e) => {
        setTimeout(updateToolbarState, 0);
        const link = e.target.closest('a');
        if (link && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            window.open(link.href, '_blank', 'noopener noreferrer');
        }
    });

    document.addEventListener('selectionchange', () => {
        const findReplaceActive = FindReplace.isVisibile();
        const findReplaceHasFocus = findReplaceActive && document.activeElement && document.querySelector('.find-replace-container')?.contains(document.activeElement);

        if (document.activeElement === editor || findReplaceHasFocus) {
            saveSelection();
            updateCounts();
            updateToolbarState();
        } else if (!findReplaceActive) {
            updateToolbarState();
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault(); clearTimeout(saveTimeout); saveContent();
        }
        if (!FindReplace.isVisibile()) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); handleCommand('bold'); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); handleCommand('italic'); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleCommand('undo'); }
            if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) { e.preventDefault(); handleCommand('redo'); }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            FindReplace.open();
        }

        if (e.key === 'Escape') {
            if (FindReplace.isVisibile()) {
                // F/R module handles escape via its input listeners
            } else if (!modalOverlay.classList.contains('hidden')) {
                e.preventDefault();
                hideAllModals();
            }
        }
    });

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const markdownContent = event.target.result;
                loadMarkdown(markdownContent);
                importFileInput.value = null;
                saveContent();
            };
            reader.onerror = () => {
                console.error("Error reading file");
                alert("Error reading the selected file.");
                importFileInput.value = null;
            }
            reader.readAsText(file);
        }
    });

    modalOverlay.addEventListener('click', hideAllModals);
    linkModal.querySelector('#link-cancel').addEventListener('click', hideLinkModal);
    linkModal.querySelector('#link-insert').addEventListener('click', insertLinkFromModal);
    linkModal.querySelector('#link-url').addEventListener('keydown', (e) => { if (e.key === 'Enter') insertLinkFromModal(); });
    imageModal.querySelector('#image-cancel').addEventListener('click', hideImageModal);
    imageModal.querySelector('#image-insert').addEventListener('click', insertImageFromModal);
    imageModal.querySelector('#image-url').addEventListener('keydown', (e) => { if (e.key === 'Enter') insertImageFromModal(); });
    tableModal.querySelector('#table-cancel').addEventListener('click', hideTableModal);
    tableModal.querySelector('#table-create').addEventListener('click', createTableFromModal);
    tableModal.querySelector('#table-rows').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); tableModal.querySelector('#table-cols').focus(); } });
    tableModal.querySelector('#table-cols').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); createTableFromModal(); } });

});