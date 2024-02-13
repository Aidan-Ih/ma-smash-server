const { SlashCommandBuilder } = require('discord.js');

const getEventsBySlug = require("../../../Startgg/getEventsBySlug")
const getPlayersFromEvent = require("../../../Startgg/getPlayersFromEvent")
const getSetsFromEvent = require("../../../Startgg/getSetsFromEvent");

const get_event_id = async (tournament_slug, event_slug) => {
	const var_tournament_slug = {
		"slug_name": tournament_slug
	}

	const data = await getEventsBySlug(var_tournament_slug);
	if (data.data.tournament == null) {
		return -1;
	}
	const events = [...data.data.tournament.events];
	const event_slugs = events.map((e) => {
		const split = e["slug"].split("/")
		last = split[split.length - 1]
		return {
			"slug": last,
			"id": e["id"]
		}
	})

	const event = event_slugs.find((e) => e["slug"] === event_slug);
	if (event == null) {
		return -1;
	}
	const id = event["id"];
	const name = data.data.tournament.name;
	return {
		"id": id,
		"name": name
	}
}

const get_sets = async (eventId) => {
	var page_num = 1;

	var var_sets = {
		"eventId": eventId,
		"page": page_num,
		"perPage": 50
	}

	const data = await getSetsFromEvent(var_sets);
	const info = data.data.event.sets.pageInfo;
	total_pages = info.totalPages;

	var sets = data.data.event.sets.nodes;

	while (page_num < total_pages) {
		page_num += 1
		var_sets = { ...var_sets, "page": page_num }
		//wait for each to prevent rate limit on a large event
		const newdata = await getSetsFromEvent(var_sets);
		sets = [...sets, ...newdata.data.event.sets.nodes];
	}
	return sets
}

const get_placement_tier = (seed) => {
	//this wouldn't get many points in algo class but it's a small list so should run fast enough
	//potential optimization if it becomes a problem:
	//Take number entrants and search backwards based only on possible placements,
	//most users will place in the bottom ranks so very long searches
	const placements = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025];
	for (var i = 0; i < placements.length; i++) {
		if (seed < placements[i]) {
			return i;
		}
	}
	return -1;
}

const get_highest_upsets = (sets) => {
	const ufs = sets.map((set) => {
		const winner = set.slots[0].standing.placement === 1 ? set.slots[0] : set.slots[1]
		const loser = set.slots[0].standing.placement === 1 ? set.slots[1] : set.slots[0]

		const projected_winner = get_placement_tier(winner.entrant.initialSeedNum)
		const projected_loser = get_placement_tier(loser.entrant.initialSeedNum)

		const upset_factor = projected_winner - projected_loser
		return {
			"phase": set.phaseGroup.phase.name,
			"round": set.fullRoundText,
			"winner": winner.entrant.name,
			"loser": loser.entrant.name,
			"uf": upset_factor
		}
	})

	return ufs.sort((a, b) => b.uf - a.uf);
}

const get_players = async (eventId) => {
	var page_num = 1;

	var var_players = {
		"eventId": eventId,
		"page": page_num,
		"perPage": 50
	}

	const response = await getPlayersFromEvent(var_players);
	const data = response.data.event.entrants;
	const info = data.pageInfo;
	const total_pages = info.totalPages;
	var players = data.nodes;

	while (page_num < total_pages) {
		page_num += 1
		var_players = { ...var_players, "page": page_num }
		//wait for each to prevent rate limit on a large event
		const newdata = await getPlayersFromEvent(var_players);
		players = [...players, ...newdata.data.event.entrants.nodes];
	}
	return players
}

const get_spr = (players) => {
	const spr_list = players.map((player) => {
		const expected = get_placement_tier(player.initialSeedNum);
		const actual = get_placement_tier(player.standing.placement);
		const spr = expected - actual;
		return {
			"name": player.name,
			"spr": spr
		}
	})

	return spr_list.sort((a, b) => b.spr - a.spr);
}

const get_tournament_results = async (event_data) => {

	const event_id = event_data["id"];
	const event_name = event_data["name"];
	const sets = await get_sets(event_id);
	const upset_factors = get_highest_upsets(sets).filter((e) => e.uf > 2);
	const players = await get_players(event_id);
	const spr = get_spr(players).filter((e) => e.spr > 0);

	var out = `# Tournament info for ${event_name}\n\n`
	out += "### Notable Upsets:\n```"
	for (i=0; i<10; i++) {
		if (i < upset_factors.length) {
			const e = upset_factors[i];
			out += `UF ${e.uf}: ${e.winner} > ${e.loser}\n`;
		}
		else {
			break;
		} 
	}

	out += "``` \n### Highest SPR Performance: \n```"
	for (i=0; i<10; i++) {
		if (i < spr.length) {
			const e = spr[i];
			out += `SPR ${e.spr}: ${e.name}\n`
		}
		else {
			break;
		}
	}
	out += "```"
	return out;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament-stats')
		.setDescription('Shows stats for a given tournament')
		.addStringOption(option =>
			option
				.setName('slug')
				.setDescription('The tournament slug')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('event')
				.setDescription('The name of the event')
				.setRequired(true)),

	async execute(interaction) {
		const slug = interaction.options.getString("slug");
		const event = interaction.options.getString("event");
		const event_data = await get_event_id(slug, event);
		console.log(event_data)

		if (event_data == -1) {
			interaction.reply("Could not find event");
			return
		}
		
		await interaction.deferReply();
		const out = await get_tournament_results(event_data);

		await interaction.editReply(out);
	},
}