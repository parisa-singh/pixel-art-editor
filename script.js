const grid = document.getElementById("grid");
const colorPalette = document.getElementById("colorPalette");
const hexColorInput = document.getElementById("hexColor");
const addColorButton = document.getElementById("addColor");
const clearButton = document.getElementById("clearButton");
const gridSizeSlider = document.getElementById("gridSize");
const gridSizeLabel = document.getElementById("gridSizeValue");

let selectedColor = "#ff5733"; 
let isDrawing = false;
let gridSize = localStorage.getItem("gridSize") ? parseInt(localStorage.getItem("gridSize")) : 16;

// Default colors (cannot be deleted)
const defaultColors = ["#ff5733", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];

// Load saved grid size
gridSizeSlider.value = gridSize;
updateGridSizeLabel(gridSize);

// Update Grid Size Label
gridSizeSlider.addEventListener("input", () => {
    gridSize = parseInt(gridSizeSlider.value);
    updateGridSizeLabel(gridSize);
    localStorage.setItem("gridSize", gridSize);
    createGrid(); 
});

function updateGridSizeLabel(size) {
    document.querySelectorAll("#gridSizeValue")[0].innerText = size;
    document.querySelectorAll("#gridSizeValue")[1].innerText = size;
}

// Add Custom Color Using HEX Code (Prevent Duplicates)
addColorButton.addEventListener("click", () => {
    const hexValue = hexColorInput.value.trim().toLowerCase(); 

    // Validate HEX Code
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexValue)) {
        alert("Invalid HEX color. Use format #xxxxxx.");
        return;
    }

    // Check if the color already exists in the palette
    const existingColors = Array.from(document.querySelectorAll(".color-option")).map(color =>
        color.getAttribute("data-color").toLowerCase()
    );

    if (existingColors.includes(hexValue)) {
        alert("This color is already in the palette!");
        return; 
    }

    // Add new color
    createColorButton(hexValue);
    // Save colors to Local Storage
    saveCustomColors(); 
    hexColorInput.value = ""; 
});

// Handle Color Selection and Deletion (Right-Click to Delete)
colorPalette.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-option")) {
        selectedColor = e.target.getAttribute("data-color");
    }
});

colorPalette.addEventListener("contextmenu", (e) => {
    e.preventDefault(); 
    if (e.target.classList.contains("color-option")) {
        const colorToDelete = e.target.getAttribute("data-color");

        // Prevent deletion of default colors 
        if (defaultColors.includes(colorToDelete)) {
            alert("You cannot delete default colors.");
            return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete ${colorToDelete}?`);
        if (confirmDelete) {
            e.target.remove();
            saveCustomColors(); 
        }
    }
});

// Clear Grid and Remove Saved Pixel Art
clearButton.addEventListener("click", () => {
    document.querySelectorAll(".pixel").forEach(pixel => {
        pixel.style.background = "white";
    });
    localStorage.removeItem("pixelArt"); 
});

// Save Custom Colors in Local Storage
function saveCustomColors() {
    const colors = [];
    document.querySelectorAll(".color-option").forEach(color => {
        colors.push(color.getAttribute("data-color"));
    });
    localStorage.setItem("customColors", JSON.stringify(colors));
}

// Load Custom Colors from Local Storage and Prevent Duplicates
function loadCustomColors() {
    colorPalette.innerHTML = ""; 
    let savedColors = JSON.parse(localStorage.getItem("customColors"));

    if (!savedColors || savedColors.length === 0) {
        savedColors = defaultColors;
        localStorage.setItem("customColors", JSON.stringify(savedColors));
    }

    savedColors.forEach(createColorButton);
}

// Create Color Button
function createColorButton(color) {
    let newColor = document.createElement("button");
    newColor.classList.add("color-option");
    newColor.style.background = color;
    newColor.setAttribute("data-color", color);
    colorPalette.appendChild(newColor);
}

// Save Pixel Art to Local Storage
function savePixelArt() {
    const pixelData = [];
    document.querySelectorAll(".pixel").forEach(pixel => {
        pixelData.push(pixel.style.background);
    });
    localStorage.setItem("pixelArt", JSON.stringify(pixelData));
}

// Load Pixel Art from Local Storage
function loadPixelArt() {
    const pixelData = JSON.parse(localStorage.getItem("pixelArt"));
    if (pixelData) {
        document.querySelectorAll(".pixel").forEach((pixel, index) => {
            pixel.style.background = pixelData[index] || "white";
        });
    }
}

// Create Grid Dynamically and Load Saved Pixel Art
function createGrid() {
    grid.innerHTML = ""; 

    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");

        // Click to paint
        pixel.addEventListener("click", () => {
            pixel.style.background = selectedColor;
            savePixelArt(); 
        });

        // Drag to paint
        pixel.addEventListener("mouseover", (e) => {
            if (isDrawing) {
                e.target.style.background = selectedColor;
                savePixelArt();
            }
        });

        grid.appendChild(pixel);
    }
    loadPixelArt(); 
}

// Mouse Events for Drawing
grid.addEventListener("mousedown", () => isDrawing = true);
grid.addEventListener("mouseup", () => isDrawing = false);
grid.addEventListener("mouseleave", () => isDrawing = false);

loadCustomColors();
createGrid();
