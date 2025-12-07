import { exec } from 'child_process'
import { promisify } from 'util'

const _async = promisify(exec)

export async function execAsync(command: string, args: (string | number)[] = []): Promise<void> {
  try {
    await _async(command + ' ' + args.join(' '))
  } catch (err) {
    throw err
  }
}
