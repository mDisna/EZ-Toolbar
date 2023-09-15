/**
 * Creates an EZ toolbar for a specified element with customizable options.
 *
 * @param {string} querySelector - The query selector string to select the HTML element where the toolbar will be attached.
 * @param {object} [options={}] - An object containing customization options for the toolbar.
 * @param {string[]} [options.fontStyles] - An array of font style options.
 * @param {string[]} [options.fontFamilies] - An array of font family options.
 * @param {number[]} [options.fontSizes] - An array of font size options.
 * @param {boolean} [options.showSaveButton=true] - A boolean indicating whether to show the Save button.
 * @param {object[]} [options.customButtons=[]] - An array of custom button objects.
 * @param {string} options.customButtons[].id - The ID of the custom button.
 * @param {string} options.customButtons[].faClass - The Font Awesome class for the custom button icon.
 * @param {string} options.customButtons[].hoverText - The hover text for the custom button.
 * @param {string} [options.themeName] - The name of the theme to apply to the toolbar.
 * @param {string} [options.toolbarFontColor] - Custom font color for the toolbar.
 * @param {string} [options.toolbarBackgroundColor] - Custom background color for the toolbar.
 * @param {string[]} [options.sections] - An array of section names to determine which toolbar groups to display.
 */
function ezToolbar(querySelector, options = {}) {
  // Get the target element where the toolbar will be attached.
  const targetElement = document.querySelector(querySelector);
  if (!targetElement) {
    console.error(`Element not found for selector: ${querySelector}`);
    return;
  }
  // Default values for font styles, font families, and font sizes.
  const defaultFontStyles = [
    "Paragraph",
    "Title",
    "Header 1",
    "Header 2",
    "Header 3",
    "Header 4",
    "Header 5",
  ];
  const defaultFontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Verdana",
    "Courier New",
    "Tahoma",
  ];
  const defaultFontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72,
  ];

  // Destructure the options object with default values.
  const {
    fontStyles = defaultFontStyles,
    fontFamilies: providedFontFamilies = [],
    fontSizes = defaultFontSizes,
    showSaveButton = true,
    customButtons = [],
    themeName,
    toolbarFontColor: customFontColor,
    toolbarBackgroundColor: customBgColor,
    sections = [
      "font-options",
      "text-formatting",
      "text-alignment",
      "text-indentation",
      "special-characters",
      "list-options",
      "text-color-options",
      "line-spacing",
      "link-options",
      "formatting-options",
      "undo-redo",
    ],
  } = options;

  // Combine the default and provided font families without duplicates and sort alphabetically.
  const fontFamilies = Array.from(
    new Set([...defaultFontFamilies, ...providedFontFamilies])
  ).sort();

  // Define group IDs for various toolbar sections.
  const groupIds = {
    "font-options": "ez-font-options-group",
    "text-formatting": "ez-text-formatting-group",
    "text-alignment": "ez-text-alignment-group",
    "text-indentation": "ez-text-indentation-group",
    "special-characters": "ez-special-characters-group",
    "list-options": "ez-list-options-group",
    "text-color-options": "ez-text-color-options-group",
    "line-spacing": "ez-line-spacing-group",
    "link-options": "ez-link-options-group",
    "formatting-options": "ez-formatting-options-group",
    "undo-redo": "ez-undo-redo-group",
  };

  // Define theme colors for the toolbar.
  const themeColors = {
    Oceanic: { backgroundColor: "#00539C", fontColor: "#FBEAEB" },
    Sunny: { backgroundColor: "#EEA47F", fontColor: "#2F3C7E" },
    Radiant: { backgroundColor: "#FEE715", fontColor: "#F96167" },
    Mystical: { backgroundColor: "#4831D4", fontColor: "#E2D1F9" },
    Harmonious: { backgroundColor: "#317773", fontColor: "#FCEDDA" },
    Flamingo: { backgroundColor: "#EE4E34", fontColor: "#ADD8E6" },
    Marine: { backgroundColor: "#00008B", fontColor: "#89ABE3" },
    Verdant: { backgroundColor: "#CBD18F", fontColor: "#3A6B35" },
    Halloween: { backgroundColor: "#121212", fontColor: "#FFA500" },
    Dark: { backgroundColor: "#121212", fontColor: "#CCCCCC" },
  };

  // Determine toolbar background and font colors based on the selected theme or custom colors.
  const {
    backgroundColor: toolbarBackgroundColor,
    fontColor: toolbarFontColor,
  } =
    themeName && themeColors[themeName]
      ? themeColors[themeName]
      : {
          backgroundColor: customBgColor || "#222f3e",
          fontColor: customFontColor || "#ffffff",
        };

  // Generate HTML options for font styles, font families, and font sizes.
  const fontStyleOptions = fontStyles
    .map((style) => `<option value="${style}">${style}</option>`)
    .join("");
  const fontFamilyOptions = fontFamilies
    .map((family) => `<option value="${family}">${family}</option>`)
    .join("");
  const fontSizeOptions = fontSizes
    .map((size) => `<option value="${size}">${size}</option>`)
    .join("");

  // Generate HTML for custom buttons, if any.
  const customButtonsHtml =
    customButtons.length > 0
      ? `
            <div class="ez-toolbar-row space-x-2 mt-2">
                ${customButtons
                  .map(
                    (button) => `
                    <div class="flex ez-toolbar-group">
                        <button id="${button.id}" class="ez-toolbar-button" ${
                      button.hoverText
                        ? `title="${button.hoverText}"`
                        : `aria-label="${button.id}"`
                    } style="color: ${toolbarFontColor};">
                            <i class="${button.faClass}"></i>
                        </button>
                    </div>
                `
                  )
                  .join("")}
                ${
                  showSaveButton && customButtons.length > 0
                    ? '<div class="flex ez-toolbar-group"><button id="ez-save" class="ez-toolbar-button" title="Save" aria-label="Save" style="color: ' +
                      toolbarFontColor +
                      ';"><i class="fas fa-save"></i></button></div>'
                    : ""
                }
            </div>
        `
      : "";

  // Generate the complete toolbar HTML.
  const toolbarHtml = `
              <div class="ez-toolbar p-2" style="background-color: ${toolbarBackgroundColor};">
                  <div class="ez-toolbar-row space-x-2">
                      ${
                        sections.includes("font-options")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["font-options"]}" aria-labelledby="${groupIds["font-options"]}">
                              <select id="ez-font-style" class="ez-toolbar-dropdown" title="Font Style" aria-label="Font Style" style="color: ${toolbarFontColor};">
                                  ${fontStyleOptions}
                              </select>
                              <select id="ez-font-family" class="ez-toolbar-dropdown" title="Font Family" aria-label="Font Family" style="color: ${toolbarFontColor};">
                                  ${fontFamilyOptions}
                              </select>
                              <select id="ez-font-size" class="ez-toolbar-dropdown" title="Font Size" aria-label="Font Size" style="color: ${toolbarFontColor};">
                                  ${fontSizeOptions}
                              </select>
                          </div>
                      `
                          : ""
                      }
      ${
        sections.includes("text-formatting")
          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["text-formatting"]}" aria-labelledby="${groupIds["text-formatting"]}">
                              <button id="ez-bold" class="ez-toolbar-button" title="Bold" aria-label="Bold" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-bold"></i>
                              </button>
                              <button id="ez-italic" class="ez-toolbar-button" title="Italic" aria-label="Italic" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-italic"></i>
                              </button>
                              <button id="ez-underline" class="ez-toolbar-button" title="Underline" aria-label="Underline" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-underline"></i>
                              </button>
                              <button id="ez-strikethrough" class="ez-toolbar-button" title="Strikethrough" aria-label="Strikethrough" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-strikethrough"></i>
                              </button>
                          </div>
                      `
          : ""
      }
                      ${
                        sections.includes("text-alignment")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["text-alignment"]}" aria-labelledby="${groupIds["text-alignment"]}">
                              <button id="ez-align-left" class="ez-toolbar-button" title="Align Left" aria-label="Align Left" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-align-left"></i>
                              </button>
                              <button id="ez-align-center" class="ez-toolbar-button" title="Align Center" aria-label="Align Center" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-align-center"></i>
                              </button>
                              <button id="ez-align-right" class="ez-toolbar-button" title="Align Right" aria-label="Align Right" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-align-right"></i>
                              </button>
                              <button id="ez-align-justify" class="ez-toolbar-button" title="Align Justify" aria-label="Align Justify" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-align-justify"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("text-indentation")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["text-indentation"]}" aria-labelledby="${groupIds["text-indentation"]}">
                              <button id="ez-decrease-indent" class="ez-toolbar-button" title="Decrease Indent" aria-label="Decrease Indent" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-indent"></i>
                              </button>
                              <button id="ez-increase-indent" class="ez-toolbar-button" title="Increase Indent" aria-label="Increase Indent" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-outdent"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("special-characters")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["special-characters"]}" aria-labelledby="${groupIds["special-characters"]}">
                              <button id="ez-special-character" class="ez-toolbar-button" title="Special Character" aria-label="Special Character" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-star"></i>
                              </button>
                              <button id="ez-emoticons" class="ez-toolbar-button" title="Emoticons" aria-label="Emoticons" style="color: ${toolbarFontColor};">
                                  <i class="far fa-smile"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                  </div>
                  <div class="ez-toolbar-row space-x-2 mt-2">
                      ${
                        sections.includes("list-options")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["list-options"]}" aria-labelledby="${groupIds["list-options"]}">
                              <button id="ez-numbered-list" class="ez-toolbar-button" title="Numbered List" aria-label="Numbered List" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-list-ol"></i>
                              </button>
                              <button id="ez-bullet-list" class="ez-toolbar-button" title="Bullet List" aria-label="Bullet List" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-list-ul"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("text-color-options")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["text-color-options"]}" aria-labelledby="${groupIds["text-color-options"]}">
                              <button id="ez-font-color" class="ez-toolbar-button" title="Font Color" aria-label="Font Color" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-font"></i>
                              </button>
                              <button id="ez-highlight-color" class="ez-toolbar-button" title="Highlight Color" aria-label="Highlight Color" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-highlighter"></i>
                              </button>
                              <button id="ez-background-color" class="ez-toolbar-button" title="Background Color" aria-label="Background Color" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-fill-drip"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("line-spacing")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["line-spacing"]}" aria-labelledby="${groupIds["line-spacing"]}">
                              <button id="ez-line-spacing" class="ez-toolbar-button" title="Line Spacing" aria-label="Line Spacing" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-text-height"></i>
                              </button>
                              <button id="ez-insert-table" class="ez-toolbar-button" title="Insert Table" aria-label="Insert Table" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-table"></i>
                              </button>
                              <button id="ez-insert-divider" class="ez-toolbar-button" title="Insert Divider" aria-label="Insert Divider" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-minus"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("link-options")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["link-options"]}" aria-labelledby="${groupIds["link-options"]}">
                              <button id="ez-insert-link" class="ez-toolbar-button" title="Insert Link" aria-label="Insert Link" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-link"></i>
                              </button>
                              <button id="ez-remove-link" class="ez-toolbar-button" title="Remove Link" aria-label="Remove Link" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-unlink"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("formatting-options")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["formatting-options"]}" aria-labelledby="${groupIds["formatting-options"]}">
                              <button id="ez-clear-formatting" class="ez-toolbar-button" title="Clear Formatting" aria-label="Clear Formatting" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-eraser"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        sections.includes("undo-redo")
                          ? `
                          <div class="flex ez-toolbar-group" id="${groupIds["undo-redo"]}" aria-labelledby="${groupIds["undo-redo"]}">
                              <button id="ez-undo" class="ez-toolbar-button" title="Undo" aria-label="Undo" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-undo"></i>
                              </button>
                              <button id="ez-redo" class="ez-toolbar-button" title="Redo" aria-label="Redo" style="color: ${toolbarFontColor};">
                                  <i class="fas fa-redo"></i>
                              </button>
                          </div>
                      `
                          : ""
                      }
                      ${
                        showSaveButton && customButtons.length == 0
                          ? '<div class="flex ez-toolbar-group"><button id="ez-save" class="ez-toolbar-button" title="Save" aria-label="Save" style="color: ' +
                            toolbarFontColor +
                            ';"><i class="fas fa-save"></i></button></div>'
                          : ""
                      }
                  </div>
                  ${customButtonsHtml}
              </div>
          `;

  // Create a toolbar element and insert it before the target element.
  const toolbar = document.createElement("div");
  toolbar.innerHTML = toolbarHtml.trim();
  targetElement.parentNode.insertBefore(toolbar, targetElement);

  // Hide the Save button if showSaveButton is false.
  if (!showSaveButton) {
    const saveButton = document.getElementById("ez-save");
    saveButton.style.display = "none";
  }
}

/**
 * Adds a click event listener to the document to intercept all clicks on elements with the class .ez-toolbar-button.
 *
 * @param {MouseEvent} event - The click event object.
 */
document.addEventListener("click", function (event) {
  /**
   * The element that was clicked.
   * @type {HTMLElement}
   */
  const clickedElement = event.target;

  // Check if the clicked element or any of its parent elements has the class .ez-toolbar-button
  if (
    clickedElement.classList.contains("ez-toolbar-button") ||
    clickedElement.closest(".ez-toolbar-button")
  ) {
    // Get the id of the clicked button
    const button = clickedElement.classList.contains("ez-toolbar-button")
      ? clickedElement
      : clickedElement.closest(".ez-toolbar-button");

    /**
     * The name of the function associated with the clicked button's id.
     * @type {string}
     */
    const functionName = button.id.replace(/-/g, "_"); // Replace hyphens with underscores

    // Check if a function with the specified name exists
    if (typeof window[functionName] === "function") {
      // Call the function with the specified name
      window[functionName]();
    } else {
      // Log an error to the console if the function is not found
      console.error(`Function not found for button with id: ${functionName}`);
    }

    // Prevent the default action (e.g., form submission) if needed
    event.preventDefault();
  }
});

/**
 * Adds a change event listener to the document to intercept all changes in elements with the class .ez-toolbar-dropdown.
 *
 * @param {Event} event - The change event object.
 */
document.addEventListener("change", function (event) {
  /**
   * The element that triggered the change event.
   * @type {HTMLElement}
   */
  const changedElement = event.target;

  // Check if the changed element is a dropdown with the class .ez-toolbar-dropdown
  if (changedElement.classList.contains("ez-toolbar-dropdown")) {
    // Get the id of the changed dropdown
    const dropdown = changedElement;

    /**
     * The name of the function associated with the changed dropdown's id.
     * @type {string}
     */
    const functionName = dropdown.id.replace(/-/g, "_"); // Replace hyphens with underscores

    /**
     * The value of the selected option in the dropdown.
     * @type {string}
     */
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;

    // Check if a function with the specified name exists
    if (typeof window[functionName] === "function") {
      // Call the function with the specified name and pass the selected option as a parameter
      window[functionName](selectedOption);
    } else {
      // Log an error to the console if the function is not found
      console.error(`Function not found for dropdown with id: ${functionName}`);
    }
  }
});

// Add a window resize event listener to update the toolbar layout
window.addEventListener("resize", updateToolbarLayout);

// Function to update the toolbar layout based on screen size
function updateToolbarLayout() {
  const toolbarRows = document.querySelectorAll(".ez-toolbar-row");
  if (window.innerWidth <= 768) {
    // For screens with width less than or equal to 768px, float toolbar groups
    toolbarRows.forEach((row) => {
      row.classList.add("clear-float");
    });
  } else {
    // For larger screens, reset the layout to default (flex)
    toolbarRows.forEach((row) => {
      row.classList.remove("clear-float");
    });
  }
}

// Call the function to set the initial layout
updateToolbarLayout();
