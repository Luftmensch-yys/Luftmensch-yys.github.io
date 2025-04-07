const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小为窗口大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 加载背景图片
const backgroundImage = new Image();
backgroundImage.src = '背景.webp'; // 替换为你的背景图片路径
backgroundImage.onload = () => {
    console.log('背景图片加载成功！');
};
backgroundImage.onerror = () => {
    console.error('背景图片加载失败，请检查路径！');
};

// 加载敌人图片
const enemyImage = new Image();
enemyImage.src = '鬼子.webp'; // 替换为你的敌人图片路径
enemyImage.onload = () => {
    console.log('敌人图片加载成功！');
};
enemyImage.onerror = () => {
    console.error('敌人图片加载失败，请检查路径！');
};

// 获取音效元素
const attackSound = document.getElementById('attackSound');
const backgroundClickSound = document.getElementById('backgroundClickSound');

// 游戏界面元素
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const hitsDisplay = document.getElementById('hitsDisplay');

// 敌人数组
let enemies = [];

// 游戏状态
let isGameRunning = false;

// 击中计数器
let hits = 0;

// 目标击中数量
const targetHits = 6;

// 初始化敌人
function initializeEnemies() {
    enemies = [
        { x: 50, y: 50, speedX: 1, speedY: 1 },
        { x: 200, y: 50, speedX: -1, speedY: 1 },
        { x: 350, y: 200, speedX: 1, speedY: -1 },
        { x: 500, y: 350, speedX: -1, speedY: -1 },
        { x: 700, y: 50, speedX: 2, speedY: 0 },
        { x: 850, y: 200, speedX: 0, speedY: 2 }
    ];
    console.log('初始化敌人数量:', enemies.length);
}

// 绘制背景
function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        console.log('背景图片尚未加载完成...');
    }
}

// 绘制敌人
function drawEnemies() {
    if (!enemyImage.complete) {
        console.log('敌人图片尚未加载完成...');
        return;
    }

    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, 100, 100); // 敌人大小为 100x100
    });
}

// 更新敌人位置
function updateEnemies() {
    enemies.forEach((enemy) => {
        enemy.x += enemy.speedX || 0; // 默认速度为 0
        enemy.y += enemy.speedY || 0; // 默认速度为 0

        if (enemy.x <= 0 || enemy.x + 100 >= canvas.width) {
            enemy.speedX *= -1; // 反转 X 方向
        }
        if (enemy.y <= 0 || enemy.y + 100 >= canvas.height) {
            enemy.speedY *= -1; // 反转 Y 方向
        }
    });
}

// 游戏主循环
function gameLoop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateEnemies();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

// 鼠标点击事件
canvas.addEventListener('click', (event) => {
    if (!isGameRunning) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    let clickedEnemy = false;

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyRect = { x: enemy.x, y: enemy.y, width: 100, height: 100 }; // 碰撞检测范围为 100x100

        if (mouseX >= enemyRect.x && mouseX <= enemyRect.x + enemyRect.width &&
            mouseY >= enemyRect.y && mouseY <= enemyRect.y + enemyRect.height) {
            enemies.splice(i, 1); // 移除被击中的敌人
            hits++;

            if (attackSound) {
                attackSound.currentTime = 0;
                attackSound.play().catch((err) => {
                    console.error('音效播放失败:', err);
                });
            }

            console.log(`击中敌人！当前击中次数：${hits}`);

            if (hits >= targetHits) {
                isGameRunning = false;
                endScreen.classList.remove('hidden');
                console.log('游戏结束，显示结束界面！');
            }

            clickedEnemy = true;
            break;
        }
    }

    if (!clickedEnemy) {
        // 点击空白处
        if (backgroundClickSound) {
            backgroundClickSound.currentTime = 0;
            backgroundClickSound.play().catch((err) => {
                console.error('音效播放失败:', err);
            });
        }

        console.log('点击了空白处！');
    }
});

// 启动游戏
function startGame() {
    startScreen.classList.add('hidden');
    isGameRunning = true;
    hits = 0;

    initializeEnemies();
    gameLoop();
}

// 绑定事件
startScreen.addEventListener('click', (event) => {
    if (event.target.id === 'startButton') {
        startGame(); // 只有点击“开始”按钮时才启动游戏
    }
});

// 监听窗口大小变化
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 清空画布并重新绘制背景
    drawBackground();
    drawEnemies();
});

// 初始化游戏
checkImagesLoaded();

// 检查图片是否加载完成
function checkImagesLoaded() {
    if (backgroundImage.complete && enemyImage.complete) {
        console.log('所有图片加载完成！');
    } else {
        setTimeout(checkImagesLoaded, 100);
    }
}