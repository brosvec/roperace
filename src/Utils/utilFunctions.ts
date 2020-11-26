import * as ECS from '../../libs/pixi-ecs';

export class UtilFunctions {
    public static getTexturePosition(objectCenterPosition: PIXI.ObservablePoint, height: number, width: number): ECS.Vector {
        return new ECS.Vector(objectCenterPosition.x - (width / 2), objectCenterPosition.y - (height / 2))
    }
    public static pairLabelStartsWithString(pair : any, wantedLabel: string): boolean {
        let labelA: string = pair.bodyA.label
        let labelB: string = pair.bodyB.label
        let result = (labelA.substring(0, wantedLabel.length) == wantedLabel || labelB.substring(0, wantedLabel.length) == wantedLabel)
        return result
    }
    public static pairGetStartsWithString(pair : any, startLabel: string): any {
        let labelA: string = pair.bodyA.label
        let labelB: string = pair.bodyB.label
        let result = (labelA.substring(0, startLabel.length) == startLabel) ? pair.bodyA : pair.bodyB
        return result
    }
    public static pairContainsLabel(pair :any, wantedLabel :string): boolean {
        return (pair.bodyA.label == wantedLabel || pair.bodyB.label == wantedLabel)
    }
    public static pairGetSecondPoint(pair : any, knownLabel :string) {
        return (pair.bodyA.label == knownLabel) ? pair.bodyB : pair.bodyA
    }
}