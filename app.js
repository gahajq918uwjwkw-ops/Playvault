/* =====================================================
   PLAYVAULT
   APP.JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const gameGrid =
        document.getElementById("gameGrid");

    const popularGrid =
        document.getElementById("popularGrid");

    const emptyState =
        document.getElementById("emptyState");

    const gameCount =
        document.getElementById("gameCount");

    const popularCount =
        document.getElementById("popularCount");

    const legalCount =
        document.getElementById("legalCount");

    const searchButton =
        document.getElementById("searchButton");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const closeSearch =
        document.getElementById("closeSearch");

    const searchInput =
        document.getElementById("searchInput");

    const sortSelect =
        document.getElementById("sortSelect");

    const themeButton =
        document.getElementById("themeButton");

    const modal =
        document.getElementById("gameModal");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalClose =
        document.getElementById("modalClose");

    const modalBody =
        document.getElementById("modalBody");

    let currentCategory = "all";

    let currentSearch = "";

    let currentSort = "latest";


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =================================================
       STATISTICS
    ================================================= */

    function updateStatistics() {

        const total =
            games.length;

        const popular =
            games.filter(game => game.popular).length;

        const legal =
            games.filter(game => game.legal).length;

        if (gameCount)
            gameCount.textContent = total;

        if (popularCount)
            popularCount.textContent = popular;

        if (legalCount)
            legalCount.textContent = legal;

    }


    /* =================================================
       GAME CARD
    ================================================= */

    function createGameCard(game) {

        const article =
            document.createElement("article");

        article.className =
            "game-card";

        article.innerHTML = `

            <div class="game-image">

                <img
                    src="${escapeHtml(game.image)}"
                    alt="${escapeHtml(game.title)}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x750/141722/ffffff?text=PlayVault'"
                >

                <span class="game-platform">
                    ${escapeHtml(game.platform)}
                </span>

                ${
                    game.popular
                    ? `
                        <span class="popular-badge">
                            <i class="fa-solid fa-fire"></i>
                        </span>
                    `
                    : ""
                }

            </div>


            <div class="game-info">

                <h3>
                    ${escapeHtml(game.title)}
                </h3>

                <div class="game-meta">

                    <span>
                        ${escapeHtml(game.year)}
                    </span>

                    <span class="game-rating">
                        ★ ${escapeHtml(game.rating)}
                    </span>

                </div>

                <button
                    class="game-button"
                    data-id="${escapeHtml(game.id)}"
                >
                    Lihat Detail
                </button>

            </div>
        `;


        const button =
            article.querySelector(".game-button");

        button.addEventListener("click", () => {

            openGameModal(game.id);

        });


        return article;

    }


    /* =================================================
       FILTER
    ================================================= */

    function getFilteredGames() {

        let result =
            [...games];


        if (currentCategory !== "all") {

            result =
                result.filter(game =>
                    String(game.platform).toLowerCase() ===
                    currentCategory.toLowerCase()
                );

        }


        if (currentSearch.trim()) {

            const query =
                currentSearch
                    .toLowerCase()
                    .trim();

            result =
                result.filter(game => {

                    return (

                        String(game.title)
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(game.genre)
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(game.platform)
                            .toLowerCase()
                            .includes(query)

                    );

                });

        }


        if (currentSort === "rating") {

            result.sort(
                (a, b) =>
                    Number(b.rating) -
                    Number(a.rating)
            );

        }


        else if (currentSort === "name") {

            result.sort(
                (a, b) =>
                    String(a.title)
                        .localeCompare(
                            String(b.title)
                        )
            );

        }


        else {

            result.sort(
                (a, b) =>
                    Number(b.year) -
                    Number(a.year)
            );

        }


        return result;

    }


    /* =================================================
       RENDER GAMES
    ================================================= */

    function renderGames() {

        if (!gameGrid)
            return;


        gameGrid.innerHTML = "";


        const filtered =
            getFilteredGames();


        if (!filtered.length) {

            if (emptyState)
                emptyState.classList.remove("hidden");

            return;

        }


        if (emptyState)
            emptyState.classList.add("hidden");


        filtered.forEach(game => {

            gameGrid.appendChild(
                createGameCard(game)
            );

        });

    }


    /* =================================================
       RENDER POPULAR
    ================================================= */

    function renderPopular() {

        if (!popularGrid)
            return;


        popularGrid.innerHTML = "";


        const popularGames =
            games.filter(
                game => game.popular
            );


        popularGames
            .slice(0, 8)
            .forEach(game => {

                popularGrid.appendChild(
                    createGameCard(game)
                );

            });

    }


    /* =================================================
       MODAL
    ================================================= */

    function openGameModal(id) {

        const game =
            games.find(
                item => String(item.id) === String(id)
            );


        if (!game || !modal || !modalBody)
            return;


        modalBody.innerHTML = `

            <div class="modal-body">

                <img
                    class="modal-cover"
                    src="${escapeHtml(game.image)}"
                    alt="${escapeHtml(game.title)}"
                    onerror="this.src='https://placehold.co/600x750/141722/ffffff?text=PlayVault'"
                >

                <h2>
                    ${escapeHtml(game.title)}
                </h2>


                <p class="modal-description">
                    ${escapeHtml(game.description)}
                </p>


                <div class="modal-details">

                    <div class="detail-item">
                        <span>Platform</span>
                        ${escapeHtml(game.platform)}
                    </div>

                    <div class="detail-item">
                        <span>Genre</span>
                        ${escapeHtml(game.genre)}
                    </div>

                    <div class="detail-item">
                        <span>Tahun</span>
                        ${escapeHtml(game.year)}
                    </div>

                    <div class="detail-item">
                        <span>Rating</span>
                        ★ ${escapeHtml(game.rating)}
                    </div>

                    <div class="detail-item">
                        <span>Ukuran</span>
                        ${escapeHtml(game.size)}
                    </div>

                    <div class="detail-item">
                        <span>Developer</span>
                        ${escapeHtml(game.developer)}
                    </div>

                    <div class="detail-item">
                        <span>Publisher</span>
                        ${escapeHtml(game.publisher)}
                    </div>

                    <div class="detail-item">
                        <span>Bahasa</span>
                        ${escapeHtml(game.language)}
                    </div>

                </div>


                ${
                    game.download_url
                    ? `
                        <a
                            class="download-button"
                            href="${escapeHtml(game.download_url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fa-solid fa-download"></i>
                            Download
                        </a>
                    `
                    : `
                        <div class="download-button">
                            Link belum tersedia
                        </div>
                    `
                }

            </div>
        `;


        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeGameModal() {

        if (!modal)
            return;

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* =================================================
       SEARCH
    ================================================= */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            () => {

                searchOverlay.classList.add("active");

                setTimeout(() => {

                    searchInput.focus();

                }, 100);

            }
        );

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchOverlay.classList.remove(
                    "active"
                );

            }
        );

    }


    if (searchOverlay) {

        searchOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    searchOverlay
                ) {

                    searchOverlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                currentSearch =
                    event.target.value;

                renderGames();

            }
        );

    }


    /* =================================================
       CATEGORY
    ================================================= */

    document
        .querySelectorAll(".category-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-button"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentCategory =
                        button.dataset.category;


                    renderGames();

                }
            );

        });


    /* =================================================
       SORT
    ================================================= */

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            event => {

                currentSort =
                    event.target.value;

                renderGames();

            }
        );

    }


    /* =================================================
       THEME
    ================================================= */

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light"
                );


                const icon =
                    themeButton.querySelector("i");


                if (
                    document.body.classList.contains(
                        "light"
                    )
                ) {

                    icon.className =
                        "fa-solid fa-sun";

                }

                else {

                    icon.className =
                        "fa-solid fa-moon";

                }

            }
        );

    }


    /* =================================================
       MODAL EVENTS
    ================================================= */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeGameModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeGameModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeGameModal();

                if (searchOverlay)
                    searchOverlay.classList.remove(
                        "active"
                    );

            }

        }
    );


    /* =================================================
       START
    ================================================= */

    updateStatistics();

    renderGames();

    renderPopular();

    console.log(
        "🎮 PlayVault berhasil diinisialisasi"
    );

});