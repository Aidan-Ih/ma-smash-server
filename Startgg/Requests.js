const { request } = require("express")

const startggurl = "https://api.start.gg/gql/alpha"

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer 0f1d0d2ca72c1880bcf17f7f788b963e" //cybersecurity go brrrr
}

const token_hashtag_cybersecurity = "0f1d0d2ca72c1880bcf17f7f788b963e"

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


const searchTournamentQuery =
    `query TournamentsByState ($perPage:Int!, $after:Timestamp!, $before:Timestamp!, $name:String!) {
                    tournaments(query: {
                        perPage: $perPage
                        page: 1
                        sortBy: "startAt asc"
                    filter: {
                        addrState: "MA"
                        afterDate: $after
                        beforeDate: $before
                        name: $name
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
                        events {
                            name
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
        return {...response, "success": true}
    }
}

const getTournament = async (vars) => {
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

const searchTournament = async (vars) => {
    const tosend = {
        query: searchTournamentQuery,
        variables: vars
    }
    const data = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(r => r.json())
    return data
}

module.exports = requestUpcoming;