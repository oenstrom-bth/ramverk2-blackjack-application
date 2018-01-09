const Deck = require("./deck");

test("create a normal deck.", () => {
    let deck = new Deck();

    expect(deck).toBeInstanceOf(Deck);
    expect(deck.cards).toHaveLength(104);
    expect(deck.cards).toEqual(expect.arrayContaining([...Array(52).keys()].map(i => ++i)));
});



test("create a three deck stack.", () => {
    let deck3 = new Deck(3);

    expect(deck3.cards).toHaveLength(156);
    expect(deck3.cards).toEqual(expect.arrayContaining([...Array(52).keys()].map(i => ++i)));
});



test("get the top card.", () => {
    let deck = new Deck(1);

    expect(deck.cards).toHaveLength(52);
    expect(deck.getCard()).toBe(52);
    expect(deck.cards).toHaveLength(51);
    expect(deck.getCard()).toBe(51);
    expect(deck.cards).toHaveLength(50);

    for (let i = 0; i < 49; i++) {
        deck.getCard();
    }

    expect(deck.cards).toHaveLength(1);
    expect(deck.getCard()).toBe(1);
    expect(deck.cards).toHaveLength(0);
});



test("shuffle the deck(s) of cards", () => {
    let deck = new Deck(1);

    expect(deck.cards).toEqual([...Array(52).keys()].map(i => ++i));

    deck.shuffle();
    expect(deck.cards).not.toEqual([...Array(52).keys()].map(i => ++i));
});



test("restore and shuffle deck", () => {
    let deck = new Deck(1);

    expect(deck.cards).toHaveLength(52);
    deck.getCard();
    deck.getCard();
    deck.getCard();
    expect(deck.cards).toHaveLength(49);

    deck.restoreAndShuffle();
    expect(deck.cards).toHaveLength(52);
    expect(deck.cards).not.toEqual([...Array(52).keys()].map(i => ++i));
});
