import RabbitStream from './megacloud.js'
import StreamTape from './streamtape.js';
import StreamWish from './streamwish.js';
import DoodStream from './doodstream.js';
import FileMoon from './filemoon.js';
import Okru from './okru.js';

import Embed69 from './embed69.js';
import Streamsito from './streamsito.js';

export const videoExtractor = async link => {
  //const baseLink = new URL(link)
  const id = link.includes("tt") ? link : null

  if (!id) {
    throw new Error("Invalid ID")
  } else {
    const embed69 = new Embed69();
    const streamsito = new Streamsito();
  
    try {
      // ejemplo de ID para peliculas: tt28093628
      // ejemplo de ID para series: tt28093628-1x01
      // Extrae los datos de los servidores
      const data = await Promise.all([
        embed69.extract(id),
        streamsito.extract(id)
      ])

      return data
    } catch (error) {
      console.error(error)
      throw new Error(`No se pudo recuperar el vídeo: ${error.message}`)
    }
  }

}