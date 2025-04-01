// Carrossel 3D Moderno
class ModernCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = this.container.querySelectorAll('.carousel-item');
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoRotate = true;
        this.rotateInterval = null;
        this.intervalDuration = 5000;
        
        this.init();
    }

    init() {
        this.setupItems();
        this.setupControls();
        this.setupTouchEvents();
        this.startAutoRotate();
        this.updateItems();
    }

    setupItems() {
        this.items.forEach((item, index) => {
            item.style.setProperty('--item-pos', index - this.currentIndex);
        });
    }

    setupControls() {
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
    }

    setupTouchEvents() {
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoRotate();
        }, {passive: true});

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoRotate();
        }, {passive: true});
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        if (diff > 50) this.next();
        if (diff < -50) this.prev();
    }

    startAutoRotate() {
        if (this.autoRotate) {
            this.rotateInterval = setInterval(() => this.next(), this.intervalDuration);
        }
    }

    stopAutoRotate() {
        clearInterval(this.rotateInterval);
    }

    updateItems() {
        this.items.forEach((item, index) => {
            const position = index - this.currentIndex;
            item.style.setProperty('--item-pos', position);
            
            // Atualiza classes para controle de visibilidade
            item.classList.toggle('active', position === 0);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateItems();
        this.restartAutoRotate();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateItems();
        this.restartAutoRotate();
    }

    restartAutoRotate() {
        this.stopAutoRotate();
        this.startAutoRotate();
    }
}

// Efeito Parallax
class ParallaxEffect {
    constructor(element) {
        this.element = element;
        this.speed = parseFloat(element.dataset.speed) || 0.4;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updatePosition());
        this.updatePosition();
    }

    updatePosition() {
        const scrollY = window.scrollY;
        const offset = scrollY * this.speed;
        this.element.style.transform = `translateY(${offset}px)`;
    }
}

// Animação ao Scroll
class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('.animate');
        this.init();
    }

    init() {
        this.checkElements();
        window.addEventListener('scroll', () => this.checkElements());
    }

    checkElements() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.75;

        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementVisible = triggerPoint;

            if (elementTop < elementVisible) {
                const delay = element.dataset.delay || 0;
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
            }
        });
    }
}

// Dark Mode Automático
class AutoDarkMode {
    constructor() {
        this.init();
    }

    init() {
        this.checkPreference();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            this.toggleDarkMode(e.matches);
        });
    }

    checkPreference() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.toggleDarkMode(isDark);
    }

    toggleDarkMode(enable) {
        document.body.classList.toggle('dark-mode', enable);
    }
}

// Modal de Produto Interativo
class ProductModal {
    constructor() {
        this.modal = new bootstrap.Modal(document.getElementById('productModal'));
        this.init();
    }

    init() {
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
            button.addEventListener('click', () => {
                const product = button.dataset.product;
                this.loadProductData(product);
            });
        });
    }

    loadProductData(product) {
        // Aqui você pode carregar dados dinâmicos de um JSON ou API
        const products = {
            'camisetas': {
                title: 'Camisetas Personalizadas',
                description: 'Camisetas de algodão 100% com estampas de alta qualidade que não desbotam com as lavagens.',
                images: ['assets/produto-camisetas.webp']
            }
            // Adicione outros produtos...
        };

        if (products[product]) {
            const data = products[product];
            document.querySelector('.product-title').textContent = data.title;
            document.querySelector('.product-description').textContent = data.description;
            document.querySelector('.main-img').src = data.images[0];
            
            this.modal.show();
        }
    }
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o carrossel
    if (document.getElementById('modernCarousel')) {
        new ModernCarousel('modernCarousel');
    }

    // Inicializa efeito parallax
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        new ParallaxEffect(bg);
    });

    // Inicializa animações ao scroll
    new ScrollAnimation();

    // Inicializa dark mode automático
    new AutoDarkMode();

    // Inicializa modal de produtos
    new ProductModal();

    // Atualiza o ano atual no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Efeito de digitação no hero
    if (document.getElementById('main-heading')) {
        new TypeIt('#main-heading', {
            strings: ["CRIAÇÕES QUE INSPIRAM", "PERSONALIZAÇÃO ÚNICA", "QUALIDADE PREMIUM"],
            speed: 100,
            breakLines: false,
            loop: true,
            nextStringDelay: 2000
        }).go();
    }
});

// Loader - Esconde quando a página carrega
window.addEventListener('load', () => {
    document.querySelector('.page-loader').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.page-loader').style.display = 'none';
    }, 500);
});