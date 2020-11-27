import {Obstacles}from "../utils/constants";
export class Obstacle {
    public damage : number

    public static getObstacleDamage(obstacle_type : Obstacles) : number{
        switch (obstacle_type) {
            case Obstacles.OBSTACLE_WALL:
                return 0.10
            default:
                break;
        }
    }

}