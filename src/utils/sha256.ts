import crypto from 'crypto'

export default function (string: string) {
  const hash = crypto.createHash('sha256')
  hash.update(string)
  return hash.digest('hex')
}
