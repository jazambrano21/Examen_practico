/*!
* Start Bootstrap - Full Width Pics v5.0.6 (https://startbootstrap.com/template/full-width-pics)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-full-width-pics/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// Añadir animaciones al entrar al viewport
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".animate__animated");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Añade una animación diferente según el tipo de elemento
                    if (entry.target.tagName === "IMG") {
                        entry.target.classList.add("animate__fadeInUp");
                    } else if (entry.target.tagName === "H2") {
                        entry.target.classList.add("animate__zoomIn");
                    }
                    observer.unobserve(entry.target); // Deja de observar el elemento
                }
            });
        },
        { threshold: 0.5 } // Se activa cuando el 50% del elemento es visible
    );

    elements.forEach((el) => observer.observe(el));
});
