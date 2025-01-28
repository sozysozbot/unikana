"use strict";
let cursoredBox = 0;
// get the currently highlighted input element
function getHighlightedInput() {
    const v = document.querySelector("input:focus");
    if (!v) {
        return document.getElementById("codepoint" + cursoredBox);
    }
    return v;
}
function moveFocusToNextInput() {
    cursoredBox = (cursoredBox + 1) % 2 /* TODO */;
    const nextInput = document.getElementById("codepoint" + cursoredBox);
    nextInput.focus();
    nextInput.setSelectionRange(0, 0);
}
function sync_triggered_from_textinput(i) {
    let success = true;
    document.getElementById("judgement_when_completed").textContent = "";
    const codepointInput = document.getElementById("codepoint" + i);
    const codepoint = codepointInput.value;
    const char_div = document.getElementById("char" + i);
    // Delete offending characters
    if (!codepointInput.checkValidity()) {
        if (success) {
            playBeepSound();
            success = false;
        }
        codepointInput.value = "";
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
    else if (codepoint === "") {
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
    else {
        char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint, 16));
        char_div.classList.remove("unfilled-char-cell");
        // If this completes the codepoint, 
        if (codepoint.length === 1 /*TODO*/) {
            // move to the next input
            moveFocusToNextInput();
        }
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
    if (inputElement.value.length === 1 /*TODO*/) {
        // move to the next input
        moveFocusToNextInput();
    }
    const previousValue = currentValue;
    syncAll_triggered_from_custom_keyboard(previousValue);
}
function syncAll_triggered_from_custom_keyboard(previousValue) {
    let success = true;
    document.getElementById("judgement_when_completed").textContent = "";
    for (let i = 0; i < 2; i++) {
        const codepointInput = document.getElementById("codepoint" + i);
        const codepoint = codepointInput.value;
        const char_div = document.getElementById("char" + i);
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
                char_div.textContent = String.fromCodePoint(parseInt("306" + previousValue, 16));
                char_div.classList.remove("unfilled-char-cell");
            }
        }
        else if (codepoint === "") {
            char_div.textContent = "";
            char_div.classList.add("unfilled-char-cell");
        }
        else {
            char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint, 16));
            char_div.classList.remove("unfilled-char-cell");
        }
    }
    if (success) {
        playClickSound();
        checkSolution();
    }
}
let stageIndex = 0;
let __stageChallengeTexts = [];
let targetText = "";
let nextStagePageName = "";
function checkSolution() {
    const char0 = document.getElementById("char0").textContent ?? "";
    const char1 = document.getElementById("char1").textContent ?? "";
    if (char0 + char1 === targetText) {
        document.getElementById("judgement_when_completed").textContent = "✅";
        setTimeout(() => {
            playSuccessSound();
            setTimeout(() => {
                nextStage();
            }, 500);
        }, 150);
    }
}
function initializeStageChallenge(o) {
    nextStagePageName = o.nextStagePageName;
    const stageChallengeElement = document.getElementById("challenge-text");
    stageChallengeElement.innerHTML = convertStageToRuby(o.stageChallengeTexts[0].challenge);
    targetText = extractKanaText(o.stageChallengeTexts[0].challenge);
    __stageChallengeTexts = o.stageChallengeTexts;
}
function nextStage() {
    stageIndex++;
    if (stageIndex >= __stageChallengeTexts.length) {
        alert("ステージクリア！");
        location.href = `./${nextStagePageName}.html`;
        throw new Error("ステージクリア");
    }
    // Update the stage challenge text
    const stageChallengeElement = document.getElementById("challenge-text");
    stageChallengeElement.innerHTML = convertStageToRuby(__stageChallengeTexts[stageIndex].challenge);
    targetText = extractKanaText(__stageChallengeTexts[stageIndex].challenge);
    document.getElementById("judgement_when_completed").textContent = "";
    // Clear the input boxes
    for (let i = 0; i < 2; i++) {
        const codepointInput = document.getElementById("codepoint" + i);
        codepointInput.value = "";
        const char_div = document.getElementById("char" + i);
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    }
}
