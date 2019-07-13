import { PWA } from './pwa.js';
import { askPermission } from './ask-permissions.js';
import { downloadPrompter } from './download-prompter.js';

downloadPrompter();
askPermission();

export const pwaGen = PWA;
