"use strict";
const Hand = require("../Hand/hand");

class Player {
    constructor(id, username, email, balance, inactive) {
        this.id          = id;
        this.username    = username;
        this.email       = email;
        this.hands       = [new Hand()];
        this.currentHand = 0;
        this.balance     = balance;
        this.inactive    = inactive;
    }


    addCard(card) {
        this.hands[this.currentHand].addCard(card);
    }


    bustHand() {
        return this.hands[this.currentHand].bust();
    }


    doubleHand() {
        if (this.balance < this.getBet() || !this.hands[this.currentHand].doubleDown()) {
            return false;
        }
        this.balance -= (this.getBet() / 2);
        return true;
    }


    getBet() {
        return this.hands[this.currentHand].bet;
    }


    newRound() {
        this.hands = [new Hand()];
        this.currentHand = 0;
        this.inactive = false;
    }


    playerBet(bet) {
        if (this.balance < bet) { return false; }

        this.hands[this.currentHand].setBet(bet);
        this.balance -= bet;
        return true;
    }


    splitHand() {
        const card = this.hands[this.currentHand].splitHand();

        if (!card) { return false; }
        this.hands.push(new Hand());
        this.hands[this.hands.length - 1].addCard(card);
        return true;
    }


    toggleActive() {
        this.inactive = !this.inactive;
    }
}

module.exports = Player;
