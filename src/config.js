let baseUrl = 'https://kidcab-api-dev.falconweb.app/';
let CAPTCHA_SITE_KEY = '6LdQNMAgAAAAAEM7_lQp7AffR2NiAPq_ZUVtVA6x';
if (window.location.host === 'kidcab-admin-dev.falconweb.app') {
  baseUrl = 'https://kidcab-api-dev.falconweb.app/';
} else if (window.location.host === 'kidcab-admin-qa.falconweb.app') {
  baseUrl = 'https://kidcab-api-qa.falconweb.app/';
} else if (window.location.host === 'kidcab-admin-staging.falconweb.app') {
  baseUrl = 'https://kidcab-api-staging.falconweb.app/';
} else if (window.location.host === 'admin.kidcab.fr') {
  baseUrl = 'https://api.kidcab.fr/';
} else if (window.location.host === 'localhost:3000') {
  baseUrl = 'http://localhost:5000/';
}

module.exports = { baseUrl, CAPTCHA_SITE_KEY };
