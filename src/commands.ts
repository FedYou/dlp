import { version } from '../package.json'

process.argv.slice(2).forEach((arg) => {
  if (arg === '--version' || arg === '-v') {
    console.log(version)
    process.exit(0)
  }
})
