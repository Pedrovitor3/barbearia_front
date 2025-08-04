import { domainNameProd, domainNameDesv } from './sistemaConfig';
export const urlsServices = {
  BACKENDWS: 'URLBACKENDPROD',
};
export let ambiente = '';

if (window.location.hostname.indexOf(domainNameProd) > -1) {
  urlsServices.BACKENDWS = 'https://bigode-time.duckdns.org/';
  ambiente = 'PROD';
} else {
  urlsServices.BACKENDWS = 'https://bigode-time.duckdns.org/';
  ambiente = 'HOMO';
  if (window.location.hostname.indexOf(domainNameDesv) > -1) {
    //PARA DESENVOLVIMENTO
    urlsServices.BACKENDWS = 'http://localhost:3000/';
    //urlsServices.BACKENDWS = 'https://sisbgws-homo.policiacivil.go.gov.br';
    //urlsServices.BACKEND = 'URLBACKENDHOMO';
  }
}
