import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { getActiveStudioConfig } from './config/studioConfig'

const studio = getActiveStudioConfig()
if (typeof document !== 'undefined') {
  const brandName = studio.branding.fullName || `${studio.branding.namePrefix} ${studio.branding.nameHighlight}`
  document.title = `${brandName} | ${studio.branding.tagline}`
  
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) {
    metaDesc.setAttribute('content', `${brandName} — ${studio.hero.description} Адрес: ${studio.branding.address}. Телефон: ${studio.branding.phoneDisplay}`)
  }
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    const city = studio.branding.address.split(',')[0].replace('г. ', '').trim()
    ogTitle.setAttribute('content', `${brandName} | ${city}`)
  }
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) {
    ogDesc.setAttribute('content', studio.hero.description)
  }
  if (studio.branding.logoUrl) {
    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon) {
      favicon.setAttribute('href', studio.branding.logoUrl)
    }
  }
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter basename={basename}><App /></BrowserRouter></StrictMode>,
)
