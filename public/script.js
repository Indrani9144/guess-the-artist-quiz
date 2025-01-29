document.addEventListener("DOMContentLoaded", () => {
    const choicesDiv = document.getElementById("choices");
    const result = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");
    const scoreDisplay = document.getElementById("score");
    const resetButton = document.getElementById("resetScore");
    const filterButton = document.getElementById("filterButton");
    const categoryDropdown = document.getElementById("category");

    const MAX_ROUNDS = 10; 
    const WIN_THRESHOLD = 7; 

    let correctCount = parseInt(localStorage.getItem("correctScore")) || 0;
    let wrongCount = parseInt(localStorage.getItem("wrongScore")) || 0;
    let roundCount = parseInt(localStorage.getItem("roundCount")) || 0;
    let selectedCategory = localStorage.getItem("selectedCategory") || "";

    if (selectedCategory) {
        categoryDropdown.value = selectedCategory;
    }

    function updateScoreDisplay() {
        scoreDisplay.innerHTML = `✅ Correct: ${correctCount} | ❌ Wrong: ${wrongCount} | 🔄 Round: ${roundCount}/${MAX_ROUNDS}`;
    }
    updateScoreDisplay();

    function checkAnswer(selected, correct) {
        if (!correct || correct === "null") {
            correct = "Unknown Artist"; 
        }
        if (selected === correct) {
            result.textContent = `✅ Correct! The answer is: ${correct}`;
            result.style.color = "green";
            correctCount++;
        } else {
            result.textContent = `❌ Wrong! The correct answer is: ${correct}`;
            result.style.color = "red";
            wrongCount++;
        }
        roundCount++;

        localStorage.setItem("correctScore", correctCount);
        localStorage.setItem("wrongScore", wrongCount);
        localStorage.setItem("roundCount", roundCount);

        document.querySelectorAll("#choices button").forEach(btn => {
            btn.disabled = true;
        });

        updateScoreDisplay(); 

        if (roundCount >= MAX_ROUNDS) {
            endGame();
        }
    }

    function endGame() {
        let message;
        if (correctCount >= WIN_THRESHOLD) {
            message = `🎉 You Win! ✅ Score: ${correctCount}/${MAX_ROUNDS}`;
        } else {
            message = `😞 You Lose! ❌ Score: ${correctCount}/${MAX_ROUNDS}`;
        }

        result.innerHTML = message;
        result.style.fontSize = "20px";
        result.style.fontWeight = "bold";

        document.querySelectorAll("#choices button, #nextButton").forEach(btn => {
            btn.disabled = true;
        });

        const restartButton = document.createElement("button");
        restartButton.innerText = "Restart Game";
        restartButton.id = "restartGame";
        restartButton.addEventListener("click", resetGame);
        document.body.appendChild(restartButton);
    }

    function resetGame() {
        localStorage.removeItem("correctScore");
        localStorage.removeItem("wrongScore");
        localStorage.removeItem("roundCount");
        window.location.reload();
    }

    choicesDiv.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const selectedArtist = event.target.textContent;
            const correctArtist = event.target.getAttribute("data-correct") || "Unknown Artist";
            checkAnswer(selectedArtist, correctArtist);
        }
    });

    resetButton.addEventListener("click", resetGame);

    nextButton.addEventListener("click", () => {
        if (roundCount < MAX_ROUNDS) {
            window.location.href = `/?departmentId=${selectedCategory}`; 

        }
    });

    function applyFilter() {
        const selectedCategory = categoryDropdown.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        window.location.href = `/?departmentId=${selectedCategory}`;
    }

    filterButton.addEventListener("click", applyFilter);
});
