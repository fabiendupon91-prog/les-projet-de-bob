const button = document.getElementById("generate");
const result = document.getElementById("result");
const copyButton = document.getElementById("copy");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");

function generatePassword(length, useUppercase, useNumbers, useSymbols) {
  let chars = "abcdefghijklmnopqrstuvwxyz";

  if (useUppercase) {
    chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (useNumbers) {
    chars += "0123456789";
  }

  if (useSymbols) {
    chars += "!@#$%^&*()_+";
  }

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

button.addEventListener("click", () => {
  const length = document.getElementById("length").value;
  const uppercase = document.getElementById("uppercase").checked;
  const numbers = document.getElementById("numbers").checked;
  const symbols = document.getElementById("symbols").checked;

  const password = generatePassword(length, uppercase, numbers, symbols);
  result.textContent = password;

  const score = evaluateStrength(password);
  updateStrengthUI(score);
});

copyButton.addEventListener("click", () => {
  const password = result.textContent;

  if (!password) {
    result.textContent = "⚠️ Génère d'abord un mot de passe !";
    return;
  }

  navigator.clipboard.writeText(password)
    .then(() => {
      result.textContent = "✅ Copié !";
    });
});

function evaluateStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

function updateStrengthUI(score) {
  if (score <= 1) {
    strengthFill.style.width = "33%";
    strengthFill.style.background = "red";
    strengthText.textContent = "Faible";
  } else if (score === 2 || score === 3) {
    strengthFill.style.width = "66%";
    strengthFill.style.background = "orange";
    strengthText.textContent = "Moyen";
  } else {
    strengthFill.style.width = "100%";
    strengthFill.style.background = "green";
    strengthText.textContent = "Fort";
  }
}