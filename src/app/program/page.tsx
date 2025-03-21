import SecondaryHeader from '@/components/SecondaryHeader';
import { Button } from '@/components/ui/button';

export default function Program() {
  return (
    <div className='tex-primary'>
      <SecondaryHeader title='програм' />

      <div className='container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <h2
          id='infrastruktura'
          className='text-4xl font-extrabold text-primary text-center mb-6'
        >
          ЧУКАРИЦА НА ПРВОМ МЕСТУ
        </h2>
        <p className='text-xl text-primary mb-6 text-justify'>
          {' '}
          Чукарица је историјски и културно гледано једна од најбогатијих
          београдских општина са огромним људским потенцијалима. Чукарица према
          последњем попису има преко 170.000 становника што је чини једном од
          најнасељенијих општина у Републици Србији. На територији наше општине
          налазе се Кошутњак, Макишка и Липовачка шума, ако и Ада Циганлија која
          спада међу најпосећенија одмаралишта у Београду.
        </p>
        <p className='text-xl text-primary mb-6 text-justify'>
          Наш локали покрет је настао као одговор на вишедеценијску погрешну
          политику развоја због чега наша општина стагнира на свим пољима. На
          последњним локалним изборима владајућа коалиција окулљена око СНС-а и
          СПС-а добила је рекордно мали број гласова на најнижу излазност у
          истирији Чукарице. Упдаво зато, власт нема легитимитет да управља
          Чукарицом цео мандат, односно пуне четири године.
        </p>
        <p className='text-xl text-primary text-justify'>
          Наш примарни циљ биће одржавање оревремених локалних избора на којима
          ћемо тражити поверење грађана за идеје које у овом програму
          кандидујемо. Циљ нашег програма јесте покретање Чукарице са мртве
          тачке, а оно што нас издваја јесте озбиљан тим људи који је спреман да
          преузме пуну одговорност за вођење општине, ако и да полаже рачуне
          грађанима.
        </p>
      </div>
      <div className='flex flex-row justify-center'>
        <a href='/files/program.pdf' download='program.pdf'>
          <Button className='text-2xl font-bold' variant='destructive'>
            Преузми програм
          </Button>
        </a>
      </div>

      <div className='container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <div className='text-justify'>
          <h2
            id='infrastruktura'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            1. НОВИ ИНФРАСТУКТУРНИ ПРОЈЕКТИ
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Чукарици си потребни нови инфраструктурни пројекти који ће моћи да
            задовоље потребе свих њених грађана.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold '>
            {' '}
            Недовољан број паркинг места у урбаном делу општине решићемо
            изградњом подземних гаража испод паркова и других јавних површина;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold '>
            {' '}
            канализацију и здраву пијаћу воду верујемо да мора имати сваки
            становник наше општине. Изградњом нове канализационе мреже и заменом
            старих водоводних цеви решићемо овај вишедеценијски проблем;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["в)"] before:font-extrabold '>
            {' '}
            Радићемо на реконструкцији постојећих и изграњи нових локалних
            путева и пратеће инфраструктуре и тако значајно допринети
            повезаности наше општине;
          </p>
          <div className='text-xl text-primary mb-10 before:content-["г)"] before:font-extrabold'>
            {' '}
            Покренућемо бројне иницијативе у сврху:
            <section>
              <p className='pl-10 text-left'>- Очувања водоизворишта Макиш;</p>
              <p className='pl-10 text-left'>
                - Реновирања Београдског Хиподрома;
              </p>
              <p className='pl-10 text-left'>
                - Издградње шеталишта од умке до Аде;
              </p>
              <p className='pl-10 text-left'>
                - Обнове стаза на Кошутњаку и Липовици.
              </p>
            </section>
          </div>
          <h2
            id='samouprava'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            2. РАД ЛОКАЛНЕ САМОУПРАВЕ
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Грађани очекују бржу и ефикаснију комуникацију са општинским
            службама, као и веће учешће у процесу доношења одлука.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold '>
            {' '}
            Посветићемо много више пажње учешћу грађана у процесу доношења
            одлука кроз бољу комуникацију општине са месним заједницама и кроз
            организовање локалних референдума на бројне битне теме;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold '>
            {' '}
            Увешћемо мобилну апликацију помоћу које ће грађани моћи да пријаве
            стање јавних површина и комунални неред, након чега ће у року од 48
            сати, добити одговоре о предузетим мерама;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["в)"] before:font-extrabold '>
            {' '}
            Редовно ћемо ажурирати сајт општине са посебним освртом на
            транспарентно приказивање финансијског пословања општине, како би
            грађани у реалном вемену могли да се информишу о томе на шта се
            троши њихов новац, као и одакле долазе приходи;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["г)"] before:font-extrabold '>
            {' '}
            Организоваћемо редовно бесплатне семинаре за све заинтересоване
            грађане на којима ће људи моћи да се информишу о свим тренутним
            административним и пореским оптерећењима, ако и о врстама државних
            субвенција, олакшица, и јавним конкурсима;
          </p>
          <p className='text-xl text-primary mb-10 before:content-["д)"] before:font-extrabold '>
            {' '}
            Унапредићемо процес легализације и издавања оних грађевинских
            дозвола које су у надлежности општине.
          </p>
          <h2
            id='mladi'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            3. БРИГА О ДЕЦИ И МЛАДИМА
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Деца су будућност наше земље због чега морамо више да се потрудимо
            како бисмо им обезбедили нормалне услове за развој.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold'>
            {' '}
            Наш циљ биће да свака школа има своју спортску секцију за фудбал,
            кошарку, одбојку, а по могућству и пливање, ако и глумачку и хорску
            секцију;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold'>
            {' '}
            Организоваћемо трибине и предавања за ученике, наставнике и родитеље
            у свим основним школама у циљу јачања националне и еколошке свести;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["в)"] before:font-extrabold'>
            {' '}
            Увешћемо професионално обезбеђење у свим вртићима и школама које би
            се финансирало из буџета општине, а не џепа родитеља, што је до сада
            био случај;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["г)"] before:font-extrabold'>
            {' '}
            У сарадњи са надлежним органима постараћемо се да све кладионице и
            коцкарнице буду удаљене најмање 200 метара од основих и средњих
            школа;
          </p>
          <p className='text-xl text-primary mb-10 before:content-["д)"] before:font-extrabold'>
            {' '}
            реконструисаћемо постојеће и радити на изградњи нових фискултурних
            сала и бауена у нашим школама.
          </p>
          <h2
            id='sredina'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            4. ЗАШТИТА ЖИВОТНЕ СРЕДИНЕ
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Без чистог ваздуха, земље и воде нема ни здравог живота у 21. веку,
            а то нарочито важи за велике градове као што је Београд.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold'>
            {' '}
            Очуваћемо постојеће зелене површине у урбаним деловима општине и
            садити дрвореде у булеварима и широким улицама због бенефита који
            долазе са њима;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold'>
            {' '}
            Субвенционисаћемо прелазакј са индивидуалних ложишта на еколошки
            прихватљивије изворе енергије;
          </p>
          <p className='text-xl text-primary mb-10 before:content-["в)"] before:font-extrabold'>
            {' '}
            Одржаваћемо уредним паркове, шуме и потоке на територији свих месних
            заједница на Чукарици.
          </p>
          <h2
            id='turizam'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            5. РАЗВОЈ ТУРИЗМА И СПОРТА
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Наша општина има огромне потенцијале за развој туризма и спорта за
            које верујемо да нису до краја и у потпуности искоришћени.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold'>
            {' '}
            Активно ћемо радити на промоцији кампинга, конгресног, спортског и
            ловног турнизма како бисмо постали прва општина у Београду на овим
            пољима;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold'>
            {' '}
            Општина ће играти важну улогу у обнови историјских споменика и
            локалитета, као и спортских терена и сала;
          </p>
          <p className='text-xl text-primary mb-10 before:content-["в)"] before:font-extrabold'>
            {' '}
            Финансираћемо трошкове путовања спортиста са Чукарице на међународна
            и регионална такмичења.
          </p>
          <h2
            id='kultura'
            className='text-4xl font-bold text-primary mb-6 text-left'
          >
            6. БЕЋА УЛАГАЊА У КУЛТУРУ
          </h2>
          <p className='text-xl text-primary mb-6 italic'>
            Као будућа власт нећемо занемарити значај улагања у развој културних
            манифестација и садржаја на нивоу читаве општине.
          </p>
          <p className='text-xl text-primary mb-6 before:content-["а)"] before:font-extrabold'>
            {' '}
            Активно ћемо радити на промоцији аутентичних културнихманифестација
            локалног карактера, као што су Дани Сремчице и Улица отвореног срца;
          </p>
          <p className='text-xl text-primary mb-6 before:content-["б)"] before:font-extrabold'>
            {' '}
            Значајно ћемо радити на улагању у развој културних садржаја на
            Чукарици, као што су галерије и позоришта;
          </p>
          <p className='text-xl text-primary mb-10 before:content-["в)"] before:font-extrabold'>
            {' '}
            Финансираћемо трошкове путовања уметника са Чукарице на међународне
            и регионалне фестивале.
          </p>
        </div>
        <div className='flex flex-row justify-center'>
          <a href='/files/program.pdf' download='program.pdf'>
            <Button className='text-2xl font-bold' variant='destructive'>
              Преузми програм
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
