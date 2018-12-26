$(() => {
    // Show tooltips on titles width data-toggles
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-toggle="popover"]').popover();

    // Hide mobile menu when cross clicked
    $(".navmenu .navbar-nav a").click(() => {
        $("#mobile-menu").offcanvas('hide');
    });
    $(".menu-close").on('click', () => {
        $('.navmenu').offcanvas("hide");
    });
});

// All functions after page loaded
$(document).ready(function () {

    // Fill star on hover
    $(".far.fa-star").hover(function (event) {
        event.preventDefault();
        $(this).parent("a").prevAll().find("span").toggleClass("far fas");
        $(this).toggleClass("far fas");
    });


    // scroll to top
    $(() => {
        const toTop = $('#toTop');
        if (toTop.length) {
            const scrollTrigger = 100, // px
                backToTop = function () {
                    let scrollTop = $(window).scrollTop();
                    if (scrollTop > scrollTrigger) {
                        toTop.show();
                    } else {
                        toTop.hide();
                    }
                };
            backToTop();
            $(window).on('scroll', function () {
                backToTop();
            });
            toTop.on('click', function (e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 800);
            });
        }
    });

    // Cookies accept
    $("#iAcceptPolicy").click(() => {
        let cookiePanel = $("#cookiesUse");
        $.cookie("acceptPolicy", 1, {
            expires: 360,
            path: '/'
        });
        cookiePanel.animate({
            bottom: -cookiePanel.height()
        }, 50, function () {
            $(this).addClass('d-none')
        })
    });

    console.log("Helper done...");
});


