// Importamos Phaser
import Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {

    // Sprite del jugador (la nave)
    player!: Phaser.Physics.Arcade.Sprite;

    // Controles del teclado
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey!: Phaser.Input.Keyboard.Key;

    // Teclas pausa/reanudar
    pauseKey!: Phaser.Input.Keyboard.Key;
    resumeKey!: Phaser.Input.Keyboard.Key;

    // Grupos
    bullets!: Phaser.Physics.Arcade.Group;
    asteroids!: Phaser.Physics.Arcade.Group;

    // Puntuación
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;

    highScore: number = 0;
    highScoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('PlayScene');
    }

    preload(): void {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('asteroid', 'assets/sprites/asteroid.png');
    }

    create(): void {

        //-------------------------------------
        // CREAR NAVE
        //-------------------------------------
        this.player = this.physics.add.sprite(
            this.scale.width / 2,
            this.scale.height - 100,
            'player'
        );
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);

        //-------------------------------------
        // CAPTURAR TECLAS
        //-------------------------------------
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.resumeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //-------------------------------------
        // GRUPOS
        //-------------------------------------
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.asteroids = this.physics.add.group({
            defaultKey: 'asteroid',
            maxSize: 20
        });

        //-------------------------------------
        // CREAR ASTEROIDES CADA 2 SEGUNDOS
        //-------------------------------------
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        //-------------------------------------
        // COLISIONES
        //-------------------------------------
        this.physics.add.overlap(
            this.bullets,
            this.asteroids,
            this.bulletHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.asteroids,
            this.playerHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        //-------------------------------------
        // TEXTO DE PUNTOS
        //-------------------------------------
        this.scoreText = this.add.text(
            this.scale.width / 2,
            20,
            'Puntos: 0',
            { fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5, 0);

        const savedHighScore = localStorage.getItem('highScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;

        this.highScoreText = this.add.text(
            this.scale.width / 2,
            50,
            'Record: ' + this.highScore,
            { fontSize: '20px', color: '#ffff00' }
        ).setOrigin(0.5, 0);
    }

    override update(): void {

        //-------------------------------------
        // MOVIMIENTO DE LA NAVE
        //-------------------------------------
        if (this.cursors.left!.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right!.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        //-------------------------------------
        // DISPARO
        //-------------------------------------
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
            this.shootBullet();
        }

        //-------------------------------------
        // LIMPIAR BALAS FUERA DE PANTALLA
        //-------------------------------------
        this.bullets.children.each((b) => {
            const bullet = b as Phaser.Physics.Arcade.Image;
            if (bullet.active && bullet.y < -10) {
                bullet.disableBody(true, true);  // 👈 IMPORTANTE: Desactiva cuerpo y oculta
            }
            return null;
        });

        //-------------------------------------
        // PAUSAR Y REANUDAR
        //-------------------------------------
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey!)) {
            this.physics.pause();
            console.log('Juego pausado');
        }

        if (Phaser.Input.Keyboard.JustDown(this.resumeKey!)) {
            this.physics.resume();
            console.log('Juego reanudado');
        }
    }

    //-------------------------------------
    // MÉTODO: DISPARAR BALA
    //-------------------------------------
    shootBullet(): void {
        const bullet = this.bullets.get(
            this.player.x,
            this.player.y - 20
        ) as Phaser.Physics.Arcade.Image;

        if (bullet) {
            bullet.enableBody(true, this.player.x, this.player.y - 20, true, true); // 👈 IMPORTANTE
            bullet.setActive(true);
            bullet.setVisible(true);
            (bullet.body as Phaser.Physics.Arcade.Body).velocity.y = -400;
            bullet.setScale(0.1);
        }
    }

    //-------------------------------------
    // MÉTODO: CREAR ASTEROIDE
    //-------------------------------------
    spawnAsteroid(): void {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const asteroid = this.asteroids.get(x, -50) as Phaser.Physics.Arcade.Image;

        if (asteroid) {
            asteroid.enableBody(true, x, -50, true, true);
            asteroid.setVelocityY(100);
            asteroid.setScale(0.2);
        }
    }

    //-------------------------------------
    // MÉTODO: COLISIÓN BALA VS ASTEROIDE
    //-------------------------------------
    bulletHitsAsteroid(
        bulletObj: Phaser.GameObjects.GameObject,
        asteroidObj: Phaser.GameObjects.GameObject
    ) {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        bullet.disableBody(true, true);   // 👈 PARA QUE NO SE QUEDE ESTÁTICA
        asteroid.disableBody(true, true);

        this.score += 1;
        this.scoreText.setText('Puntos: ' + this.score);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText('Record: ' + this.highScore);
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    //-------------------------------------
    // MÉTODO: COLISIÓN NAVE VS ASTEROIDE
    //-------------------------------------
    playerHitsAsteroid(
        playerObj: Phaser.GameObjects.GameObject,
        asteroidObj: Phaser.GameObjects.GameObject
    ) {
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        this.physics.pause();
        this.player.setTint(0xff0000);
        asteroid.setTint(0xff0000);

        this.scoreText.setText('¡Perdiste! Puntos: ' + this.score);

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', {
                score: this.score,
                highScore: this.highScore
            });
        });
    }
}
