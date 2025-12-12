const playersInput = document.getElementById("players-input");
const startBtn = document.getElementById("start-btn");
const newRoundBtn = document.getElementById("new-round-btn");
const cardsContainer = document.getElementById("cards-container");
const messageEl = document.getElementById("message");
// الاصوااات 
const SND_START = "sounds/game-start-317318.mp3";
const SND_OPEN = "sounds/page-flip-47177.mp3";
const SND_CLOSE = "sounds/computer-mouse-click-352734.mp3";
const SND_ROUND =   "sounds/success-340660.mp3";

function playSound(src) {
    const a = new Audio(src);
    a.currentTime = 0;
    a.play().catch(() => {});
}

const WORD_POOL = [
    // أطعمة و فواكه
    "تفاحة","برتقال","ليمون","موز","عنب","فراولة","كيوي","بطيخ","شمام","توت",
    "مانجو","خوخ","برقوق","كراز","تين","تمر","جوز","لوز","بندق","فستق",
    "جزر","خيار","طماطم","فلفل","بطاطس","باذنجان","قرع","زهرة","ملفوف",
    "خبز","جبن","شوربة","بيتزا","برجر","شاورما","مكرونة","أرز","كبسة",
    "سمك","دجاج","لحم","بيضة","فطيرة","عسل","مربى","كعكة","بسكويت","شوكولاتة",
    "قهوة","شاي","عصير","ماء","لبن","نعناع","يانسون","قرفة",

    // أدوات و أغراض
    "قلم","دفتر","سبورة","ممحاة","مبراة","كتاب","مقلمة","كرسي","طاولة","باب",
    "نافذة","مفتاح","محفظة","حقيبة","خريطة","كاميرا","موبايل","شاحن","سماعة","كمبيوتر",
    "لوحة","فأرة","كيبورد","مصباح","مروحة","ساعة","خزانة","سجادة","مرآة","ستارة",

    // ملابس
    "قميص","بنطال","فستان","عباية","عقال","شماغ","حذاء","قبعة","جوارب","عباية",

    // منزل
    "سرير","لحاف","وسادة","مطبخ","مغرفة","شوكة","سكين","طبق","كوب","قدر",
    
    // حيوانات
    "قطة","كلب","حصان","جمل","ذباب","غزال","نمر","أسد","ذئب","أرنب",
    "سمكة","سلحفاة","دولفين","قرد","خروف","بقرة","دجاجة","بط","نحلة","فراشة",

    // طبيعة و أماكن
    "بحر","شاطئ","صحراء","وادي","جبل","غابة","بحيرة","مطر","غيوم","قمر",
    "شمس","رمل","نسيم","ثلج","ريح","كوكب","سماء","برق","رعد","نهر",

    // مركبات
    "سيارة","دراجة","طائرة","قطار","سفينة","قارب","حافلة","شاحنة","صاروخ",

    // ألعاب و أشياء عامة
    "كرة","بالون","هدية","ساعة رملية","مظلة","مصباح","ريموت","مفتاح سيارة","بطاقة",

    // مهن
    "طبيب","مهندس","معلم","مبرمج","فنان","شرطي","طيار","بحّار","جندي","سائق", "خبير مالي "

    // كلمات عشوائية ممتعة
    ,"قوس قزح","لمبة","سحابة","ممحاة","شريحة","وردة","زهرة","ريشة","صندوق",
    "خاتم","قلادة","لعبة","حلوى","ورق","مسك ","خطوة","مغناطيس","طبشورة"
];

let remainingWords = [...WORD_POOL];

function resetWordsPool() {
    remainingWords = [...WORD_POOL];
}


function pickUniqueWord() {
    if (remainingWords.length === 0) {
        return null; 
    }
    const index = Math.floor(Math.random() * remainingWords.length);
    const word = remainingWords[index];
    remainingWords.splice(index, 1);
    return word;
}

function createCards(numPlayers) {
    cardsContainer.innerHTML = "";


    if (remainingWords.length < 2) {
        messageEl.textContent = "ما عاد فيه كلمات جديدة 🤍 اضغطي Start Game لبداية جديدة.";
        return;
    }

    const impostorIndex = Math.floor(Math.random() * numPlayers);


    const crewWord = pickUniqueWord();
 
    const impostorWord = pickUniqueWord();

    for (let i = 0; i < numPlayers; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.role = (i === impostorIndex) ? "impostor" : "crewmate";
        card.dataset.revealed = "false";

        const text = document.createElement("div");
        text.className = "card-text";
        text.textContent = "اضغط";

        card.appendChild(text);

        card.addEventListener("click", () => {
            
            if (card.classList.contains("closed")) return; 

            if (card.dataset.revealed === "false") {
                playSound(SND_OPEN);

                card.dataset.revealed = "true";
                card.classList.add("revealed");

                if (card.dataset.role === "impostor") {
                   
                    text.textContent = impostorWord;
                } else {
                    text.textContent = crewWord;
                }

            } else {
                playSound(SND_CLOSE);

                card.classList.remove("revealed");
                card.classList.add("closed");
                text.textContent = "تم الفتح  ✅";
            }
        });

        cardsContainer.appendChild(card);
    }

    messageEl.textContent = "دورك... افتح بطاقتك الآن";
}

startBtn.addEventListener("click", () => {
    const num = Number(playersInput.value);

    if (isNaN(num) || num < 3) {
        messageEl.textContent = "أدخلي عدد لاعبين ٣ أو أكثر.";
        return;
    }
    playSound(SND_START);
   
    resetWordsPool();
    createCards(num);
    newRoundBtn.disabled = false;
});

newRoundBtn.addEventListener("click", () => {
    playSound(SND_ROUND);

    const num = Number(playersInput.value);
    if (num >= 3) {
        createCards(num);
    }
});
