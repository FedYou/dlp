import { Style, Space, LineBreak } from 'utils/baseUi'

import type { DependenciesStatus, DependencyStatusFormat } from 'dlp-core/types/any'

function dependencyFormat(name: string, dependency: DependencyStatusFormat): string[] {
  const content: string[] = []
  content.push(Style(name)('green-fg') + '')
  content.push(Space())
  if (dependency.installed) {
    content.push(Style(`v${dependency.version}`)('cyan-fg') + '')
  } else {
    content.push(Style('(install)')('red-fg') + '')
  }
  return content
}

export default function (dependencies: DependenciesStatus): string {
  const content: string[] = []

  const { ytdlp, ffmpeg, deno, aria2 } = dependencies.list

  // YTDLP
  content.push(Style('├── ytdlp')('green-fg') + '')
  content.push(Space())

  if (!ytdlp.installed) {
    content.push(Style('(install)')('red-fg') + '')
  }

  if (ytdlp.lastest && ytdlp.installed) {
    content.push(Style(`(lastest) v${ytdlp.version}`)('cyan-fg') + '')
  }

  if (!ytdlp.lastest && ytdlp.installed) {
    content.push(Style(`(outdated) v${ytdlp.version}`)('red-fg') + '')
    content.push(' (update)')
  }

  content.push(...[LineBreak(), Style('│')('green-fg') + '', Space(5), '└───── '])

  // DENO
  content.push(...dependencyFormat('deno', deno))

  // FFMPEG
  content.push(...[LineBreak(), Style('├── ')('green-fg') + ''])
  content.push(...dependencyFormat('ffmpeg', ffmpeg))

  // ARIA2
  content.push(...[LineBreak(), Style('└── ')('green-fg') + ''])
  content.push(...dependencyFormat('aria2', aria2))

  return content.join('')
}
