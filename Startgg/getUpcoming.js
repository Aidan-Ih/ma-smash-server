const startggurl = "https://api.start.gg/gql/alpha"
require('dotenv').config();
gg_token = process.env.STARTGG_TOKEN

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer " + gg_token
}

const getUpcomingTournamentsQuery =
    `query TournamentsByState ($perPage:Int!, $currentDate:Timestamp!, $state:String!) {
            tournaments(query: {
                perPage: $perPage
                page: 1
                sortBy: "startAt asc"
            filter: {
                addrState: $state
                afterDate: $currentDate
                countryCode: "US"
                videogameIds: [
                                1386
                            ]
                    }
                }) {
            nodes {
                id
                name
                city
                startAt
                venueAddress
                addrState
                events {
                    name
                }
                images {
                    type
                    url
                }
                shortSlug
                slug
                events {
                    videogame {
                                    id
                                }
                            }
                        }
                    }
                }`

var eventsTimestamp = 0
var events = []

const requestUpcoming = async (vars) => {
    const tosend = {
        query: getUpcomingTournamentsQuery,
        variables: vars
    }
    const response = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(res => res.json())
    if ("success" in response) {
        return response
    }
    else {
        return { ...response, "success": true }
    }
}

const refreshEvents = async () => {
    const timestamp = Math.floor(Date.now() / 1000) - 30000 //show events from a bit age
    const MA = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "MA" });
    /*
    const NH = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "NH" });
    const VT = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "VT" });
    const ME = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "ME" });
    const CT = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "CT" });
    const RI = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "RI" });
    */
    const MAEvents = MA.data.tournaments.nodes
    /*
    const NHEvents = NH.data.tournaments.nodes
    const VTEvents = VT.data.tournaments.nodes
    const MEEvents = ME.data.tournaments.nodes
    const CTEvents = CT.data.tournaments.nodes
    const RIEvents = RI.data.tournaments.nodes
    */

    const newEvents = [...MAEvents]
    events = newEvents
    events.sort((a, b) => a.startAt - b.startAt)
    eventsTimestamp = Date.now()
}

const getUpcoming = async () => {
    const now = Date.now()
    if (now > eventsTimestamp + (5 * 60 * 1000)) {
        await refreshEvents();
        return events
    }
    else {
        return events
    }
}

module.exports = getUpcoming;