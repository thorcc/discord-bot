const axios = require("axios");
const { SlashCommandBuilder } = require('@discordjs/builders');

const getVegaToday = async () => {
    const url = "https://vegascene.no/template/ajax/json_showsAllDays.jsp?showType=kino";
    const { data } = await axios.get(url);
    const movies = data.dates[0].movies.map(m => {
        const showings = m.shows.map(s => s.time)
        return `${m.title}: ${showings.join(', ')}`;
    }).join('\n');
    return `Vega kino - Dagens program \n${movies}`;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kino')
		.setDescription('Henter ukens kinoprogram'),
	async execute(interaction) {
        const program = await getVegaToday();
		await interaction.reply(program);
	},
};
