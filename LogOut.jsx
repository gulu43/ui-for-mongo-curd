import React from 'react';

export function LogOut() {
    const logout = () => {
        sessionStorage.clear()
        localStorage.clear()
    }
    return (
        <button onClick={logout}>
            logout
        </button>
    );
}