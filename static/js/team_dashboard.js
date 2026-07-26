document.addEventListener("DOMContentLoaded", () => {

    /* ==================================================
       Animated Counters
    ================================================== */

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target =
            parseInt(counter.dataset.target, 10) || 0;

        let current = 0;

        const duration = 850;

        const frames = duration / 16;

        const increment =
            Math.max(1, Math.ceil(target / frames));


        function updateCounter() {

            current += increment;

            if (current >= target) {

                counter.innerText =
                    target.toLocaleString();

                return;

            }

            counter.innerText =
                current.toLocaleString();

            requestAnimationFrame(updateCounter);

        }


        requestAnimationFrame(updateCounter);

    });



    /* ==================================================
       Translation Progress Animation
    ================================================== */

    const progressBar =
        document.querySelector(".animated-progress");

    if (progressBar) {

        let progress =
            parseInt(progressBar.dataset.progress, 10) || 0;

        progress =
            Math.min(100, Math.max(0, progress));

        setTimeout(() => {

            progressBar.style.width =
                progress + "%";

        }, 250);

    }



    /* ==================================================
       Stat Card Entrance
    ================================================== */

    const statCards =
        document.querySelectorAll(".stat-card");

    statCards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(15px)";

        card.style.transition =
            "opacity .45s ease, transform .45s ease";


        setTimeout(() => {

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, 300 + (index * 70));

    });



    /* ==================================================
       Primary Action Animation
    ================================================== */

    const primary =
        document.querySelector(".primary-action");

    if (primary) {

        primary.addEventListener(
            "mouseenter",
            () => {

                primary.animate(

                    [
                        {
                            transform:
                                "translateY(-5px) scale(1)"
                        },

                        {
                            transform:
                                "translateY(-6px) scale(1.015)"
                        },

                        {
                            transform:
                                "translateY(-5px) scale(1)"
                        }
                    ],

                    {
                        duration: 280
                    }

                );

            }
        );

    }

});