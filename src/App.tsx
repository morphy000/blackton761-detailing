import { useEffect, useState, type FormEvent } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import {
  ArrowRight, Check, ChevronDown, Clock3, MapPin,
  ArrowLeft, ExternalLink, Menu, Navigation, Phone, ShieldCheck, Sparkles, Star, X, Calculator, MessageCircle
} from 'lucide-react'
import { cn } from './lib/utils'

const WHATSAPP_URL = "https://wa.me/79184422669"
const PHONE_DISPLAY = "+7 (918) 442-26-69"
const PHONE_RAW = "+79184422669"
const YANDEX_REVIEWS_URL = "https://yandex.com/maps/org/blesk/170427377596/reviews/"

const services = [
  { no: '01', title: 'Комплексная мойка (кузов + салон)', desc: 'Полная профессиональная очистка внешней и внутренней поверхности авто: бережная мойка и глубокая уборка интерьера.', price: '1 400 ₽', time: '1–1.5 ч' },
  { no: '02', title: 'Керамическое покрытие кузова', desc: 'Нанесение нанокерамического слоя на ЛКП: стойкая защита от дорожной химии, грязи, ультрафиолета и реагентов.', price: '7 999 ₽', time: '1–2 дня' },
  { no: '03', title: 'Химчистка салона автомобиля', desc: 'Тщательная глубокая очистка кресел, ковров, потолка, пластика и багажника. Скидка 30% до конца месяца.', price: '7 999 ₽', time: '1 день' },
  { no: '04', title: 'Двухфазная детейлинг мойка кузова', desc: 'Комплексная мойка с сохранением и подготовкой лакокрасочного покрытия (ЛКП) к дальнейшей защите.', price: '1 299 ₽', time: '45 мин' },
  { no: '05', title: 'Мойка подкапотного пространства', desc: 'Глубокая и безопасная очистка моторного отсека от масла, грязи, гари и солей с защитной консервацией.', price: '1 499 ₽', time: '1 час' },
  { no: '06', title: 'Трёхфазная детейлинг мойка кузова', desc: 'Премиум мойка кузова с деконтаминацией, консервацией лака и защитным гидрофобным слоем.', price: '1 799 ₽', time: '1–1.5 ч' },
  { no: '07', title: 'Пропитка кожи салона', desc: 'Глубокая обработка и кондиционирование кожаных сидений, дверных карт, руля и вставок (кожа и экокожа).', price: '1 999 ₽', time: '1.5 ч' },
  { no: '08', title: 'Озонирование салона', desc: 'Профессиональная дезинфекция и полное удаление табачного, биологического запаха и бактерий.', price: '1 999 ₽', time: '45 мин' },
  { no: '09', title: 'Кварцевое покрытие кузова', desc: 'Нанесение силикатно-кварцевого слоя (жидкое стекло), создающего прочную прозрачную гидрофобную пленку.', price: '500 ₽', time: '30 мин' },
]

const studioGallery = [
  '/photos/slot_1.jpg',
  '/photos/slot_2.jpg',
  '/photos/photo_4.jpg',
  '/photos/photo_5.jpg',
  '/photos/slot_5.jpg',
  '/photos/slot_6.jpg',
]

const testimonials = [
  {
    quote: 'Долго искал мастерскую для полной уборки салона и подкапотного пространства своего авто. Уборку под капотом не каждому доверишь. Спасибо мастеру Виталию — подробно рассказал о технологии приведения авто в первозданное состояние. Забирал машину с внуками, которые увидев чистоту, отказывались садиться в салон в обуви! Рекомендую.',
    name: 'Петрович Иванов',
    car: 'Химчистка салона + Мойка подкапотки',
    date: '2 ноября 2025'
  },
  {
    quote: 'Результат превзошёл все ожидания! Кузов блестит как новенький, запах свежести в салоне просто потрясающий. Особенно впечатлила работа с колёсами — чернение выполнено безупречно, битумные пятна ушли без следа. Использовали специальные средства для пропитки кожи и полироли для пластика.',
    name: 'Pavel P.',
    car: 'Комплексная мойка + Пропитка кожи',
    date: '12 сентября 2025'
  },
  {
    quote: 'Мыл здесь свою BMW 5 перед свадьбой — результат превзошёл все ожидания! Машина выглядела просто идеально, всё сияло как новое. Видно, что работают с душой и вниманием к деталям. Персонал — отдельное спасибо, очень вежливые и общительные ребята.',
    name: 'Владислав',
    car: 'BMW 5 · Трёхфазная детейлинг мойка',
    date: '10 июня 2025'
  },
  {
    quote: 'Долгое время не решалась на мойку подкапотного пространства своего авто, но почитала положительные отзывы об автомойке и доверилась сотрудникам. В итоге не пожалела — всё сделали в лучшем виде! Адекватные цены, отличное обслуживание, комфортная зона ожидания.',
    name: 'Анастасия М.',
    car: 'Мойка подкапотного пространства',
    date: '28 августа 2025'
  },
]

const faqs = [
  ['Сколько по времени занимает комплексная мойка (кузов + салон)?', 'Комплексная мойка кузова и салона занимает от 1 до 1.5 часов. Мы совмещаем бережную мойку кузова с глубокой очисткой салона, очищаем стекла изнутри и наносим чернение на резину.'],
  ['Что дает керамическое покрытие кузова за 7 999 ₽?', 'Керамика образует нанокерамический защитный слой, который надежно защищает ЛКП от грязи, дорожной химии, ультрафиолета и реагентов, создавая глубокий зеркальный блеск и мощный гидрофоб.'],
  ['Безопасна ли мойка подкапотного пространства?', 'Да, на 100%. Мы используем специальный диэлектрический состав, безопасный для проводки и блоков управления. Моторный отсек очищается кистями от масла, гари и солей, затем сушится и консервируется защитным составом.'],
  ['Что включает химчистка салона за 7 999 ₽?', 'Тщательная профессиональная очистка кресел, ковров, потолка, пластика и багажника. До конца месяца действует скидка 30% на детейлинг салона! Дополнительно доступна пропитка кожи (1 999 ₽) и озонирование (1 999 ₽).'],
]

const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.22, 1, 0.36, 1] as const } } }

function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(onComplete, 1200)
    return () => { window.clearTimeout(timer); document.body.style.overflow = '' }
  }, [onComplete])

  return <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .45, ease: 'easeInOut' } }} className="fixed inset-0 z-[100] grid place-items-center bg-ink text-bone">
    <div className="w-[min(320px,76vw)] text-center">
      <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex justify-center"><Logo /></motion.div>
      <div className="mt-8 h-px overflow-hidden bg-white/15"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} className="h-full origin-left bg-acid" /></div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="mt-4 text-[10px] font-bold uppercase tracking-[.24em] text-white/50">Премиум детейлинг Краснодар</motion.p>
    </div>
  </motion.div>
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: .25 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-acid" />
}

function Logo({ light = true }: { light?: boolean }) {
  return <Link to="/" className={cn('group flex items-center gap-3.5', light ? 'text-bone' : 'text-ink')} aria-label="БЛЕСК — главная">
    <span className={cn('relative grid size-10 place-items-center overflow-hidden rounded-[11px] border transition duration-500 group-hover:rotate-3', light ? 'border-white/25 bg-white/[.04]' : 'border-black/20')}>
      <Sparkles className="size-5 text-acid" />
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-acid transition-all duration-500 group-hover:w-full" />
    </span>
    <span className="flex flex-col leading-none">
      <span className="font-display text-[20px] font-bold tracking-[.14em]">БЛЕСК</span>
      <span className="mt-1 text-[8px] font-bold tracking-[.25em] text-muted">DETAILING & PPF</span>
    </span>
  </Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn) }, [])
  const links = [['Запись', '#kontakt'], ['Услуги', '#uslugi'], ['Работы', '#realizacii'], ['Цены', '#cennik'], ['Карта', '#karta']]
  
  return <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled && 'border-b border-white/10 bg-ink/90 backdrop-blur-xl')}>
    <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
      <Logo />
      <nav className="hidden items-center gap-8 lg:flex" aria-label="Главная навигация">
        {links.map(([name, href]) => <a key={name} href={href} className="text-sm font-medium text-white/70 transition hover:text-white">{name}</a>)}
      </nav>
      <div className="hidden items-center gap-4 sm:flex">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-black">
          <MessageCircle size={15} /> WhatsApp
        </a>
        <a href={`tel:${PHONE_RAW}`} className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-acid hover:bg-acid hover:text-ink">
          <Phone size={14} /> {PHONE_DISPLAY}
        </a>
      </div>
      <button className="grid size-11 place-items-center rounded-full border border-white/20 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }} className="border-t border-white/10 bg-ink px-5 py-8 lg:hidden">
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .05 } } }}>
        {links.map(([name, href], i) => <motion.a variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }} key={name} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl text-bone"><span>{name}</span><span className="font-sans text-[10px] text-white/30">0{i + 1}</span></motion.a>)}
        <div className="mt-6 flex flex-col gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 font-bold text-black">
            <MessageCircle size={17} /> Написать в WhatsApp
          </a>
          <a href={`tel:${PHONE_RAW}`} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white">
            <Phone size={17} /> Позвонить {PHONE_DISPLAY}
          </a>
        </div>
      </motion.div>
    </motion.nav>}</AnimatePresence>
  </header>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.19em] text-muted"><span className="h-px w-8 bg-acid" />{children}</div>
}

function Hero() {
  const reduce = useReducedMotion()
  return <section className="relative min-h-[760px] overflow-hidden bg-ink text-white sm:min-h-[820px] lg:h-screen lg:min-h-[760px]">
    <div className="absolute inset-0">
      <img src="/photos/photo_1.jpg" alt="Бокс детейлинг студии Блеск Краснодар" className="h-full w-full object-cover object-[60%_center]" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.96)_0%,rgba(5,5,5,.75)_50%,rgba(5,5,5,.3)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.85)_0%,transparent_50%)]" />
    </div>
    <div className="relative mx-auto flex h-full min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 sm:min-h-[820px] sm:px-8 lg:min-h-[760px] lg:justify-center lg:px-12 lg:pb-0">
      <motion.div initial={reduce ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: .12 } } }} className="max-w-4xl">
        <motion.div variants={reveal} className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-white/80">
          <span>Студия детейлинга и бронирования · Краснодар</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-acid">★ 4.9 (278 отзывов)</span>
        </motion.div>
        <motion.h1 variants={reveal} className="font-display text-[clamp(2.8rem,6.8vw,6.5rem)] font-bold leading-[.92] tracking-[-.045em] text-white">
          Блеск и защита<br />
          <span className="text-white">для вашего авто.</span>
        </motion.h1>
        <motion.p variants={reveal} className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
          Комплексная мойка, керамическое покрытие кузова, глубокая химчистка салона и мойка двигателя на ул. Первомайской, 55 в Краснодаре. Профессиональная автохимия и честные цены без переплат.
        </motion.p>
        <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#kontakt" className="group flex min-h-14 items-center justify-between gap-6 rounded-full bg-acid px-7 font-bold text-ink transition hover:bg-white active:scale-[0.98]">
            Записаться на осмотр <ArrowRight className="transition group-hover:translate-x-1" size={19} />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-7 font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-black">
            <MessageCircle size={18} /> Написать в WhatsApp
          </a>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-7 right-12 hidden gap-10 text-sm text-white/70 lg:flex">
        <div><b className="block text-white">Пн.–Вс. 9:00–20:00</b>Без выходных</div>
        <div><b className="block text-white">ул. Первомайская, 55</b>Краснодар, 1 этаж</div>
      </div>
    </div>
  </section>
}

function TrustStrip() {
  const items = [
    [ShieldCheck, 'Премиальная автохимия', 'Безопасные составы для ЛКП, кожи и моторного отсека'],
    [Clock3, 'Четкие сроки', 'Фиксируем дату выдачи в акте до начала работ'],
    [Sparkles, 'Прозрачный расчет', 'Никаких доплат после сдачи автомобиля']
  ]
  return <section className="border-b border-line bg-graphite">
    <div className="mx-auto grid max-w-[1440px] sm:grid-cols-3">
      {items.map(([Icon, title, desc], i) => (
        <div key={String(title)} className={cn('flex items-center gap-4 px-5 py-7 sm:px-8 lg:px-12', i !== 2 && 'border-b border-line sm:border-b-0 sm:border-r')}>
          <Icon className="shrink-0 text-acid" size={24} />
          <div>
            <b className="block text-sm text-bone">{title as string}</b>
            <span className="text-xs text-muted">{desc as string}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
}

function Services() {
  return <section id="uslugi" className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <motion.div initial={{ opacity: 1, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .65 }} className="mb-14 grid gap-8 lg:grid-cols-2">
      <div><SectionLabel>Услуги студии</SectionLabel><h2 className="max-w-xl font-display text-4xl font-bold leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">Профессиональный детейлинг и уход.</h2></div>
      <p className="max-w-lg self-end text-base leading-7 text-black/60 lg:justify-self-end">Мы не предлагаем лишних работ. Сначала проводим осмотр кузова под инспекционным светом, выявляем повреждения и подбираем точный пакет защиты.</p>
    </motion.div>
    <div className="grid border-t border-black/15 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => <motion.article key={s.no} initial={{ opacity: 1, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * .07 }} className="group relative min-h-[310px] border-b border-black/15 p-7 transition-colors hover:bg-white lg:p-9 md:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(odd)]:border-r-0">
        <div className="flex items-center justify-between text-xs font-bold tracking-[.12em] text-black/40"><span>{s.no}</span><ArrowRight size={17} className="transition group-hover:translate-x-1 group-hover:text-black" /></div>
        <h3 className="mt-10 font-display text-2xl font-bold tracking-[-.03em] text-ink">{s.title}</h3><p className="mt-4 text-sm leading-6 text-black/60">{s.desc}</p>
        <div className="absolute bottom-7 left-7 right-7 flex justify-between border-t border-black/10 pt-4 text-xs lg:bottom-9 lg:left-9 lg:right-9"><b>{s.price}</b><span className="text-black/50">{s.time}</span></div>
      </motion.article>)}
    </div>
  </div></section>
}

function Projects() {
  return <section id="realizacii" className="bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <motion.div initial={{ opacity: 1, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .65 }} className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
      <div>
        <SectionLabel>Портфолио студии</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-[-.045em] sm:text-6xl">Работы из нашего бокса.</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
          Реальные фотографии автомобилей и процессов ухода без фильтров и искусственной ретуши.
        </p>
      </div>
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
        <MessageCircle size={17} /> Запросить больше фото в WhatsApp
      </a>
    </motion.div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studioGallery.map((img, i) => (
        <motion.article
          key={img}
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .18 }}
          transition={{ duration: .5, delay: (i % 3) * .08 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-graphite"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={img}
              alt={`Работа студии Блеск #${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Фото 0{i + 1}
            </span>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-semibold text-white/90">Выполнено в студии</span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-acid">
                <Check size={13} /> Гарантия
              </span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  </div></section>
}

function Pricing() {
  return <section id="cennik" className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <div className="grid gap-12 lg:grid-cols-12"><div className="lg:col-span-5"><SectionLabel>Прайс-лист услуг</SectionLabel><h2 className="font-display text-4xl font-bold leading-[1.03] tracking-[-.045em] text-ink sm:text-6xl">Честная стоимость без сюрпризов.</h2><p className="mt-7 max-w-md text-sm leading-6 text-black/60">Официальный прайс-лист студии «Блеск» на ул. Первомайской, 55. Профессиональная автохимия, бережное отношение к авто и фиксированные цены.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
        <PriceCard title="Комплексная мойка (кузов + салон)" price="1 400 ₽" desc="Полная очистка внешней и внутренней поверхности автомобиля." items={['Бережная двухфазная мойка кузова', 'Влажная уборка и пылесос салона', 'Мойка стекол изнутри и снаружи', 'Чернение резины и сушка турбосушкой']} />
        <PriceCard featured title="Керамическое покрытие кузова" price="7 999 ₽" desc="Нанесение нанокерамического слоя на ЛКП для стойкой защиты." items={['Глубокая деконтаминация ЛКП', 'Нанесение нанокерамического слоя', 'Защита от дорожной химии и УФ-лучей', 'Стойкий зеркальный глянец и гидрофоб']} />
        <PriceCard title="Химчистка салона" price="7 999 ₽" desc="Тщательная глубокая очистка интерьера (скидка 30%)." items={['Химчистка кресел, ковров и потолка', 'Глубокая очистка пластика и багажника', 'Удаление въевшихся пятен и запахов', 'Деликатная сушка без сырости']} />
        <PriceCard title="Мойка подкапотного пространства" price="1 499 ₽" desc="Безопасная очистка моторного отсека." items={['Диэлектрический состав для проводки', 'Удаление масла, гари и солевых отложений', 'Кистевая проработка труднодоступных мест', 'Защитная консервация навесного оборудования']} />
      </div></div>
  </div></section>
}

function PriceCard({ title, price, desc, items, featured }: { title: string, price: string, desc: string, items: string[], featured?: boolean }) {
  const waText = encodeURIComponent(`Здравствуйте! Хочу записаться на пакет «${title}» (${price}).
Мое имя: 
Телефон: 
Марка и модель авто: `)

  return <motion.article initial={{ opacity: 1, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} whileHover={{ y: -6 }} transition={{ duration: .4 }} className={cn('relative flex flex-col justify-between rounded-2xl border p-7', featured ? 'border-ink bg-ink text-bone' : 'border-black/15 bg-white text-ink')}>
    <div>
      {featured && <span className="absolute right-5 top-5 rounded-full bg-acid px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Хит сезона</span>}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <p className={cn('mt-2 text-xs', featured ? 'text-white/50' : 'text-black/50')}>{desc}</p>
      <p className="mt-8 font-display text-3xl font-bold">{price}</p>
      <ul className={cn('mt-6 space-y-3 border-t pt-6 text-sm', featured ? 'border-white/15 text-white/70' : 'border-black/10 text-black/65')}>
        {items.map(item => <li key={item} className="flex gap-3"><Check size={16} className="shrink-0 text-lime-600" />{item}</li>)}
      </ul>
    </div>
    <div className="mt-8 pt-6 border-t border-black/10">
      <a
        href={`${WHATSAPP_URL}?text=${waText}`}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition duration-200',
          featured
            ? 'bg-acid text-ink hover:bg-white'
            : 'border border-black/15 bg-black/[0.03] text-ink hover:border-black hover:bg-black hover:text-white'
        )}
      >
        <MessageCircle size={15} /> Выбрать пакет
      </a>
    </div>
  </motion.article>
}

function Testimonials() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setActive(value => (value + 1) % testimonials.length), 7000)
    return () => window.clearInterval(timer)
  }, [])
  const change = (direction: number) => setActive(value => (value + direction + testimonials.length) % testimonials.length)

  return <section className="overflow-hidden bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12">
    <div className="mx-auto max-w-[1344px]">
      <motion.div initial={{ opacity: 1, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <SectionLabel>Отзывы автовладельцев</SectionLabel>
      </motion.div>
      <div className="grid gap-10 lg:grid-cols-[1.45fr_.55fr]">
        <div className="min-h-[460px] sm:min-h-[380px] lg:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="flex gap-1 text-acid">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/60">
                  Яндекс Карты · {testimonials[active].date}
                </span>
              </div>
              <p className="font-display text-xl leading-[1.35] tracking-[-.025em] text-white/95 sm:text-3xl">
                «{testimonials[active].quote}»
              </p>
              <footer className="mt-7 text-sm">
                <b className="text-white">{testimonials[active].name}</b>
                <span className="ml-3 text-white/45">{testimonials[active].car}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-between border-t border-white/15 pt-7 lg:border-l lg:border-t-0 lg:pl-10">
          <div>
            <div className="font-display text-6xl font-bold">4.9<span className="text-2xl text-white/40">/5</span></div>
            <div className="mt-3 flex gap-1 text-acid">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            </div>
            <p className="mt-3 text-xs leading-5 text-white/50">
              Рейтинг на Яндекс Картах на основе 278 реальных отзывов
            </p>
            <div className="mt-6">
              <a
                href={YANDEX_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-bone transition hover:border-acid hover:bg-acid hover:text-ink"
              >
                <ExternalLink size={14} className="text-acid group-hover:text-ink transition" />
                <span>Посмотреть отзывы на Яндекс Картах</span>
              </a>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => change(-1)}
              className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-acid hover:text-acid"
              aria-label="Предыдущий"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => change(1)}
              className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-acid hover:text-acid"
              aria-label="Следующий"
            >
              <ArrowRight size={18} />
            </button>
            <span className="ml-auto self-center text-xs text-white/35">
              0{active + 1} / 0{testimonials.length}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-14 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((item, i) => (
          <button
            key={item.name}
            onClick={() => setActive(i)}
            className={cn(
              'border-b border-white/10 px-0 py-5 text-left transition sm:px-5 lg:border-b-0 lg:border-r',
              active === i ? 'text-bone' : 'text-white/35 hover:text-white/65'
            )}
          >
            <span className="text-[10px] font-bold text-acid">0{i + 1}</span>
            <b className="mt-2 block text-sm">{item.name}</b>
            <span className="mt-1 block truncate text-[10px]">{item.car}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
}

function FAQ() {
  return <section className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Частые вопросы</SectionLabel><h2 className="font-display text-4xl font-bold tracking-[-.04em] text-ink sm:text-5xl">Все прозрачно до заезда в бокс.</h2></div>
    <Accordion.Root type="single" collapsible className="border-t border-black/15">{faqs.map(([q, a], i) => <Accordion.Item value={`item-${i}`} key={q} className="group/item border-b border-black/15"><Accordion.Header><Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-bold text-ink transition hover:pl-2 sm:text-xl">{q}<span className="grid size-9 shrink-0 place-items-center rounded-full border border-black/15 transition duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-white"><ChevronDown size={17} /></span></Accordion.Trigger></Accordion.Header><Accordion.Content className="accordion-content overflow-hidden text-sm leading-6 text-black/60"><motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-2xl pb-7 pr-10">{a}</motion.p></Accordion.Content></Accordion.Item>)}</Accordion.Root>
  </div></section>
}

function MapSection() {
  return <section className="bg-bone px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12"><motion.div initial={{ opacity: 1, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1344px] overflow-hidden rounded-2xl bg-ink text-bone">
    <div className="grid lg:grid-cols-[.72fr_1.28fr]">
      <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
        <div>
          <SectionLabel>Локация</SectionLabel>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-.04em] sm:text-5xl">Студия «Блеск»<br /><span className="text-white/40">в Краснодаре.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">Удобный асфальтированный заезд, круглосуточно охраняемая территория и закрытый чистый бокс.</p>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div><span className="block text-[10px] font-bold uppercase tracking-widest text-white/35">Адрес</span><b className="mt-1.5 block">Краснодар, ул. Первомайская, 55<br />1 этаж</b></div>
            <div><span className="block text-[10px] font-bold uppercase tracking-widest text-white/35">График работы</span><b className="mt-1.5 block">Пн.–Вс. 9:00–20:00<br />Без выходных</b></div>
          </div>
          <a href={`https://yandex.ru/maps/?text=Краснодар+Первомайская+55`} target="_blank" rel="noreferrer" className="group mt-7 flex min-h-14 items-center justify-between rounded-full bg-acid px-6 font-bold text-ink transition hover:bg-white">
            Построить маршрут в навигаторе <span className="flex items-center gap-2"><Navigation size={17} /><ExternalLink size={15} className="opacity-45 transition group-hover:opacity-100" /></span>
          </a>
        </div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden bg-[#18181b] lg:min-h-[580px]">
        <iframe title="Карта проезда к студии Блеск" src="https://yandex.ru/map-widget/v1/?ll=38.995%2C45.055&z=15" loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[40%] contrast-[1.1]" />
      </div>
    </div>
  </motion.div></section>
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [service, setService] = useState('Комплексная мойка (кузов + салон) — 1 400 ₽')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = fd.get('name') || 'Не указано'
    const phone = fd.get('phone') || 'Не указан'
    const car = fd.get('car') || 'Не указана'
    const selectedService = fd.get('service') || service

    const message = `Здравствуйте! Хочу записаться на осмотр и расчет:
Имя: ${name}
Телефон: ${phone}
Автомобиль: ${car}
Услуга: ${selectedService}`

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank')
    setSent(true)
  }

  return <section id="kontakt" className="relative overflow-hidden bg-graphite px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12">
    <div className="pointer-events-none absolute -right-40 top-0 size-[600px] rounded-full bg-acid/5 blur-3xl" />
    <div className="relative mx-auto grid max-w-[1344px] gap-14 lg:grid-cols-2">
      <div>
        <SectionLabel>Онлайн-запись</SectionLabel>
        <h2 className="max-w-xl font-display text-4xl font-bold leading-[1.03] tracking-[-.045em] sm:text-6xl">Запишитесь на осмотр и расчет.</h2>
        <p className="mt-7 max-w-md text-sm leading-6 text-white/60">Ответим на любые вопросы, проведем осмотр под инспекционным светом и зафиксируем точную смету по официальному прайсу без скрытых доплат.</p>
        <div className="mt-10 space-y-5 text-sm">
          <a href={`tel:${PHONE_RAW}`} className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full border border-white/15"><Phone size={18} /></span>
            <div><span className="block text-xs text-white/40">Прямой звонок</span><b className="text-lg">{PHONE_DISPLAY}</b></div>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-emerald-400">
            <span className="grid size-11 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10"><MessageCircle size={18} /></span>
            <div><span className="block text-xs text-white/40">WhatsApp чат</span><b className="text-lg">Написать мастеру</b></div>
          </a>
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full border border-white/15"><MapPin size={18} /></span>
            <div><span className="block text-xs text-white/40">Адрес бокса</span><b>г. Краснодар, ул. Первомайская, 55 (1 этаж)</b></div>
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="rounded-2xl bg-bone p-6 text-ink sm:p-9">
        {sent ? (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-acid"><Check /></span>
              <h3 className="mt-6 font-display text-3xl font-bold">Заявка отправлена.</h3>
              <p className="mt-3 text-sm text-black/60">Мы открыли чат WhatsApp для согласования удобного времени визита.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 inline-flex text-xs font-bold underline"
              >
                Отправить еще одну запись
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="mb-6 font-display text-2xl font-bold">Быстрая запись на оценку</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Ваше имя" name="name" placeholder="Как вас зовут?" />
              <Field label="Телефон" name="phone" placeholder="+7 (9XX) XXX-XX-XX" type="tel" />
            </div>
            <Field label="Марка и модель авто" name="car" placeholder="Например: Camry, Нива, BMW, Kia" />
            <label className="mt-5 block text-xs font-bold">Интересующая услуга
              <select
                name="service"
                value={service}
                onChange={e => setService(e.target.value)}
                className="mt-2 min-h-12 w-full appearance-none rounded-lg border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"
              >
                <option value="Комплексная мойка (кузов + салон) — 1 400 ₽">Комплексная мойка (кузов + салон) — 1 400 ₽</option>
                <option value="Керамическое покрытие кузова — 7 999 ₽">Керамическое покрытие кузова — 7 999 ₽</option>
                <option value="Химчистка салона — 7 999 ₽">Химчистка салона — 7 999 ₽</option>
                <option value="Трёхфазная детейлинг мойка кузова — 1 799 ₽">Трёхфазная детейлинг мойка кузова — 1 799 ₽</option>
                <option value="Мойка подкапотного пространства — 1 499 ₽">Мойка подкапотного пространства — 1 499 ₽</option>
                <option value="Пропитка кожи салона — 1 999 ₽">Пропитка кожи салона — 1 999 ₽</option>
                <option value="Озонирование салона — 1 999 ₽">Озонирование салона — 1 999 ₽</option>
                <option value="Кварцевое покрытие кузова — 500 ₽">Кварцевое покрытие кузова — 500 ₽</option>
              </select>
            </label>
            <button
              type="submit"
              className="mt-6 flex min-h-14 w-full items-center justify-between rounded-full bg-ink px-7 font-bold text-white transition hover:bg-acid hover:text-ink"
            >
              Записаться в WhatsApp <ArrowRight size={18} />
            </button>
            <span className="mt-3 block text-center text-[11px] text-black/50">
              Отвечаем в течение 5 минут в рабочее время
            </span>
          </>
        )}
      </form>
    </div>
  </section>
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="mt-5 block text-xs font-bold first:mt-0 sm:[.grid_&]:mt-0">{label}
    <input required {...props} className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm outline-none placeholder:text-black/35 focus:border-black" />
  </label>
}

function Footer() {
  return <footer className="bg-ink px-5 pb-24 pt-16 text-bone sm:px-8 lg:px-12 lg:pb-10">
    <div className="mx-auto max-w-[1344px]">
      <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-xs leading-5 text-white/50">
            Студия детейлинга и бронирования «Блеск». Краснодар, ул. Первомайская, 55. Профессиональная защита и уход за автомобилями премиум-класса.
          </p>
        </div>
        <div className="text-sm">
          <b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Локация</b>
          <p>Краснодар, ул. Первомайская, 55<br />микрорайон Табачная Фабрика, 1 этаж</p>
        </div>
        <div className="text-sm">
          <b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Связь</b>
          <a href={`tel:${PHONE_RAW}`} className="block font-semibold">{PHONE_DISPLAY}</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2 block text-emerald-400">WhatsApp чат</a>
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-7 text-[11px] text-white/35 sm:flex-row sm:justify-between">
        <p>© 2026 Студия детейлинга «Блеск». Все права защищены.</p>
        <div className="flex gap-5">
          <span>Краснодар, Россия</span>
        </div>
      </div>
    </div>
  </footer>
}

function Home() {
  const [loaded, setLoaded] = useState(false)
  return <>
    <AnimatePresence>{!loaded && <Loader onComplete={() => setLoaded(true)} />}</AnimatePresence>
    {loaded && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
      <ScrollProgress /><Header />
      <main>
        <Hero />
        <TrustStrip />
        <Contact />
        <Services />
        <Projects />
        <Pricing />
        <Testimonials />
        <FAQ />
        <MapSection />
      </main>
      <Footer />
      <motion.a
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ delay: .8, type: 'spring', stiffness: 180, damping: 22 }}
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-3 left-3 right-3 z-40 flex min-h-14 items-center justify-between rounded-full bg-emerald-500 px-6 font-bold text-black shadow-2xl sm:hidden"
      >
        <span>Рассчитать в WhatsApp</span>
        <MessageCircle size={20} />
      </motion.a>
    </motion.div>}
  </>
}

export default function App() {
  return <Routes><Route path="*" element={<Home />} /></Routes>
}
