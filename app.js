const games = [
    {
        id: 'minecraft',
        title: 'Minecraft',
        description: 'The ultimate sandbox game where imagination is the only limit. Build, survive, and thrive in an infinite blocky world.',
        tier: 'S',
        category: 'main',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png'
    },
    {
        id: 'roblox',
        title: 'Roblox',
        description: 'A global platform that brings people together through play. Millions of user-created 3D experiences to explore.',
        tier: 'A',
        category: 'main',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg'
    },
    {
        id: 'fortnite',
        title: 'Fortnite',
        description: 'Drop in, build, and outlast everyone else. The battle royale that changed gaming forever with its massive crossovers.',
        tier: 'A',
        category: 'main',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/FortniteLogo.svg'
    },
    {
        id: 'hill-climb',
        title: 'Hill Climb Racing',
        description: 'A classic physics-based driving game. Addictive gameplay but can get repetitive after hours of grinding for coins.',
        tier: 'B',
        category: 'main',
        logoUrl: 'https://play-lh.googleusercontent.com/N0A6i75q7F5WLYTfksu3Zf6zY4kLz_2E27Vz5lE1h_j4mB_aR1z8y3j_TfG3uB5gRtw'
    },
    {
        id: 'brookhaven',
        title: 'Brookhaven RP',
        description: 'Hang out with like-minded people and explore a massive city. Incredible roleplay but sometimes highly chaotic.',
        tier: 'B',
        category: 'roblox',
        logoUrl: 'https://tr.rbxcdn.com/f04c7d0313f8373bbf91a1ae12574e9e/150/150/Image/Jpeg'
    },
    {
        id: 'adopt-me',
        title: 'Adopt Me!',
        description: 'Raise and dress cute pets, decorate your house, and play with friends in the magical, family-friendly Adopt Me world!',
        tier: 'A',
        category: 'roblox',
        logoUrl: 'https://tr.rbxcdn.com/7bfff3c5bd565eb6fbe00bc4c7b8a7f9/150/150/Image/Jpeg'
    },
    {
        id: 'blox-fruits',
        title: 'Blox Fruits',
        description: 'Become a master swordsman or a powerful blox fruit user as you train to become the strongest player to ever live.',
        tier: 'S',
        category: 'roblox',
        logoUrl: 'https://tr.rbxcdn.com/1526f2df27f8d1eab2994f4b669e46a5/150/150/Image/Jpeg'
    },
    {
        id: 'tower-of-hell',
        title: 'Tower of Hell',
        description: 'Reach the top of a randomly generated tower with no checkpoints. Incredibly frustrating but highly rewarding.',
        tier: 'C',
        category: 'roblox',
        logoUrl: 'https://tr.rbxcdn.com/396264ff6910da3daafb2ae4c1e0fac2/150/150/Image/Jpeg'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.getElementById('main-games-grid');
    const robloxGrid = document.getElementById('roblox-games-grid');
    const modal = document.getElementById('review-modal');
    const closeBtn = document.querySelector('.close-btn');
    const reviewForm = document.getElementById('review-form');
    const modalTitle = document.getElementById('modal-game-title');
    const modalGameId = document.getElementById('modal-game-id');

    // Initialize Game Reviews from localStorage
    const getReviews = (gameId) => {
        const stored = localStorage.getItem(`reviews_${gameId}`);
        return stored ? JSON.parse(stored) : [];
    };

    const saveReview = (gameId, reviewer, text) => {
        const reviews = getReviews(gameId);
        reviews.push({ reviewer, text, date: new Date().toISOString() });
        localStorage.setItem(`reviews_${gameId}`, JSON.stringify(reviews));
        renderGames(); // Re-render to show new review
    };

    // Render a single game card
    const createGameCard = (game) => {
        const reviews = getReviews(game.id);
        const reviewsHtml = reviews.length > 0
            ? reviews.map(r => `
                <div class="review-item">
                    <div class="reviewer-name">${r.reviewer} says:</div>
                    <div class="review-text">"${r.text}"</div>
                </div>
              `).join('')
            : `<div class="no-reviews">No reviews yet. Be the first!</div>`;

        return `
            <div class="game-card">
                <div class="game-header">
                    <img src="${game.logoUrl}" alt="${game.title} Logo" class="game-logo" onerror="this.src='https://via.placeholder.com/80/000000/39ff14?text=LOGO'">
                    <h3 class="game-title cursive">${game.title}</h3>
                    <div class="tier-badge tier-${game.tier.toLowerCase()}" title="Tier ${game.tier}">
                        <span class="cursive">${game.tier}</span>
                    </div>
                </div>
                <p class="game-desc cursive">${game.description}</p>
                
                <h4 class="cursive" style="color: var(--neon-green); margin-bottom: 0.5rem;">Player Reviews:</h4>
                <div class="reviews-container">
                    ${reviewsHtml}
                </div>

                <button class="btn cursive btn-add-review" data-id="${game.id}" data-title="${game.title}">+ Add Review</button>
            </div>
        `;
    };

    // Render all games
    const renderGames = () => {
        mainGrid.innerHTML = games.filter(g => g.category === 'main').map(createGameCard).join('');
        robloxGrid.innerHTML = games.filter(g => g.category === 'roblox').map(createGameCard).join('');

        // Attach event listeners to new buttons
        document.querySelectorAll('.btn-add-review').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const title = e.target.getAttribute('data-title');
                openModal(id, title);
            });
        });
    };

    // Modal Logic
    const openModal = (gameId, gameTitle) => {
        modalGameId.value = gameId;
        modalTitle.textContent = `Reviewing: ${gameTitle}`;
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        reviewForm.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const gameId = modalGameId.value;
        const name = document.getElementById('reviewer-name').value;
        const text = document.getElementById('reviewer-text').value;

        if (name && text) {
            saveReview(gameId, name, text);
            closeModal();
        }
    });

    // Initial render
    renderGames();
});
