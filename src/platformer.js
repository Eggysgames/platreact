/* global Phaser */

import { useEffect, useRef, useState } from 'react';
import { Game as PhaserGame, Scene } from "phaser";

export default function Game() {
    const parent = useRef(null);
    const [Game, setGame] = useState(null);
    let controls = useRef(null);

    
    let jumpForce = -500
    

    useEffect(() => {
      if (!parent.current) return;


      
      ///Main Menu
      class FirstScene extends Scene {

        constructor() {
          super({ key: 'FirstScene' });
        }
      
      preload() {}

      create() {

        this.add.text(400, 150, 'Main Menu', { fontFamily: 'Arial', fontSize: '44px', fill: '#000' });
        const button = this.add.rectangle(500, 400, 130, 50, 0xff6699);
        button.setInteractive();
    
        const buttonText = this.add.text(500, 400, 'Play Game', { fontFamily: 'Arial', fontSize: '24px', fill: '#000' });
        buttonText.setOrigin(0.5);
    
        buttonText.setPosition(button.x, button.y);

        button.on('pointerdown', () => {
          this.scene.start('SecondScene');
        });
    }

      update(){}

    }

      //Main Game
      class SecondScene extends Scene {

        constructor() {
          super({ key: 'SecondScene' });
        }

      preload() {
        this.load.image("background", "/background.png");

        this.load.spritesheet('WalkPlayer', '/walk.png', {
          frameWidth: 63, 
          frameHeight: 99, 
        });
        this.load.spritesheet('IdlePlayer', '/idle.png', {
          frameWidth: 38, 
          frameHeight: 67, 
        });
    }
    
    create() {
      

      var sceneWidth = this.sys.game.config.width;
      var sceneHeight = this.sys.game.config.height;
      controls = this.input.keyboard.createCursorKeys();

      this.add.image(sceneWidth/2, sceneHeight/2, "background");

      this.player = this.physics.add.sprite(100, 695, 'WalkPlayer');
      this.player.setScale(1);

      // Animation configuration
      this.anims.create({
          key: 'Walk', 
          frames: this.anims.generateFrameNumbers('WalkPlayer', { start: 0, end: 11 }),
          frameRate: 28,
          repeat: -1
      });

      this.anims.create({
        key: 'Idle', 
        frames: this.anims.generateFrameNumbers('IdlePlayer', { start: 0, end: 18 }), // Adjust frame numbers as needed
        frameRate: 10, // Adjust frame rate as needed
        repeat: -1
    });

    //this.physics.world.createDebugGraphic();

    
    this.player.setSize(32, 32);

      this.player.anims.play('Idle')

      this.physics.world.setBounds(0, 0, sceneWidth, sceneHeight);
      this.player.setCollideWorldBounds(true);
    
    }
      
    update() {
      // Check keyboard input
      if (controls.left.isDown) {
          this.player.flipX = true;
          this.player.x -= 5;
          this.player.anims.play('Walk', true); // Start Walk animation
          this.player.setScale(0.7)
          this.player.setSize(40, 88);
          
      } else if (controls.right.isDown) {
          this.player.flipX = false;
          this.player.x += 5;
          this.player.anims.play('Walk', true); // Start Walk animation
          this.player.setScale(0.7)
          this.player.setSize(40, 88);
          
      } else {
          // If no keys are pressed, play Idle animation
          this.player.anims.play('Idle', true);
          this.player.setScale(1)
          this.player.setSize(32, 68);
          
      }
  
      // Wrap player position if it goes beyond screen bounds
      if (this.player.x > 1070) {
          this.player.x = -50;
      }
      if (this.player.x < -50) {
          this.player.x = 1020;
      }
      if (controls.up.isDown && this.player.y >650) {
        console.log("Jump")
        this.player.setVelocityY(jumpForce);
      }

      if (this.player.y > 700) {
        this.player.y = 700;
      }

      }
    }
        
        const config = {
          type: Phaser.AUTO,
          width: 1000,
          height: 700,
          //autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: parent.current,
          backgroundColor : "2EE0EF",
          scene: [FirstScene, SecondScene],
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 1500 }, 
              debug: false 
            }
          }
        };

        const Game = new PhaserGame(config);
        setGame(Game);

        // Cleanup function
        return () => {
            // Destroy the Phaser game instance when the component unmounts
            if (Game) 
            setGame(null)
              Game.destroy(true);
              console.log("🐲 Game destroyed 🐲");
            };
    }, []);

    return (
      <div className="">
          <div ref={parent} className="gameContainer" />
      </div>
      
  );
}
