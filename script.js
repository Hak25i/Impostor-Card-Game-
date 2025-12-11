const playersInput = document.getElementById("players-input");
const startBtn = document.getElementById("start-btn");
const newRoundBtn = document.getElementById("new-round-btn");
const cardsContainer = document.getElementById("cards-container");
const messageEl = document.getElementById("message");


// أكبر قائمة كلمات عربية متنوعة
const WORD_POOL = [
"تفاحة","برتقال","ليمون","موز","عنب","فراولة","جزر","خيار","طماطم","فلفل",
"جبن","خبز","شوربة","بيتزا","برجر","شاورما","أرز","سمك","كعكة","بسكويت",
"شاي","قهوة","عصير","ماء","لبن","تميس","فطيرة","عسل","تمر","معكرونة",
"قلم","دفتر","سبورة","ممحاة","علبة","شاحن","سماعة","كمبيوتر","جوال","لوحة",
"كرسي","طاولة","باب","نافذة","سرير","سجادة","مرآة","مروحة","لمبة","خزانة",
"ساعة","نظارة","مفتاح","محفظة","حقيبة","فرشاة","صابون","شامبو","مناديل","مشط",
"قطة","كلب","حصان","سمكة","نحلة","نملة","عصفور","أرنب","جمل","زرافة",
"بحر","شاطئ","صحراء","وادي","جبل","رمل","سماء","غيوم","مطر","قمر",
"سيارة","دراجة","طائرة","سفينة","قارب","قطار","خريطة","كاميرا","بالون","هدية"
];

function pickWord() {
    return WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
}

function createCards(numPlayers) {
    cardsContainer.innerHTML = "";
    const impostor = Math.floor(Math.random() * numPlayers);
    const word = pickWord();

    for (let i = 0; i < numPlayers; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.role = (i === impostor) ? "impostor" : "crewmate";
        card.dataset.revealed = "false";

        const text = document.createElement("div");
        text.className = "card-text";
        text.textContent = "اضغط";

        card.appendChild(text);

        // first tap: reveal word
        // second tap: close forever
        card.addEventListener("click", () => {
            if (card.classList.contains("closed")) return;

            if (card.dataset.revealed === "false") {
                card.dataset.revealed = "true";
                card.classList.add("revealed");

               if (card.dataset.role === "impostor") {
    // يعطى كلمة مختلفة بدون ما يدري أنه إمبوستر
    let fakeWord = pickWord();
    while (fakeWord === word) {
        fakeWord = pickWord(); // ضمان كلمة مختلفة عن كلمة اللاعبين
    }
    text.textContent = fakeWord; 
} else {
    text.textContent = word;
}

            } else {
                card.dataset.revealed = "false";
                card.classList.remove("revealed");
                card.classList.add("closed");
                text.textContent = " تم الفتح ✅";
            }
        });

        cardsContainer.appendChild(card);
    }
}

startBtn.addEventListener("click", () => {
    const num = Number(playersInput.value);

    if (isNaN(num) || num < 3) {
        messageEl.textContent = "Please enter number ≥ 3.";
        return;
    }

    createCards(num);
    messageEl.textContent = "Each player taps once to see their role, then taps again to close.";
    newRoundBtn.disabled = false;
});

newRoundBtn.addEventListener("click", () => {
    const num = Number(playersInput.value);
    if (num >= 3) createCards(num);
});
