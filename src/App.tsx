import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import {
  ArrowRight, Check, ChevronDown, Clock3, MapPin,
  ArrowLeft, ExternalLink, Menu, Phone, ShieldCheck, Sparkles, Star, X, MessageCircle
} from 'lucide-react'
import { cn } from './lib/utils'
import { getActiveStudioConfig } from './config/studioConfig'

const studio = getActiveStudioConfig()
const MESSENGER_URL = studio.branding.messenger.url
const PHONE_DISPLAY = studio.branding.phoneDisplay
const PHONE_RAW = studio.branding.phoneRaw
const YANDEX_REVIEWS_URL = studio.rating.sourceUrl
const STUDIO_NAME = studio.branding.fullName || `${studio.branding.namePrefix} ${studio.branding.nameHighlight}`

const FALLBACK_GALLERY_IMAGES = [
  '/images/project-sedan.webp',
  '/images/project-ev.webp',
  '/images/project-estate.webp',
  '/images/project-hatch.webp',
  '/images/audi.webp',
  '/images/bmw.webp'
]

function getMessengerStyles(type: string) {
  switch (type) {
    case 'whatsapp':
      return {
        badgeBorder: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white',
        heroButton: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-600 hover:text-white',
        submitButton: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        linkText: 'text-emerald-400',
        contactIcon: 'border-emerald-500/30 bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white',
        floatingBar: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      }
    case 'telegram':
      return {
        badgeBorder: 'border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-600 hover:text-white',
        heroButton: 'border-sky-500/40 bg-sky-500/15 text-sky-400 hover:bg-sky-600 hover:text-white',
        submitButton: 'bg-sky-600 hover:bg-sky-500 text-white',
        linkText: 'text-sky-400',
        contactIcon: 'border-sky-500/30 bg-sky-500/10 group-hover:bg-sky-600 group-hover:text-white',
        floatingBar: 'bg-sky-600 hover:bg-sky-500 text-white',
      }
    case 'max':
    default:
      return {
        badgeBorder: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white',
        heroButton: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-600 hover:text-white',
        submitButton: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        linkText: 'text-indigo-400',
        contactIcon: 'border-indigo-500/30 bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white',
        floatingBar: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      }
  }
}
const messengerTheme = getMessengerStyles(studio.branding.messenger.type)

const services = studio.services
const studioGallery = studio.gallery
const testimonials = studio.testimonials
const faqs = studio.faqs

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
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="mt-4 text-[10px] font-bold uppercase tracking-[.24em] text-white/50">{studio.branding.tagline}</motion.p>
    </div>
  </motion.div>
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: .25 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-acid" />
}

function Logo({ light = true }: { light?: boolean }) {
  return <Link to="/" className={cn('group flex items-center gap-3', light ? 'text-bone' : 'text-ink')} aria-label={`${STUDIO_NAME} — главная`}>
    {studio.branding.logoUrl ? (
      <div className="relative size-11 overflow-hidden rounded-xl border border-white/20 bg-white p-1 transition duration-300 group-hover:border-acid shrink-0 flex items-center justify-center">
        <img src={studio.branding.logoUrl} alt={`Логотип ${STUDIO_NAME}`} className="h-full w-full object-contain" />
      </div>
    ) : (
      <span className={cn('relative grid size-10 place-items-center overflow-hidden rounded-[11px] border transition duration-500 group-hover:rotate-3', light ? 'border-white/25 bg-white/[.04]' : 'border-black/20')}>
        <Sparkles className="size-5 text-acid" />
      </span>
    )}
    <div className="flex flex-col leading-none">
      <div className="flex items-center gap-1.5 font-display text-[17px] font-bold tracking-tight">
        <span className={light ? 'text-white' : 'text-ink'}>{studio.branding.namePrefix}</span>
        <span className="text-red-500 font-extrabold tracking-wide">{studio.branding.nameHighlight}</span>
      </div>
      <span className="mt-1 text-[8.5px] font-bold tracking-[.18em] text-white/50 uppercase">
        {studio.branding.tagline}
      </span>
    </div>
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
        <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className={cn('flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition', messengerTheme.badgeBorder)}>
          <MessageCircle size={15} /> {studio.branding.messenger.label}
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
          <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className={cn('flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition', messengerTheme.submitButton)}>
            <MessageCircle size={17} /> {studio.branding.messenger.chatActionText}
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
      <img
        src={studioGallery[0] || "/images/hero.webp"}
        alt={`Бокс ${STUDIO_NAME}`}
        onError={(e) => {
          if (e.currentTarget.src !== '/images/hero.webp' && !e.currentTarget.src.endsWith('/images/hero.webp')) {
            e.currentTarget.src = '/images/hero.webp'
          }
        }}
        className="h-full w-full object-cover object-[60%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.96)_0%,rgba(5,5,5,.75)_50%,rgba(5,5,5,.3)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.85)_0%,transparent_50%)]" />
    </div>
    <div className="relative mx-auto flex h-full min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 sm:min-h-[820px] sm:px-8 lg:min-h-[760px] lg:justify-center lg:px-12 lg:pb-0">
      <motion.div initial={reduce ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: .12 } } }} className="max-w-4xl">
        <motion.div variants={reveal} className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-white/80">
          <span>{studio.hero.badge}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-acid">{studio.hero.ratingBadge}</span>
        </motion.div>
        <motion.h1 variants={reveal} className="font-display text-[clamp(2.8rem,6.8vw,6.5rem)] font-bold leading-[.92] tracking-[-.045em] text-white">
          {studio.hero.titleLine1}<br />
          <span className="text-white">{studio.hero.titleLine2}</span>
        </motion.h1>
        <motion.p variants={reveal} className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
          {studio.hero.description}
        </motion.p>
        <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#kontakt" className="group flex min-h-14 items-center justify-between gap-6 rounded-full bg-acid px-7 font-bold text-ink transition hover:bg-white active:scale-[0.98]">
            {studio.hero.ctaPrimaryText} <ArrowRight className="transition group-hover:translate-x-1" size={19} />
          </a>
          <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className={cn('flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 font-semibold transition', messengerTheme.heroButton)}>
            <MessageCircle size={18} /> {studio.hero.ctaSecondaryText}
          </a>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-7 right-12 hidden gap-10 text-sm text-white/70 lg:flex">
        <div><b className="block text-white">{studio.branding.schedule}</b>График работы</div>
        <div><b className="block text-white">{studio.branding.address}</b>Локация</div>
      </div>
    </div>
  </section>
}

function TrustStrip() {
  const items = [
    [ShieldCheck, 'Премиальная автохимия', 'Безопасные составы для ЛКП, кожи и моторного отсека'],
    [Clock3, 'Четкие сроки', 'Фиксируем дату выдачи в акте до начала работ'],
    [Sparkles, 'Прозрачный расчет', 'Никаких скрытых доплат после сдачи авто']
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

function Contact() {
  const [sent, setSent] = useState(false)
  const [service, setService] = useState(services[0]?.title ? `${services[0].title} — ${services[0].price}` : 'Комплексная мойка')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.open(MESSENGER_URL, '_blank')
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
          <a href={`tel:${PHONE_RAW}`} className="flex items-center gap-4 group">
            <span className="grid size-11 place-items-center rounded-full border border-white/15 transition group-hover:border-acid group-hover:text-acid"><Phone size={18} /></span>
            <div><span className="block text-xs text-white/40">Прямой звонок</span><b className="text-lg">{PHONE_DISPLAY}</b></div>
          </a>
          <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className={cn('flex items-center gap-4 group', messengerTheme.linkText)}>
            <span className={cn('grid size-11 place-items-center rounded-full border transition', messengerTheme.contactIcon)}><MessageCircle size={18} /></span>
            <div><span className="block text-xs text-white/40">{studio.branding.messenger.label}</span><b className="text-lg">{studio.branding.messenger.chatActionText}</b></div>
          </a>
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full border border-white/15"><MapPin size={18} /></span>
            <div><span className="block text-xs text-white/40">Адрес бокса</span><b>{studio.branding.address}</b></div>
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="rounded-2xl bg-bone p-6 text-ink sm:p-9">
        {sent ? (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-acid"><Check /></span>
              <h3 className="mt-6 font-display text-3xl font-bold">Заявка отправлена.</h3>
              <p className="mt-3 text-sm text-black/60">Мы открыли {studio.branding.messenger.label} для согласования удобного времени визита.</p>
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
                {services.map(s => (
                  <option key={s.title} value={`${s.title} — ${s.price}`}>
                    {s.title} — {s.price}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className={cn('mt-6 flex min-h-14 w-full items-center justify-between rounded-full px-7 font-bold transition', messengerTheme.submitButton)}
            >
              {studio.branding.messenger.chatActionText} <ArrowRight size={18} />
            </button>
            <span className="mt-3 block text-center text-[11px] text-black/50">
              Или позвоните нам напрямую: {PHONE_DISPLAY}
            </span>
          </>
        )}
      </form>
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
      <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
        <MessageCircle size={17} /> Запросить больше фото ({studio.branding.messenger.chatActionText})
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
              alt={`Работа студии #${i + 1}`}
              loading="lazy"
              onError={(e) => {
                const fallback = FALLBACK_GALLERY_IMAGES[i % FALLBACK_GALLERY_IMAGES.length]
                if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                  e.currentTarget.src = fallback
                }
              }}
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
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SectionLabel>Прайс-лист услуг</SectionLabel>
        <h2 className="font-display text-4xl font-bold leading-[1.03] tracking-[-.045em] text-ink sm:text-6xl">Честная стоимость без сюрпризов.</h2>
        <p className="mt-7 max-w-md text-sm leading-6 text-black/60">
          Официальный прайс-лист студии «{STUDIO_NAME}» ({studio.branding.address}). Профессиональная автохимия, бережное отношение к авто и фиксированные цены.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
        {studio.popularPackages.map(pkg => (
          <PriceCard
            key={pkg.title}
            title={pkg.title}
            price={pkg.price}
            desc={pkg.desc}
            items={pkg.items}
            featured={pkg.featured}
            badge={pkg.badge}
          />
        ))}
      </div>
    </div>
  </div></section>
}

function PriceCard({ title, price, desc, items, featured, badge }: { title: string, price: string, desc: string, items: string[], featured?: boolean, badge?: string }) {
  return <motion.article initial={{ opacity: 1, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} whileHover={{ y: -6 }} transition={{ duration: .4 }} className={cn('relative flex flex-col justify-between rounded-2xl border p-7', featured ? 'border-ink bg-ink text-bone' : 'border-black/15 bg-white text-ink')}>
    <div>
      {featured && <span className="absolute right-5 top-5 rounded-full bg-acid px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{badge || 'Хит сезона'}</span>}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <p className={cn('mt-2 text-xs', featured ? 'text-white/50' : 'text-black/50')}>{desc}</p>
      <p className="mt-8 font-display text-3xl font-bold">{price}</p>
      <ul className={cn('mt-6 space-y-3 border-t pt-6 text-sm', featured ? 'border-white/15 text-white/70' : 'border-black/10 text-black/65')}>
        {items.map(item => <li key={item} className="flex gap-3"><Check size={16} className="shrink-0 text-lime-600" />{item}</li>)}
      </ul>
    </div>
    <div className="mt-8 pt-6 border-t border-black/10">
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition duration-200',
          featured
            ? 'bg-acid text-ink hover:bg-white'
            : 'border border-black/15 bg-black/[0.03] text-ink hover:border-black hover:bg-black hover:text-white'
        )}
      >
        <MessageCircle size={15} /> Выбрать услугу ({studio.branding.messenger.chatActionText})
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
                  {studio.rating.sourceName} · {testimonials[active].date}
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
            <div className="font-display text-6xl font-bold">{studio.rating.score}<span className="text-2xl text-white/40">/5</span></div>
            <div className="mt-3 flex gap-1 text-acid">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            </div>
            <p className="mt-3 text-xs leading-5 text-white/50">
              {studio.rating.label}
            </p>
            <div className="mt-6">
              <a
                href={YANDEX_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-bone transition hover:border-acid hover:bg-acid hover:text-ink"
              >
                <ExternalLink size={14} className="text-acid group-hover:text-ink transition" />
                <span>Посмотреть отзывы на {studio.rating.sourceName}</span>
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
  return <section className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <SectionLabel>Вопросы и ответы</SectionLabel>
    <div className="grid gap-12 lg:grid-cols-12"><div className="lg:col-span-5"><h2 className="font-display text-4xl font-bold leading-[1.03] tracking-[-.045em] text-ink sm:text-6xl">Все, что нужно знать перед визитом.</h2><p className="mt-7 max-w-md text-sm leading-6 text-black/60">Отвечаем на частые вопросы автовладельцев о гарантиях, сроках и составах.</p></div>
      <div className="lg:col-span-7">
        <Accordion.Root type="single" collapsible className="border-t border-black/15">{faqs.map(([q, a], i) => <Accordion.Item value={`item-${i}`} key={q} className="group/item border-b border-black/15"><Accordion.Header><Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-bold text-ink transition hover:pl-2 sm:text-xl">{q}<span className="grid size-9 shrink-0 place-items-center rounded-full border border-black/15 transition duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-white"><ChevronDown size={17} /></span></Accordion.Trigger></Accordion.Header><Accordion.Content className="accordion-content overflow-hidden text-sm leading-6 text-black/60"><motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-2xl pb-7 pr-10">{a}</motion.p></Accordion.Content></Accordion.Item>)}</Accordion.Root>
      </div></div>
  </div></section>
}

function MapSection() {
  return <section id="karta" className="relative h-[480px] w-full overflow-hidden bg-ink">
    <iframe
      src={studio.mapEmbedUrl || `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(studio.branding.address)}`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="eager"
      title="Студия на Яндекс Картах"
    />
    <div className="pointer-events-none absolute bottom-8 left-5 right-5 sm:left-12 sm:right-auto">
      <div className="pointer-events-auto rounded-2xl border border-white/15 bg-ink/90 p-6 text-bone backdrop-blur-xl sm:max-w-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-acid">
          <MapPin size={16} /> Наш адрес
        </div>
        <b className="mt-2 block text-lg font-bold">{studio.branding.address}</b>
        <p className="mt-1 text-xs text-white/50">{studio.branding.schedule}</p>
        <div className="mt-4 flex gap-3">
          <a
            href={studio.rating.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-acid px-4 py-2 text-xs font-bold text-ink transition hover:bg-white"
          >
            <ExternalLink size={13} /> Открыть в Яндекс Картах
          </a>
        </div>
      </div>
    </div>
  </section>
}

function Field({ label, name, placeholder, type = 'text' }: { label: string, name: string, placeholder: string, type?: string }) {
  return <label className="block text-xs font-bold text-ink">{label}<input type={type} name={name} placeholder={placeholder} className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-black" /></label>
}

function Footer() {
  const city = studio.branding.address.split(',')[0].replace('г. ', '').trim()
  return <footer className="bg-ink px-5 pb-24 pt-16 text-bone sm:px-8 lg:px-12 lg:pb-10">
    <div className="mx-auto max-w-[1344px]">
      <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-xs leading-5 text-white/50">
            {STUDIO_NAME}. {studio.branding.address}. Профессиональная оклейка PPF, полировка, керамика, химчистка и качественный детейлинг авто.
          </p>
        </div>
        <div className="text-sm">
          <b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Локация</b>
          <p>{studio.branding.address}</p>
        </div>
        <div className="text-sm">
          <b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Связь</b>
          <a href={`tel:${PHONE_RAW}`} className="block font-semibold hover:text-acid transition">{PHONE_DISPLAY}</a>
          <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className={cn('mt-2 block hover:underline', messengerTheme.linkText)}>{studio.branding.messenger.label}</a>
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-7 text-[11px] text-white/35 sm:flex-row sm:justify-between">
        <p>© 2026 {STUDIO_NAME}. Все права защищены.</p>
        <div className="flex gap-5">
          <span>{city}, Россия</span>
        </div>
      </div>
    </div>
  </footer>
}

export function Home() {
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
        href={MESSENGER_URL}
        target="_blank"
        rel="noreferrer"
        className={cn('fixed bottom-3 left-3 right-3 z-40 flex min-h-14 items-center justify-between rounded-full px-6 font-bold shadow-2xl sm:hidden', messengerTheme.floatingBar)}
      >
        <span>{studio.branding.messenger.chatActionText}</span>
        <MessageCircle size={20} />
      </motion.a>
    </motion.div>}
  </>
}

export default function App() {
  return <Home />
}
