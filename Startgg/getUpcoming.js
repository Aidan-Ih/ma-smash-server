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
    try {
        const response = await fetch(startggurl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(tosend),
        }).then(res => res.json())
    
        return {data: response.data.tournaments.nodes, success: true}
    }
    catch (error) {
        return {"success": false}
    }
}
    
   

const refreshEvents = async () => {
    try {
        const timestamp = Math.floor(Date.now() / 1000) - 30000 //show events from a bit age
        const MA = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "MA" });
        const NH = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "NH" });
        const VT = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "VT" });
        const ME = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "ME" });
        const CT = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "CT" });
        const RI = await requestUpcoming({ perPage: 50, currentDate: timestamp, state: "RI" });
    
        const states = [MA, NH, VT, ME, CT, RI];
    
        //check no error
        for (var i = 0; i < states.length; i++) {
            const s = states[i]
            if (!s.success) {
                //if any failed, stop and return error message
                eventsTimestamp = Date.now();
                events = {success: false, message: s.message};
                return
            }
        }
    
        var newEvents = states.map((s) => s.data)
        newEvents = newEvents.flat();
        
        newEvents = newEvents.sort((a, b) => a.startAt - b.startAt)
        eventsTimestamp = Date.now()
        events = {success: true, data: newEvents}
        return;
    }
    catch (error) {
        eventsTimestamp = Date.now();
        events = "An unknown error has occurred";
    }
}

const getUpcoming = async () => {
    const now = Date.now()
    //refresh at most once per minute, otherwise just store in memory
    if (now > eventsTimestamp + (60 * 1000)) {
        await refreshEvents();
        return events
    }
    else {
        return events
    }
}

module.exports = getUpcoming;