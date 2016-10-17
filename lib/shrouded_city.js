import GameView from './game_view';
import Game from './game';
import PIXI from 'pixi.js';


let renderer = PIXI.autoDetectRenderer(Game.dim_x, Game.dim_y,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);


let game = new Game(renderer);

new GameView(game, renderer).start();
