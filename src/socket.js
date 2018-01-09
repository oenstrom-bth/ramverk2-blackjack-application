"use strict";
const IO = require("socket.io");
const Table = require("./Table/table");
const { verify } = require("./token");

/**
 * Get all rooms except socket rooms.
 */
const getAllRooms = io => {
    const rooms = {};

    for (let key in io.sockets.adapter.rooms) {
        if (!Object.keys(io.sockets.sockets).includes(key)) {
            rooms[key] = io.sockets.adapter.rooms[key];
        }
    }
    return rooms;
};

/**
 * Get the latest room.
 */
const getLatestRoom = io => {
    const rooms = getAllRooms(io);
    const latestKey = Object.keys(rooms).reduce((a, b) => a > b ? a : b, "Table 1");

    return io.sockets.adapter.rooms[latestKey];
};

/**
 * On event "list rooms" emit the list of rooms.
 */
const onListRooms = (io, socket) => {
    socket.on("list rooms", () => {
        emitRooms(io);
    });
};

/**
 *  Emit the list of rooms to everyone.
 */
const emitRooms = (io) => {
    io.emit("list rooms", getAllRooms(io));
};

/**
 * Create a new room name to join.
 */
const joinNewRoom = (io, socket, db) => {
    let latest = getLatestRoom(io);

    return joinRoom(io, socket, latest ? latest.roomId + 1 : 1, db);
};

/**
 * Join a room by room name.
 */
const joinRoom = (io, socket, roomId, db) => {
    const roomName = `Table ${roomId}`;

    if (io.sockets.adapter.rooms[roomName] && io.sockets.adapter.rooms[roomName].length >= 4) {
        return false;
    }
    if (socket.currentRoom) { socket.leave(socket.currentRoom); }
    socket.join(roomName);
    io.sockets.adapter.rooms[roomName].roomId = roomId;
    io.sockets.adapter.rooms[roomName].roomName = roomName;
    socket.currentRoom = roomName;
    console.log(socket.id + " joined the room '" + roomName + "'");
    emitRooms(io);
    setupTable(io, socket, io.sockets.adapter.rooms[roomName], db);
    return roomId;
};

/**
 * On event "join room" join the room.
 */
const onJoinRoom = (io, socket, db) => {
    socket.on("join room", (roomId, callback) => {
        let roomNr;

        if (typeof roomId !== "number") {
            roomNr = joinNewRoom(io, socket, db);
        } else {
            roomNr = joinRoom(io, socket, roomId, db);
        }
        callback(roomNr);
    });
};

/**
 * On event "disconnect" remove the user from room and emit rooms.
 */
const onDisconnect = (io, socket) => {
    socket.on("disconnect", () => {
        leaveRoom(io, socket);
        emitRooms(io);
        console.log(`${socket.user.username} disconnected`);
    });
};

/**
 * On event "account balance" return the accounts money or refill the accounts money and return it.
 */
const onAccountBalance = (socket, db) => socket.on("account balance", async (refill, callback) => {
    if (refill) {
        await setAccountBalance(100, socket.user.email, db);
        callback(100);
    } else {
        callback(await getAccountBalance(socket.user.email, db));
    }
});

const getAccountBalance = async (email, db) => {
    return (await db.collection("users").findOne({email}, {fields: {money: 1}})).money;
};

const setAccountBalance = async (money, email, db) => {
    await db.collection("users").update({email}, {$set: {money}});
};

/**
 * Create the IO server.
 */
const createIO = (server, db) => {
    const io = new IO(server);

    io.use((socket, next) => {
        let token;

        try {
            token = verify(socket.handshake.query.token);
        } catch (err) {
            token = err;
        }
        if (token.hasOwnProperty("username")) {
            socket.user = token;
            return next();
        }

        return next(new Error("authentication error"));
    });

    io.on("connection", socket => {
        console.log(`${socket.user.username} connected`);
        onAccountBalance(socket, db);
        onListRooms(io, socket);
        onJoinRoom(io, socket, db);
        onLeaveRoom(io, socket);
        onDisconnect(io, socket);
    });

    return io;
};

const onPlayerBet = (io, socket, room, db) => socket.on("player bet", (bet) => {
    console.log("Player bet:", socket.id);
    const playerIdx = room.table.getIndex(socket.id);
    const bettingStatus = room.table.status === "betting";
    const intBet = Number.isInteger(bet);
    const rangeBet = bet >= 5 && bet <= 50 && bet % 5 === 0;
    const noBet = room.table.players[playerIdx].hands[0].bet === null;

    if (!bettingStatus || !intBet || !rangeBet || !noBet || !room.table.playerBet(socket.id, bet)) {
        return false;
    }

    const { balance, email } = room.table.players[playerIdx];

    setAccountBalance(balance, email, db)
        .then(() => {
            emitGameUpdate(io, room);
            if (room.table.betsDone()) {
                room.table.startRound();
                emitGameUpdate(io, room, "All bets are done.");
                if (room.table.currentPlayer === "dealer") { dealerTurn(io, room, db); }
            }
        });
});

const bustByHit = (io, socket, room) => {
    if (room.table.player().hands[room.table.player().currentHand].getValue() > 21) {
        room.table.bustHand();
        return true;
    }
    return false;
};

const onPlayerHit = (io, socket, room, db) => socket.on("player hit", () => {
    console.log("Player hit:", socket.id);
    if (!Number.isInteger(room.table.currentPlayer)
        || socket.id !== room.table.player().id || room.table.status !== "playing") {
        return false;
    }
    room.table.addCards(1, "current");
    emitGameUpdate(io, room, `${socket.user.username} hit and got a card.`);
    const isBust = bustByHit(io, socket, room);

    if (isBust || room.table.player().hands[0].getValue() === 21) {
        emitGameUpdate(
            io,
            room,
            `${socket.user.username} ${isBust ? " bust" : " got 21"}, next players turn.`
        );
        nextPlayerTurn(io, socket, room, db);
    }
});

const payout = async (room, db) => {
    const promises = room.table.players.map(player => {
        setAccountBalance(player.balance, player.email, db);
    });

    await Promise.all(promises);
};

const dealerTurn = (io, room, db) => {
    emitGameUpdate(io, room, "Dealer's turn to act.");
    const dealerHand = room.table.dealer.hand.getValue();
    const busted = room.table.players.filter(player => player.hands[0].result === "bust").length;

    if (dealerHand >= 17 || dealerHand === "Black Jack" || busted === room.length) {
        room.table.roundResults();
        payout(room, db).then(() => {
            emitGameUpdate(io, room, "Next round starts in 5 seconds.");
            setTimeout(() => {
                room.table.newRound();
                emitGameUpdate(io, room, "New round starting, place your bets.");
            }, 5000);
        });
    } else {
        setTimeout(() => {
            room.table.addCards(1, "dealer");
            emitGameUpdate(io, room, "The dealer got a card.");
            dealerTurn(io, room, db);
        }, 1000);
    }
};

const nextPlayerTurn = (io, socket, room, db) => {
    const turn = room.table.playerStand();

    if (turn === "dealer") {
        // DO dealer stuff
        dealerTurn(io, room, db);
    }
    emitGameUpdate(io, room);
};

const onPlayerStand = (io, socket, room, db) => socket.on("player stand", () => {
    if (!Number.isInteger(room.table.currentPlayer)
        || socket.id !== room.table.player().id || room.table.status !== "playing") {
        return false;
    }
    emitGameUpdate(io, room, `${socket.user.username} choose to stand, next players turn.`);
    nextPlayerTurn(io, socket, room, db);
});

const onPlayerDouble = (io, socket, room, db) => socket.on("player double", () => {
    console.log("Player double:", socket.id);
    if (!Number.isInteger(room.table.currentPlayer)
        || socket.id !== room.table.player().id || room.table.status !== "playing") {
        return false;
    }
    if (room.table.playerDouble()) {
        setAccountBalance(room.table.player().balance, room.table.player().email, db)
            .then(() => {
                emitGameUpdate(io, room);
                bustByHit(io, socket, room);
                nextPlayerTurn(io, socket, room, db);
            });
    }
});

const onGameUpdate = (io, socket, room) => socket.on("game update", () => {
    emitGameUpdate(io, room);
});

const onLeaveRoom = (io, socket) => socket.on("leave room", () => {
    leaveRoom(io, socket);
});

// Emit functions
const emitGameUpdate = (io, room, msg = null) => {
    io.in(room.roomName).emit("game update", room, msg);
};


const leaveRoom = (io, socket) => {
    if (!socket.currentRoom || !io.sockets.adapter.rooms[socket.currentRoom]) { return false; }

    io.sockets.adapter.rooms[socket.currentRoom].table.removePlayer(socket.id);
    socket.leave(socket.currentRoom, () => {
        console.log(socket.id, "left the room", socket.currentRoom);
        if (io.sockets.adapter.rooms[socket.currentRoom]) {
            emitGameUpdate(
                io,
                io.sockets.adapter.rooms[socket.currentRoom],
                `${socket.user.username} left the table.`
            );
            for (let player of io.sockets.adapter.rooms[socket.currentRoom].table.players) {
                if (!player.inactive) {
                    socket.currentRoom = undefined;
                    return;
                }
            }
            // New round if there are no active players
            io.sockets.adapter.rooms[socket.currentRoom].table.newRound();
            emitGameUpdate(io, io.sockets.adapter.rooms[socket.currentRoom]);
        }
        socket.currentRoom = undefined;
    });
    socket.removeAllListeners("player bet");
    socket.removeAllListeners("player hit");
    socket.removeAllListeners("player stand");
    socket.removeAllListeners("game update");
};


const setupTable = (io, socket, room, db) => {
    getAccountBalance(socket.user.email, db).then(balance => {
        if (balance < 5) {
            socket.leave(room.roomName);
            return;
        }

        if (room.table) {
            room.table.addPlayer(socket, balance, room.table.status === "betting" ? false : true);
            emitGameUpdate(io, room, `${socket.user.username} joined the table.`);
        } else {
            room.table = new Table(2);
            room.table.addPlayer(socket, balance, false);
        }

        onGameUpdate(io, socket, room);
        onPlayerBet(io, socket, room, db);
        onPlayerHit(io, socket, room, db);
        onPlayerStand(io, socket, room, db);
        onPlayerDouble(io, socket, room, db);
    });
};

module.exports = { createIO };
