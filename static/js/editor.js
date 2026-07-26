document.addEventListener("DOMContentLoaded", function () {

    let activeEditor = null;
    let savedRange = null;


    // =========================================================
    // 1. FIELDS THAT SUPPORT DMS RICH FORMATTING
    // =========================================================

    const richFieldNames = [
        // Shared fields
        "scenario_en",
        "scenario_ml",
        "scenario_explanation_en",
        "scenario_explanation_ml",
        "memory_shortcut_en",
        "memory_shortcut_ml",
        "applies_when_en",
        "applies_when_ml",
        "not_applies_when_en",
        "not_applies_when_ml",

        // Question
        "question_en",
        "question_ml",

        // Options
        "option_a_en",
        "option_a_ml",
        "option_b_en",
        "option_b_ml",
        "option_c_en",
        "option_c_ml",

        // Correct answer text
        "correct_answer_en",
        "correct_answer_ml",

        // Explanation
        "explanation_en",
        "explanation_ml",

        // Wrong answer tip
        "wrong_answer_tip_en",
        "wrong_answer_tip_ml"
    ];


    // =========================================================
    // 2. AUTOMATICALLY CONVERT NORMAL FIELDS INTO RICH EDITORS
    // =========================================================

    richFieldNames.forEach(function (fieldName) {

        const originalField =
            document.querySelector(`[name="${fieldName}"]`);

        if (!originalField) {
            return;
        }


        // Already manually converted?
        const existingEditor =
            document.querySelector(`.rich-editor[data-field="${fieldName}"]`);

        if (existingEditor) {

            const savedRich =
                window.savedRichContent &&
                window.savedRichContent[fieldName];

            // Check whether saved rich HTML contains actual text,
            // not just empty tags such as <br>
            const temp = document.createElement("div");
            temp.innerHTML = savedRich || "";

            const hasRealRichContent =
                temp.innerText.trim() !== "";

            if (hasRealRichContent) {

                existingEditor.innerHTML = savedRich;

            } else if (originalField.value) {

                // Rich content is empty, so use the normal DB value
                existingEditor.textContent = originalField.value;

            }

            return;
        }

        // Do not convert hidden fields
        if (originalField.type === "hidden") {
            return;
        }


        // Create rich editor
        const editor = document.createElement("div");

        editor.className = originalField.className + " rich-editor";

        editor.dataset.field = fieldName;

        editor.contentEditable =
            originalField.disabled || originalField.readOnly
                ? "false"
                : "true";


        // Put current plain text inside editor safely
        const savedRich =
            window.savedRichContent &&
            window.savedRichContent[fieldName];

        if (savedRich) {
            editor.innerHTML = savedRich;
        } else {
            editor.textContent = originalField.value || "";
        }


        // Preserve approximate textarea height
        if (originalField.tagName === "TEXTAREA") {

            editor.style.minHeight =
                originalField.offsetHeight
                    ? originalField.offsetHeight + "px"
                    : "100px";

        }


        // -----------------------------------------------------
        // Convert original field into hidden plain-data field
        // -----------------------------------------------------

        originalField.type !== undefined &&
        originalField.tagName === "INPUT"
            ? originalField.type = "hidden"
            : originalField.style.display = "none";


        // -----------------------------------------------------
        // Create hidden rich HTML field
        // -----------------------------------------------------

        const richHidden = document.createElement("input");

        richHidden.type = "hidden";
        richHidden.name = `rich_${fieldName}`;


        // -----------------------------------------------------
        // Insert editor before original field
        // -----------------------------------------------------

        originalField.parentNode.insertBefore(
            editor,
            originalField
        );

        originalField.parentNode.insertBefore(
            richHidden,
            originalField.nextSibling
        );

    });



    // =========================================================
    // 3. REMEMBER ACTIVE EDITOR
    // =========================================================

    document.addEventListener("focusin", function (event) {

        const editor = event.target.closest(".rich-editor");

        if (editor) {
            activeEditor = editor;
        }

    });



    // =========================================================
    // 4. REMEMBER SELECTED TEXT
    // =========================================================

    document.addEventListener("selectionchange", function () {

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        const container =
            range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                ? range.commonAncestorContainer.parentElement
                : range.commonAncestorContainer;

        if (container && container.closest(".rich-editor")) {

            activeEditor =
                container.closest(".rich-editor");

            savedRange =
                range.cloneRange();

        }

    });



    // =========================================================
    // 5. TOOLBAR
    // =========================================================

    document.querySelectorAll(".editor-tool").forEach(function (button) {

        button.addEventListener("mousedown", function (event) {
            event.preventDefault();
        });


        button.addEventListener("click", function () {

            if (!activeEditor) {
                return;
            }


            // Don't allow formatting locked fields
            if (activeEditor.contentEditable === "false") {
                return;
            }


            activeEditor.focus();


            if (savedRange) {

                const selection =
                    window.getSelection();

                selection.removeAllRanges();

                selection.addRange(savedRange);

            }


            const command =
                this.dataset.command;

            const value =
                this.dataset.value || null;


            document.execCommand(
                command,
                false,
                value
            );


            activeEditor.focus();

        });

    });



    // =========================================================
    // 6. BEFORE FORM SUBMIT
    // =========================================================

    document.querySelectorAll("form").forEach(function (form) {

        form.addEventListener("submit", function () {

            form.querySelectorAll(".rich-editor").forEach(function (editor) {

                const fieldName =
                    editor.dataset.field;

                if (!fieldName) {
                    return;
                }


                const plainField =
                    form.querySelector(
                        `[name="${fieldName}"]`
                    );


                const richField =
                    form.querySelector(
                        `[name="rich_${fieldName}"]`
                    );


                // Plain dataset value
                if (plainField) {

                    plainField.value =
                        editor.innerText.trim();

                }


                // DMS-only formatted HTML
                if (richField) {

                    richField.value =
                        editor.innerHTML;

                }

            });

        });

    });

});