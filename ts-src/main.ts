let cursoredBox = 0;

// get the currently highlighted input element
function getHighlightedInput(): HTMLInputElement {
    const v = document.querySelector("input:focus") as HTMLInputElement;
    if (!v) {
        return document.getElementById("codepoint" + cursoredBox)! as HTMLInputElement;
    }
    return v;
}

function insertAtCursor(textToInsert: string) {
    const inputElement = getHighlightedInput();
    const currentValue = inputElement.value;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    inputElement.value = currentValue.slice(0, start) + textToInsert + currentValue.slice(end);
    inputElement.setSelectionRange(start + textToInsert.length, start + textToInsert.length);

    // If this completes the codepoint, move to the next input
    if (inputElement.value.length === 1 /*TODO*/) {
        cursoredBox = (cursoredBox + 1) % 2 /* TODO */;
        const nextInput = document.getElementById("codepoint" + cursoredBox)! as HTMLInputElement;
        nextInput.focus();
        nextInput.setSelectionRange(0, 0);
    }

    const previousValue = currentValue;
    syncAll_triggered_from_custom_keyboard(previousValue);
}

function sync_triggered_from_textinput(i: number) {
    let success = true;
    const codepointInput = document.getElementById("codepoint" + i)! as HTMLInputElement;

    const codepoint = codepointInput.value;
    const char_div = document.getElementById("char" + i)!;

    // Delete offending characters
    if (!codepointInput.checkValidity()) {
        if (success) {
            beepSound();
            success = false;
        }

        codepointInput.value = "";
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    } else if (codepoint === "") {
        char_div.textContent = "";
        char_div.classList.add("unfilled-char-cell");
    } else {
        char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint, 16));
        char_div.classList.remove("unfilled-char-cell");

        // If this completes the codepoint, move to the next input
        if (codepoint.length === 1 /*TODO*/) {
            cursoredBox = (i + 1) % 2 /* TODO */;
            const nextInput = document.getElementById("codepoint" + cursoredBox)! as HTMLInputElement;
            nextInput.focus();
            nextInput.setSelectionRange(0, 0);
        }
    }

    if (success) {
        clickSound();
    }
}

function syncAll_triggered_from_custom_keyboard(previousValue: string) {
    let success = true;
    for (let i = 0; i < 2; i++) {
        const codepointInput = document.getElementById("codepoint" + i)! as HTMLInputElement;
        const codepoint = codepointInput.value;
        const char_div = document.getElementById("char" + i)!;

        // Delete offending characters
        if (!codepointInput.checkValidity()) {
            if (success) {
                beepSound();
                success = false;
            }

            if (previousValue === undefined) {
                codepointInput.value = "";
                char_div.textContent = "";
                char_div.classList.add("unfilled-char-cell");
            } else {
                codepointInput.value = previousValue;
                char_div.textContent = String.fromCodePoint(parseInt("306" + previousValue, 16));
                char_div.classList.remove("unfilled-char-cell");
            }
        } else if (codepoint === "") {
            char_div.textContent = "";
            char_div.classList.add("unfilled-char-cell");
        } else {
            char_div.textContent = String.fromCodePoint(parseInt("306" + codepoint, 16));
            char_div.classList.remove("unfilled-char-cell");
        }
    }

    if (success) {
        clickSound();
    }
}
