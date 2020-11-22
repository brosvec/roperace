import {INIT_PLAYER_LIVE, INIT_PLAYER_SPEED} from "../utils/constants";
import * as PixiMatter from '../../libs/pixi-matter';

export class Player {
    public lives: number = INIT_PLAYER_LIVE
    public id : string
    public speed : number = INIT_PLAYER_SPEED
    public playerNumber : number
    public playerMatter: PixiMatter.MatterBody

    public constructor(playerNumber : number) {
        this.playerNumber = playerNumber
        this.id = "P" + playerNumber
    }
}