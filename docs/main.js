let cursoredBox = 0;

// get the currently highlighted input element
function getHighlightedInput() {
    const v = document.querySelector("input:focus");
    if (!v) {
        return document.getElementById("codepoint" + cursoredBox);
    }
    return v;
}

function insertAtCursor(textToInsert) {
    const inputElement = getHighlightedInput();
    const currentValue = inputElement.value;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    inputElement.value = currentValue.slice(0, start) + textToInsert + currentValue.slice(end);
    inputElement.setSelectionRange(start + textToInsert.length, start + textToInsert.length);

    // If this completes the codepoint, move to the next input
    if (inputElement.value.length === 1 /*TODO*/) {
        cursoredBox = (cursoredBox + 1) % 2 /* TODO */;
        const nextInput = document.getElementById("codepoint" + cursoredBox);
        nextInput.focus();
        nextInput.setSelectionRange(0, 0);
    }

    const previousValue = currentValue;
    syncAll_triggered_from_custom_keyboard(previousValue);
}

function sync_triggered_from_textinput(i) {
    let success = true;
    let codepoint_input = document.getElementById("codepoint" + i).value;
    const char_div = document.getElementById("char" + i);

    // Delete offending characters
    if (!document.getElementById("codepoint" + i).checkValidity()) {
        if (success) {
            beepSound();
            success = false;
        }

        document.getElementById("codepoint" + i).value = "";
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    } else if (codepoint_input === "") {
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    } else {
        char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint_input, 16));
        char_div.classList.remove("unfilled-char-cell");

        // If this completes the codepoint, move to the next input
        if (codepoint_input.length === 1 /*TODO*/) {
            cursoredBox = (i + 1) % 2 /* TODO */;
            const nextInput = document.getElementById("codepoint" + cursoredBox);
            nextInput.focus();
            nextInput.setSelectionRange(0, 0);
        }
    }

    if (success) {
        clickSound();
    }
}

function syncAll_triggered_from_custom_keyboard(previousValue) {
    let success = true;
    for (let i = 0; i < 2; i++) {
        let codepoint_input = document.getElementById("codepoint" + i).value;
        const char_div = document.getElementById("char" + i);

        // Delete offending characters
        if (!document.getElementById("codepoint" + i).checkValidity()) {
            if (success) {
                beepSound();
                success = false;
            }

            if (previousValue === undefined) {
                document.getElementById("codepoint" + i).value = "";
                char_div.textContent = "";
                char_div.classList.add("unfilled-char-cell");
            } else {
                document.getElementById("codepoint" + i).value = previousValue;
                char_div.textContent = String.fromCodePoint(parseInt("306" + previousValue, 16));
                char_div.classList.remove("unfilled-char-cell");
            }
        } else if (codepoint_input === "") {
            char_div.textContent = "";
            char_div.classList.add("unfilled-char-cell");
        } else {
            char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint_input, 16));
            char_div.classList.remove("unfilled-char-cell");
        }
    }

    if (success) {
        clickSound();
    }
}
