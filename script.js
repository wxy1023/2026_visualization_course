// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove('active'));

        const activeLink = document.querySelector(
            '.nav-links a[href*=' + sections[index].id + ']'
        );

        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', highlightNavLink);

    // Image lazy loading for better performance
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // This would be useful if we had data-src attributes
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add subtle animation to stat cards on scroll
    const statCards = document.querySelectorAll('.stat-card');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        statObserver.observe(card);
    });

    // Add hover effect to visualization items
    const vizItems = document.querySelectorAll('.viz-item');
    vizItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add CSS transitions
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            color: #3182ce;
            position: relative;
        }

        .nav-links a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #3182ce;
            border-radius: 1px;
        }

        .viz-item {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        img {
            opacity: 0.9;
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Mobile navigation toggle (if needed in future)
    function createMobileMenu() {
        const nav = document.querySelector('.nav');
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #2d3748;
        `;

        const navLinks = document.querySelector('.nav-links');

        mobileToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        nav.insertBefore(mobileToggle, navLinks);

        // Show/hide mobile toggle based on screen size
        function toggleMobileMenu() {
            if (window.innerWidth <= 768) {
                mobileToggle.style.display = 'block';
                navLinks.style.display = 'none';
                navLinks.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                `;
            } else {
                mobileToggle.style.display = 'none';
                navLinks.style.cssText = '';
            }
        }

        window.addEventListener('resize', toggleMobileMenu);
        toggleMobileMenu();
    }

    // Uncomment the line below if you want mobile menu functionality
    // createMobileMenu();

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        document.body.classList.add('scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('scrolling');
        }, 150);
    });

    // Add print styles
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            .header, .footer, .nav-links {
                display: none !important;
            }

            body {
                background: white !important;
                color: black !important;
            }

            .container {
                max-width: none !important;
                padding: 0 !important;
            }

            img {
                max-width: 100% !important;
                page-break-inside: avoid;
            }

            section {
                page-break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(printStyle);
});

    // Tab functionality for visualizations
    function openTab(evt, tabName) {
        const tabPanes = document.querySelectorAll('.tab-pane');
        const tabBtns = document.querySelectorAll('.tab-btn');

        // Hide all tab panes
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });

        // Remove active class from all tab buttons
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show the selected tab pane and mark button as active
        document.getElementById(tabName).classList.add('active');
        if (evt) {
            evt.currentTarget.classList.add('active');
        }
    }

    // Add tab styles
    const tabStyle = document.createElement('style');
    tabStyle.textContent = `
        .viz-tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e2e8f0;
        }

        .tab-btn {
            background: none;
            border: none;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            text-align: center;
        }

        .tab-btn:hover {
            color: #3182ce;
            background-color: #f8fafc;
        }

        .tab-btn.active {
            color: #3182ce;
            font-weight: 600;
        }

        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background-color: #3182ce;
            border-radius: 2px 2px 0 0;
        }

        .tab-content {
            position: relative;
        }

        .tab-pane {
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .tab-pane.active {
            display: block;
            opacity: 1;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .viz-tabs {
                flex-wrap: wrap;
                justify-content: center;
            }

            .tab-btn {
                flex: 1;
                min-width: 120px;
                padding: 0.75rem 1rem;
                font-size: 0.9rem;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .tab-btn {
                flex: 1 0 50%;
                font-size: 0.85rem;
                padding: 0.5rem 0.75rem;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(tabStyle);

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (console && console.log) {
                console.log('页面加载性能:', {
                    'DNS查询时间': perfData.domainLookupEnd - perfData.domainLookupStart + 'ms',
                    '页面加载时间': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
                    'DOM处理时间': perfData.domComplete - perfData.domInteractive + 'ms'
                });
            }
        }, 0);
    });
}
