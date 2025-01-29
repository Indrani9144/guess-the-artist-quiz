document.addEventListener("DOMContentLoaded", () => {
    const choicesDiv = document.getElementById("choices");
    const result = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");
    const scoreDisplay = document.getElementById("score");
    const resetButton = document.getElementById("resetScore");

    let correctCount = parseInt(localStorage.getItem("correctScore")) || 0;
    let wrongCount = parseInt(localStorage.getItem("wrongScore")) || 0;

    function updateScoreDisplay() {
        scoreDisplay.innerHTML = `✅ Correct: ${correctCount} | ❌ Wrong: ${wrongCount}`;
    }
    updateScoreDisplay();

    document.getElementById("resetScore").addEventListener("click", () => {
        localStorage.removeItem("correctScore");
        localStorage.removeItem("wrongScore");
        window.location.reload();
    });

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            result.textContent = "✅ Correct!";
            result.style.color = "green";
            correctCount++;
        } else {
            result.textContent = `❌ Wrong! The correct answer is: ${correct}`;
            result.style.color = "red";
            wrongCount++;
        }

        localStorage.setItem("correctScore", correctCount);
        localStorage.setItem("wrongScore", wrongCount);

        document.querySelectorAll("#choices button").forEach(btn => {
            btn.disabled = true;
        });
        updateScoreDisplay(); 
    }

    choicesDiv.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const selectedArtist = event.target.textContent;
            const correctArtist = event.target.getAttribute("data-correct");
            checkAnswer(selectedArtist, correctArtist);
        }
    });

    nextButton.addEventListener("click", () => {
        window.location.reload();
    });
});

resetButton.addEventListener("click", () => {
    localStorage.removeItem("correctScore");
    localStorage.removeItem("wrongScore");
    correctCount = 0;
    wrongCount = 0;
    updateScoreDisplay();
});