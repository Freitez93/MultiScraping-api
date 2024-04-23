import { rabbitStream } from './megacloud.js'
import { streamTape } from './streamtape.js';
import { streamWish } from './streamwish.js';
import { doodStream } from './doodstream.js';
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
    case 'doodstream.com':
    case 'd0000d.com':
    case 'd000d.com':
      return doodStream(link)
    case 'filemoon.sx':
      return fileMoon(link)
    case 'ok.ru':
      return okru(link)
    default:
      console.error('Extractor not found')
      return null
      //throw new Error('Extractor not found')
  }
}