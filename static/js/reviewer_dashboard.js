document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       Animated Counter
    ========================== */

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = parseInt(counter.dataset.target) || 0;

        let current = 0;

        const duration = 1000;

        const increment = Math.max(1, Math.ceil(target / (duration / 16)));

        function updateCounter() {

            current += increment;

            if (current >= target) {

                counter.innerText = target.toLocaleString();

                return;

            }

            counter.innerText = current.toLocaleString();

            requestAnimationFrame(updateCounter);

        }

        requestAnimationFrame(updateCounter);

    });



    /* ==========================
       Progress Bar Animation
    ========================== */

    const progressBar = document.querySelector(".animated-progress");

    if (progressBar) {

        const progress = progressBar.dataset.progress || 0;

        setTimeout(() => {

            progressBar.style.width = progress + "%";

        }, 250);

    }



    /* ==========================
       Stagger Card Animation
    ========================== */

    const cards = document.querySelectorAll(".stat-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        card.style.transition = "all .5s ease";

        setTimeout(() => {

            card.style.opacity = "1";

            card.style.transform = "translateY(0px)";

        }, 250 + (index * 120));

    });



    /* ==========================
       Queue Hover Effect
    ========================== */

    document.querySelectorAll(".queue-item").forEach(item => {

        item.addEventListener("mouseenter", () => {

            item.style.transition = "all .3s";

        });

    });



    /* ==========================
       Primary Button Shine
    ========================== */

    const primary = document.querySelector(".primary-action");

    if(primary){

        primary.addEventListener("mouseenter", () => {

            primary.animate([

                { transform: "translateY(-6px) scale(1)" },

                { transform: "translateY(-8px) scale(1.02)" },

                { transform: "translateY(-6px) scale(1)" }

            ],{

                duration:300

            });

        });

    }



    /* ==========================
       Stat Card Bounce
    ========================== */

    setTimeout(() => {

        cards.forEach((card, index) => {

            setTimeout(() => {

                card.animate([

                    { transform:"translateY(0px)" },

                    { transform:"translateY(-6px)" },

                    { transform:"translateY(0px)" }

                ],{

                    duration:350

                });

            }, index*70);

        });

    },1200);



});