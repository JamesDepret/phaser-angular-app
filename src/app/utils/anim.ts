
	const createAnimation = (scene: Phaser.Scene,name: string, start: number, end: number, pngName?: string) => {
        if(pngName != null) pngName = name;
		scene.anims.create({
			key: name,
			frames: scene.anims.generateFrameNames(name, { start: start, end: end, prefix: name, suffix:'.png'}),
			repeat: -1,
			frameRate: 4
		});
	}