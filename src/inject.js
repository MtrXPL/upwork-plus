const i18n = require("./i18n");
const util = require("./util");
const buildFilterItems = require("./filters.ejs");

// enable all filters by default since there is no peristency
const filters = {
  "regular-job": true,
  "interesting-job": true,
  "featured-job": true,
  "unspecified": true,
  "$5-$10": true,
  "$10-$20": true,
  "$20-$30": true,
  "$30-$40": true,
  "$40-$50": true,
  "$50-$65": true,
  "$65-$80": true,
  "$80+": true
};

const updateFeed = async () => {
  for (let el of await util.waitForSelector("section.job-tile", document, false)) {
    el.classList.add("was-processed");

    // check the job quality
    const isInteresting = !!el.querySelector(".badge.badge-recommended:not(.badge-featured)");
    const isFeatured = !!el.querySelector(".badge.badge-featured");

    const isQualityAccepted =
      (filters["interesting-job"] && isInteresting) ||
      (filters["featured-job"] && isFeatured) ||
      filters["regular-job"];

    if (!isQualityAccepted) {
      el.style.display = "none";
      continue;
    }

    // check the job hourly budget
    const type = el.querySelector("[data-job-type]").textContent.trim();

    if (!filters["unspecified"] && type === i18n.translate("hourly")) {
      el.style.display = "none";
      continue;
    }

    const re = /\$(?<min>[0-9\.]+)-\$(?<max>[0-9\.]+)$/.exec(type);

    if (re) {
      const min = Number(re.groups.min);
      const max = Number(re.groups.max);

      const isWithinBudget = 
        (filters["$5-$10"] && min >= 5 && max <= 10) ||
        (filters["$10-$20"] && min >= 10 && max <= 20) ||
        (filters["$20-$30"] && min >= 20 && max <= 30) ||
        (filters["$30-$40"] && min >= 30 && max <= 40) ||
        (filters["$40-$50"] && min >= 40 && max <= 50) ||
        (filters["$50-$65"] && min >= 50 && max <= 65) ||
        (filters["$65-$80"] && min >= 65 && max <= 80) ||
        (filters["$80+"] && min >= 80);

      if (!isWithinBudget) {
        el.style.display = "none";
        continue;
      }
    }

    el.style.display = "";
  }
};

chrome.extension.sendMessage({}, async () => {
  await util.waitUntilReady();

  // insert extra filters
  const extraFiltersEl = document.createElement("div");

  extraFiltersEl.innerHTML = buildFilterItems({
    translate: i18n.translate,
    filters
  });

  const filterTrayEl = await util.waitForSelector("[data-filter-tray] > div");
  filterTrayEl.insertBefore(extraFiltersEl, filterTrayEl.firstChild);

  // register event handlers for all added filters
  for (let inputEl of [...extraFiltersEl.querySelectorAll(`input[type="checkbox"]`)]) {
    inputEl.onchange = async function() {
      const key = this.getAttribute("key");
      filters[key] = this.checked;
      await updateFeed();
    }
  }

  // update the feed whenever new entries are added
  while (true) {
    await util.waitForSelector(`section.job-tile:not(.was-processed)`);
    await updateFeed();
  }
});
