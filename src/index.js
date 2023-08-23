import Phaser from 'phaser';
import dudeImg from './assets/dude.png';
import skyImg from './assets/sky.png';
import heartImg from './assets/heart.png';
import swordSnd from './assets/sword.wav';
import cutImg from './assets/cut.png';
import sendImg from './assets/send.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.player = null;
        this.player2 = null;
        this.cursors = null;
        this.lastTime = -100000000;
        this.numHeart = 0;
        this.interval = 5 * 1000;
        this.minInterval = 1500;
        this.hearts = null;
        this.gameOver = false;
        this.score = 0;
        this.scoreText = null;
        this.level = 1;
    }

    preload ()
    {
        this.load.image('sky', skyImg);
        this.load.image('heart', heartImg);
        this.load.image('cut', cutImg);
        this.load.image('send', sendImg);
        this.load.spritesheet('dude', dudeImg, { frameWidth: 32, frameHeight: 48 });
        this.load.audio('sword', swordSnd)
    }
      
    create ()
    {
        this.add.image(400, 300, 'sky');

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player = this.physics.add.sprite(20, 450, 'cut');
        this.player.setScale(0.5);
        this.player2 = this.physics.add.sprite(800, 450, 'send');
        this.player2.setScale(0.5);

        this.hearts = this.physics.add.group();

        this.physics.add.overlap(this.player, this.hearts, this.hitHeart, null, this);

        this.sword = this.sound.add('sword');

        this.scoreText = this.add.text(16, 16, 'Score: 0 Level: 1', { fontSize: '32px', fill: '#000' });

    }

    update (time, delta)
    {
        if (this.gameOver) {
            return;
        }

        if (this.lastTime) {
            if (time - this.lastTime > this.interval) {
                // console.log(time);
                const height = Phaser.Math.FloatBetween(50, 550);
                this.player2.setY(height);
                const heart = this.hearts.create(750, height, 'heart')
                heart.setScale(0.05);
                heart.setVelocity(-100,0)
                heart.setCollideWorldBounds(true);
                heart.body.onWorldBounds = true;
                heart.body.world.on('worldbounds', function(body) {
                    // Checks if it's the sprite that you'listening for
                    if (body.gameObject === this) {
                      // Make the enemy sprite unactived & make it disappear
                      this.setActive(false);
                      this.setVisible(false);
                      console.log('hitwall')
                      this.physics.pause();
                      this.gameOver = true;
                    }
                  }, heart);
                this.lastTime = time;
            }
        } else {
            this.lastTime = time;
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-200);
    
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(200);
    
            // player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityY(0);
    
            // player.anims.play('turn');
        }

        var pointer = this.input.activePointer;
        if (pointer.isDown) {
            if (pointer.y < 300) {
                this.player.setVelocityY(-200);
            } else {
                this.player.setVelocityY(200);
            }
        }
    
    }

    hitHeart (player, heart)
    {
        heart.destroy();
        // heart.setActive(false);
        // heart.setVisible(false);
        // heart.setVelocityX(0);
        this.sword.play()
        this.numHeart += 1;
        if (this.numHeart >= 3) {
            this.numHeart = 0;
            this.interval -= (this.interval - this.minInterval) / 2;
            this.level += 1;
        }
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score + ' Level: ' + this.level);

        console.log('hitplayer')
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
