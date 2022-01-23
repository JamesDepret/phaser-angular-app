import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './scenes/main_scene';
import Preloader from './scenes/preloader';

import NineSlicePlugin from 'phaser3-nineslice'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 640,
      width: 600,
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
  ngOnInit() {
  }

}
