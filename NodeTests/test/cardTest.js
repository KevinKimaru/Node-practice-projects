'use strict';

var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var card = require('../app/card.js');

describe("Testing card modules", () => {

    describe("Testing card module", () => {

        it("testing card", () => {

            var myCard = new card.card('9', 'd', 'Nine', 9);
            expect(myCard).is.not.null;

        });

    });

});

