const startggurl = "https://api.start.gg/gql/alpha"
require('dotenv').config();
gg_token = process.env.STARTGG_TOKEN;

const headers = {
    "content-type": "application/json",
    "Accept": "application/json",
    Authorization: "Bearer " + gg_token
}

const getSetsFromEventQuery = `
query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
        sets(
            page: $page
            perPage: $perPage
        ) {
            pageInfo {
                total
                totalPages
            }
            
            nodes {
                id
                round
                fullRoundText
                phaseGroup {
                    phase {
                        name
                    }
                }
                identifier
                slots {
                  id
                  prereqId
                  prereqType
                  standing {
                      placement
                  }
                  entrant {
                    id
                    name
                    initialSeedNum
                  }
                }
            }
        }
    }
}`

const getSetsFromEvent = async (vars) => {
    const tosend = {
        query: getSetsFromEventQuery,
        variables: vars
    }
    const data = await fetch(startggurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(tosend),
    }).then(r => r.json())
    return data
}

module.exports = getSetsFromEvent;