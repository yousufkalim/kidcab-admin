baseUrl = 'http://localhost:5000/api/';
CAPTCHA_SITE_KEY = '6LdQNMAgAAAAAEM7_lQp7AffR2NiAPq_ZUVtVA6x';

if (window.location.host === 'kidcab-admin-dev.falconweb.app') {
  baseUrl = 'https://kidcab-api-dev.falconweb.app/api/';
} else if (window.location.host === 'kidcab-admin-qa.falconweb.app') {
  baseUrl = 'https://kidcab-api-qa.falconweb.app/api/';
} else if (window.location.host === 'kidcab-admin-staging.falconweb.app') {
  baseUrl = 'https://kidcab-api-staging.falconweb.app/api/';
} else if (window.location.host === 'kidcab-admin-prod.falconweb.app') {
  baseUrl = 'https://kidcab-api-prod.falconweb.app/api/';
}

module.exports = { baseUrl };
