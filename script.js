// Hamburger Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-menu');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-menu');
    }
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-menu');
    });
});

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and sections
document.querySelectorAll('.project-card, .about-content, .stat-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Active nav link indicator
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = 'var(--light-text)';
        }
    });
});

// Add a simple typing animation for the hero title
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let index = 0;
    
    function typeText() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 50);
        }
    }
    
    // Delay typing animation until page loads
    window.addEventListener('load', () => {
        heroTitle.textContent = '';
        index = 0;
        typeText();
    });
}

// ========== POLLUTION TRACKER FUNCTIONS ==========

// Open the tracker as an inline popover positioned below the trigger button
function openPollutionTracker(triggerEl) {
    const modal = document.getElementById('pollutionTrackerModal');
    if (!modal) return;

    // Prepare modal for positioning
    modal.style.position = 'absolute';
    modal.style.display = 'block';
    modal.style.zIndex = '9999';
    modal.style.maxWidth = '380px';

    // Temporarily make visible but hidden to measure size
    modal.style.visibility = 'hidden';

    // Small delay to ensure browser calculates layout when called from inline onclick
    requestAnimationFrame(() => {
        const rect = triggerEl.getBoundingClientRect();
        const modalWidth = modal.offsetWidth || 360;
        const gap = 8; // px gap between button and popover

        let left = rect.left + window.scrollX;
        // Ensure it doesn't overflow right edge
        if (left + modalWidth + 16 > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - modalWidth - 16;
        }
        if (left < 8 + window.scrollX) left = 8 + window.scrollX;

        const top = rect.bottom + window.scrollY + gap;

        modal.style.left = left + 'px';
        modal.style.top = top + 'px';

        modal.style.visibility = 'visible';

        // For inline popover we don't block body scrolling
        // but we want to ensure any other modals/popovers are hidden
        document.body.style.overflow = document.body.style.overflow || '';
    });
}

function closePollutionTracker() {
    const modal = document.getElementById('pollutionTrackerModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.style.left = '';
    modal.style.top = '';
    modal.style.position = '';
    modal.style.zIndex = '';
    modal.style.maxWidth = '';
    document.body.style.overflow = 'auto';
}

function analyzeAirQuality() {
    const aqi = parseInt(document.getElementById('aqi').value);
    const temp = parseInt(document.getElementById('temp').value);
    const humidity = parseInt(document.getElementById('humidity').value);
    const resultDiv = document.getElementById('trackerResult');
    
    // Validation
    if (isNaN(aqi) || isNaN(temp) || isNaN(humidity)) {
        resultDiv.innerHTML = '<p style="color: #f85149;">⚠️ Please enter valid integers for all fields.</p>';
        return;
    }
    
    if (aqi < 0 || aqi > 500 || temp < -50 || temp > 60 || humidity < 0 || humidity > 100) {
        resultDiv.innerHTML = '<p style="color: #f85149;">⚠️ Please enter values within valid ranges.</p>';
        return;
    }
    
    let status, color, tips = [];
    
    if (aqi <= 100) {
        status = 'GOOD';
        color = '#3fb950';
        tips = [
            '✅ Safe for outdoor activities.',
            '✅ Air quality is healthy.',
            '✅ No precautions needed.'
        ];
    } else if (aqi <= 150) {
        status = 'MODERATE';
        color = '#d29922';
        tips = [
            '⚠️ Sensitive groups stay indoors.',
            '🚗 Reduce vehicle use.',
            '😷 Wear a mask if going out.'
        ];
    } else if (aqi <= 200) {
        status = 'UNHEALTHY FOR SENSITIVE GROUPS';
        color = '#f85149';
        tips = [
            '⚠️ Avoid outdoor activities.',
            '😷 Wear N95 mask if going out.',
            '🏠 Keep windows and doors closed.'
        ];
    } else {
        status = 'DANGEROUS';
        color = '#f85149';
        tips = [
            '🏠 Avoid going outside.',
            '😷 Wear proper mask (N95) if outdoors.',
            '🚫 No burning or heavy activity.',
            '💨 Use air purifiers indoors.'
        ];
    }
    
    // Build result HTML
    let resultHTML = `<div style="border-left: 4px solid ${color}; padding-left: 1rem;">
        <h3 style="color: ${color}; margin-bottom: 0.5rem;">Air Quality: ${status}</h3>
        <p style="color: #b8c5d6; margin-bottom: 1rem; font-size: 0.9rem;">AQI: ${aqi} | Temp: ${temp}°C | Humidity: ${humidity}%</p>`;
    
    tips.forEach(tip => {
        resultHTML += `<p style="color: #e6edf3; margin: 0.5rem 0; font-size: 0.95rem;">${tip}</p>`;
    });
    
    resultHTML += '</div>';
    resultDiv.innerHTML = resultHTML;
}

function clearTrackerForm() {
    document.getElementById('aqi').value = '';
    document.getElementById('temp').value = '';
    document.getElementById('humidity').value = '';
    document.getElementById('trackerResult').innerHTML = '<p style="color: #b8c5d6;">Enter values and click Analyze</p>';
}

// Close popover when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('pollutionTrackerModal');
    if (!modal) return;

    // If displayed as inline popover, hide when clicking outside the popover and outside any project card
    if (modal.style.display === 'block') {
        const clickedInsidePopover = modal.contains(event.target);
        const clickedInsideTriggerCard = event.target.closest('.project-card');
        if (!clickedInsidePopover && !clickedInsideTriggerCard) {
            closePollutionTracker();
        }
    }
});

// ========== THEME TOGGLE ==========
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const userPrefKey = 'site-theme'; // 'dark' | 'light'

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      updateToggleIcon('light');
    } else {
      document.documentElement.classList.remove('light-theme');
      updateToggleIcon('dark');
    }
  }

  function updateToggleIcon(mode) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (mode === 'light') {
      icon.className = 'fas fa-sun';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      icon.className = 'fas fa-moon';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  function getSavedTheme() {
    return localStorage.getItem(userPrefKey);
  }

  function setSavedTheme(value) {
    if (value) localStorage.setItem(userPrefKey, value);
    else localStorage.removeItem(userPrefKey);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = getSavedTheme();
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    // react to system changes only if user hasn't set a preference
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light');
      });
    } catch (e) {
      // older browsers may not support addEventListener on matchMedia
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentlyLight = document.documentElement.classList.contains('light-theme');
        const newTheme = currentlyLight ? 'dark' : 'light';
        setSavedTheme(newTheme);
        applyTheme(newTheme);
      });
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          themeToggle.click();
        }
      });
    } else {
      // console.warn('themeToggle not found');
    }
  });
})();
