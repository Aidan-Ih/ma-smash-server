const startggurl = "https://api.start.gg/gql/alpha"
require('dotenv').config();
gg_token = process.env.STARTGG_TOKEN;

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer " + gg_token
}

const getTournamentEventsRequest = `
query Tournaments($slug_name: String!) {
    tournament(slug: $slug_name) {
        id
        name
        events {
            id
            slug
        }
    }
}`;

const getEventsBySlug = async (vars) => {
    const tosend = {
        query: getTournamentEventsRequest,
        variables: vars
    }
    const data = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(r => r.json())
    return data
}
 
module.exports = getEventsBySlug