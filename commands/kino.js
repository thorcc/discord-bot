const axios = require("axios");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const getVegaToday = async () => {
    const url = "https://vegascene.no/template/ajax/json_showsAllDays.jsp?showType=kino";
    const { data } = await axios.get(url);
    const movies = data.dates[0].movies.map(m => {
        const showings = m.shows.map(s => s.time)
        return {name: m.title, value: showings.join(', ')};
    });
    return movies;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kino')
		.setDescription('Henter dagens kinoprogram'),
	async execute(interaction) {
        const movies = await getVegaToday();
        const date = new Date().toLocaleDateString('no-no')
        
        const moviesEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Kinoprogram')
            .setURL('https://vegascene.no/vegascene/program/?date=ALLE&type=ALLE')
            .setAuthor('Christian Strand', 'https://upload.wikimedia.org/wikipedia/commons/4/40/Til_bords_med_fienden_-_NMD_2013_%288723105666%29_%28cropped%29.jpg', 'https://no.wikipedia.org/wiki/Christian_Strand')
            .setDescription(`${date}`)
            .setThumbnail('https://vegascene.no/template/static/gfx/header_logo.jpg')
            .addFields(
                movies
            )
            .setTimestamp()
        
        await interaction.reply({ embeds: [moviesEmbed] });
		//await interaction.reply(program);
	},
};
