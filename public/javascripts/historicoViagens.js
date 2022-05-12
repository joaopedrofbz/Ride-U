console.clear();
const appEl = document.querySelector("#app");
const notificationEl = appEl.querySelector(".notification");
const toggleEl = notificationEl.querySelector(".notification-header");

// Adiciona click event no Listener
toggleEl.addEventListener("click", () => {
  // Usa FLIP para dar trigger as animacoes
  flip(() => {
    appEl.dataset.state = appEl.dataset.state === "closed" ? "opened" : "closed";
  }, notificationEl)
  // Adicionar flip ao conteudo
  flip(() => {}, appEl.querySelector('.app-content'));
});

// F.L.I.P
const flip = (doSomething, firstEl, getLastEl = () => firstEl) => {
  // Primeiro
  const firstElRect = firstEl.getBoundingClientRect();

  requestAnimationFrame(() => {
    doSomething();

    // Ultimo
    let lastEl = getLastEl();
    const lastElRect = lastEl.getBoundingClientRect();

    // Inverte
    const dx = lastElRect.x - firstElRect.x;
    const dy = lastElRect.y - firstElRect.y;
    const dw = lastElRect.width / firstElRect.width;
    const dh = lastElRect.height / firstElRect.height;

    console.log({ dx, dy, dh, dw });

    lastEl.dataset.flipping = true;
    lastEl.style.setProperty("--dx", dx);
    lastEl.style.setProperty("--dy", dy);
    lastEl.style.setProperty("--dw", dw);
    lastEl.style.setProperty("--dh", dh);

    // Play
    requestAnimationFrame(() => {
      delete lastEl.dataset.flipping;
    });
  });
};
