const startggurl = "https://api.start.gg/gql/alpha"
require('dotenv').config();
gg_token = process.env.STARTGG_TOKEN;

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer " + gg_token
}

const getPlayersFromEventQuery = `
query EventEntrants($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
        id
        name
        entrants(query: {
            page: $page
            perPage: $perPage
        }) {
            pageInfo {
                total
                totalPages
            }
            nodes {
                name
                initialSeedNum
                standing {
                    placement
                }
                participants {
                    checkedIn
                    player {
                        id
                    }
                }
            }
        }
    }
}`

const getPlayersFromEvent = async (vars) => {
    const tosend = {
        query: getPlayersFromEventQuery,
        variables: vars
    }
    const data = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(r => r.json())
    return data
}

module.exports = getPlayersFromEvent;