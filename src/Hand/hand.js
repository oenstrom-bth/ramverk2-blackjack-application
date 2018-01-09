"use strict";

class Hand {
    /**
     * Create a hand consisting of cards.
     */
    constructor() {
        this.cards = [];
        this.value = 0;
        this.result = null;
        this.bet = null;
    }


    /**
     * Add a card to the hand and update the hand value.
     * @param {Object} card The card to be added.
     */
    addCard(card) {
        this.cards.push(card);
        this.value += card.rank;
        for (let idx in this.cards) {
            if (this.value > 21 && this.cards[idx].rank === 11) {
                this.cards[idx].rank = 1;
                this.value -= 10;
            }
        }
    }


    /**
     * Bust the hand and return the bet.
     */
    bust() {
        this.result = "bust";
        return this.bet;
    }


    /**
     * Double down if the hand consists of two cards.
     */
    doubleDown() {
        if (this.cards.length !== 2) {
            return false;
        }
        this.bet *= 2;
        return true;
    }


    /**
     * Get the rank/value of the hand.
     */
    getValue() {
        return this.cards.length === 2 && this.value === 21 ? "Black Jack" : this.value;
    }


    /**
     * Reset the hand.
     */
    resetHand() {
        this.cards = [];
        this.value = 0;
        this.result = null;
        this.bet = null;
    }


    /**
     * Set the hands bet.
     * @param {Integer} bet The bet.
     */
    setBet(bet) {
        this.bet = bet;
    }


    /**
     * Set the result of the hand.
     * @param {String} res The hand result.
     */
    setResult(res) {
        this.result = res;
    }


    /**
     * Split the hand if possible.
     */
    splitHand() {
        if (this.cards.length === 2 && this.cards[0].rank === this.cards[1].rank) {
            return this.cards.pop();
        }
        return false;
    }
}

module.exports = Hand;
