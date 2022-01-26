import { Component } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './scenes/main_scene';
import Preloader from './scenes/preloader';

@Component({
  selector: 'app-game',
  template: '',
  styles: ['']
})
export class GameComponent {
  //Game and frame size setup

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 32 * 20,
      width: 32 * 16,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        }
      },
      scene: [ Preloader, MainScene ],
      scale: {
        zoom: 1.4
      }
    };
    
    this.phaserGame = new Phaser.Game(this.config);
  }
}
