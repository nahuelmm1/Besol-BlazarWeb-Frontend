import { OpaqueToken } from '@angular/core';

// import translations
import { LANG_EN_TRANS } from './lang-en';
import { LANG_EN_ERRORCODE_TRANS } from './lang-en-errorcodes';
import { LANG_ES_TRANS } from './lang-es';
import { LANG_ES_ERRORCODE_TRANS } from './lang-es-errorcodes';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

// all translations
export const dictionary = {
    en: Object.assign(LANG_EN_TRANS, LANG_EN_ERRORCODE_TRANS),
    es: Object.assign(LANG_ES_TRANS, LANG_ES_ERRORCODE_TRANS),
};

//providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
