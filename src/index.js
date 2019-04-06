import { startApp } from './scripts/index.js';
import './styles/base/reset.styl';
import './styles/utils/helpers.styl'
// import './static/fonts/seat-bcn/stylesheet.styl';
// import './static/fonts/seat-bcn-condensed/stylesheet.styl';
import './styles/components/buttons.styl';
// import './styles/components/schedule.styl';
import './styles/vendor/vendor.styl';

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});