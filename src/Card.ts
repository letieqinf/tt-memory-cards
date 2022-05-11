import * as PIXI from 'pixi.js'


export const enum Status {
    Closed, Opened, Found
}

export type Card = {
    status: Status,
    sprite: PIXI.Sprite
    back: PIXI.Sprite
    pictureId: number
    onClick: () => void
}