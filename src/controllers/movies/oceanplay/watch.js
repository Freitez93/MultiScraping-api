import axios from "axios"
import { load } from "cheerio";
import { MovieSources } from "../../../models/movie.js";

export const GetEpisodeServers = async (req, res) => {
	const { episodeID } = req.params
	const { season, episode, type="lat" } = req.query
	const isTvShow = season ? `${season}/${episode}` : ""
	const baseUrl = `https://es.oceanplay.me/embed/${episodeID}/${isTvShow}`  


	try {
		const { data } = await axios.get(baseUrl)
		const $ = load(data)

		// Verificamos El audio del episodio
		const selectOptionLat = $("div.loadPlay > ul.selectOption.Latino > li")
		const selectOptionCas = $("div.loadPlay > ul.selectOption.Castellano > li")
		const selectOptionJap = $("div.loadPlay > ul.selectOption.Japones > li")

		const selectOptionUrl = []
		if (selectOptionLat.length > 1){
			selectOptionLat.each((index, element) => {
				selectOptionUrl.push($(element).attr("data-link"))
			})
			const value = selectOptionUrl[0].split("?h=")[1].split("&bg=")[0]
			const response = await axios.get(selectOptionUrl[0], {
				timeout: 10000
			}).then(res => {
				axios.post('https://es.oceanplay.me/external/v2/r.php', {
					h: value
				}).then(res => {
					console.log(res)
				})
			})
		} else if(selectOptionCas > 1){
			console.log("Hay audio Castellano")
		} else if (selectOptionJap > 1){
			console.log("Hay audio Japones")
		}
		return res.status(200).json({message: "estamos trabajando"})
	} catch (error){
		console.log(error)
		return res.status(500).json("Error " + error.message);
	}
}


const selectServer = element => {
	
}