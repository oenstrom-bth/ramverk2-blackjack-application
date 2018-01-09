const Table = require("./table");
const Hand = require("../Hand/hand");
const Deck = require("../Deck/deck");
const Card = new (require("../Card/card"));
const playerInfo = {id: "id_test", user: {username: "test", email: "test@test.com"}};
const playerInfo2 = {id: "id_test2", user: {username: "test2", email: "test2@test2.com"}};
const playerInfo3 = {id: "id_test3", user: {username: "test3", email: "test3@test3.com"}};


test("test create table", () => {
    const table = new Table(2);

    expect(table).toBeInstanceOf(Table);
    expect(table.deck).toBeInstanceOf(Deck);
    expect(table.status).toBe("betting");
    expect(table.players).toHaveLength(0);
    expect(table.dealer.hand).toBeInstanceOf(Hand);
    expect(table.currentPlayer).toBe(0);
    expect(table.nextPlayer).toBe("dealer");
});

test("test addPlayer()", () => {
    const table = new Table(2);

    expect(table.players).toHaveLength(0);
    table.addPlayer(playerInfo, 100, false);
    expect(table.players).toHaveLength(1);
});


test("test addCards()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);

    expect(table.dealer.hand.cards).toHaveLength(0);
    table.addCards(2, "dealer");
    expect(table.dealer.hand.cards).toHaveLength(2);
    table.addCards(2);
    expect(table.players[0].hands[0].cards).toHaveLength(2);
    table.addCards(2, "current");
    expect(table.players[0].hands[0].cards).toHaveLength(4);
    table.addCards(2, 0);
    expect(table.players[0].hands[0].cards).toHaveLength(6);
});


test("test betsDone()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    expect(table.betsDone()).toBeFalsy();
    table.playerBet("id_test", 20);
    expect(table.betsDone()).toBeTruthy();
});


test("test bustHand()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    table.playerBet("id_test", 20);
    expect(table.bustHand()).toBe(20);
});


test("test getIndex()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    expect(table.getIndex("id_test")).toBe(0);
});


test("test newRound()", () => {
    const table = new Table(2);

    table.status = "playing";
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.addCards(2, 0);
    table.addCards(2, 1);
    table.addCards(2, "dealer");
    table.currentPlayer = 1;

    expect(table.deck.cards).toHaveLength(98);
    expect(table.status).toBe("playing");
    expect(table.currentPlayer).toBe(1),
    expect(table.nextPlayer).toBe("dealer");

    table.newRound();
    expect(table.deck.cards).toHaveLength(104);
    expect(table.status).toBe("betting");
    expect(table.currentPlayer).toBe(0),
    expect(table.nextPlayer).toBe(1);

    table.players.splice(-1, 1);
    table.newRound();
    expect(table.nextPlayer).toBe("dealer");
});


test("test player()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    expect(table.player()).toEqual({
        id: "id_test",
        balance: 100,
        username: "test",
        email: "test@test.com",
        currentHand: 0,
        inactive: false,
        hands: [{
            bet: null,
            cards: [],
            result: null,
            value: 0
        }],
    });
});


test("test playerDouble()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    expect(table.playerDouble()).toBeFalsy();
    table.addCards(2, "current");
    expect(table.player().hands[0].cards).toHaveLength(2);
    expect(table.playerDouble()).toBeTruthy();
    expect(table.player().hands[0].cards).toHaveLength(3);
});


test("test playerStand()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    table.players[0].hands.push(new Hand());
    expect(table.playerStand()).toBe("next hand");
    expect(table.player().currentHand).toBe(1);

    table.newRound();
    expect(table.playerStand()).toBe("dealer");
    expect(table.nextPlayer).toBe("end");

    table.addPlayer(playerInfo2, 100, false);
    table.newRound();
    expect(table.playerStand()).toBe("next player");
    expect(table.currentPlayer).toBe(1);
    expect(table.nextPlayer).toBe("dealer");

    table.addPlayer(playerInfo2, 100, false);
    table.newRound();
    expect(table.playerStand()).toBe("next player");
    expect(table.currentPlayer).toBe(1);
    expect(table.nextPlayer).toBe(2);
});


test("test removePlayer()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.newRound();
    expect(table.players).toHaveLength(2);
    table.removePlayer("id_test2");
    expect(table.players).toHaveLength(1);
    expect(table.nextPlayer).toBe("dealer");

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.addPlayer(playerInfo3, 100, false);
    table.newRound();
    expect(table.players).toHaveLength(3);
    table.removePlayer("id_test2");
    expect(table.players).toHaveLength(2);
    expect(table.nextPlayer).toBe(1);

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.addPlayer(playerInfo3, 100, false);
    table.newRound();
    table.currentPlayer = 1;
    table.nextPlayer = 2;
    expect(table.players).toHaveLength(3);
    table.removePlayer("id_test");
    expect(table.players).toHaveLength(2);
    expect(table.currentPlayer).toBe(0);
    expect(table.nextPlayer).toBe(1);

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.newRound();
    table.currentPlayer = 1;
    table.nextPlayer = "dealer";
    expect(table.players).toHaveLength(2);
    table.removePlayer("id_test");
    expect(table.players).toHaveLength(1);
    expect(table.currentPlayer).toBe(0);
    expect(table.nextPlayer).toBe("dealer");

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.newRound();
    expect(table.players).toHaveLength(1);
    table.removePlayer("id_test");
    expect(table.players).toHaveLength(0);
    expect(table.nextPlayer).toBe("dealer");

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.addPlayer(playerInfo3, 100, false);
    table.newRound();
    expect(table.players).toHaveLength(3);
    table.removePlayer("id_test");
    expect(table.players).toHaveLength(2);
    expect(table.nextPlayer).toBe(1);

    table.players = [];
    table.addPlayer(playerInfo, 100, false);
    table.addPlayer(playerInfo2, 100, false);
    table.addPlayer(playerInfo3, 100, false);
    table.newRound();
    expect(table.players).toHaveLength(3);
    table.removePlayer("id_test3");
    expect(table.players).toHaveLength(2);
    expect(table.nextPlayer).toBe(1);
});

test("test roundResults()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    table.players[0].addCard(Card.getCard(11));
    table.players[0].addCard(Card.getCard(12));
    table.players[0].addCard(Card.getCard(13));
    table.dealer.hand.addCard(Card.getCard(7));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("bust");

    table.newRound();
    table.players[0].addCard(Card.getCard(1));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(1));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("push");

    table.newRound();
    table.players[0].addCard(Card.getCard(5));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(1));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("lose");

    table.newRound();
    table.players[0].addCard(Card.getCard(1));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(7));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("Black Jack");

    table.newRound();
    table.players[0].addCard(Card.getCard(8));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(7));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("win");

    table.newRound();
    table.players[0].addCard(Card.getCard(8));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(7));
    table.dealer.hand.addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("win");

    table.newRound();
    table.players[0].addCard(Card.getCard(5));
    table.players[0].addCard(Card.getCard(10));
    table.dealer.hand.addCard(Card.getCard(7));
    table.dealer.hand.addCard(Card.getCard(10));
    table.roundResults();
    expect(table.players[0].hands[0].result).toBe("lose");
});

test("test startRound()", () => {
    const table = new Table(2);

    table.addPlayer(playerInfo, 100, false);
    expect(table.player().hands[0].cards).toHaveLength(0);
    expect(table.dealer.hand.cards).toHaveLength(0);
    expect(table.status).toBe("betting");

    table.startRound();
    expect(table.player().hands[0].cards).toHaveLength(2);
    expect(table.nextPlayer).toBe("dealer");
    expect(table.dealer.hand.cards).toHaveLength(1);
    expect(table.status).toBe("playing");

    table.addPlayer(playerInfo2, 100, false);
    table.newRound();
    table.deck.cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    table.startRound();
    expect(table.nextPlayer).toBe(1);

    table.newRound();
    table.deck.cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 10];
    table.startRound();
    expect(table.nextPlayer).toBe("dealer");
});
