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
  if (setAccessTokenFn) setAccessTokenFn(accessToken);
  console.log('update Access Trigger: ',accessToken);
  
}
