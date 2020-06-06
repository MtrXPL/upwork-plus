const KEYS = {
  en: {
    "hourly": "Hourly",
    "job-quality": "Job Quality",
    "regular-job": "Regular",
    "interesting-job": "Interesting",
    "featured-job": "Featured",
    "budget-hourly": "Budget hourly",
    "unspecified": "Unspecified"
  }
};

const language = "en";

const translate = (key) => KEYS[language][key] || key;

module.exports = {
  translate,
};
