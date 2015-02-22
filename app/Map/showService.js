module.exports = {
    find: function(query) {
        return [
            {
                artist: "Grimecraft",
                location: [38.896217, -77.010749],
                venue: "Intergalactic Labs",
                time: new Date()
            }
        ]
    },
    insert: function(show) {
        throw Error("Not Implemented");
    }
};