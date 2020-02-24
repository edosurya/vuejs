import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Admin BRI Digisign'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
