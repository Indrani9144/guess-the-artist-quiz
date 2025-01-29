document.addEventListener("DOMContentLoaded", () => {
    const choicesDiv = document.getElementById("choices");
    const result = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");

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
        } else {
            result.textContent = `❌ Wrong! The correct answer is: ${correct}`;
            result.style.color = "red";
        }

        document.querySelectorAll("#choices button").forEach(btn => {
            btn.disabled = true;
        });
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
