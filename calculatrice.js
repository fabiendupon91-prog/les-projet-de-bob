const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const clearBtn = document.getElementById("clear");
const equalsBtn = document.getElementById("equals");
const backspaceBtn = document.getElementById("backspace");

let currentInput = "";

// Ajouter les chiffres et opérateurs
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "=" || value === "C" || value === "⌫") return;

    currentInput += value;
    display.value = currentInput;
  });
});

// Calcul
equalsBtn.addEventListener("click", () => {
  try {
    currentInput = eval(currentInput);
    display.value = currentInput;
  } catch {
    display.value = "Erreur";
  }
});

// Reset
clearBtn.addEventListener("click", () => {
  currentInput = "";
  display.value = "";
});

backspaceBtn.addEventListener("click", () => {
  if (currentInput.length === 0) return;

  currentInput = currentInput.slice(0, -1);
  display.value = currentInput;
});