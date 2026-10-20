document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. INJETAR PROJETOS NA GALERIA
    // ==========================================
    const dadosProjetos = [
        { titulo: "Classificação Liga Betclic 2026", imagem: "Images/ClassificaçãoAtual.png" },
        { titulo: "Autocolante SLB", imagem: "Images/Sticker1.png" },
        { titulo: "Sporting VS PSG", imagem: "Images/LuisSuarez1.png" },
        { titulo: "Matchday Juventus VS Benfica", imagem: "Images/JuventusVSBenfica.png" },
        { titulo: "960 golos CR7", imagem: "Images/Ronaldo960.png" },
        { titulo: "XI Benfica VS Juventus", imagem: "Images/XIbenfica.png" },
        { titulo: "Bandeira UFCI", imagem: "Images/UFCI.png" },
        { titulo: "Honrai os Ases", imagem: "Images/Ases.png" },
        { titulo: "E Pluribus Unum", imagem: "Images/Epluribusunum.png" },
        { titulo: "Bandeira Pai e filho", imagem: "Images/Loucos.png" },
        { titulo: "Bandeira Estrela da Amadora", imagem: "Images/Estrela.png" },
        { titulo: "Viktoria Plzen VS FC Porto", imagem: "Images/PlznVsPorto.jpg" },
        { titulo: "Bandeira Personalizada", imagem: "Images/BandeiraTopoSul.png" },
        { titulo: "Autocolantes SCP", imagem: "Images/AutocolantesSCP1.png" },
        { titulo: "Autocolantes SCP Vol.2", imagem: "Images/AutocolantesSCP2.png" }
    ];

    const galleryContainer = document.getElementById('galleryContainer');
    if(galleryContainer) {
        dadosProjetos.forEach((projeto, index) => {
            const card = document.createElement('div');
            card.className = 'project-card animate-on-scroll';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <img src="${projeto.imagem}" alt="${projeto.titulo}" class="gallery-img">
                <div class="overlay"><p>${projeto.titulo}</p></div>
            `;
            galleryContainer.appendChild(card);
        });
    }

    // ==========================================
    // 2. ANIMAÇÕES (Scroll e Textos)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    document.querySelectorAll('.about-card').forEach((card, i) => card.style.transitionDelay = `${i * 0.15}s`);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('revealed'), i * 200);
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-text').forEach(text => revealObserver.observe(text));

    // Typewriter
    const tagline = document.querySelector('.about-tagline p strong');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.borderRight = '2px solid white';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) { tagline.textContent += text.charAt(i); i++; setTimeout(typeWriter, 50); } 
            else { setTimeout(() => tagline.style.borderRight = 'none', 500); }
        };
        const taglineObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && tagline.textContent === '') { typeWriter(); taglineObserver.disconnect(); }
        }, { threshold: 0.5 });
        taglineObserver.observe(tagline.closest('.about-tagline'));
    }

    // Smooth Scroll Nods
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        });
    });

    // ==========================================
    // 3. MODAL DE IMAGENS DA GALERIA
    // ==========================================
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function () {
            modalImg.src = this.querySelector('.gallery-img').src;
            imageModal.style.display = 'block';
            imageModal.offsetHeight; // force reflow
            setTimeout(() => imageModal.classList.add('active'), 10);
        });
    });

    document.querySelector('.gallery-close')?.addEventListener('click', closeImageModal);
    imageModal?.addEventListener('click', (e) => { if (e.target === imageModal) closeImageModal(); });
    
    function closeImageModal() {
        imageModal.classList.remove('active');
        setTimeout(() => imageModal.style.display = 'none', 400);
    }

    // Bloquear clique direito (Básico)
    document.querySelectorAll('.gallery-img, #modalImage').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.addEventListener('dragstart', e => e.preventDefault());
    });

    // ==========================================
    // 4. SISTEMA DE AUTENTICAÇÃO (Login/Registo)
    // ==========================================
    const authModal = document.getElementById('authModal');
    const toggleLogin = document.getElementById('toggleLogin');
    const toggleRegister = document.getElementById('toggleRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Abrir modal Auth
    document.getElementById('navLoginBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'block';
        authModal.offsetHeight;
        setTimeout(() => authModal.classList.add('active'), 10);
    });

    // Fechar Modal Auth
    document.querySelector('.auth-close')?.addEventListener('click', () => {
        authModal.classList.remove('active');
        setTimeout(() => authModal.style.display = 'none', 400);
    });

    // Alternar abas
    toggleRegister?.addEventListener('click', () => {
        toggleLogin.classList.remove('active'); toggleRegister.classList.add('active');
        loginForm.classList.remove('active'); registerForm.classList.add('active');
    });
    toggleLogin?.addEventListener('click', () => {
        toggleRegister.classList.remove('active'); toggleLogin.classList.add('active');
        registerForm.classList.remove('active'); loginForm.classList.add('active');
    });

    // Força da Password
    const regPass = document.getElementById('regPassword');
    const sBar = document.getElementById('strengthBar');
    const sText = document.getElementById('strengthText');
    
    regPass?.addEventListener('input', function() {
        const pass = this.value; let force = 0;
        if (pass.length >= 6) force += 1;
        if (pass.length >= 8) force += 1;
        if (/[A-Z]/.test(pass)) force += 1;
        if (/[0-9]/.test(pass)) force += 1;
        if (/[^A-Za-z0-9]/.test(pass)) force += 1;

        if (pass.length === 0) { sBar.style.width = '0%'; sText.textContent = ''; } 
        else if (force <= 2) { sBar.style.width = '33%'; sBar.style.backgroundColor = '#ff4d4d'; sText.textContent = 'Fraca'; sText.style.color = '#ff4d4d'; } 
        else if (force <= 4) { sBar.style.width = '66%'; sBar.style.backgroundColor = '#ffa64d'; sText.textContent = 'Média'; sText.style.color = '#ffa64d'; } 
        else { sBar.style.width = '100%'; sBar.style.backgroundColor = '#33cc33'; sText.textContent = 'Muito Forte'; sText.style.color = '#33cc33'; }
    });

    // Submissão REGISTO
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDisplay = document.getElementById('registerError');
        errorDisplay.textContent = "A aguardar...";

        try {
            const response = await fetch('api_auth.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register',
                    name: document.getElementById('regName').value,
                    email: document.getElementById('regEmail').value,
                    password: regPass.value
                })
            });
            const result = await response.json();

            if (result.success) {
                registerForm.reset(); sBar.style.width = '0%'; sText.textContent = '';
                errorDisplay.textContent = "";
                alert("Conta criada! Faz login agora.");
                toggleLogin.click();
            } else { errorDisplay.textContent = result.message; }
        } catch (err) { errorDisplay.textContent = "Erro de servidor."; }
    });

    // Submissão LOGIN
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDisplay = document.getElementById('loginError');
        errorDisplay.textContent = "A verificar...";

        try {
            const response = await fetch('api_auth.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    email: document.getElementById('loginEmail').value,
                    password: document.getElementById('loginPassword').value
                })
            });
            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(result.user));
                loginForm.reset();
                document.querySelector('.auth-close').click();
                atualizarInterface();
                alert(result.user.role === 'admin' ? "Bem-vindo, Admin!" : `Bem-vindo, ${result.user.name}!`);
            } else { errorDisplay.textContent = result.message; }
        } catch (err) { errorDisplay.textContent = "Erro de servidor."; }
    });

    // Atualizar UI após Login
    function atualizarInterface() {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        const userArea = document.getElementById('userArea');
        
        if (user && userArea) {
            let adminBadge = user.role === 'admin' ? '<span class="badge bg-danger ms-2">Admin</span>' : '';
            userArea.innerHTML = `
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle btn-login" href="#" id="userMenu" role="button" data-bs-toggle="dropdown">
                        Olá, ${user.name.split(' ')[0]} ${adminBadge}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="userMenu">
                        ${user.role === 'admin' ? '<li><a class="dropdown-item text-warning" href="#">Painel de Gestão</a></li><li><hr class="dropdown-divider"></li>' : ''}
                        <li><a class="dropdown-item" href="#" id="btnLogout">Sair</a></li>
                    </ul>
                </div>
            `;
            document.getElementById('btnLogout')?.addEventListener('click', (e) => {
                e.preventDefault(); sessionStorage.removeItem('currentUser'); location.reload();
            });
        }
    }
    atualizarInterface();

    // ==========================================
    // 5. CANVAS STARS (Fundo)
    // ==========================================
    const canvas = document.getElementById('starsCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        const stars = Array.from({length: 80}, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.pulse += 0.02; const op = s.opacity + Math.sin(s.pulse) * 0.15;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 160, 255, ${op})`; ctx.fill();
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(157, 78, 221, ${op * 0.3})`; ctx.fill();
                s.x += s.speedX; s.y += s.speedY;
                if(s.x < 0) s.x = canvas.width; if(s.x > canvas.width) s.x = 0;
                if(s.y < 0) s.y = canvas.height; if(s.y > canvas.height) s.y = 0;
            });
            for(let i=0; i<stars.length; i++) {
                for(let j=i+1; j<stars.length; j++) {
                    const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                    if(dist < 120) {
                        ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(157, 78, 221, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };
        draw();
    }
});