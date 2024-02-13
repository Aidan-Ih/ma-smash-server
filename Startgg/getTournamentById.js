const startggurl = "https://api.start.gg/gql/alpha"
require('dotenv').config();
gg_token = process.env.STARTGG_TOKEN

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer " + gg_token 
}

const getTournamentByIdQuery =
    `query TournamentById ($id:ID) {
        tournaments(query: {
          filter: {
            id: $id
          }
            
            }) {
        nodes {
            id
            name
            city
            startAt
            venueAddress
            slug
            events {
                id
                name
                entrants {
                    nodes {
                        id
                        name
                    }
                }
            }
            images {
                type
                url
            }
            shortSlug
            events {
                videogame {
                                id
                            }
                        }
                    }
                }
            }`


const getTournamentById = async (vars) => {
    const tosend = {
        query: getTournamentByIdQuery,
        variables: vars
    }
    const data = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(r => r.json())
    return data
}

module.exports = getTournamentById;