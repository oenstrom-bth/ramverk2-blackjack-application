const Hand = require("./hand");
const Card = new (require("../Card/card"));


test("test create hand", () => {
    const hand = new Hand();

    expect(hand).toBeInstanceOf(Hand);
});


test("test addCard", () => {
    const hand = new Hand();

    expect(hand.cards).toEqual([]);
    hand.addCard(Card.getCard(1));
    expect(hand.cards).toEqual([{
        suit: {name: "Hearts", abbr: "h"},
        name: "Ace",
        rank: 11
    }]);
});


test("test bust()", () => {
    const hand = new Hand();

    expect(hand.result).toBeNull();
    hand.setBet(20);
    expect(hand.bust()).toBe(20);
    expect(hand.result).toBe("bust");
});


test("test doubleDown()", () => {
    const hand = new Hand();

    expect(hand.doubleDown()).toBeFalsy();
    hand.setBet(20);
    hand.addCard(5);
    hand.addCard(6);
    expect(hand.doubleDown()).toBeTruthy();
    expect(hand.bet).toBe(40);
});


test("test getValue()", () => {
    const hand = new Hand();

    expect(hand.getValue()).toBe(0);
    hand.addCard(Card.getCard(1));
    expect(hand.getValue()).toBe(11);
    hand.addCard(Card.getCard(13));
    expect(hand.getValue()).toBe("Black Jack");
    hand.addCard(Card.getCard(11));
    expect(hand.getValue()).toBe(21);
});


test("test resetHand()", () => {
    const hand = new Hand();

    hand.addCard(Card.getCard(4));
    hand.addCard(Card.getCard(6));
    hand.setBet(20);
    hand.setResult("lose");
    expect(hand.cards).toHaveLength(2);
    expect(hand.value).toBe(10);
    expect(hand.bet).toBe(20);
    expect(hand.result).toBe("lose");

    hand.resetHand();
    expect(hand.cards).toHaveLength(0);
    expect(hand.value).toBe(0);
    expect(hand.bet).toBeNull();
    expect(hand.result).toBeNull();
});


test("test setBet()", () => {
    const hand = new Hand();

    expect(hand.bet).toBeNull();
    hand.setBet(20);
    expect(hand.bet).toBe(20);
    hand.setBet(50);
    expect(hand.bet).toBe(50);
});


test("test setResult()", () => {
    const hand = new Hand();

    expect(hand.result).toBeNull();
    hand.setResult("win");
    expect(hand.result).toBe("win");
    hand.setResult("lose");
    expect(hand.result).toBe("lose");
});


test("test splitHand()", () => {
    const hand = new Hand();

    expect(hand.splitHand()).toBeFalsy();
    hand.addCard(Card.getCard(4));
    expect(hand.splitHand()).toBeFalsy();

    hand.resetHand();
    hand.addCard(Card.getCard(4));
    hand.addCard(Card.getCard(6));
    expect(hand.splitHand()).toBeFalsy();

    hand.resetHand();
    hand.addCard(Card.getCard(10));
    hand.addCard(Card.getCard(10));
    expect(hand.cards).toHaveLength(2);
    expect(hand.splitHand()).toEqual({
        name: "Ten",
        suit: {name: "Hearts", abbr: "h"},
        rank: 10
    });
    expect(hand.cards).toHaveLength(1);
});
