// Importamos Phaser
import Phaser from 'phaser';

// Creamos una clase que extiende de Phaser.Scene
export class PlayScene extends Phaser.Scene {

    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey!: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;
    asteroids!: Phaser.Physics.Arcade.Group;

    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('PlayScene');
    }

    preload(): void {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('asteroid', 'assets/sprites/asteroid.png');
    }

    create(): void {

        // CREAR NAVE
        this.player = this.physics.add.sprite(
            this.scale.width / 2,
            this.scale.height - 100,
            'player'
        );
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);

        // CAPTURAR TECLAS
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.keyboard!.removeAllListeners();
        this.input.keyboard!.enabled = true;

        // GRUPO DE BALAS
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        // GRUPO DE ASTEROIDES
        this.asteroids = this.physics.add.group({
            defaultKey: 'asteroid',
            maxSize: 20
        });

        // CREAR ASTEROIDES CADA 2 SEGUNDOS
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // COLISIONES BALAS VS ASTEROIDES
        this.physics.add.overlap(
            this.bullets,
            this.asteroids,
            this.bulletHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // COLISIÓN JUGADOR VS ASTEROIDES
        this.physics.add.overlap(
            this.player,
            this.asteroids,
            this.playerHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // TEXTO DE PUNTOS
        this.scoreText = this.add.text(
            this.scale.width / 2,
            20,
            'Puntos: 0',
            { fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5, 0);
    }

    override update(): void {

        // MOVIMIENTO DE LA NAVE
        if (this.cursors.left!.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right!.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // DISPARO
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
            this.shootBullet();
        }

        // LIMPIAR BALAS FUERA DE PANTALLA
        this.bullets.children.each((b) => {
            const bullet = b as Phaser.Physics.Arcade.Image;
            if (bullet.active && bullet.y < -10) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
            return null;
        });

    }

    shootBullet(): void {
        const bullet = this.bullets.get(
            this.player.x,
            this.player.y - 20
        ) as Phaser.Physics.Arcade.Image;

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body && (bullet.body.velocity.y = -400);
            bullet.setScale(0.1);
        }
    }

    spawnAsteroid(): void {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const asteroid = this.asteroids.get(x, -50) as Phaser.Physics.Arcade.Image;

        if (asteroid) {
            asteroid.setActive(true);
            asteroid.setVisible(true);
            asteroid.setVelocityY(100);
            asteroid.setScale(0.2);
        }
    }

    bulletHitsAsteroid(
        bulletObj: Phaser.GameObjects.GameObject,
        asteroidObj: Phaser.GameObjects.GameObject
    ) {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        // 👇 Muy importante: asegurarse que ambos están activos
        if (!bullet.active || !asteroid.active) {
            return;
        }

        bullet.setActive(false);
        bullet.setVisible(false);

        asteroid.setActive(false);
        asteroid.setVisible(false);

        // SUMAR SOLO 1 PUNTO
        this.score += 1;
        this.scoreText.setText('Puntos: ' + this.score);
    }

    playerHitsAsteroid(
        playerObj: Phaser.GameObjects.GameObject,
        asteroidObj: Phaser.GameObjects.GameObject
    ) {
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

        this.physics.pause();
        this.player.setTint(0xff0000);
        asteroid.setTint(0xff0000);

        this.scoreText.setText('¡Perdiste! Puntos: ' + this.score);
    }
}
