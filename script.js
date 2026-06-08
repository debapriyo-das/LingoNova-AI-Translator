let timer;
let historyList = [];

async function translateText() {
    const text = document.getElementById("inputText").value;
    const source = document.getElementById("sourceLang").value;
    const target = document.getElementById("targetLang").value;

    if (!text.trim()) {
        document.getElementById("outputText").value = "";
        return;
    }

    document.getElementById("outputText").value =
        "⏳ Translating...";

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/translate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text,
                    source: source,
                    target: target
                })
            }
        );

        const data = await response.json();

        document.getElementById("outputText").value =
            data.translated;

        addToHistory(text, data.translated);

    } catch (error) {

        document.getElementById("outputText").value =
            "Translation failed";

        console.error(error);
    }
}

function copyText() {

    const text =
        document.getElementById("outputText").value;

    navigator.clipboard.writeText(text);

    alert("✅ Copied!");
}

function clearText() {

    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";

    document.getElementById("wordCount").textContent = "0";
    document.getElementById("charCount").textContent = "0";
}

function speakTranslation() {

    const text =
        document.getElementById("outputText").value;

    if (!text.trim()) return;

    const speech =
        new SpeechSynthesisUtterance(text);

    window.speechSynthesis.speak(speech);
}

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert(
            "Speech Recognition not supported"
        );
        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("inputText").value =
            transcript;

        translateText();
    };
}

function addToHistory(original, translated) {

    const historyBox =
        document.getElementById("historyList");

    const item =
        document.createElement("li");

    item.innerHTML =
        `<strong>${original}</strong><br>${translated}`;

    historyBox.prepend(item);
}

document.getElementById("swapBtn")
.addEventListener("click", function() {

    const source =
        document.getElementById("sourceLang");

    const target =
        document.getElementById("targetLang");

    let temp = source.value;

    source.value = target.value;
    target.value = temp;

    translateText();
});

document.getElementById("inputText")
.addEventListener("input", function() {

    const text = this.value;

    document.getElementById("charCount")
        .textContent = text.length;

    const words =
        text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    document.getElementById("wordCount")
        .textContent = words;

    clearTimeout(timer);

    timer = setTimeout(() => {
        translateText();
    }, 1000);
});

document.getElementById("sourceLang")
.addEventListener("change", translateText);

document.getElementById("targetLang")
.addEventListener("change", translateText);