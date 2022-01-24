
const createAnimation = (scene: Phaser.Scene, name: string,  prefix: string, start: number, end: number) => {
    scene.anims.create({
        key: name,
        frames: scene.anims.generateFrameNames(name, { start: start, end: end, prefix: name + prefix, suffix:'.png'}),
        repeat: -1,
        frameRate: 4
    });
}

    
export {
    createAnimation
};