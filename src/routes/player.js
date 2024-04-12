import express from 'express';

export const router = express.Router();
const players = {};
const rooms = {};

const playerExample = {
    roomKey: "123-45-678-9",
    name: "John Doe",
}

const roomExample = {
    roomKey: "123-45-678-9",
    player1: {},
    player2: {},
}

const addPlayer = (req, res) => {
    const { roomKey } = req.body;
    players[roomKey] = "waiting";
    res.status(200).send({message: `Player Added in room: ${roomKey}`});
}

const getAllPlayers = (req, res) => {
    res.status(200);
    res.send(players);
}

const getAllRooms = (req, res) => {
    res.status(200);
    res.send(rooms);
}

const findPlayer = (req, res) => {
    if (players === {}) {
        res.status(200).send({message: false});
        return false;
    }
    const playerInfo = req.body;
    const room = {};

    if (playerInfo.roomKey in players) {
        room["player1"] = {"state": "Idle"};
        room["player2"] = {"state": "Idle"};

        delete players[playerInfo.roomKey];
        rooms[playerInfo.roomKey] = room;
        res.status(200).send({message: true});
        return true;
    }

    res.status(200).send({message: false});
    return false;
}

const getPlayerState = (req, res) => {
    const { roomKey } = req.body;

    if (roomKey in rooms) {
        const playerState = {
            "player1": rooms[roomKey]["player1"]["state"],
            "player2": rooms[roomKey]["player2"]["state"]
        };
        res.status(200).send(playerState);
    } else {
        res.status(200).send( {message: "failed"} );
    }
}

const updatePlayerState = (req, res) => {
    const { roomKey, player, state } = req.body;
    
    if (roomKey in rooms) {
        rooms[roomKey][player]["state"] = state;
        res.status(200).send( {message: "player updated"} );
    } else {
        res.status(200).send( {message: "room not found"} );
    }
}

const deletePlayer = (req, res) => {
    const { roomKey } = req.body;

    if (roomKey in players) {
        delete players[roomKey];
        res.status(200).send( {message: "player removed from host queue"} );
    } else {
        res.status(200).send( {message: "player not found in host queue"} );
    }
}

const deleteRoom = (req, res) => {
    const { roomKey } = req.body;

    if (roomKey in rooms) {
        delete rooms[roomKey];
        res.status(200).send( {message: "room removed"} );
    } else {
        res.status(200).send( {message: "room not found"} );
    }
}

router.get("/getAllPlayers", getAllPlayers);
router.get("/getAllRooms", getAllRooms);
router.post("/getState", getPlayerState);
router.post("/addPlayer", addPlayer);
router.post("/findPlayer", findPlayer);
router.put('/updateState', updatePlayerState);
router.delete("/deletePlayer", deletePlayer);
router.delete("/deleteRoom", deleteRoom);