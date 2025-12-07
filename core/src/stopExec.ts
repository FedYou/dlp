import { killRPC } from 'lib/dlf'
process.on('uncaughtException', (err) => {
  console.error(err)
  killRPC()
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error(reason)
  killRPC()
  process.exit(1)
})
