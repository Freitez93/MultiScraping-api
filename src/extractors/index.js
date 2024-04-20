import { rabbitStream } from './megacloud.js'
import { streamTape } from './streamtape.js';
import { streamWish } from './streamwish.js';
import { fileMoon } from './filemoon.js';
import { okru } from './okru.js';


export const videoExtractor = link => {
  const baseLink = new URL(link)

  switch (baseLink.hostname) {
    case 'megacloud.tv':
    case 'rapid-cloud.co':
      return rabbitStream(link)
    case 'streamtape.com':
      return streamTape(link)
    case 'streamwish.to':
      return streamWish(link)
    case 'filemoon.net':
      return fileMoon(link)
    case 'ok.ru':
      return okru(link)
    default:
      return null
      //throw new Error('Extractor not found')
  }
}