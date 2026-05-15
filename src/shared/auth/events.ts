export const AUTH_LOGOUT_EVENT = 'tsv:auth:logout';
export const AUTH_TOKEN_REFRESHED_EVENT = 'tsv:auth:token-refreshed';

export const emitAuthLogout = (): void => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
};

export const emitTokenRefreshed = (): void => {
  window.dispatchEvent(new CustomEvent(AUTH_TOKEN_REFRESHED_EVENT));
};
