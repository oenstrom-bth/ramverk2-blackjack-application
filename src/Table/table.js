"use strict";
const Deck = require("../Deck/deck");
const Hand = require("../Hand/hand");
const Player = require("../Player/player");
const Card = new (require("../Card/card"));

class Table {
    constructor(nrOfDecks) {
        this.deck = new Deck(nrOfDecks);
        this.status = "betting";
        this.players = [];
        this.dealer = {hand: new Hand()};
        this.currentPlayer = 0;
        this.nextPlayer = "dealer";
        this.deck.shuffle();
    }

    addCards(nrOfCards, player = "current") {
        if (player === "dealer") {
            for (let i = 0; i < nrOfCards; i++) {
                this.dealer.hand.addCard(Card.getCard(this.deck.getCard()));
            }
        } else {
            const who = player === "current" ? this.currentPlayer : player;

            for (let i = 0; i < nrOfCards; i++) {
                this.players[who].addCard(Card.getCard(this.deck.getCard()));
            }
        }
    }

    addPlayer({ id, user}, balance, inactive) {
        this.players.push(new Player(id, user.username, user.email, balance, inactive));
    }

    betsDone() {
        for (let player of this.players) {
            if (!player.hands[0].bet) {
                return false;
            }
        }
        return true;
    }

    bustHand() {
        return this.players[this.currentPlayer].bustHand();
    }

    getIndex(playerId) {
        return this.players.findIndex(player => player.id === playerId);
    }

    newRound() {
        this.deck.restoreAndShuffle();
        this.status = "betting";
        this.dealer.hand.resetHand();
        this.currentPlayer = 0;
        this.nextPlayer = this.players.length > 1 ? 1 : "dealer";
        this.players.forEach(player => player.newRound());
    }

    player() {
        return this.players[this.currentPlayer];
    }

    playerBet(playerId, bet) {
        return this.players[this.getIndex(playerId)].playerBet(bet);
    }

    playerDouble() {
        if (!this.players[this.currentPlayer].doubleHand()) {
            return false;
        }
        this.addCards(1, "current");
        return true;
    }

    playerStand() {
        if (this.player().hands.length - 1 > this.player().currentHand) {
            this.players[this.currentPlayer].currentHand++;
            return "next hand";
        }

        [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer];
        if (this.currentPlayer === "dealer") {
            this.nextPlayer = "end";
            return "dealer";
        }

        this.nextPlayer += 2;
        this.nextPlayer = this.nextPlayer > this.players.length - 1
            || this.players[this.nextPlayer].inactive ? "dealer" : this.nextPlayer;
        return "next player";
    }

    removePlayer(socketId) {
        // const currIndex = this.players.indexOf(this.player());
        const leaveIndex = this.players.findIndex(player => player.id === socketId);

        // if (this.nextPlayer === "dealer" && leaveIndex === this.currentPlayer) {
        //     console.log("DEALERS TURN");
        //     this.players.splice(leaveIndex, 1);
        //     return false;
        if (leaveIndex === this.currentPlayer + 1) {
            this.nextPlayer = this.players[leaveIndex + 1] ? this.nextPlayer : "dealer";
        } else if (leaveIndex < this.currentPlayer) {
            this.currentPlayer--;
            this.nextPlayer = Number.isInteger(this.nextPlayer)
                ? this.nextPlayer - 1
                : this.nextPlayer;
        } else if (leaveIndex === this.currentPlayer) {
            this.nextPlayer = this.players[this.nextPlayer + 1] ? this.nextPlayer : "dealer";
        }
        this.players.splice(leaveIndex, 1);
    }

    roundResults() {
        const dealerValue = this.dealer.hand.getValue();

        for (let player of this.players) {
            for (let hand of player.hands) {
                const handValue = hand.getValue();

                if (hand.result === "bust" || handValue > 21) {
                    hand.setResult("bust");
                } else if (handValue === dealerValue) {
                    hand.setResult("push");
                    player.balance += player.getBet();
                } else if (dealerValue === "Black Jack") {
                    hand.setResult("lose");
                } else if (handValue === "Black Jack") {
                    hand.setResult("Black Jack");
                    player.balance += player.getBet() + (player.getBet() * 1.5);
                } else if ((handValue > dealerValue && handValue < 22) || dealerValue > 21) {
                    hand.setResult("win");
                    player.balance += (player.getBet() * 2);
                } else {
                    hand.setResult("lose");
                }
            }
        }
    }

    startRound() {
        this.status = "playing";
        this.nextPlayer = this.players.length > 1 ? 1 : "dealer";
        this.players.map((_, index) => this.addCards(2, index));
        this.addCards(1, "dealer");
        this.players.forEach(player => {
            if (player.hands[0].getValue() === "Black Jack") {
                player.hands[0].setResult("Black Jack");
                this.playerStand();
            }
        });
    }
}

module.exports = Table;
