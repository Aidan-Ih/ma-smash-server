const startggurl = "https://api.start.gg/gql/alpha"

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer 6d0d769a0294cc2068c96080115056f5" //cybersecurity go brrrr
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



const getUpcoming = async (vars) => {
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

export { getUpcoming, getTournament, searchTournament }