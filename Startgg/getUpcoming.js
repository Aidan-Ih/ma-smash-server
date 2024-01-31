const requestUpcoming = require("./Requests")

var eventsTimestamp = 0
var events = []
var featuredTimestamp = 0
var featuredEvents = []
var featuredIds = [617711, 620014, 616898, 620152, 616592, 620223, 619532, 598069]

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