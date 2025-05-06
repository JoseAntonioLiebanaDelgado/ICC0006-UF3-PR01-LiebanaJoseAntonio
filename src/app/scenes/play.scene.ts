import Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {

    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey!: Phaser.Input.Keyboard.Key;
    pauseKey!: Phaser.Input.Keyboard.Key;
    resumeKey!: Phaser.Input.Keyboard.Key;

    bullets!: Phaser.Physics.Arcade.Group;
    asteroids!: Phaser.Physics.Arcade.Group;

    asteroidTimer!: Phaser.Time.TimerEvent;

    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;

    highScore: number = 0;
    highScoreText!: Phaser.GameObjects.Text;

    pauseText!: Phaser.GameObjects.Text;

    constructor() {
        super('PlayScene');
    }

    preload(): void {
        this.load.image('spaceBackground', 'assets/sprites/spaceBackground.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('asteroid', 'assets/sprites/asteroid.png');
    }

    create(): void {
        // Resetear puntuaciones al comenzar la partida
        this.score = 0;

        const savedHighScore = localStorage.getItem('highScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;

        // Fondo
        this.add.image(0, 0, 'spaceBackground').setOrigin(0, 0);

        // Jugador
        this.player = this.physics.add.sprite(
            this.scale.width / 2,
            this.scale.height - 100,
            'player'
        ).setScale(0.5).setCollideWorldBounds(true);

        // Controles
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.resumeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Grupo de balas
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        // Grupo de asteroides
        this.asteroids = this.physics.add.group({
            defaultKey: 'asteroid',
            maxSize: 20
        });

        // Generar asteroides periódicamente y guardar el evento para poder pausarlo
        this.asteroidTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Colisión balas <-> asteroides
        this.physics.add.overlap(
            this.bullets,
            this.asteroids,
            this.bulletHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Colisión jugador <-> asteroides
        this.physics.add.overlap(
            this.player,
            this.asteroids,
            this.playerHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Texto de puntuación
        this.scoreText = this.add.text(
            this.scale.width / 2, 20,
            'Puntos: 0',
            { fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5, 0);

        this.highScoreText = this.add.text(
            this.scale.width / 2, 50,
            'Record: ' + this.highScore,
            { fontSize: '20px', color: '#ffff00' }
        ).setOrigin(0.5, 0);

        // Texto de pausa (inicialmente invisible)
        this.pauseText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'EN PAUSA',
            { fontSize: '48px', color: '#ff0000', fontStyle: 'bold' }
        ).setOrigin(0.5);
        this.pauseText.setVisible(false);
    }

    override update(): void {
        // Movimiento jugador
        if (this.cursors.left!.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right!.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Disparo
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
            this.shootBullet();
        }

        // Limpiar balas que se salen de la pantalla
        this.bullets.children.each((b) => {
            const bullet = b as Phaser.Physics.Arcade.Image;
            if (bullet.active && bullet.y < -10) {
                bullet.setActive(false).setVisible(false);
            }
            return null;
        });

        // Pausar
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey!)) {
            this.physics.pause();
            this.asteroidTimer.paused = true;
            this.pauseText.setVisible(true);
        }

        // Reanudar
        if (Phaser.Input.Keyboard.JustDown(this.resumeKey!)) {
            this.physics.resume();
            this.asteroidTimer.paused = false;
            this.pauseText.setVisible(false);
        }
    }

    shootBullet(): void {
        const bullet = this.bullets.get(
            this.player.x,
            this.player.y - 20
        ) as Phaser.Physics.Arcade.Image;

        if (bullet) {
            bullet.enableBody(true, this.player.x, this.player.y - 20, true, true);
            bullet.setActive(true).setVisible(true);
            bullet.body && (bullet.body.velocity.y = -400);
            bullet.setScale(0.03);
        }
    }

    spawnAsteroid(): void {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const asteroid = this.asteroids.get(x, -50) as Phaser.Physics.Arcade.Image;

        if (asteroid) {
            asteroid.setActive(true).setVisible(true);
            asteroid.setVelocityY(100);
            asteroid.setScale(0.5);
        }
    }

    bulletHitsAsteroid(bulletObj: Phaser.GameObjects.GameObject, asteroidObj: Phaser.GameObjects.GameObject) {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        bullet.disableBody(true, true);
        asteroid.disableBody(true, true);

        this.score += 1;
        this.scoreText.setText('Puntos: ' + this.score);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText('Record: ' + this.highScore);
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    playerHitsAsteroid(playerObj: Phaser.GameObjects.GameObject, asteroidObj: Phaser.GameObjects.GameObject) {
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        this.physics.pause();
        this.asteroidTimer.paused = true;
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
