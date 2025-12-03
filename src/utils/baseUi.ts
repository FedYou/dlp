function eclipseStr(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 6).trim() + '...'
  }
  return str
}

type Style = {
  (style: string): Style
  [Symbol.toPrimitive](hint: string): string
}

function Style(str: string): Style {
  const styles: string[] = []
  const add = (p: string, v: string) => (p === '' ? v : `{${p}}${v}{/${p}}`)

  const fn = ((style: string) => {
    styles.push(style)
    return fn
  }) as Style

  fn[Symbol.toPrimitive] = () => {
    const ordered = styles.slice().reverse() // no muta el array original
    return ordered.reduce((acc, style) => add(style, acc), str)
  }

  return fn
}

function Space(amount: number = 1) {
  return ' '.repeat(amount)
}

function LineBreak(amount: number = 1) {
  return '\n'.repeat(amount)
}

function VarLine({
  label,
  text,
  underline,
  width
}: {
  label: string
  text: string
  underline: boolean
  width: number
}): string {
  const maxLength = width - (6 + label.length) // 3 = 2 spaces + 1 : + 2 spaces + 1 space
  const eclipse = eclipseStr(text.replace('\n', ' '), maxLength)
  return (
    Space(2) + Style(label)('bold') + ' : ' + (underline ? Style(eclipse)('underline') + '' : eclipse)
  )
}

export { Style, Space, LineBreak, VarLine }
