"use strict";

/** Class representing a deck of cards. */
class Deck {
    /**
     * Create a deck.
     *
     * @param {Number} nrOfDecks - Number of decks to use.
     */
    constructor(nrOfDecks) {
        this.setup(nrOfDecks);
    }



    /**
     * Setup up the deck.
     *
     * @param {Number} nrOfDecks - Number of decks to use.
     */
    setup(nrOfDecks) {
        this.decks = nrOfDecks || 2;
        this.cards = [];

        [...Array(this.decks).keys()].map(() => {
            this.cards = this.cards.concat([...Array(52).keys()].map(i => ++i));
        });
    }



    /**
     * Restores the deck and shuffle the cards.
     */
    restoreAndShuffle() {
        this.setup(this.decks);
        this.shuffle();
    }



    /**
     * Shuffle the deck of cards.
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }



    /**
     * Get the last card in the card array.
     *
     * @returns {Number} The card id.
     */
    getCard() {
        return this.cards.pop();
    }
}

module.exports = Deck;
