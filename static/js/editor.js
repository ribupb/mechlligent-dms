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
// =========================================================
// 6B. PREVENT DOUBLE FORM SUBMISSION
// =========================================================

document.querySelectorAll("form").forEach(function (form) {

    form.addEventListener("submit", function (event) {

        // Only the button that actually submitted the form
        const clickedButton = event.submitter;

        // Disable the OTHER submit buttons immediately
        form.querySelectorAll(
            'button[type="submit"], input[type="submit"]'
        ).forEach(function (button) {

            if (button !== clickedButton) {
                button.disabled = true;
            }

        });

        // Change ONLY clicked button to Saving...
        if (clickedButton) {

            if (clickedButton.tagName === "BUTTON") {

                clickedButton.dataset.originalText =
                    clickedButton.innerHTML;

                clickedButton.innerHTML = "Saving...";

            } else if (clickedButton.tagName === "INPUT") {

                clickedButton.dataset.originalText =
                    clickedButton.value;

                clickedButton.value = "Saving...";

            }

            /*
             * IMPORTANT:
             * Do NOT disable clickedButton here.
             *
             * It has name="action" and value="approve",
             * "corrections", "save", etc.
             *
             * A disabled submit button may not send its
             * name/value to Flask.
             */
        }

    });

});






        // =========================================================
        // 7. LOCAL DRAFT BACKUP
        // =========================================================

        const editorForm = document.querySelector(
            'form:has([name="question_en"], [name="scenario_en"], [name="topic_en"])'
        );

        if (editorForm && !window.disableLocalDraft) {

            let hasUnsavedChanges = false;
            let formIsSubmitting = false;

            // Each question/new-entry page gets its own draft key.
            const draftKey =
                "mechlligent_draft_" + window.location.pathname;


            const urlParams =
                new URLSearchParams(window.location.search);

            const clearNewDraftProjectId =
                urlParams.get("clear_new_draft");

            if (clearNewDraftProjectId) {

                const newEntryDraftKey =
                    "mechlligent_draft_" +
                    `/project/${clearNewDraftProjectId}/new-entry`;

                localStorage.removeItem(newEntryDraftKey);

            }


            // -----------------------------------------------------
            // Clear draft after confirmed successful DB save
            // -----------------------------------------------------

            if (
                urlParams.get("saved") === "1" ||
                urlParams.get("submitted") === "1" ||
                urlParams.get("resubmitted") === "1"
            ) {

                localStorage.removeItem(draftKey);

            }


            // New Entry uses a different URL/draft key
            if (urlParams.get("new_created") === "1") {

                const newEntryDraftKey =
                    "mechlligent_draft_" +
                    `/project/${window.location.pathname.split("/")[2]}/new-entry`;

                localStorage.removeItem(newEntryDraftKey);

            }
                
                


            // -----------------------------------------------------
            // Save current form into browser storage
            // -----------------------------------------------------

            function saveLocalDraft() {

                const draft = {};

                // Normal inputs / textareas / selects
                editorForm
                    .querySelectorAll("input, textarea, select")
                    .forEach(function (field) {

                        if (!field.name) {
                            return;
                        }

                        // Don't store hidden rich_* fields separately.
                        // Rich HTML is stored from the editor below.
                        if (field.name.startsWith("rich_")) {
                            return;
                        }

                        if (
                            field.type === "submit" ||
                            field.type === "button"
                        ) {
                            return;
                        }

                        if (
                            field.type === "checkbox" ||
                            field.type === "radio"
                        ) {
                            draft[field.name] = {
                                type: field.type,
                                value: field.value,
                                checked: field.checked
                            };
                        } else {
                            draft[field.name] = {
                                type: "value",
                                value: field.value
                            };
                        }

                    });


                // Rich editors
                editorForm
                    .querySelectorAll(".rich-editor")
                    .forEach(function (editor) {

                        const fieldName = editor.dataset.field;

                        if (!fieldName) {
                            return;
                        }

                        draft["rich_editor_" + fieldName] = {
                            type: "rich",
                            html: editor.innerHTML
                        };

                    });


                try {

                    localStorage.setItem(
                        draftKey,
                        JSON.stringify(draft)
                    );

                } catch (error) {

                    console.warn(
                        "Could not save local draft:",
                        error
                    );

                }

            }


                    // -----------------------------------------------------
            // Restore a saved local draft
            // -----------------------------------------------------

            function restoreLocalDraft() {

                let savedDraft;

                try {

                    savedDraft = localStorage.getItem(draftKey);

                    if (!savedDraft) {
                        return;
                    }

                    savedDraft = JSON.parse(savedDraft);

                } catch (error) {

                    console.warn(
                        "Could not read local draft:",
                        error
                    );

                    return;
                }


                // Ask before replacing what is currently displayed
                const restore = confirm(
                    "An unsaved draft was found for this entry. " +
                    "Would you like to restore it?"
                );

                if (!restore) {
                    return;
                }


                Object.entries(savedDraft).forEach(
                    function ([fieldName, data]) {

                        // -----------------------------
                        // Rich editor
                        // -----------------------------

                        if (data.type === "rich") {

                            const realFieldName =
                                fieldName.replace(
                                    "rich_editor_",
                                    ""
                                );

                            const editor =
                                editorForm.querySelector(
                                    `.rich-editor[data-field="${realFieldName}"]`
                                );

                            if (editor) {
                                editor.innerHTML = data.html || "";
                            }

                            return;
                        }


                        // -----------------------------
                        // Normal field
                        // -----------------------------

                        const fields =
                            editorForm.querySelectorAll(
                                `[name="${fieldName}"]`
                            );


                        fields.forEach(function (field) {

                            if (
                                data.type === "checkbox" ||
                                data.type === "radio"
                            ) {

                                if (field.value === data.value) {
                                    field.checked = data.checked;
                                }

                            } else {

                                field.value = data.value || "";

                            }

                        });

                    }
                );


                console.log("Local draft restored.");

            }

            if (urlParams.get("saved") !== "1") {
                restoreLocalDraft();
            }


            // -----------------------------------------------------
            // Save while user is working
            // -----------------------------------------------------

            let draftTimer = null;

            editorForm.addEventListener("input", function () {

                hasUnsavedChanges = true;

                clearTimeout(draftTimer);

                draftTimer = setTimeout(
                    saveLocalDraft,
                    500
                );

            });

            editorForm.addEventListener("change", function () {

                hasUnsavedChanges = true;

                clearTimeout(draftTimer);

                draftTimer = setTimeout(
                    saveLocalDraft,
                    300
                );

            });


            // Backup periodically as extra protection
            setInterval(
                saveLocalDraft,
                10000
            );


            // -----------------------------------------------------
            // Warn before leaving with unsaved changes
            // -----------------------------------------------------

            editorForm.addEventListener("submit", function () {

                formIsSubmitting = true;
                hasUnsavedChanges = false;

            });


            window.addEventListener("beforeunload", function (event) {

                if (hasUnsavedChanges && !formIsSubmitting) {

                    // Save one last backup before leaving
                    saveLocalDraft();

                    event.preventDefault();
                    event.returnValue = "";

                }

            });

        }

});