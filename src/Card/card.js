"use strict";
// ♣ ♦ ♥ ♠

/** Class representing a card. */
class Card {
    /**
     * Create a card.
     */
    constructor() {
        this.suits = [
            {name: "Hearts", abbr: "h"},
            {name: "Clubs", abbr: "c"},
            {name: "Diamonds", abbr: "d"},
            {name: "Spades", abbr: "s"}
        ];
        this.names = [
            "King", "Ace", "Two", "Three", "Four", "Five", "Six",
            "Seven", "Eight", "Nine", "Ten", "Jack", "Queen"
        ];
        this.ranks = [10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10];
    }



    /**
     * Get the suit of a card based on the card id.
     *
     * @param {Number} cardNumber - The id of the card.
     * @returns {Object} The card suit.
     */
    getSuit(cardNumber) {
        return this.suits[Math.floor((cardNumber - 1) / 13)];
    }



    /**
     * Get the name of a card based on the card id.
     *
     * @param {Number} cardNumber - The id of the card.
     * @returns {String} The name of the card.
     */
    getName(cardNumber) {
        return this.names[Math.floor(cardNumber % 13)];
    }



    /**
     * Get the rank of a card based on the card id.
     *
     * @param {Number} cardNumber - The id of the card.
     * @returns {Number} The rank of the card
     */
    getRank(cardNumber) {
        return this.ranks[Math.floor(cardNumber % 13)];
    }



    /**
     * Get the suit, name and rank of a card based on the card id.
     *
     * @param {Number} cardNumber - The id of the card.
     * @returns {Object} The suit, name and rank of the card.
     */
    getCard(cardNumber) {
        let suit = this.getSuit(cardNumber);
        let name = this.getName(cardNumber);
        let rank = this.getRank(cardNumber);

        return {suit, name, rank};
    }
}

module.exports = Card;
