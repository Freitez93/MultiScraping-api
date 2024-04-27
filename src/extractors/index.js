import RabbitStream from './megacloud.js'
import StreamTape from './streamtape.js';
import StreamWish from './streamwish.js';
import DoodStream from './doodstream.js';
import FileMoon from './filemoon.js';
import Okru from './okru.js';


export const videoExtractor = async link => {
  const baseLink = new URL(link)

  switch (baseLink.hostname) {
    case 'megacloud.tv':
    case 'rapid-cloud.co':
      const rabbitStream = new RabbitStream().extract(link).then(res => {
        return res
      })
      return rabbitStream
    case 'streamtape.com':
      const streamTape = new StreamTape().extract(link).then(res => {
        return res
      })
      return streamTape
    case 'streamwish.to':
      const streamWish = new StreamWish().extract(link).then(res => {
        return res
      })
      return streamWish
    case 'doodstream.com':
    case 'd0000d.com':
    case 'd000d.com':
      const doodStream = new DoodStream().extract(link).then(res => {
        return res
      })
      return doodStream
    case 'filemoon.sx':
      const fileMoon = new FileMoon().extract(link).then(res => {
        return res
      })
      return fileMoon
    case 'ok.ru':
      const okru = new Okru().extract(link).then(res => {
        return res
      })
      return okru
    default:
      console.error('Extractor not found')
      return null
    //throw new Error('Extractor not found')
  }
}