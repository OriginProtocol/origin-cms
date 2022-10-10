import favicon from './extensions/origin-32x32.png';
import logo from './extensions/origin-logo.png';

const config = {
  auth: {
    logo,
  },
  head: {
    favicon,
  },
  menu: {
    logo: favicon,
  },
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'Origin CMS',
      'app.components.LeftMenu.navbrand.workplace': 'Admin Dashboard',
    },
  },
};

const bootstrap = () => {};

export default {
  config,
  bootstrap,
};
