let navigateFn = null;

export const setNavigator = (navigate) => {
    navigateFn = navigate;
};

export const goToLogin = () => {
    if (navigateFn) navigateFn('/login');
};

let setAccessTokenFn = null;

export const setAccessTokenOutside = (set)=>{
    setAccessTokenFn = set
}

export function updateAccessTokenInIntercepter(accessToken) {
    console.log('in redirect1: ',accessToken);
  if (setAccessTokenFn) setAccessTokenFn(accessToken);
  console.log('in redirect: ',accessToken);
  
}
