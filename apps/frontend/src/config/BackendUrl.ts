declare const process: any;

function getBackendUrlHost() {
  const defaultUrl = 'http://localhost:2200';
  const envUrl = process?.env?.BACKEND_URL || '';
  const localStorageUrl = localStorage.getItem('backendUrl') || '';
  const urlParam = new URLSearchParams(window.location.search).get('api') || '';
  const result =  urlParam || localStorageUrl || envUrl || defaultUrl;
  const resultWithoutTrailingSlash = result.replace(/\/$/, '');
  return resultWithoutTrailingSlash;
}

export function getBackendApiUrl() {
  return getBackendUrlHost();
}

export function getBackendSocketUrl() {
  return getBackendUrlHost().replace(/^http/, 'ws');
}
