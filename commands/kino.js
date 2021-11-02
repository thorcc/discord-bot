const axios = require("axios");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const getFilmwebToday = async movies => {
    const url = "https://skynet.filmweb.no/MovieInfoQs/graphql/?query=query(%24date%3AString%2C%24location%3AString)%7BmovieQuery%7BgetCurrentMovies(date%3A%24date%2Clocation%3A%24location)%7BarticleId%20mainVersionId%20premiere%20title%20isKinoklubbMovie%3AisKinoklubb%20genres%20lengthInMinutes%20rating%20poster%7Bname%20versions%7Bheight%20width%20url%7D%7Dshows%7BfirmName%20showStart%20screenName%20showType%20isKinoklubb%20ticketSaleUrl%20theaterName%20movieVersionId%20versionTags%7Btag%20type%7D%7D%7D%7D%7D&variables=%7B%22location%22%3A%22Oslo%22%2C%22date%22%3A%222021-11-02%22%7D"
    const { data } = await axios.get(url);
    const movieList = data.data.movieQuery.getCurrentMovies;
    return movieList.map(m => {
        const showings = {}
        
        m.shows.forEach(s => {
            const name = s.screenName.split(' ')[0].toLowerCase();
            const time = new Date(s.showStart).toLocaleTimeString('id',{hour: '2-digit', minute: '2-digit'});
            if(showings.hasOwnProperty(name)){
                showings[name].push(time)
            } else{
                showings[name] = [time]
            }
        })
        const showString = Object.keys(showings).map(s => `${s}: ${showings[s].join(', ')}`).join('\n')
        return {name: m.title, value: showString}
    })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kino')
		.setDescription('Henter dagens kinoprogram'),
	async execute(interaction) {
        const movies = await getFilmwebToday();
        const date = new Date().toLocaleDateString('no-no')
        
        const moviesEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Kinoprogram')
            .setURL('https://www.filmweb.no/program')
            .setAuthor('Rolf Kristian Larsen', 'https://premium.vgc.no/v2/images/22841acd-c8ad-4725-a2e8-3c4a87572d2d?fit=crop&format=auto&h=2728&w=1900&s=6d96e9146f33a73ccbe02f62fde8c9d03f09e2ba', 'https://no.wikipedia.org/wiki/Rolf_Kristian_Larsen')
            .setDescription(`${date}`)
            .setThumbnail('https://strex.stage.dekodes.no/wp/wp-content/uploads/2014/09/Filmweb-logo-300x52.png')
            .addFields(
                movies
            )
            .setTimestamp()
        
        await interaction.reply({ embeds: [moviesEmbed] });
	},
};
