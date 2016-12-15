import PIXI from 'pixi.js';
import Game from './game';

class GameView {
  constructor (game, renderer) {
    this.game = game;
    this.renderer = renderer;
  }



  start () {

    let loader = PIXI.loader;

    let textures = [
      'assets/sprites/cultist/movement/down0.png',
      'assets/sprites/cultist/movement/down1.png',
      'assets/sprites/cultist/movement/down_right0.png',
      'assets/sprites/cultist/movement/down_right1.png',
      'assets/sprites/cultist/movement/right0.png',
      'assets/sprites/cultist/movement/right1.png',
      'assets/sprites/cultist/movement/up_right0.png',
      'assets/sprites/cultist/movement/up_right1.png',
      'assets/sprites/cultist/movement/up0.png',
      'assets/sprites/cultist/movement/up1.png',
      'assets/sprites/cultist/movement/up_left0.png',
      'assets/sprites/cultist/movement/up_left1.png',
      'assets/sprites/cultist/movement/left0.png',
      'assets/sprites/cultist/movement/left1.png',
      'assets/sprites/cultist/movement/down_left0.png',
      'assets/sprites/cultist/movement/down_left1.png',
      'assets/sprites/cultist/attack/down0.png',
      'assets/sprites/cultist/attack/down1.png',
      'assets/sprites/cultist/attack/down2.png',
      'assets/sprites/cultist/attack/down3.png',
      'assets/sprites/cultist/attack/down_right0.png',
      'assets/sprites/cultist/attack/down_right1.png',
      'assets/sprites/cultist/attack/down_right2.png',
      'assets/sprites/cultist/attack/down_right3.png',
      'assets/sprites/cultist/attack/right0.png',
      'assets/sprites/cultist/attack/right1.png',
      'assets/sprites/cultist/attack/right2.png',
      'assets/sprites/cultist/attack/right3.png',
      'assets/sprites/cultist/attack/up_right0.png',
      'assets/sprites/cultist/attack/up_right1.png',
      'assets/sprites/cultist/attack/up_right2.png',
      'assets/sprites/cultist/attack/up_right3.png',
      'assets/sprites/cultist/attack/up0.png',
      'assets/sprites/cultist/attack/up1.png',
      'assets/sprites/cultist/attack/up2.png',
      'assets/sprites/cultist/attack/up3.png',
      'assets/sprites/cultist/attack/up_left0.png',
      'assets/sprites/cultist/attack/up_left1.png',
      'assets/sprites/cultist/attack/up_left2.png',
      'assets/sprites/cultist/attack/up_left3.png',
      'assets/sprites/cultist/attack/left0.png',
      'assets/sprites/cultist/attack/left1.png',
      'assets/sprites/cultist/attack/left2.png',
      'assets/sprites/cultist/attack/left3.png',
      'assets/sprites/cultist/attack/down_left0.png',
      'assets/sprites/cultist/attack/down_left1.png',
      'assets/sprites/cultist/attack/down_left2.png',
      'assets/sprites/cultist/attack/down_left3.png',
      'assets/sprites/dynamo/1.png',
      'assets/sprites/dynamo/2.png',
      'assets/sprites/dynamo/3.png',
      'assets/sprites/dynamo/4.png',
      'assets/sprites/dynamo/5.png',
      'assets/sprites/dynamo/6.png',
      'assets/sprites/dynamo/7.png',
      'assets/sprites/dynamo/8.png',
      'assets/sprites/dynamo/firing/1.png',
      'assets/sprites/dynamo/firing/2.png',
      'assets/sprites/dynamo/firing/3.png',
      'assets/sprites/dynamo/firing/4.png',
      'assets/sprites/dynamo/firing/5.png',
      'assets/sprites/dynamo/firing/6.png',
      'assets/sprites/dynamo/firing/7.png',
      'assets/sprites/dynamo/firing/8.png',
      'assets/sprites/lightning_sprites/lightning_sprite_0.png',
      'assets/sprites/lightning_sprites/lightning_sprite_1.png',
      'assets/sprites/lightning_sprites/lightning_sprite_2.png',
      'assets/sprites/lightning_sprites/lightning_sprite_3.png',
      'assets/sprites/lightning_sprites/lightning_sprite_4.png',
      'assets/sprites/forward.png',
      'assets/sprites/weapons/player_bullet.png',
      'assets/sprites/default_button.png',
      'assets/sprites/walls/wall_corner_a.png',
      'assets/sprites/walls/wall_corner_b.png',
      'assets/sprites/walls/wall_corner_c.png',
      'assets/sprites/walls/wall_segment_a.png',
      'assets/sprites/walls/wall_segment_b.png',
      'assets/sprites/walls/wall_segment_c.png',
      'assets/sprites/walls/blank_wall.png',
      'assets/sprites/floors/floor_tile_a_beam.png',
      'assets/sprites/floors/floor_tile_a_blank.png',
      'assets/sprites/floors/floor_tile_a_circle.png',
      'assets/backgrounds/blank_background.png',
      'assets/backgrounds/starting_room_background.png',
      'assets/backgrounds/second_room_background.png',
      'assets/backgrounds/third_room_background.png',
      'assets/backgrounds/fifth_room_background.png',
      'assets/backgrounds/elevator_1_background.png',
      'assets/sprites/items/basic_health_pack.png',
      'assets/sprites/items/special_pack.png',
      'assets/sprites/murk.png',
      'assets/sprites/roland/movement/down0.png',
      'assets/sprites/roland/movement/down1.png',
      'assets/sprites/roland/movement/down_right0.png',
      'assets/sprites/roland/movement/down_right1.png',
      'assets/sprites/roland/movement/right0.png',
      'assets/sprites/roland/movement/right1.png',
      'assets/sprites/roland/movement/up0.png',
      'assets/sprites/roland/movement/up1.png',
      'assets/sprites/roland/movement/up0.png',
      'assets/sprites/roland/movement/up1.png',
      'assets/sprites/roland/movement/up0.png',
      'assets/sprites/roland/movement/up1.png',
      'assets/sprites/roland/movement/left0.png',
      'assets/sprites/roland/movement/left1.png',
      'assets/sprites/roland/movement/down_left0.png',
      'assets/sprites/roland/movement/down_left1.png',
      'assets/sprites/roland/primary_attack/down0.png',
      'assets/sprites/roland/primary_attack/down1.png',
      'assets/sprites/roland/primary_attack/down_right0.png',
      'assets/sprites/roland/primary_attack/down_right1.png',
      'assets/sprites/roland/primary_attack/right0.png',
      'assets/sprites/roland/primary_attack/right1.png',
      'assets/sprites/roland/primary_attack/up0.png',
      'assets/sprites/roland/primary_attack/up1.png',
      'assets/sprites/roland/primary_attack/up0.png',
      'assets/sprites/roland/primary_attack/up1.png',
      'assets/sprites/roland/primary_attack/up0.png',
      'assets/sprites/roland/primary_attack/up1.png',
      'assets/sprites/roland/primary_attack/left0.png',
      'assets/sprites/roland/primary_attack/left1.png',
      'assets/sprites/roland/primary_attack/down_left0.png',
      'assets/sprites/roland/primary_attack/down_left1.png',
      'assets/sprites/roland/secondary_attack/0.png',
      'assets/sprites/roland/secondary_attack/1.png',
      'assets/sprites/roland/secondary_attack/2.png',
      'assets/sprites/roland/secondary_attack/3.png',
      'assets/sprites/roland/secondary_attack/4.png',
      'assets/sprites/roland/secondary_attack/5.png',
      'assets/sprites/roland/secondary_attack/6.png',
      'assets/sprites/weapons/roland_special_bullet/0.png',
      'assets/sprites/weapons/roland_special_bullet/1.png',
      'assets/sprites/weapons/roland_special_bullet/2.png',
      'assets/sprites/weapons/roland_special_bullet/crosshairs.png',
      'assets/sprites/doors/large_door/0.png',
      'assets/sprites/doors/large_door/1.png'
    ];

    let textureNames = [
      'cultist_down0',
      'cultist_down1',
      'cultist_down_right0',
      'cultist_down_right1',
      'cultist_right0',
      'cultist_right1',
      'cultist_up_right0',
      'cultist_up_right1',
      'cultist_up0',
      'cultist_up1',
      'cultist_up_left0',
      'cultist_up_left1',
      'cultist_left0',
      'cultist_left1',
      'cultist_down_left0',
      'cultist_down_left1',
      'cultist_attack_down0',
      'cultist_attack_down1',
      'cultist_attack_down2',
      'cultist_attack_down3',
      'cultist_attack_down_right0',
      'cultist_attack_down_right1',
      'cultist_attack_down_right2',
      'cultist_attack_down_right3',
      'cultist_attack_right0',
      'cultist_attack_right1',
      'cultist_attack_right2',
      'cultist_attack_right3',
      'cultist_attack_up_right0',
      'cultist_attack_up_right1',
      'cultist_attack_up_right2',
      'cultist_attack_up_right3',
      'cultist_attack_up0',
      'cultist_attack_up1',
      'cultist_attack_up2',
      'cultist_attack_up3',
      'cultist_attack_up_left0',
      'cultist_attack_up_left1',
      'cultist_attack_up_left2',
      'cultist_attack_up_left3',
      'cultist_attack_left0',
      'cultist_attack_left1',
      'cultist_attack_left2',
      'cultist_attack_left3',
      'cultist_attack_down_left0',
      'cultist_attack_down_left1',
      'cultist_attack_down_left2',
      'cultist_attack_down_left3',
      'dynamo_down',
      'dynamo_down_right',
      'dynamo_right',
      'dynamo_up_right',
      'dynamo_up',
      'dynamo_up_left',
      'dynamo_left',
      'dynamo_down_left',
      'dynamo_firing_down',
      'dynamo_firing_down_right',
      'dynamo_firing_right',
      'dynamo_firing_up_right',
      'dynamo_firing_up',
      'dynamo_firing_up_left',
      'dynamo_firing_left',
      'dynamo_firing_down_left',
      'lightning_warning',
      'lightning_blank',
      'lightning1',
      'lightning2',
      'lightning3',
      'player',
      'player_bullet',
      'default_button',
      'wall_corner_a',
      'wall_corner_b',
      'wall_corner_c',
      'wall_segment_a',
      'wall_segment_b',
      'wall_segment_c',
      'blank_wall',
      'floor_tile_a_beam',
      'floor_tile_a_blank',
      'floor_tile_a_circle',
      'blank_background',
      'starting_room_background',
      'second_room_background',
      'third_room_background',
      'fifth_room_background',
      'elevator1_background',
      'health_pack',
      'special_pack',
      'murk',
      'roland_down0',
      'roland_down1',
      'roland_down_right0',
      'roland_down_right1',
      'roland_right0',
      'roland_right1',
      'roland_up_right0',
      'roland_up_right1',
      'roland_up0',
      'roland_up1',
      'roland_up_left0',
      'roland_up_left1',
      'roland_left0',
      'roland_left1',
      'roland_down_left0',
      'roland_down_left1',
      'roland_primary_attack_down0',
      'roland_primary_attack_down1',
      'roland_primary_attack_down_right0',
      'roland_primary_attack_down_right1',
      'roland_primary_attack_right0',
      'roland_primary_attack_right1',
      'roland_primary_attack_up_right0',
      'roland_primary_attack_up_right1',
      'roland_primary_attack_up0',
      'roland_primary_attack_up1',
      'roland_primary_attack_up_left0',
      'roland_primary_attack_up_left1',
      'roland_primary_attack_left0',
      'roland_primary_attack_left1',
      'roland_primary_attack_down_left0',
      'roland_primary_attack_down_left1',
      'roland_secondary_attack0',
      'roland_secondary_attack1',
      'roland_secondary_attack2',
      'roland_secondary_attack3',
      'roland_secondary_attack4',
      'roland_secondary_attack5',
      'roland_secondary_attack6',
      'roland_special_bullet0',
      'roland_special_bullet1',
      'roland_special_bullet2',
      'roland_crosshairs',
      'large_door0',
      'large_door1'


    ];

    for (let i = 0; i <= 32; i++) {
      if (i < 10) {
        textures.push('assets/sprites/dynamite/dynamite0' + i + '.png');
      } else {
        textures.push('assets/sprites/dynamite/dynamite' + i + '.png');
      }
      textureNames.push('dynamite' + i)
    }
    for (let i = 0; i < 4; i++) {
      textures.push('assets/sprites/murkspawn/move' + i + '.png');
      textureNames.push('murkspawn_move' + i)
      textures.push('assets/sprites/murkspawn/attack' + i + '.png');
      textureNames.push('murkspawn_attack' + i)
    }


    for (let i = 0; i < textures.length; i++) {
      loader.add(textureNames[i], textures[i]);
    }

    let renderer = this.renderer;
    renderer.backgroundColor = 212121;
    let game = this.game;

    let loadText = new PIXI.Text(
      "Shrouding the city...",
      {font: '32px Arial', fill: '#01d450', align: 'center'}
    );
    [loadText.anchor.x, loadText.anchor.y] = [0.5, 0.5];
    [loadText.x, loadText.y] = [Game.dim_x / 2, Game.dim_y / 2];
    renderer.render(loadText);

    function startGame () {
      let timeDelta = 0
      game.enactSetupSequence();
      function animate () {
        requestAnimationFrame(animate);
        game.doTheThing(timeDelta);
        if (!game.stopped) {
          timeDelta += 1;
        }
      }
      animate();
    }

    loader.once('complete', startGame);

    loader.load();

  }



}

export default GameView;
