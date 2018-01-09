const Card = require("./card");
const card = new Card();

test("create a card", () => {
    expect(card).toBeInstanceOf(Card);
    expect(card.suits).toEqual([
        {name: "Hearts", abbr: "h"},
        {name: "Clubs", abbr: "c"},
        {name: "Diamonds", abbr: "d"},
        {name: "Spades", abbr: "s"}
    ]);
    expect(card.names).toEqual([
        "King", "Ace", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Jack", "Queen"
    ]);
    expect(card.ranks).toEqual([10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10]);
});



test("get suit of the card", () => {
    expect(card.getSuit(1)).toEqual({name: "Hearts", abbr: "h"});
    expect(card.getSuit(13)).toEqual({name: "Hearts", abbr: "h"});
    expect(card.getSuit(14)).toEqual({name: "Clubs", abbr: "c"});
    expect(card.getSuit(26)).toEqual({name: "Clubs", abbr: "c"});
    expect(card.getSuit(27)).toEqual({name: "Diamonds", abbr: "d"});
    expect(card.getSuit(39)).toEqual({name: "Diamonds", abbr: "d"});
    expect(card.getSuit(40)).toEqual({name: "Spades", abbr: "s"});
    expect(card.getSuit(52)).toEqual({name: "Spades", abbr: "s"});
});



test("get card rank", () => {
    expect(card.getRank(1)).toBe(11);
    expect(card.getRank(2)).toBe(2);
    expect(card.getRank(3)).toBe(3);
    expect(card.getRank(4)).toBe(4);
    expect(card.getRank(5)).toBe(5);
    expect(card.getRank(6)).toBe(6);
    expect(card.getRank(7)).toBe(7);
    expect(card.getRank(8)).toBe(8);
    expect(card.getRank(9)).toBe(9);
    expect(card.getRank(10)).toBe(10);
    expect(card.getRank(11)).toBe(10);
    expect(card.getRank(12)).toBe(10);
    expect(card.getRank(13)).toBe(10);
    expect(card.getRank(40)).toBe(11);
    expect(card.getRank(41)).toBe(2);
    expect(card.getRank(42)).toBe(3);
    expect(card.getRank(43)).toBe(4);
    expect(card.getRank(44)).toBe(5);
    expect(card.getRank(45)).toBe(6);
    expect(card.getRank(46)).toBe(7);
    expect(card.getRank(47)).toBe(8);
    expect(card.getRank(48)).toBe(9);
    expect(card.getRank(49)).toBe(10);
    expect(card.getRank(50)).toBe(10);
    expect(card.getRank(51)).toBe(10);
    expect(card.getRank(52)).toBe(10);
});



test("get card name", () => {
    expect(card.getName(1)).toBe("Ace");
    expect(card.getName(2)).toBe("Two");
    expect(card.getName(3)).toBe("Three");
    expect(card.getName(4)).toBe("Four");
    expect(card.getName(5)).toBe("Five");
    expect(card.getName(6)).toBe("Six");
    expect(card.getName(7)).toBe("Seven");
    expect(card.getName(8)).toBe("Eight");
    expect(card.getName(9)).toBe("Nine");
    expect(card.getName(10)).toBe("Ten");
    expect(card.getName(11)).toBe("Jack");
    expect(card.getName(12)).toBe("Queen");
    expect(card.getName(13)).toBe("King");
    expect(card.getName(40)).toBe("Ace");
    expect(card.getName(41)).toBe("Two");
    expect(card.getName(42)).toBe("Three");
    expect(card.getName(43)).toBe("Four");
    expect(card.getName(44)).toBe("Five");
    expect(card.getName(45)).toBe("Six");
    expect(card.getName(46)).toBe("Seven");
    expect(card.getName(47)).toBe("Eight");
    expect(card.getName(48)).toBe("Nine");
    expect(card.getName(49)).toBe("Ten");
    expect(card.getName(50)).toBe("Jack");
    expect(card.getName(51)).toBe("Queen");
    expect(card.getName(52)).toBe("King");
});



test("get full card", () => {
    expect(card.getCard(1)).toEqual(
        {
            suit: {name: "Hearts", abbr: "h"},
            name: "Ace",
            rank: 11
        }
    );
    expect(card.getCard(13)).toEqual(
        {
            suit: {name: "Hearts", abbr: "h"},
            name: "King",
            rank: 10
        }
    );
    expect(card.getCard(17)).toEqual(
        {
            suit: {name: "Clubs", abbr: "c"},
            name: "Four",
            rank: 4
        }
    );
    expect(card.getCard(26)).toEqual(
        {
            suit: {name: "Clubs", abbr: "c"},
            name: "King",
            rank: 10
        }
    );
});
