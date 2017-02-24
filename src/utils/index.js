import { initGA } from './analytics'
import { initRaven } from './errors'

export const initScripts = () => {
  initRaven()
  initGA()
}
