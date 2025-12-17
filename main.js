/* Project Name: 3D Youtuber Personal Branding Website
Project Owner/Auther: OG -> Omkar R. Ghare
Project Technologies: HTML, CSS & JS. */

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with delay (using GSAP for smoothness)
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: 'power2.out'
    });
});

// Hover effects for cursor
const links = document.querySelectorAll('a, button, .video-card');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, {
            scale: 1.5,
            backgroundColor: 'rgba(0, 243, 255, 0.1)',
            duration: 0.2
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, {
            scale: 1,
            backgroundColor: 'transparent',
            duration: 0.2
        });
    });
});

// Three.js 3D Background
const initThreeJS = () => {
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8,
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);
    
    // Connecting Lines (optional, but might be heavy, let's stick to particles for performance + geometric shapes)
    // Let's add some floating geometric shapes instead for "3D branding"
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xbc13fe, transparent: true, opacity: 0.3 });
    const sphere = new THREE.LineSegments(wireframe, lineMaterial);
    
    sphere.position.set(3, 0, -2);
    scene.add(sphere);

    const geometry2 = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.2 });
    const torus = new THREE.Mesh(geometry2, material2);
    
    torus.position.set(-3, 1, -3);
    scene.add(torus);

    camera.position.z = 5;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Clock
    const clock = new THREE.Clock();

    const animate = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        const elapsedTime = clock.getElapsedTime();

        // Rotate objects
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;
        
        torus.rotation.x += 0.003;
        torus.rotation.y -= 0.003;

        // Continuous rotation for particles
        particlesMesh.rotation.y += 0.001; 

        // Mouse interaction (gentle tilt/sway)
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.z += 0.05 * (targetX - particlesMesh.rotation.z); // Rotate on Z axis for sway

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThreeJS();

// GSAP Animations
const initAnimations = () => {
    // Hero Text Glitch Reveal
    gsap.from('.hero-title', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.from('.hero-subtitle', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.8
    });

    gsap.from('.cta-btn', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: 1.2
    });

    // Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Cards Stagger
    gsap.utils.toArray('.video-card, .service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1, // Stagger effect manual implementation or use stagger property
            ease: 'power2.out'
        });
    });
};

initAnimations();

// Animated Counter
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

counters.forEach(counter => {
    const animateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        
        // Lower inc to slow and higher to fast
        const inc = target / speed;

        if (count < target) {
            // Add inc to count and output in counter
            counter.innerText = Math.ceil(count + inc);
            // Call function every ms
            setTimeout(animateCounter, 20);
        } else {
            // Format number (e.g. 2.5M)
            if(target >= 1000000) {
                counter.innerText = (target / 1000000).toFixed(1) + 'M';
            } else if(target >= 1000) {
                counter.innerText = (target / 1000).toFixed(1) + 'K';
            } else {
                counter.innerText = target;
            }
        }
    };

    // Trigger animation when in view
    ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => animateCounter()
    });
});

// 3D Tilt Card Effect
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Mobile Menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if(navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#050505';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    }
});
