import youfile from 'youfile'
import cache from 'global/cache'

export default function (fileName: string) {
  return youfile.existsSync(cache.path + '/' + fileName)
}
