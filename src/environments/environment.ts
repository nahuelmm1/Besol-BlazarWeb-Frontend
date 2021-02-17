// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  googleApi: '',
  API: 'http://localhost:65259/',
  REMEMBER_ME_STORAGE_KEY: 'remember_me',
  AUTH_TOKEN_STORAGE_KEY: 'id_token',
  AUTH_PROFILE_STORAGE_KEY: 'user_data',
  SETTINGS_STORAGE_KEY: 'settings_data',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm',
  SHORT_DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_LANG: 'en',
  CURRENT_LANG: 'es',
  PRODUCT_IMAGE_PATH: 'http://besol.com.ar/img/imagenProducto/',
  CURRENCY: {
    CODE: 'ARS',
    FORMAT: '1.2-2'
  },
  LOCALE: 'es-AR'
};
