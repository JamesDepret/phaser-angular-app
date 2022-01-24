/**
	 * 
	 * @param charName Characters name, used in the animations as well
	 * @param x x-location on map
	 * @param y y-location on map
	 * @returns animatable character with callable animations for: 
	 * 
	 * charname + 
	 * - "-look-down", 
	 * - "-look-left", 
	 * - "-look-right", 
	 * - "-look-up"
	 */
const createCharacter = (scene: Phaser.Scene, charName:string, x: number, y: number): Phaser.Physics.Arcade.Sprite =>{
    const character = scene.physics.add.sprite(x , y, charName, charName +'-standing1.png');
    createCharAnimation(scene,charName);
    character.anims.play(charName + '-look-down')
    return character;
};

// todo: update sprite texture file to use same names as the animations: so all using "look" instead of "standing"
const createCharAnimation = (scene: Phaser.Scene, charName: string) => {
    createAnimation(scene,charName, charName + '-look-down');
    createAnimation(scene,charName, charName + '-look-left');
    createAnimation(scene,charName, charName + '-look-right');
    createAnimation(scene,charName, charName + '-look-up');
};

const createAnimation = (scene: Phaser.Scene, charname: string, key: string) =>{
    scene.anims.create({
        key: key,
        frames: scene.anims.generateFrameNames(charname, { start: 1, end: 2, prefix: key, suffix:'.png'}),
        repeat: -1,
        frameRate: 4
    });
};

export {
    createCharacter
}