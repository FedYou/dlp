export default function (url: string): 'youtube' | 'instagram' | 'tiktok' | null {
  try {
    const _URL = new URL(url)
    const hostname = _URL.hostname.toLowerCase()
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube'
    }

    if (hostname.includes('tiktok.com')) {
      return 'tiktok'
    }

    if (hostname.includes('instagram.com')) {
      return 'instagram'
    }
    return null
  } catch (err) {
    return null
  }
}
