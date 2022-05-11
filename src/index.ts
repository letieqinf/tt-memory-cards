import * as PIXI from 'pixi.js'
import { Status, Card } from './Card'


export class Game {
    private app: PIXI.Application
    private stage: PIXI.Container
    private cards: Array<Card>

    private SPRITES: string = '../assets/images/'
    private SPRITE_WIDTH: number = 150
    private SPRITE_HEIGHT: number = 150
    private OFFSET: number = 20

    private STEPS: number = 0

    private MINUTES: number = 0
    private SECONDS: number = 0
    private TIMER: NodeJS.Timer = setInterval(() => {})

    public constructor() {
        this.app = new PIXI.Application({
            width: 720,
            height: 720,
            backgroundColor: 0xAACF74,
            backgroundAlpha: 0.8
        })
        document.getElementById("game")?.appendChild(this.app.view)

        this.stage = new PIXI.Container()
        this.cards = []
        this.createCardMatrix()

        this.stage.x = this.app.screen.width / 2
        this.stage.y = this.app.screen.height / 2
        this.stage.pivot.x = this.stage.width / 2
        this.stage.pivot.y = this.stage.height / 2

        this.app.stage.addChild(this.stage)
    }

    public run(): void {
        this.cards.forEach(element => {
            element.back.visible = false
        })

        this.delay(() => {
            this.cards.forEach(element => {
                element.back.visible = true
            })
            this.startTimer()
        }, 3000)

        this.cards.forEach(card => {
            card.back.on('pointerdown', card.onClick)
        });
    }

    private startTimer(): void {
        var ms: number = 0
        this.TIMER = setInterval(() => {
            ms++
            if (ms == 100) {
                ms = 0
                this.SECONDS++

                var stc: any = document.getElementById("seconds")
                stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS.toString()
            }

            if (this.SECONDS == 60) {
                this.SECONDS = 0
                this.MINUTES++

                var stc: any = document.getElementById("minutes")
                stc.innerHTML = (this.MINUTES / 10 < 1 ? "0" : "") + this.MINUTES.toString()

                stc = document.getElementById("seconds")
                stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS.toString()
            }
        }, 10)
    }

    private createCardMatrix(): void {
        for (var id = 0; id < 16; id++) {
            const card: Card = {
                status: Status.Closed,
                sprite: PIXI.Sprite.from(this.SPRITES + `card_${id % 8 + 1}.png`),
                back: PIXI.Sprite.from(this.SPRITES + 'back.png'),
                pictureId: id % 8 + 1,
                onClick: () => {
                    card.back.visible = false
                    card.status = Status.Opened
                    this.STEPS++

                    const stc: any = document.getElementById("stepCounter")
                    stc.innerHTML = this.STEPS.toString()

                    this.cards.forEach(pc => {
                        if (pc.status == Status.Opened && pc != card) {
                            if (pc.pictureId == card.pictureId) {
                                pc.status = card.status = Status.Found
                                return
                            }

                            this.cards.forEach(element => {
                                element.back.interactive = false;
                                element.back.buttonMode = false;
                            })

                            this.delay(() => {
                                pc.status = card.status = Status.Closed
                                pc.back.visible = card.back.visible = true

                                this.cards.forEach(element => {
                                    element.back.interactive = true;
                                    element.back.buttonMode = true;
                                })
                            }, 600)
                        }
                    })

                    if (this.cards.every(element => element.status == Status.Found)) {
                        this.finalize()
                    }
                }
            }

            card.back.width = card.sprite.width = this.SPRITE_WIDTH
            card.back.height = card.sprite.height = this.SPRITE_HEIGHT

            card.back.interactive = true;
            card.back.buttonMode = true;

            this.cards.push(card)
            this.stage.addChild(card.sprite)
            this.stage.addChild(card.back)
        }

        this.cards = this.cards.sort(function() {
            return Math.random() - 0.5;
        });

        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                this.cards[row * 4 + col].back.x = this.cards[row * 4 + col].sprite.x = col * (this.SPRITE_WIDTH + this.OFFSET)
                this.cards[row * 4 + col].back.y = this.cards[row * 4 + col].sprite.y = row * (this.SPRITE_HEIGHT + this.OFFSET)
            }
        }
    }

    private delay(onDelay: () => void, time: number) {
        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }
        sleep(time).then(() => { onDelay() })
    }

    private finalize(): void {
        clearInterval(this.TIMER)
        const minutes: string = (this.MINUTES / 10 < 1? "0" : "") + this.MINUTES.toString()
        const seconds: string = (this.SECONDS / 10 < 1? "0" : "") + this.SECONDS.toString()

        const gameOver = new PIXI.Container()

        const background = new PIXI.Graphics()
        background.beginFill(0xFFFFFF)
        background.alpha = 0.5
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
        background.endFill()

        const style = new PIXI.TextStyle({
            fontFamily: 'Nunito',
            fontSize: 72,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        })
        const gameOverText = new PIXI.Text('ПОБЕДА!', style)
        gameOverText.x = this.app.screen.width / 2
        gameOverText.y = this.app.screen.height / 2 - 40
        gameOverText.pivot.x = gameOverText.width / 2
        gameOverText.pivot.y = gameOverText.height / 2

        const timeResult = new PIXI.Text('ВРЕМЯ: ' + minutes + ' : ' + seconds)
        timeResult.x = this.app.screen.width / 2
        timeResult.y = this.app.screen.height / 2 + 40
        timeResult.pivot.x = timeResult.width / 2
        timeResult.pivot.y = timeResult.height / 2

        gameOver.addChild(background)
        gameOver.addChild(gameOverText)
        gameOver.addChild(timeResult)
        this.app.stage.addChild(gameOver)

        this.delay(() => {
            this.app.stage.removeChild(gameOver)
            this.restart()
        }, 3000)
    }

    private restart(): void {
        this.STEPS = 0
        this.MINUTES = 0
        this.SECONDS = 0

        var stc: any = document.getElementById("stepCounter")
        stc.innerHTML = this.STEPS

        stc = document.getElementById("seconds")
        stc.innerHTML = (this.SECONDS / 10 < 1 ? "0" : "") + this.SECONDS

        stc = document.getElementById("minutes")
        stc.innerHTML = (this.MINUTES / 10 < 1 ? "0" : "") + this.MINUTES

        this.cards.forEach(card => {
            this.stage.removeChild(card.sprite)
            this.stage.removeChild(card.back)
        })
        this.cards = []
        this.createCardMatrix()
        this.run()
    }
}

window.onload = function () {
    var game = new Game()
    game.run()
}