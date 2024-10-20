// JavaScript to include external HTML
function includeHTML() {
    const elements = document.querySelectorAll("[data-include-html]");
    elements.forEach(async (element) => {
        const file = element.getAttribute("data-include-html");
        if (file) {
            try {
                let response = await fetch(file);
                if (!response.ok) throw new Error("Failed to load " + file);
                element.innerHTML = await response.text();
            } catch (error) {
                element.innerHTML = "Error loading file!";
                console.error(error);
            }
        }
    });
}

// Call includeHTML on page load
document.addEventListener("DOMContentLoaded", includeHTML);