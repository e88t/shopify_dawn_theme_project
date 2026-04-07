document.addEventListener("DOMContentLoaded", () => {

  const accordions = document.querySelectorAll(".footer-block__details");

  accordions.forEach(acc => {

    const heading = acc.querySelector(".footer-block__heading");
    const content = acc.querySelector(".footer-block__details-content");

    heading.addEventListener("click", () => {

      if (window.innerWidth > 768) return;

      acc.classList.toggle("active");

      if (acc.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }

    });

  });

});