const Player = require("./player");
const Card = new (require("../Card/card"));


test("test create player", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player).toBeInstanceOf(Player);
});


test("test addCard()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.hands[0].cards).toHaveLength(0);
    player.addCard(Card.getCard(1));
    expect(player.hands[0].cards).toHaveLength(1);
});


test("test bustHand()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.bustHand()).toBeNull();
    player.playerBet(20);
    expect(player.bustHand()).toBe(20);
});


test("test doubleHand()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.doubleHand()).toBeFalsy();
    player.playerBet(20);
    player.addCard(Card.getCard(5));
    player.addCard(Card.getCard(6));
    expect(player.doubleHand()).toBeTruthy();
});


test("test getBet()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.getBet()).toBeNull();
    player.playerBet(20);
    expect(player.getBet()).toBe(20);
});


test("test newRound()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    player.addCard(Card.getCard(5));
    player.currentHand = 1;
    expect(player.hands[0].cards).toHaveLength(1);
    expect(player.currentHand).toBe(1);
    
    player.newRound();
    expect(player.hands[0]).toBeInstanceOf(require("../Hand/hand"));
    expect(player.hands[0].cards).toHaveLength(0);
    expect(player.currentHand).toBe(0);
});


test("test playerBet()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.hands[0].bet).toBeNull();
    player.playerBet(20);
    expect(player.hands[0].bet).toBe(20);
    expect(player.playerBet(500)).toBeFalsy();
});


test("test splitHand()", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.hands).toHaveLength(1);
    expect(player.hands[0].cards).toHaveLength(0);
    expect(player.splitHand()).toBeFalsy();
    player.addCard(Card.getCard(10));
    player.addCard(Card.getCard(10));
    expect(player.hands[0].cards).toHaveLength(2);
    expect(player.splitHand()).toBeTruthy();
    expect(player.hands).toHaveLength(2);
    expect(player.hands[0].cards).toHaveLength(1);
    expect(player.hands[1].cards).toHaveLength(1);
});


test("test toggleActive", () => {
    const player = new Player("id_test", "test", "test@test.com", 100, false);

    expect(player.inactive).toBeFalsy();
    player.toggleActive();
    expect(player.inactive).toBeTruthy();
    player.toggleActive();
    expect(player.inactive).toBeFalsy();
});
