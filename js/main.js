document.addEventListener('DOMContentLoaded', function() {
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    const loadingScreen = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    
    // 预加载图片
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    function preloadImage(img) {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    showMainContent();
                }
            });
        }
    }
    
    images.forEach(preloadImage);
    
    // 将等待时间从3秒改为1秒
    setTimeout(showMainContent, 1000);
    
    function showMainContent() {
        if (!mainContent.classList.contains('visible')) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                changeText();
            }, 500);
        }
    }

    // 设置面板控
    const settingsBtn = document.querySelector('.social-link.settings');
    const settingsPanel = document.querySelector('.settings-panel');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.querySelector('.opacity-value');
    const profileCard = document.querySelector('.profile-card');
    const closeBtn = document.querySelector('.close-btn');

    // 切换设置面板
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsPanel.classList.remove('hidden');
        settingsPanel.classList.add('active');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
    });

    // 调整透明度
    opacitySlider.addEventListener('input', function() {
        const value = this.value;
        opacityValue.textContent = `${value}%`;
        profileCard.style.backgroundColor = `rgba(255, 255, 255, ${value / 100})`;
    });

    // 初始化透明度
    profileCard.style.backgroundColor = `rgba(255, 255, 255, 0.6)`;

    // 点击外部关闭设置面板
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });

    // 阻止设置面板内部点击事件冒泡
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 状态点控制
    const statusDot = document.querySelector('.status-dot');
    
    // 初始状态设置
    if (document.hasFocus()) {
        statusDot.classList.add('active');
    }

    // 窗口焦点控制
    window.addEventListener('focus', function() {
        statusDot.classList.add('active');
    });
    
    window.addEventListener('blur', function() {
        statusDot.classList.remove('active');
    });

    // 添加悬浮提示
    const tooltips = {
        'blog': '访问我的博客',
        'github': '查看我的开源项目',
        'qq': '联系我吧',
        'email': '给我发送邮件',
        'settings': '个性化设置'
    };

    // 创建提示框函数
    function showMessage(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: slideDown 0.3s ease forwards;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 创建提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // 为社交链接添加悬停效果
    const socialLinks = document.querySelectorAll('.social-links .social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const type = link.classList[1];
            tooltip.textContent = tooltips[type];
            tooltip.style.opacity = '1';
            
            // 计算位置
            const rect = link.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
        });

        link.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // 打字机效果
    const stringArray = [
        "欢迎来到我的主页",
        "Welcome to my homepage",
        "一个热爱生活的人",
        "联系我吧",
        "A person who loves life"
    ];
    let switch_box = document.getElementById('switch-box');
    let index = 0;
    let charIndex = 0;
    let isDelete = false;
    let defaultDelay = 120;  // 稍微加快速度
    let waitDelay = 2500;    // 增加停留时间
    let delay = defaultDelay;

    let changeText = () => {
        const randomDelay = Math.random() * 50;
        delay = defaultDelay + randomDelay;

        // 一个字一个字地显示
        if (charIndex <= stringArray[index].length) {
            switch_box.textContent = stringArray[index].substring(0, charIndex);
            // 每个字都创建烟花效果
            if (charIndex > 0 && !isDelete) {
                createFirework(switch_box, true);
            }
        }

        if (!isDelete) {
            charIndex++;
            if (charIndex > stringArray[index].length) {
                isDelete = true;
                delay = waitDelay;
                createFirework(switch_box, false);
            }
        } else {
            charIndex--;
            if (charIndex < 1) {
                isDelete = false;
                index++;
                if (index >= stringArray.length) {
                    index = 0;
                }
                delay = defaultDelay;
                createFirework(switch_box, false);
            }
        }
        setTimeout(changeText, delay);
    }

    // 创建烟花效果
    function createFirework(element, isDelete) {
        const rect = element.getBoundingClientRect();
        const firework = document.createElement('div');
        firework.className = 'firework';
        const randomOffset = (Math.random() - 0.5) * 150;
        firework.style.left = `${rect.left + rect.width/2 + randomOffset}px`;
        firework.style.top = `${rect.top + rect.height/2}px`;
        
        const particleCount = isDelete ? 40 : 20;
        const colors = [
            '#FFD700', // 金色
            '#FF69B4', // 粉红
            '#00FFFF', // 青色
            '#FF1493', // 深粉红
            '#FFA500', // 橙色
            '#9400D3', // 紫色
            '#00FF7F', // 春绿
            '#7FFF00', // 黄绿色
            '#9400D3'  // 紫罗兰
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i * 360) / particleCount;
            const distance = 40 + Math.random() * 60;
            const scale = 0.5 + Math.random() * 1;
            particle.style.transform = `rotate(${angle}deg) translate(${distance}px) scale(${scale})`;
            
            firework.appendChild(particle);
        }
        
        document.body.appendChild(firework);
        
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }

    // 添加鼠标跟随的星星效果
    (function fairyDustCursor() {
        var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
        var width = window.innerWidth;
        var height = window.innerHeight;
        var cursor = { x: width / 2, y: width / 2 };
        var particles = [];
        window.onMouseMove = function(e) {  // 将函数挂载到window对象上
            if (mouseEffectEnabled) {
                cursor.x = e.clientX;
                cursor.y = e.clientY;
                addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
            }
        };

        function init() {
            bindEvents();
            loop();
        }

        function bindEvents() {
            document.addEventListener('mousemove', window.onMouseMove);
            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize(e) {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        function addParticle(x, y, color) {
            var particle = new Particle();
            particle.init(x, y, color);
            particles.push(particle);
        }

        function updateParticles() {
            // 检查容器是否存在
            const container = document.querySelector('.js-cursor-container');
            if (!container) return;

            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            for (var i = particles.length - 1; i >= 0; i--) {
                if (particles[i].lifeSpan < 0) {
                    particles[i].die();
                    particles.splice(i, 1);
                }
            }
        }

        function loop() {
            requestAnimationFrame(loop);
            updateParticles();
        }

        function Particle() {
            this.characters = ["✦", "✧", "⋆", "✫", "✬", "✭", "✮", "✯", "✰"];
            this.lifeSpan = 120;
            this.initialStyles = {
                "position": "fixed",
                "display": "inline-block",
                "top": "0px",
                "left": "0px",
                "pointerEvents": "none",
                "touch-action": "none",
                "z-index": "10000000",
                "fontSize": "20px",
                "will-change": "transform"
            };

            this.init = function (x, y, color) {
                this.velocity = {
                    x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
                    y: 0.8 + Math.random() * 0.4
                };
                this.position = { x: x + 10, y: y + 10 };
                this.initialStyles.color = color;

                this.element = document.createElement('span');
                this.element.innerHTML = this.characters[Math.floor(Math.random() * this.characters.length)];
                applyProperties(this.element, this.initialStyles);
                this.update();

                document.querySelector('.js-cursor-container').appendChild(this.element);
            };

            this.update = function () {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                this.lifeSpan--;
                this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
            }

            this.die = function () {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
        }

        function applyProperties(target, properties) {
            for (var key in properties) {
                target.style[key] = properties[key];
            }
        }

        if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) init();
    })();

    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showMessage('为了网站安全，已禁用右键菜单');
        return false;
    });
    
    // 禁用 F12 和其��开发者工具快捷键
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showMessage('为了网站安全，已禁用 F12 功能');
            return false;
        }
        
        // Ctrl + Shift + I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showMessage('为了网站安全，已禁用开发者工具');
            return false;
        }
        
        // Ctrl + Shift + J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showMessage('为了网站安全，已禁用控制台');
            return false;
        }
        
        // Ctrl + U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showMessage('为了网站安全，已禁用查看源代码功能');
            return false;
        }
    });
    
    // 禁用开发者工具
    window.addEventListener('devtoolschange', function(e) {
        if (e.detail.open) {
            showMessage('请不要打开开发者工具');
            window.location.reload();
        }
    });

    const mouseEffectToggle = document.getElementById('mouse-effect');
    const clickEffectToggle = document.getElementById('click-effect');
    let mouseEffectEnabled = true;
    let clickEffectEnabled = true;

    // 鼠标点击文字效果
    const words = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
    const colors = [
        "#FF0000", // 红色
        "#FF7F00", // 橙色
        "#FFFF00", // 黄色
        "#00FF00", // 绿色
        "#00FFFF", // 青色
        "#0000FF", // 蓝色
        "#8B00FF", // 紫色
        "#FF1493", // 粉红
        "#FF4500", // 橘红
        "#32CD32", // 酸橙
        "#4169E1", // 皇家蓝
        "#9370DB"  // 中紫色
    ];
    let wordIndex = 0;

    document.addEventListener('click', function(e) {
        if (!clickEffectEnabled) return;
        
        const span = document.createElement('span');
        span.textContent = words[wordIndex];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        wordIndex = (wordIndex + 1) % words.length;

        span.style.cssText = `
            position: fixed;
            z-index: 999999;
            top: ${e.clientY - 20}px;
            left: ${e.clientX}px;
            font-weight: bold;
            color: ${randomColor};
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
            pointer-events: none;
            animation: floatUp 1.5s ease-out forwards;
            font-size: 16px;
        `;

        document.body.appendChild(span);
        setTimeout(() => span.remove(), 1500);
    });

    // 鼠标特效开关控制
    mouseEffectToggle.addEventListener('change', function() {
        mouseEffectEnabled = this.checked;
        const container = document.querySelector('.js-cursor-container');
        
        if (!mouseEffectEnabled) {
            // 清除所有现有的特效元素
            while (container && container.firstChild) {
                container.removeChild(container.firstChild);
            }
            // 移除鼠标移动事件监听器
            document.removeEventListener('mousemove', window.onMouseMove);
        } else {
            // 重新添加鼠标移动事件监听器
            document.addEventListener('mousemove', window.onMouseMove);
        }
    });

    // 点击特效开关控制
    clickEffectToggle.addEventListener('change', function() {
        clickEffectEnabled = this.checked;
    });
}); 