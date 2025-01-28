"use strict";
const UI_STATE = { cursoredBox: 0 };
const STAGE_STATE = { stageIndex: 0, stageChallengeTexts: [], targetText: "", nextStagePageName: "", hexPrefix: "", expectedHexLength: 1 };
// get the currently highlighted input element
function getHighlightedInput() {
    const v = document.querySelector("input:focus");
    if (!v) {
        return document.getElementById("codepoint" + UI_STATE.cursoredBox);
    }
    return v;
}
function moveFocusToNextInput() {
    UI_STATE.cursoredBox = (UI_STATE.cursoredBox + 1) % STAGE_STATE.targetText.length;
    const nextInput = document.getElementById("codepoint" + UI_STATE.cursoredBox);
    nextInput.focus();
    nextInput.setSelectionRange(0, 0);
}
function sync_triggered_from_textinput(i) {
    let success = true;
    document.getElementById("judgement_when_completed").textContent = "";
    const codepointInput = document.getElementById("codepoint" + i);
    const codepoint = codepointInput.value;
    const char_div = document.getElementById("char" + i);
    if (codepoint === "") {
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
    else if (codepointInput.checkValidity()) {
        char_div.textContent = String.fromCodePoint(parseInt(STAGE_STATE.hexPrefix + codepoint, 16));
        char_div.classList.remove("unfilled-char-cell");
        // If this completes the codepoint, 
        if (codepoint.length === STAGE_STATE.expectedHexLength) {
            // move to the next input
            moveFocusToNextInput();
        }
    }
    else if (codepoint.length === STAGE_STATE.expectedHexLength) {
        if (success) {
            playBeepSound();
            success = false;
        }
        codepointInput.value = "";
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
    if (success) {
        playClickSound();
        checkSolution();
    }
}
function insertAtCursor(textToInsert) {
    const inputElement = getHighlightedInput();
    const currentValue = inputElement.value;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    inputElement.value = currentValue.slice(0, start) + textToInsert + currentValue.slice(end);
    inputElement.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    // If this completes the codepoint, 
    if (inputElement.value.length === STAGE_STATE.expectedHexLength) {
        // move to the next input
        moveFocusToNextInput();
    }
    const previousValue = currentValue;
    syncAll_triggered_from_custom_keyboard(previousValue);
}
function syncAll_triggered_from_custom_keyboard(previousValue) {
    let success = true;
    document.getElementById("judgement_when_completed").textContent = "";
    for (let i = 0; i < STAGE_STATE.targetText.length; i++) {
        const codepointInput = document.getElementById("codepoint" + i);
        const codepoint = codepointInput.value;
        const char_div = document.getElementById("char" + i);
        if (STAGE_STATE.expectedHexLength === 1) {
            // Delete offending characters
            if (!codepointInput.checkValidity()) {
                if (success) {
                    playBeepSound();
                    success = false;
                }
                if (previousValue === undefined) {
                    codepointInput.value = "";
                    char_div.textContent = "";
                    char_div.classList.add("unfilled-char-cell");
                }
                else {
                    codepointInput.value = previousValue;
                    char_div.textContent = String.fromCodePoint(parseInt(STAGE_STATE.hexPrefix + previousValue, 16));
                    char_div.classList.remove("unfilled-char-cell");
                }
            }
            else if (codepoint === "") {
                char_div.textContent = "";
                char_div.classList.add("unfilled-char-cell");
            }
            else {
                char_div.textContent = String.fromCodePoint(parseInt(STAGE_STATE.hexPrefix + codepoint, 16));
                char_div.classList.remove("unfilled-char-cell");
            }
        }
        else {
            if (codepoint === "") {
                char_div.textContent = "";
                char_div.classList.add("unfilled-char-cell");
            }
            else if (codepointInput.checkValidity()) {
                char_div.textContent = String.fromCodePoint(parseInt(STAGE_STATE.hexPrefix + codepoint, 16));
                char_div.classList.remove("unfilled-char-cell");
            }
            else if (codepoint.length === STAGE_STATE.expectedHexLength) {
                if (success) {
                    playBeepSound();
                    success = false;
                }
                if (previousValue === undefined) {
                    codepointInput.value = "";
                    char_div.textContent = "";
                    char_div.classList.add("unfilled-char-cell");
                }
                else {
                    codepointInput.value = previousValue;
                    char_div.textContent = String.fromCodePoint(parseInt(STAGE_STATE.hexPrefix + previousValue, 16));
                    char_div.classList.remove("unfilled-char-cell");
                }
            }
        }
    }
    if (success) {
        playClickSound();
        checkSolution();
    }
}
function checkSolution() {
    const len = STAGE_STATE.targetText.length;
    for (let i = 0; i < len; i++) {
        if (document.getElementById("char" + i).textContent === "") {
            return;
        }
    }
    let chars = "";
    for (let i = 0; i < len; i++) {
        chars += document.getElementById("char" + i).textContent;
    }
    if (chars === STAGE_STATE.targetText) {
        document.getElementById("judgement_when_completed").textContent = "✅";
        UI_STATE.cursoredBox = 0;
        setTimeout(() => {
            playSuccessSound();
            setTimeout(() => {
                nextStage();
            }, 500);
        }, 150);
    }
}
function initializeStageChallenge(o) {
    STAGE_STATE.hexPrefix = o.hexPrefix;
    STAGE_STATE.expectedHexLength = o.expectedHexLength;
    STAGE_STATE.nextStagePageName = o.nextStagePageName;
    const stageChallengeElement = document.getElementById("challenge-text");
    stageChallengeElement.innerHTML = convertStageToRuby(o.stageChallengeTexts[0].challenge);
    STAGE_STATE.targetText = extractKanaText(o.stageChallengeTexts[0].challenge);
    STAGE_STATE.stageChallengeTexts = o.stageChallengeTexts;
    const commentaryElement = document.getElementById("commentary-text");
    commentaryElement.textContent = STAGE_STATE.stageChallengeTexts[0].commentary || "\u00A0";
}
function nextStage() {
    STAGE_STATE.stageIndex++;
    if (STAGE_STATE.stageIndex >= STAGE_STATE.stageChallengeTexts.length) {
        alert("ステージクリア！");
        location.href = `./${STAGE_STATE.nextStagePageName}.html`;
        throw new Error("ステージクリア");
    }
    // Update the stage challenge text
    const stageChallengeElement = document.getElementById("challenge-text");
    stageChallengeElement.innerHTML = convertStageToRuby(STAGE_STATE.stageChallengeTexts[STAGE_STATE.stageIndex].challenge);
    STAGE_STATE.targetText = extractKanaText(STAGE_STATE.stageChallengeTexts[STAGE_STATE.stageIndex].challenge);
    const commentaryElement = document.getElementById("commentary-text");
    commentaryElement.textContent = STAGE_STATE.stageChallengeTexts[STAGE_STATE.stageIndex].commentary;
    document.getElementById("judgement_when_completed").textContent = "";
    // Clear the input boxes
    for (let i = 0; i < STAGE_STATE.targetText.length; i++) {
        const codepointInput = document.getElementById("codepoint" + i);
        codepointInput.value = "";
        const char_div = document.getElementById("char" + i);
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
}
