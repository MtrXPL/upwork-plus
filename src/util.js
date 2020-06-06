const waitUntilReady = () =>
  new Promise((resolve) => {
    const check = setInterval(() => {
      if (document.readyState === "complete") {
        clearInterval(check);
        resolve();
      }
    }, 10);
  });

const waitForSelector = (selector, parentEl, single = true) =>
  new Promise((resolve) => {
    const check = setInterval(() => {
      const r = [...(parentEl || document).querySelectorAll(selector)];

      if (r && r.length !== 0) {
        clearInterval(check);
        resolve(single ? r[0] : r);
      }
    }, 10);
  });

module.exports = {
  waitUntilReady,
  waitForSelector
};
