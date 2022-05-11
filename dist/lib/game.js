(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("PIXI"));
	else if(typeof define === 'function' && define.amd)
		define("memory-cards-game", ["PIXI"], factory);
	else if(typeof exports === 'object')
		exports["memory-cards-game"] = factory(require("PIXI"));
	else
		root["memory-cards-game"] = factory(root["PIXI"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__700__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 22:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const PIXI = __importStar(__webpack_require__(700));
class Game {
    constructor() {
        var _a;
        this.SPRITES = '../assets/images/';
        this.SPRITE_WIDTH = 150;
        this.SPRITE_HEIGHT = 150;
        this.OFFSET = 20;
        this.STEPS = 0;
        this.MINUTES = 0;
        this.SECONDS = 0;
        this.TIMER = setInterval(() => { });
        this.app = new PIXI.Application({
            width: 720,
            height: 720,
            backgroundColor: 0xAACF74,
            backgroundAlpha: 0.8
        });
        (_a = document.getElementById("game")) === null || _a === void 0 ? void 0 : _a.appendChild(this.app.view);
        this.stage = new PIXI.Container();
        this.cards = [];
        this.createCardMatrix();
        this.stage.x = this.app.screen.width / 2;
        this.stage.y = this.app.screen.height / 2;
        this.stage.pivot.x = this.stage.width / 2;
        this.stage.pivot.y = this.stage.height / 2;
        this.app.stage.addChild(this.stage);
    }
    run() {
        this.cards.forEach(element => {
            element.back.visible = false;
        });
        this.delay(() => {
            this.cards.forEach(element => {
                element.back.visible = true;
            });
            this.startTimer();
        }, 3000);
        this.cards.forEach(card => {
            card.back.on('pointerdown', card.onClick);
        });
    }
    startTimer() {
        var ms = 0;
        this.TIMER = setInterval(() => {
            ms++;
            if (ms == 100) {
                ms = 0;
                this.SECONDS++;
                var stc = document.getElementById("seconds");
                stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS.toString();
            }
            if (this.SECONDS == 60) {
                this.SECONDS = 0;
                this.MINUTES++;
                var stc = document.getElementById("minutes");
                stc.innerHTML = (this.MINUTES / 10 < 1 ? "0" : "") + this.MINUTES.toString();
                stc = document.getElementById("seconds");
                stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS.toString();
            }
        }, 10);
    }
    createCardMatrix() {
        for (var id = 0; id < 16; id++) {
            const card = {
                status: 0 /* Closed */,
                sprite: PIXI.Sprite.from(this.SPRITES + `card_${id % 8 + 1}.png`),
                back: PIXI.Sprite.from(this.SPRITES + 'back.png'),
                pictureId: id % 8 + 1,
                onClick: () => {
                    card.back.visible = false;
                    card.status = 1 /* Opened */;
                    this.STEPS++;
                    const stc = document.getElementById("stepCounter");
                    stc.innerHTML = this.STEPS.toString();
                    this.cards.forEach(pc => {
                        if (pc.status == 1 /* Opened */ && pc != card) {
                            if (pc.pictureId == card.pictureId) {
                                pc.status = card.status = 2 /* Found */;
                                return;
                            }
                            this.cards.forEach(element => {
                                element.back.interactive = false;
                                element.back.buttonMode = false;
                            });
                            this.delay(() => {
                                pc.status = card.status = 0 /* Closed */;
                                pc.back.visible = card.back.visible = true;
                                this.cards.forEach(element => {
                                    element.back.interactive = true;
                                    element.back.buttonMode = true;
                                });
                            }, 600);
                        }
                    });
                    if (this.cards.every(element => element.status == 2 /* Found */)) {
                        this.finalize();
                    }
                }
            };
            card.back.width = card.sprite.width = this.SPRITE_WIDTH;
            card.back.height = card.sprite.height = this.SPRITE_HEIGHT;
            card.back.interactive = true;
            card.back.buttonMode = true;
            this.cards.push(card);
            this.stage.addChild(card.sprite);
            this.stage.addChild(card.back);
        }
        this.cards = this.cards.sort(function () {
            return Math.random() - 0.5;
        });
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                this.cards[row * 4 + col].back.x = this.cards[row * 4 + col].sprite.x = col * (this.SPRITE_WIDTH + this.OFFSET);
                this.cards[row * 4 + col].back.y = this.cards[row * 4 + col].sprite.y = row * (this.SPRITE_HEIGHT + this.OFFSET);
            }
        }
    }
    delay(onDelay, time) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        sleep(time).then(() => { onDelay(); });
    }
    finalize() {
        clearInterval(this.TIMER);
        const minutes = (this.MINUTES / 10 < 1 ? "0" : "") + this.MINUTES.toString();
        const seconds = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS.toString();
        const gameOver = new PIXI.Container();
        const background = new PIXI.Graphics();
        background.beginFill(0xFFFFFF);
        background.alpha = 0.5;
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        const style = new PIXI.TextStyle({
            fontFamily: 'Nunito',
            fontSize: 72,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        });
        const gameOverText = new PIXI.Text('ПОБЕДА!', style);
        gameOverText.x = this.app.screen.width / 2;
        gameOverText.y = this.app.screen.height / 2 - 40;
        gameOverText.pivot.x = gameOverText.width / 2;
        gameOverText.pivot.y = gameOverText.height / 2;
        const timeResult = new PIXI.Text('ВРЕМЯ: ' + minutes + ' : ' + seconds);
        timeResult.x = this.app.screen.width / 2;
        timeResult.y = this.app.screen.height / 2 + 40;
        timeResult.pivot.x = timeResult.width / 2;
        timeResult.pivot.y = timeResult.height / 2;
        gameOver.addChild(background);
        gameOver.addChild(gameOverText);
        gameOver.addChild(timeResult);
        this.app.stage.addChild(gameOver);
        this.delay(() => {
            this.app.stage.removeChild(gameOver);
            this.restart();
        }, 3000);
    }
    restart() {
        this.STEPS = 0;
        this.MINUTES = 0;
        this.SECONDS = 0;
        var stc = document.getElementById("stepCounter");
        stc.innerHTML = this.STEPS;
        stc = document.getElementById("seconds");
        stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS;
        stc = document.getElementById("minutes");
        stc.innerHTML = (this.MINUTES / 10 < 1 ? "0" : "") + this.MINUTES;
        this.cards.forEach(card => {
            this.stage.removeChild(card.sprite);
            this.stage.removeChild(card.back);
        });
        this.cards = [];
        this.createCardMatrix();
        this.run();
    }
}
exports.Game = Game;
window.onload = function () {
    var game = new Game();
    game.run();
};


/***/ }),

/***/ 700:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__700__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(22);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});