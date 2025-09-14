document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const previousOperationElement = document.querySelector(
    ".previous-operation"
  );
  const currentResultElement = document.querySelector(".current-result");
  const calculationCountElement = document.getElementById("calculationCount");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsPanel = document.getElementById("settingsPanel");
  const calculationTriggerInput = document.getElementById("calculationTrigger");
  const messageDurationInput = document.getElementById("messageDuration");
  const buttons = document.querySelectorAll("button");

  // Calculator state
  let currentInput = "0";
  let previousInput = "";
  let operation = null;
  let calculationCount = 0;
  let funnyMode = false;
  let typewriterInterval = null;

  // Settings with defaults
  let calculationsBeforeMessage = 1;
  let messageDuration = 25000; // 5 seconds in milliseconds

  // Professional funny messages
  const funnyMessages = [
    "Pagod na ako, ikaw ba hindi napapagod?",
    "Hindi ako calculator, tao po ako!",
    "Math is hard, let's go shopping!",
    "Bakit mo ako pinagagawa nito?",
    "Sige, compute ka ng compute, ako? Pagod na!",
    "May buhay din ako sa labas ng calculator ah!",
    "Kape muna tayo, break tayo!",
    "Bakit hindi mo subukan mag-abacus?",
    "Error 404: Motivation not found",
    "Tama na, sobra na, mag-excel ka na lang!",
    "I think therefore I am... tired",
    "Bakit parang laging may assignment?",
    "Pahinga muna, 5 minutes please!",
    "Sino ba nagpauso ng math? Sana pinatulog na lang!",
  ];

  // Toggle settings panel
  settingsToggle.addEventListener("click", function () {
    settingsPanel.classList.toggle("active");
  });

  // Update settings from inputs
  calculationTriggerInput.addEventListener("change", function () {
    calculationsBeforeMessage = parseInt(this.value) || 1;
  });

  messageDurationInput.addEventListener("change", function () {
    messageDuration = (parseInt(this.value) || 25) * 1000;
  });

  // Update display
  function updateDisplay() {
    if (funnyMode) return;

    currentResultElement.textContent = formatNumber(currentInput);
    calculationCountElement.textContent = calculationCount;

    if (previousInput) {
      previousOperationElement.textContent = `${formatNumber(
        previousInput
      )} ${getOperationSymbol(operation)}`;
    } else {
      previousOperationElement.textContent = "";
    }
  }

  // Format number with commas
  function formatNumber(num) {
    if (num === "Error") return "Error";

    // Check if it's a number
    if (isNaN(num) || !isFinite(num)) return num;

    // Handle decimal numbers
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // Get symbol for operation
  function getOperationSymbol(op) {
    switch (op) {
      case "+":
        return "+";
      case "-":
        return "−";
      case "*":
        return "×";
      case "/":
        return "÷";
      case "%":
        return "%";
      default:
        return "";
    }
  }

  // Add number to current input
  function addNumber(number) {
    if (funnyMode) {
      resetCalculator();
      return;
    }

    if (currentInput === "0" || currentInput === "Error") {
      currentInput = number;
    } else {
      currentInput += number;
    }
    updateDisplay();
  }

  // Add decimal point
  function addDecimal() {
    if (funnyMode) {
      resetCalculator();
      return;
    }

    if (!currentInput.includes(".")) {
      currentInput += ".";
    }
    updateDisplay();
  }

  // Handle operations
  function chooseOperation(op) {
    if (funnyMode) {
      resetCalculator();
      return;
    }

    if (currentInput === "Error") return;

    if (previousInput !== "") {
      compute();
    }

    operation = op;
    previousInput = currentInput;
    currentInput = "0";
    updateDisplay();
  }

  // Perform calculation
  function compute() {
    if (funnyMode) return;

    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    calculationCount++;

    // Check if it's time to show a funny message
    if (calculationCount >= calculationsBeforeMessage && Math.random() < 0.5) {
      showFunnyMessage();
      return;
    }

    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        if (current === 0) {
          computation = "Error";
        } else {
          computation = prev / current;
        }
        break;
      case "%":
        computation = prev % current;
        break;
      default:
        return;
    }

    // Round if necessary
    if (computation !== "Error") {
      computation = Math.round(computation * 1000000) / 1000000;
    }

    currentInput = computation.toString();
    operation = null;
    previousInput = "";
    updateDisplay();
  }

  // Show funny message with smooth typewriter effect
  function showFunnyMessage() {
    funnyMode = true;
    const randomMessage =
      funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    // Clear previous content
    previousOperationElement.textContent = "";

    // Set up for typewriter effect
    currentResultElement.textContent = "";
    currentResultElement.style.textAlign = "center";
    currentResultElement.style.justifyContent = "center";
    currentResultElement.style.fontSize = "1.6rem";
    currentResultElement.style.color = "#FFD700";
    currentResultElement.style.minHeight = "80px";

    // Start the typewriter animation
    let i = 0;
    const speed = 50; // typing speed in milliseconds

    // Clear any existing interval
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
    }

    function typeWriter() {
      if (i < randomMessage.length) {
        currentResultElement.textContent += randomMessage.charAt(i);
        i++;
        typewriterInterval = setTimeout(typeWriter, speed);
      } else {
        // Add blinking cursor after text
        const cursor = document.createElement("span");
        cursor.textContent = "|";
        cursor.style.animation = "blink 1s step-end infinite";
        cursor.style.color = "#FF6B6B";
        cursor.style.fontWeight = "bold";
        currentResultElement.appendChild(cursor);
      }
    }

    typeWriter();

    // Reset calculation count
    calculationCount = 0;
    calculationCountElement.textContent = "0";

    // Clear the funny message after the set duration
    setTimeout(() => {
      resetCalculator();
    }, messageDuration);
  }

  // Clear calculator
  function clearCalculator() {
    if (funnyMode) {
      resetCalculator();
      return;
    }

    currentInput = "0";
    previousInput = "";
    operation = null;
    updateDisplay();
  }

  // Reset calculator
  function resetCalculator() {
    funnyMode = false;
    currentInput = "0";
    previousInput = "";
    operation = null;

    // Clear any running interval
    if (typewriterInterval) {
      clearTimeout(typewriterInterval);
      typewriterInterval = null;
    }

    // Reset styles
    currentResultElement.style.textAlign = "right";
    currentResultElement.style.justifyContent = "flex-end";
    currentResultElement.style.fontSize = "3rem";
    currentResultElement.style.color = "white";
    currentResultElement.style.minHeight = "3.5rem";

    updateDisplay();
  }

  // Backspace function
  function backspace() {
    if (funnyMode) {
      resetCalculator();
      return;
    }

    if (currentInput.length === 1 || currentInput === "Error") {
      currentInput = "0";
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  // Add event listeners to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("number")) {
        addNumber(button.textContent);
      } else if (button.classList.contains("operator")) {
        chooseOperation(
          button.textContent === "×"
            ? "*"
            : button.textContent === "÷"
            ? "/"
            : button.textContent
        );
      } else if (button.classList.contains("equals")) {
        compute();
      } else if (button.classList.contains("clear")) {
        clearCalculator();
      } else if (button.classList.contains("backspace")) {
        backspace();
      }
    });
  });

  // Keyboard support
  document.addEventListener("keydown", (event) => {
    if (/[0-9]/.test(event.key)) {
      addNumber(event.key);
    } else if (event.key === ".") {
      addDecimal();
    } else if (event.key === "+" || event.key === "-" || event.key === "*") {
      chooseOperation(event.key);
    } else if (event.key === "/") {
      event.preventDefault();
      chooseOperation("/");
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      compute();
    } else if (event.key === "Backspace") {
      backspace();
    } else if (event.key === "Escape") {
      clearCalculator();
    }
  });
});
