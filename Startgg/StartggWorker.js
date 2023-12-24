import { getUpcoming, getTournament, searchTournament } from "./Requests.js";
import NodeCache from "node-cache";

var eventsTimestamp = 0
var events = []

const getEvents = async () => {
    console.log("getting events")
    var timestamp = Math.floor(Date.now() / 1000)
    var response = await getUpcoming({ perPage: 50, currentDate: timestamp, state: "MA" });
    if (response.success === true) {
        const newEvents = response.data.tournaments.nodes
        events = newEvents
        eventsTimestamp = Date.now()
    }
    else {
        console.log(response)
    }
}

const StartggWorker = (app) => {

    app.get("/getUpcoming/", async (req, res) => {
        console.log(now)
        if (now > eventsTimestamp + (5 * 60 * 1000)) {
            await getEvents();
            res.send(events);
        }
        else {
            res.send(events);
        }
    })
}

export default StartggWorker;