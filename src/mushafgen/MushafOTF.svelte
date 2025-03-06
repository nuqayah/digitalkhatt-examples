<main>
  <article data-page=582>{@html page_tpl(text, use_tajweed)}</article>
</main>

<script>
import {apply_repls, add_zwj} from 'components/src/util.js'

let use_tajweed = true
let quran
const text = `
عَمَّ يَتَسَآءَلُونَ ۝١ عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ ۝٢ ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ ۝٣<br>
كَلَّا سَيَعْلَمُونَ ۝٤ ثُمَّ كَلَّا سَيَعْلَمُونَ ۝٥ أَلَمْ نَجْعَلِ ٱلْأَرْضَ مِهَٰدًا ۝٦<br>
وَٱلْجِبَالَ أَوْتَادًا ۝٧ وَخَلَقْنَٰكُمْ أَزْوَٰجًا ۝٨ وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا ۝٩<br>
وَجَعَلْنَا ٱلَّيْلَ لِبَاسًا ۝١٠ وَجَعَلْنَا ٱلنَّهَارَ مَعَاشًا ۝١١ وَبَنَيْنَا<br>
فَوْقَكُمْ سَبْعًا شِدَادًا ۝١٢ وَجَعَلْنَا سِرَاجًا وَهَّاجًا ۝١٣ وَأَنزَلْنَا<br>
مِنَ ٱلْمُعْصِرَٰتِ مَآءً ثَجَّاجًا ۝١٤ لِّنُخْرِجَ بِهِۦ حَبًّا وَنَبَاتًا ۝١٥ وَجَنَّٰتٍ<br>
أَلْفَافًا ۝١٦ إِنَّ يَوْمَ ٱلْفَصْلِ كَانَ مِيقَٰتًا ۝١٧ يَوْمَ يُنفَخُ فِى ٱلصُّورِ<br>
فَتَأْتُونَ أَفْوَاجًا ۝١٨ وَفُتِحَتِ ٱلسَّمَآءُ فَكَانَتْ أَبْوَٰبًا ۝١٩ وَسُيِّرَتِ<br>
ٱلْجِبَالُ فَكَانَتْ سَرَابًا ۝٢٠ إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا ۝٢١ لِّلطَّٰغِينَ<br>
مَـَٔابًا ۝٢٢ لَّٰبِثِينَ فِيهَآ أَحْقَابًا ۝٢٣ لَّا يَذُوقُونَ فِيهَا بَرْدًا وَلَا شَرَابًا<br>
۝٢٤ إِلَّا حَمِيمًا وَغَسَّاقًا ۝٢٥ جَزَآءً وِفَاقًا ۝٢٦ إِنَّهُمْ كَانُوا۟<br>
لَا يَرْجُونَ حِسَابًا ۝٢٧ وَكَذَّبُوا۟ بِـَٔايَٰتِنَا كِذَّابًا ۝٢٨ وَكُلَّ شَىْءٍ<br>
أَحْصَيْنَٰهُ كِتَٰبًا ۝٢٩ فَذُوقُوا۟ فَلَن نَّزِيدَكُمْ إِلَّا عَذَابًا ۝٣٠<br>
`

function page_tpl(use_tajweed) {
  let t = text
  if (use_tajweed)
      t = add_zwj(apply_repls(t, tajweed_repls))
  return t
}

const tajweed_repls = [
    [/([او]ٓ)(.ّ)/g,                     '<.madd-lazim>$1</span>$2'],
    [/([لمصكعسقن]ٓ)/g,                  '<.madd-lazim>$1</span>'],
    [/(آ)(لْ)/g,                        '<.madd-lazim>$1</span>$2'],
    [/(ـ?[اويٰ]ٓ)([ـ ]?ى?[ٕٔءأإؤئ])/g,     '<.madd-wajib>$1</span>$2'],
    [/([\u06E5\u06E6]ٓ)/g,              '<.madd-wajib>$1</span> '],
    [/(َا|ِي|ُو)(?=...[۝\n])/g,           (m, m1) => `<.madd-aarid>${m1}</span>`],

    [/ٱل(.ّ)/g,                         'ٱ<.idgham>ل</span>$1'],
    [/([لّ?.])ل(.ّ)/g,                   '$1<.idgham>ل</span>$2'],
    [/([وايى]۟)/g,                      '<.idgham>$1</span>'],
    [/([ࣰًࣱٌࣲٍ]|ن)([اى]? )([ينمو])/g,        '<.idgham>$1</span>$2<.ikhfaa>$3</span>'],
    [/([ࣰࣱࣲ]|ن)(?=[اى]? [لر])/g,          '<.idgham>$1</span>'],

    [/([ࣰًࣱٌࣲٍ]|ن)(?= ?[صذثكجشقسدطزفتضظ])/g, '<.ikhfaa>$1</span>'],
    [/([ۭۢ])/g,                          '<.ikhfaa>$1</span>'],
    [/([نم]ّ[َ-ِ])/g,                     '<.ikhfaa>$1</span>'],
    [/م(?= [مب])/g,                    '<.ikhfaa>م</span>'],

    [/([قطبجد]ْ)/g,                     '<.qalqalah>$1</span>'],
    [/<\.(\w.*?)>/g,                   (m, m1) => `<span class="tajweed-tip ${m1}">`],
    [/ (?=\d+[ ]|\n)/,                 ' ۝'],
]
</script>

<style>
@font-face {
  font-family: digitalkhatt;
  src: url(https://raw.githubusercontent.com/DigitalKhatt/digitalkhatt.org/master/ClientApp/src/assets/fonts/oldmadina.woff2);
}
@font-face {
  font-family: digitalkhatt;
  src: url(https://raw.githubusercontent.com/DigitalKhatt/digitalkhatt.org/master/ClientApp/src/assets/fonts/oldmadina.woff2);
  font-weight: bold;
}
main {
  font-family: digitalkhatt;
  font-size: 1.4rem;
  max-width: min(595px, 95vw);
  line-height: 1.9;
  margin: 0 auto;
}
article {
  text-align: justify;
  text-align-last: justify;
  padding: 0.2rem 0.5rem;
}
h1 {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
}
</style>
