// Função de validação de e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Dropdown do Footer
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const dropdown = this.closest('.footer-dropdown');
            
            // Fechar outros dropdowns abertos
            document.querySelectorAll('.footer-dropdown.active').forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle do dropdown atual
            dropdown.classList.toggle('active');
        });
    });
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.footer-dropdown')) {
            document.querySelectorAll('.footer-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Garantir que o marcador não apareça no mobile
    const marker = document.querySelector('.smart-marker');
    if (marker && window.innerWidth <= 768) {
        marker.style.display = 'none';
    }
});

// Garantir que o marcador não apareça no mobile ao redimensionar
window.addEventListener('resize', () => {
    const marker = document.querySelector('.smart-marker');
    if (marker) {
        if (window.innerWidth <= 768) {
            marker.style.display = 'none';
        } else {
            marker.style.display = '';
        }
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth Scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Compensar altura da navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Slider de Produtos
class ProductSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.product-slide');
        this.sliderWrapper = document.querySelector('.product-slider .slider-wrapper');
        this.dots = document.querySelectorAll('.product-slider .dot');
        this.sliderContainer = document.querySelector('.product-slider .slider-container');
        
        // Variáveis para arrasto
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragThreshold = 50;
        
        this.init();
    }
    
    init() {
        // Eventos de arrasto
        this.initDragEvents();
        
        // Auto-play
        this.startAutoPlay();
        
        // Pausar auto-play no hover
        if (this.sliderContainer) {
            this.sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    initDragEvents() {
        // Mouse events
        this.sliderContainer.addEventListener('mousedown', (e) => this.startDrag(e));
        this.sliderContainer.addEventListener('mousemove', (e) => this.drag(e));
        this.sliderContainer.addEventListener('mouseup', () => this.endDrag());
        this.sliderContainer.addEventListener('mouseleave', () => this.endDrag());
        
        // Touch events
        this.sliderContainer.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        this.sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        this.sliderContainer.addEventListener('touchend', () => this.endDrag());
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.currentX = this.startX;
        this.stopAutoPlay();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX;
        const diff = this.currentX - this.startX;
        
        // Aplicar transformação visual durante o arrasto
        const slideWidth = this.sliderWrapper.offsetWidth;
        const currentTranslate = -this.currentSlide * slideWidth;
        this.sliderWrapper.style.transform = `translateX(${currentTranslate + diff}px)`;
    }
    
    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.currentX - this.startX;
        
        // Determinar direção do arrasto
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            // Voltar para a posição atual se o arrasto for muito pequeno
            this.updateSlider();
        }
        
        this.startAutoPlay();
    }
    
    updateSlider() {
        if (this.sliderWrapper) {
            this.sliderWrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Atualizar marcadores
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Slider de Planos
class PlanSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.plan-slide');
        this.sliderWrapper = document.querySelector('.plan-slider .slider-wrapper');
        this.dots = document.querySelectorAll('.plan-slider .dot');
        this.sliderContainer = document.querySelector('.plan-slider .slider-container');
        
        // Variáveis para arrasto
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragThreshold = 50;
        
        this.init();
    }
    
    init() {
        // Eventos de arrasto
        this.initDragEvents();
        
        // Auto-play
        this.startAutoPlay();
        
        // Pausar auto-play no hover
        if (this.sliderContainer) {
            this.sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    initDragEvents() {
        // Mouse events
        this.sliderContainer.addEventListener('mousedown', (e) => this.startDrag(e));
        this.sliderContainer.addEventListener('mousemove', (e) => this.drag(e));
        this.sliderContainer.addEventListener('mouseup', () => this.endDrag());
        this.sliderContainer.addEventListener('mouseleave', () => this.endDrag());
        
        // Touch events
        this.sliderContainer.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        this.sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        this.sliderContainer.addEventListener('touchend', () => this.endDrag());
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.currentX = this.startX;
        this.stopAutoPlay();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX;
        const diff = this.currentX - this.startX;
        
        // Aplicar transformação visual durante o arrasto
        const slideWidth = this.sliderWrapper.offsetWidth;
        const currentTranslate = -this.currentSlide * slideWidth;
        this.sliderWrapper.style.transform = `translateX(${currentTranslate + diff}px)`;
    }
    
    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.currentX - this.startX;
        
        // Determinar direção do arrasto
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            // Voltar para a posição atual se o arrasto for muito pequeno
            this.updateSlider();
        }
        
        this.startAutoPlay();
    }
    
    updateSlider() {
        if (this.sliderWrapper) {
            this.sliderWrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Atualizar marcadores
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Inicializar sliders
const productSlider = new ProductSlider();
const planSlider = new PlanSlider();

// Funcionalidade de toggle para conteúdo oculto
document.addEventListener('DOMContentLoaded', function() {
    const toggleArrows = document.querySelectorAll('.toggle-arrow');
    
    toggleArrows.forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const hiddenContent = this.nextElementSibling;
            const isShowing = hiddenContent.classList.contains('show');
            
            // Toggle do conteúdo
            hiddenContent.classList.toggle('show');
            
            // Toggle da seta
            this.classList.toggle('active');
            
            // Atualizar texto da seta se necessário
            const icon = this.querySelector('i');
            if (isShowing) {
                icon.className = 'fas fa-chevron-down';
            } else {
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
});

// Funcionalidade para exibir/ocultar formulário de contato
function toggleForm() {
    const contactForm = document.querySelector('.contact-form');
    const messageBtn = document.querySelector('.message-btn');
    
    if (contactForm.classList.contains('show')) {
        // Ocultar formulário
        contactForm.classList.remove('show');
        messageBtn.textContent = 'Mensagem';
        messageBtn.style.background = 'var(--gradient-green)';
        messageBtn.style.color = 'var(--primary-black)';
    } else {
        // Exibir formulário
        contactForm.classList.add('show');
        messageBtn.textContent = 'Fechar';
        messageBtn.style.background = 'var(--primary-black)';
        messageBtn.style.color = 'var(--white)';
    }
}

// Evento de submit do formulário com EmailJS e WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formContato');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Capturar valores dos campos
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // Validar e-mail antes de enviar
            if (!validarEmail(email)) {
                alert("Digite um e-mail válido.");
                return;
            }
            
            // Enviar dados com EmailJS
            emailjs.send("service_gm930vc", "template_qtlho9g", {
                name: nome,
                email: email,
                phone: telefone,
                subject: assunto,
                message: mensagem
            })
            .then(function(response) {
                // Sucesso - exibir alert e abrir WhatsApp
                alert("Mensagem enviada com sucesso!");
                
                const whatsappMessage = `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\nMensagem: ${mensagem}`;
                const whatsappUrl = `https://wa.me/5565993467390?text=${encodeURIComponent(whatsappMessage)}`;
                
                // Tentar abrir WhatsApp
                setTimeout(() => {
                    try {
                        window.open(whatsappUrl, '_blank');
                    } catch (error) {
                        // Fallback: copiar mensagem para área de transferência
                        navigator.clipboard.writeText(whatsappMessage).then(() => {
                            alert("Mensagem copiada! Abra o WhatsApp manualmente e cole a mensagem.");
                        });
                    }
                }, 500);
                
                // Limpar formulário
                form.reset();
            })
            .catch((error) => {
                console.log("ERRO:", error);
                alert("Erro ao enviar mensagem");
            });
        });
    }
});

// Animações de Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Adicionar classe fade-in aos elementos
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.section-header, .about-text, .about-image, .location-card, .expertise-card, .product-card, .plan-card, .contact-item, .contact-form'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// Contador animado para estatísticas
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.start = 0;
        this.startTime = null;
    }
    
    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        
        const progress = Math.min((timestamp - this.startTime) / this.duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * this.target);
        
        this.element.textContent = current + (this.element.textContent.includes('+') ? '+' : '') + 
                          (this.element.textContent.includes('%') ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
    
    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Iniciar contadores quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (!isNaN(number)) {
                const counter = new AnimatedCounter(entry.target, number);
                counter.start();
                entry.target.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

// Observar elementos de estatísticas
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-item h4');
    statNumbers.forEach(stat => statsObserver.observe(stat));
});

// Formulário de Contato
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(this);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validação básica
            if (!data.name || !data.email || !data.message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validar e-mail
            if (!validarEmail(data.email)) {
                showNotification('Digite um e-mail válido.', 'error');
                return;
            }
            
            // Simular envio
            showNotification('Enviando mensagem...', 'success');
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                this.reset();
            }, 2000);
        });
    }
});

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificações existentes
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'var(--gradient-green)' : type === 'error' ? '#ff4444' : 'var(--gradient-dark)'};
        color: ${type === 'success' || type === 'error' ? 'white' : 'var(--white)'};
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Debounce function para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos de scroll
const debouncedScroll = debounce(() => {
    // Eventos de scroll que não precisam ser executados a cada frame
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Animação de entrada para elementos quando eles entram na viewport
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };
    
    // Verificar elementos visíveis no carregamento
    animateOnScroll();
    
    // Verificar durante o scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Marcador Inteligente com Microbolhas
class SmartMarker {
    constructor() {
        this.marker = document.querySelector('.smart-marker');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.marker || this.navLinks.length === 0) return;
        
        this.setupEventListeners();
        this.setActiveByScroll();
        this.updateMarker();
    }
    
    setupEventListeners() {
        // Hover nos links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('mouseenter', () => {
                if (!this.isAnimating) {
                    this.updateMarkerPosition(index);
                }
            });
            
            link.addEventListener('mouseleave', () => {
                if (!this.isAnimating) {
                    this.updateMarkerPosition(this.currentIndex);
                }
            });
        });
        
        // Scroll da página
        window.addEventListener('scroll', () => this.setActiveByScroll());
        
        // Resize
        window.addEventListener('resize', () => this.updateMarker());
    }
    
    setActiveByScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        let activeSection = null;
        let closestSection = null;
        let closestDistance = Infinity;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Verificar se scroll está dentro da seção
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
            
            // Encontrar seção mais próxima (fallback)
            const distance = Math.abs(scrollPosition - (sectionTop + sectionHeight / 2));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = sectionId;
            }
        });
        
        // Usar seção ativa ou a mais próxima
        const targetSection = activeSection || closestSection;
        
        // Se ainda não encontrou, usar a primeira
        const finalSection = targetSection || (sections.length > 0 ? sections[0].getAttribute('id') : null);
        
        if (finalSection) {
            // Encontrar o link correspondente
            this.navLinks.forEach((link, index) => {
                const section = link.dataset.section;
                const isActive = section === finalSection;
                
                if (isActive && index !== this.currentIndex) {
                    this.currentIndex = index;
                    this.updateMarkerPosition(index);
                }
            });
        }
    }
    
    updateMarker() {
        this.updateMarkerPosition(this.currentIndex);
    }
    
    updateMarkerPosition(index) {
        if (this.isAnimating || index < 0 || index >= this.navLinks.length) return;
        
        this.isAnimating = true;
        const targetLink = this.navLinks[index];
        const linkRect = targetLink.getBoundingClientRect();
        const containerRect = targetLink.closest('.smart-menu-container').getBoundingClientRect();
        
        // Calcular tamanho dinâmico do marcador baseado no texto
        const padding = 20; // Padding horizontal total
        const markerWidth = linkRect.width + padding;
        const markerHeight = 35; // Altura fixa
        
        // Ajustar o tamanho do marcador
        const markerCore = this.marker.querySelector('.marker-core');
        markerCore.style.width = `${markerWidth}px`;
        markerCore.style.height = `${markerHeight}px`;
        
        // Calcular posição relativa ao container para contornar a opção
        const leftPosition = linkRect.left - containerRect.left + (linkRect.width / 2) - (markerWidth / 2);
        
        // Aplicar transformação
        this.marker.style.left = `${leftPosition}px`;
        
        // Adicionar efeito de pulso nas bolhas
        this.pulseBubbles();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    pulseBubbles() {
        const bubbles = this.marker.querySelectorAll('.bubble');
        bubbles.forEach((bubble, index) => {
            // Reiniciar animação
            bubble.style.animation = 'none';
            bubble.offsetHeight; // Trigger reflow
            bubble.style.animation = null;
        });
    }
}

// Inicializar o marcador inteligente
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam prontos
    setTimeout(() => {
        if (document.querySelector('.smart-marker') && document.querySelectorAll('.nav-link').length > 0) {
            window.smartMarker = new SmartMarker();
            
            // Forçar atualização inicial após criação
            setTimeout(() => {
                if (window.smartMarker) {
                    window.smartMarker.setActiveByScroll();
                    window.smartMarker.updateMarker();
                }
            }, 200);
        }
    }, 100);
});

// Garantir inicialização correta após refresh completo
window.addEventListener('load', function() {
    setTimeout(() => {
        if (window.smartMarker) {
            window.smartMarker.setActiveByScroll();
            window.smartMarker.updateMarker();
        }
    }, 300);
});

// Forçar verificação após hash change (navegação por âncora)
window.addEventListener('hashchange', function() {
    if (window.smartMarker) {
        setTimeout(() => {
            window.smartMarker.setActiveByScroll();
            window.smartMarker.updateMarker();
        }, 100);
    }
});

// Debounce para o evento de scroll para evitar múltiplas chamadas
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.smartMarker && !window.smartMarker.isAnimating) {
            window.smartMarker.setActiveByScroll();
        }
    }, 50);
});

// Verificação adicional após resize
window.addEventListener('resize', function() {
    setTimeout(() => {
        if (window.smartMarker) {
            window.smartMarker.updateMarker();
        }
    }, 150);
});

// Console message para desenvolvedores
console.log('%c LCSP Site ', 'background: linear-gradient(135deg, #71de00, #8fff00); color: #000; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 5px;');
console.log('%c Desenvolvido com tecnologia moderna e design responsivo ', 'color: #454545; font-size: 12px;');
