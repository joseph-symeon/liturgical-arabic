const phrases = {
  // ── Roles ────────────────────────────────────────────────────────────────
  "role-deacon": {
    arabic_voweled: "الشَمَّاسْ",
    arabic_unvoweled: "الشماس",
    translation: "Deacon",
    literal: "The Deacon",
    tags: ["role"]
  },
  "role-priest": {
    arabic_voweled: "الكاهِنْ",
    arabic_unvoweled: "الكاهن",
    translation: "Priest",
    literal: "The Priest",
    tags: ["role"]
  },
  "role-choir": {
    arabic_voweled: "الجَوْقة",
    arabic_unvoweled: "الجوقة",
    translation: "Choir",
    literal: "The Choir",
    tags: ["role"]
  },
  "role-all": {
    arabic_voweled: "الكُلُّ",
    arabic_unvoweled: "الكل",
    translation: "All",
    literal: "Everyone",
    tags: ["role"]
  },

  // ── Section Titles ───────────────────────────────────────────────────────
  "section-litany-of-peace": {
    arabic_voweled: "طِلْبَةُ السَّلام",
    arabic_unvoweled: "طلبة السلام",
    translation: "Litany of Peace",
    literal: "Petition of peace",
    tags: ["section-title", "litany"]
  },
  "section-antiphons": {
    arabic_voweled: "الأَنْدِيفُونَات",
    arabic_unvoweled: "الأنديفونات",
    translation: "Antiphons",
    literal: "Antiphons",
    tags: ["section-title", "antiphons"]
  },

  // ── Litany of Peace ──────────────────────────────────────────────────────
  "peace-001": {
    arabic_voweled: "بِسَلامٍ",
    arabic_unvoweled: "بسلام",
    translation: "In peace",
    literal: "With peace",
    tags: ["peace", "opening"]
  },
  "petition-001": {
    arabic_voweled: "إِلَى الرَّبِّ نَطْلُب",
    arabic_unvoweled: "إلى الرب نطلب",
    translation: "let us pray to the Lord",
    literal: "to the Lord we ask",
    tags: ["petition", "repeated"]
  },
  "lord-have-mercy-001": {
    arabic_voweled: "يَا رَبُّ ارْحَمْ",
    arabic_unvoweled: "يا رب ارحم",
    translation: "Lord, have mercy",
    literal: "O Lord, have mercy",
    tags: ["response", "mercy", "repeated"]
  },
  "peace-from-above-001": {
    arabic_voweled: "مِنْ أَجْلِ السَّلامِ مِنَ الْعُلَى",
    arabic_unvoweled: "من اجل السلام من العلى",
    translation: "For the peace from above",
    literal: "For the peace from on high",
    tags: ["peace", "petition"]
  },
  "salvation-001": {
    arabic_voweled: "وَخَلاصِ نُفُوسِنَا",
    arabic_unvoweled: "وخلاص نفوسنا",
    translation: "and the salvation of our souls",
    literal: "and salvation of our souls",
    tags: ["salvation", "souls"]
  },
  "whole-world-001": {
    arabic_voweled: "مِنْ أَجْلِ سَلامِ الْعَالَمِ كُلِّهِ",
    arabic_unvoweled: "من اجل سلام العالم كله",
    translation: "For the peace of the whole world",
    literal: "For peace of the whole world",
    tags: ["peace", "world"]
  },
  "holy-churches-001": {
    arabic_voweled: "وَحُسْنِ ثَبَاتِ كَنَائِسِ اللَّهِ الْقِدِّيسَة",
    arabic_unvoweled: "وحسن ثبات كنائس الله القديسة",
    translation: "and the good estate of the holy churches of God",
    literal: "and the good stability of the holy churches of God",
    tags: ["church", "stability"]
  },
  "union-001": {
    arabic_voweled: "وَاتِّحَادِ الْجَمِيع",
    arabic_unvoweled: "واتحاد الجميع",
    translation: "and the union of all",
    literal: "and union of everyone",
    tags: ["unity"]
  },
  "holy-house-001": {
    arabic_voweled: "مِنْ أَجْلِ هَذَا الْبَيْتِ الْقِدِّيس",
    arabic_unvoweled: "من اجل هذا البيت القديس",
    translation: "For this holy house",
    literal: "For this holy house",
    tags: ["church", "place"]
  },
  "enter-with-faith-001": {
    arabic_voweled: "وَالَّذِينَ يَدْخُلُونَ إِلَيْهِ بِإِيمَانٍ وَوَرَعٍ وَخَوْفِ اللَّه",
    arabic_unvoweled: "والذين يدخلون اليه بالايمان والورع وخوف الله",
    translation: "and those who enter it with faith, reverence, and the fear of God",
    literal: "and those who enter into it with faith and reverence and fear of God",
    tags: ["faith", "reverence", "fear-of-god"]
  },
  "help-save-001": {
    arabic_voweled: "أَعْضُدْ وَخَلِّصْ وَارْحَمْ وَاحْفَظْنَا يَا اللَّهُ بِنِعْمَتِكَ",
    arabic_unvoweled: "اعضد وخلص وارحم واحفظنا يا الله بنعمتك",
    translation: "Help, save, have mercy, and preserve us, O God, by Your grace",
    literal: "Support and save and have mercy and preserve us, O God, by Your grace",
    tags: ["verbs", "mercy", "grace"]
  },

  // ── Antiphons ─────────────────────────────────────────────────────────────
  "word-of-god-001": {
    arabic_voweled: "يا كَلِمَةَ اللّٰهِ",
    arabic_unvoweled: "يا كلمة الله",
    translation: "O Word of God",
    literal: "O Word of God",
    tags: ["address", "word-of-god", "christology"]
  },
  "only-begotten-001": {
    arabic_voweled: "الْابْنَ الْوَحيدَ",
    arabic_unvoweled: "الابن الوحيد",
    translation: "the Only-Begotten Son",
    literal: "the Only-Begotten Son",
    tags: ["christology", "only-begotten"]
  },
  "deathless-001": {
    arabic_voweled: "الَّذي لَمْ يَزَلْ غَيرَ مائِتٍ",
    arabic_unvoweled: "الذي لم يزل غير مائت",
    translation: "who has not ceased being deathless",
    literal: "who has not ceased, not dying",
    tags: ["christology", "deathless"]
  },
  "accepted-incarnate-001": {
    arabic_voweled: "لَقَدْ قَبِلْتَ أنْ تَتَجَسَّدَ",
    arabic_unvoweled: "لقد قبلت ان تتجسد",
    translation: "you accepted to become incarnate",
    literal: "you indeed accepted to become flesh",
    tags: ["incarnation"]
  },
  "for-our-salvation-001": {
    arabic_voweled: "مِنْ أجْلِ خَلاصِنا",
    arabic_unvoweled: "من اجل خلاصنا",
    translation: "for our salvation",
    literal: "for the sake of our salvation",
    tags: ["salvation", "incarnation"]
  },
  "from-theotokos-001": {
    arabic_voweled: "مِنَ القدّيسةِ والِدةِ الإِلهِ",
    arabic_unvoweled: "من القديسة والدة الاله",
    translation: "from the holy Mother of God",
    literal: "from the holy Mother of God",
    tags: ["theotokos", "incarnation"]
  },
  "ever-virgin-mary-001": {
    arabic_voweled: "الدّائمةِ البَتوليَّةِ مَرْيَمَ",
    arabic_unvoweled: "الدائمة البتولية مريم",
    translation: "the ever-virgin Mary",
    literal: "the ever-virgin Mary",
    tags: ["theotokos", "mary"]
  },
  "became-man-001": {
    arabic_voweled: "وَتأَنَّسْتَ بِغَيْرِ اسْتِحالَةٍ",
    arabic_unvoweled: "وتأنست بغير استحالة",
    translation: "and became man without change",
    literal: "and you became human without alteration",
    tags: ["incarnation", "christology"]
  },
  "crucified-001": {
    arabic_voweled: "وَصُلِبْتَ أَيُّها الْمَسيحُ إِلَهُنا",
    arabic_unvoweled: "وصلبت ايها المسيح الهنا",
    translation: "and were crucified, O Christ our God",
    literal: "and you were crucified, O Christ our God",
    tags: ["crucifixion"]
  },
  "trampled-death-001": {
    arabic_voweled: "وَبِمَوْتِكَ وَطِئْتَ الْمَوْتَ",
    arabic_unvoweled: "وبموتك وطئت الموت",
    translation: "and by Your death You trampled death",
    literal: "and by your death you trampled death",
    tags: ["resurrection", "death"]
  },
  "one-of-trinity-001": {
    arabic_voweled: "وَأَنْتَ لَمْ تَزَلْ أَحَدَ الثّالوثِ الْقَدّوسِ",
    arabic_unvoweled: "وانت لم تزل احد الثالوث القدوس",
    translation: "and You remain one of the Holy Trinity",
    literal: "and you have not ceased being one of the Holy Trinity",
    tags: ["trinity"]
  },
  "glorified-with-father-001": {
    arabic_voweled: "الْمُمَجَّدَ مَعَ الْآبِ والرّوحِ الْقُدُسِ",
    arabic_unvoweled: "الممجد مع الاب والروح القدس",
    translation: "glorified with the Father and the Holy Spirit",
    literal: "glorified with the Father and the Holy Spirit",
    tags: ["trinity"]
  },
  "save-us-001": {
    arabic_voweled: "خَلِّصْنا",
    arabic_unvoweled: "خلصنا",
    translation: "save us",
    literal: "save us",
    tags: ["petition"]
  }
};

export default phrases;
