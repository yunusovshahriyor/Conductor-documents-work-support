import type { Messages } from "./ru";

const uz: Messages = {
  app: {
    name: "Проводник",
    fullName: "Проводник: документы, работа, поддержка",
    tagline: "Rossiyadagi migrantlar uchun tushunarli yordam",
  },
  nav: {
    home: "Bosh sahifa",
    documents: "Hujjatlar",
    deadlines: "Muddatlar",
    work: "Ish",
    help: "Yordam",
    about: "Loyiha haqida",
    language: "Til",
    menu: "Asosiy menyu",
  },
  common: {
    official: "Rasmiy manbalar",
    officialNote: "Qoidalar oʻzgaradi. Doim rasmiy saytlardan tekshiring.",
    gosuslugi: "Gosuslugi",
    mvd: "Rossiya IIV",
    verifyBanner:
      "Maʼlumotlar maʼlumot uchun va yuridik maslahat emas. Harakat qilishdan oldin rasmiy saytlarda tekshiring.",
    back: "Orqaga",
    days: "kun",
    today: "bugun",
    callEmergency: "112 ga qoʻngʻiroq",
    installTitle: "Telefonga oʻrnating",
    installText: "«Проводник»ni bosh ekranga qoʻshing — u oddiy ilova kabi, hatto internetsiz ham ochiladi.",
    installButton: "Oʻrnatish",
    dismiss: "Yopish",
    offlineBadge: "Internet yoʻq — saqlangan maʼlumotlar koʻrsatilmoqda",
  },
  home: {
    heroTitle: "Hujjatlar, ish va yordam — bir joyda",
    heroText:
      "Bosqichma-bosqich yoʻriqnomalar, muddat eslatmalari va ish beruvchini oddiy tilda tekshirish. Tojik, rus, oʻzbek va qirgʻiz tillarida.",
    ctaDocs: "Hujjatlardan boshlash",
    ctaHelp: "Menga shoshilinch yordam kerak",
    modulesTitle: "Ichida nima bor",
    modules: {
      documents: { title: "Hujjatlar", text: "Kirishdan patent va VNJgacha qadamlar va roʻyxatlar." },
      deadlines: { title: "Muddatlar", text: "Necha kun qolganini hisoblang va muhim narsani oʻtkazib yubormang." },
      work: { title: "Ish", text: "Ish beruvchini qanday tekshirish va shartnomada nimalarga qarash kerak." },
      help: { title: "Yordam", text: "Hibsga olish, aldov yoki salomatlik muammolarida nima qilish kerak." },
    },
    warnTitle: "Firibgarlardan ehtiyot boʻling",
    warnItems: [
      "Rasmiy toʻlovlardan tashqari hech kim pul evaziga patent yoki roʻyxatga olishni «kafolatlay» olmaydi.",
      "Patentni faqat rasmiy kanallar orqali toʻlang va cheklarni saqlang.",
      "Pasportni ish beruvchi yoki vositachiga garovga bermang.",
    ],
    sosTitle: "Shoshilinch yordam kerakmi?",
    sosText: "Rossiyada yagona favqulodda raqam — 112. Bepul, istalgan telefondan.",
  },
  documents: {
    title: "Hujjatlar: qadamma-qadam",
    intro: "Bajarilgan qadamlarni belgilang — belgilar telefoningizda saqlanadi.",
    progress: "Bajarildi",
    of: "dan",
    reset: "Belgilarni tozalash",
    itemsTitle: "Nimani tayyorlash kerak",
    steps: [
      {
        title: "Kirish va migratsiya kartasi",
        text: "Kirish hujjatlarini saqlang — ular qachon kelganingizni tasdiqlaydi.",
        items: [
          "Amaldagi pasport (muddatini tekshiring)",
          "Migratsiya kartasi yoki kirish belgisi — chiqquncha saqlang",
          "Barcha hujjatlarning telefondagi surati/nusxasi",
        ],
      },
      {
        title: "Migratsion hisob (roʻyxatga olish)",
        text: "Qabul qiluvchi tomon (uy egasi yoki ish beruvchi) sizni belgilangan muddatda hisobga qoʻyishi kerak.",
        items: [
          "Yashaydigan manzilingiz",
          "Xabarnoma topshirilganiga tasdiq",
          "Hisob holatini rasmiy xizmatlar orqali tekshiring",
        ],
      },
      {
        title: "Tibbiy koʻrik, daktiloskopiya, surat",
        text: "Ish uchun odatda vakolatli markazda majburiy jarayonlardan oʻtish kerak.",
        items: [
          "Tibbiy koʻrik",
          "Daktiloskopiya va suratga olish",
          "Shahringizdagi dolzarb roʻyxat va markaz manzillarini aniqlang",
        ],
      },
      {
        title: "Ish huquqi: patent yoki shartnoma",
        text: "Tartib fuqarolikka bogʻliq. Yevroosiyo iqtisodiy ittifoqi (YeOII) mamlakatlari fuqarolari (masalan, Qirgʻiziston) patentsiz, mehnat shartnomasi bilan ishlaydi.",
        items: [
          "Rus tili, tarix va qonunchilikdan test (patent kerak boʻlsa)",
          "Tibbiy sugʻurta polisi (DMS)",
          "Patentni har oy toʻlash — faqat rasmiy usullar bilan",
          "Yozma mehnat shartnomasi",
        ],
      },
      {
        title: "Uzaytirish, VNJ, fuqarolik",
        text: "Oldindan rejalashtiring: koʻp jarayonlar oylar oladi va qattiq muddatlarga ega.",
        items: [
          "Patent va turish muddatini kuzating",
          "Variantlarni oʻrganing: RVP, VNJ, fuqarolik",
          "Murakkab holatlarda yurist yoki notijorat tashkilotga murojaat qiling",
        ],
      },
    ],
  },
  deadlines: {
    title: "Muddat kalkulyatori",
    intro: "Sanalarni kiriting — ilova taxminiy muddatlarni hisoblaydi. Maʼlumotlar faqat telefoningizda saqlanadi.",
    groupLabel: "Fuqaroligingiz",
    groupOther: "Tojikiston, Oʻzbekiston va boshqalar (YeOIIga kirmaydi)",
    groupEaeu: "YeOII davlati (Qirgʻiziston, Qozogʻiston, Armaniston, Belarus)",
    entryDate: "Rossiyaga kirgan sana",
    patentUntil: "Patent qaysi sanagacha toʻlangan",
    contractUntil: "Shartnoma / ruxsat muddati",
    resultsTitle: "Sizning muddatlaringiz",
    registration: "Migratsion hisobning oxirgi muddati",
    stay90: "Vizasiz turishning oxirgi kuni (180 kunning 90 kuni)",
    patent: "Patent toʻlovini shu sanagacha uzaytiring",
    contract: "Shartnoma / ruxsat tugashi",
    left: "qoldi",
    overdue: "muddat oʻtdi",
    noDates: "Kamida bitta sanani kiriting.",
    approx: "Hisob taxminiy. Aniq muddatlarni rasmiy manbalardan aniqlang.",
    eaeuNote: "YeOII fuqarolari uchun 90 kun cheklovi va patent odatda qoʻllanilmaydi. Mehnat shartnomasi muddatini kuzating.",
    save: "Qurilmada saqlandi",
    clear: "Tozalash",
    soon: "Tez orada",
  },
  work: {
    title: "Aldovsiz ish",
    intro: "Pul, hujjat va salomatlikni yoʻqotmaslikka yordam beradigan qisqa qoidalar.",
    rightsTitle: "Sizning huquqlaringiz",
    rights: [
      "Sizga tushunarli tilda yozma mehnat shartnomasi.",
      "Maosh oʻz vaqtida va toʻliq toʻlanadi.",
      "Xavfsiz mehnat sharoitlari va himoya vositalari.",
      "Pasport va hujjatlar doim sizda qoladi.",
      "Mehnat inspeksiyasi, yurist yoki konsullikka murojaat qilishingiz mumkin.",
    ],
    flagsTitle: "Xavf belgilari",
    flags: [
      "«Joylashtirish» yoki ish «kafolati» uchun pul soʻrashadi.",
      "Pasport yoki hujjatni «saqlash uchun» olib qoʻyishadi.",
      "Shartnoma yoʻq, faqat ogʻzaki va'da.",
      "Maosh «konvertda» yoki butun muddat tugagach.",
      "Obyektdan chiqishga yoki alohida yashashga qoʻymaydi.",
      "Politsiya yoki deportatsiya bilan qoʻrqitishadi.",
    ],
    checkTitle: "Shartnomada nimani tekshirish kerak",
    checks: [
      "Ish beruvchi nomi, manzili va aloqa maʼlumotlari",
      "Lavozim va ish joyi",
      "Maosh miqdori va toʻlash muddatlari",
      "Jadval: soatlar, dam olish kunlari, taʼtil",
      "Shartnoma muddati va bekor qilish shartlari",
      "Imzo va sizdagi shartnoma nusxasi",
    ],
    jobsTitle: "Vakansiyalar",
    jobsSoon: "Tekshirilgan vakansiyalar boʻlimi keyinroq paydo boʻladi.",
  },
  help: {
    title: "Shoshilinch yordam",
    intro: "Xotirjam boʻling. Quyida — qiyin vaziyatlarda nima qilish kerak.",
    emergencyTitle: "Favqulodda xizmatlar",
    emergencyText: "Yagona favqulodda raqam — 112 (bepul).",
    consulateTitle: "Elchixona yoki konsullik",
    consulateText:
      "Oʻz mamlakatingiz konsulligining telefoni va manzilini mamlakatingiz TIV rasmiy saytidan topib, telefonga saqlang.",
    scenariosTitle: "Agar… nima qilish kerak",
    scenarios: [
      {
        title: "Sizni hibsga olishdi yoki hujjatlaringizni tekshirishmoqda",
        steps: [
          "Xotirjam boʻling, qarshilik qilmang.",
          "Tarjimon va sababni tushuntirishni soʻrang.",
          "Tushunmagan narsangizni imzolamang.",
          "Bayonnoma nusxasini talab qiling. Konsullik yoki yuristga qoʻngʻiroq qiling.",
        ],
      },
      {
        title: "Ish beruvchi maosh bermayapti yoki hujjatlarni olib qoʻygan",
        steps: [
          "Yozib oling: surat, xabarlar, guvohlar, sanalar.",
          "Ortiqcha narsani bermang va imzolamang.",
          "Mehnat inspeksiyasi, yurist, konsullikka murojaat qiling.",
        ],
      },
      {
        title: "Kasal boʻlib qoldingiz yoki jarohat oldingiz",
        steps: [
          "Hayotga xavf boʻlsa 112 ga qoʻngʻiroq qiling.",
          "Xorijiy fuqaro ekaningizni ayting — yordam koʻrsatish majburiy.",
          "Maʼlumotnoma va xulosalarni saqlang.",
        ],
      },
    ],
    ngoTitle: "Yuridik yordam",
    ngoText: "Tekshirilgan tashkilotlar va bepul yuristlar roʻyxatini tekshiruvdan keyin qoʻshamiz.",
  },
  about: {
    title: "Loyiha haqida",
    text:
      "«Проводник» — Markaziy Osiyodan kelgan migrantlarga Rossiyada hujjatlar, ish va qoʻllab-quvvatlash masalalarida yordam beradigan mustaqil loyiha.",
    disclaimerTitle: "Muhim",
    disclaimer:
      "Ilova davlat xizmati emas va yuridik maslahatni almashtirmaydi. Qonunlar va qoidalar oʻzgaradi — maʼlumotni rasmiy saytlarda tekshiring.",
    privacyTitle: "Maxfiylik",
    privacy:
      "Hozircha barcha belgilar va sanalaringiz faqat brauzeringizda saqlanadi. Biz ularni serverga yubormaymiz.",
    versionLabel: "Versiya",
  },
  offline: {
    title: "Internet yoʻq",
    text: "Avval yuklangan boʻlimni oching yoki keyinroq urinib koʻring.",
  },
};

export default uz;
