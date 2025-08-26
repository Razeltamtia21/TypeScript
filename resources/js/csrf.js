import axios from 'axios';

// Konfigurasi axios untuk CSRF token
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Ambil token dari meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
    console.error('CSRF token not found in meta tag');
}

// Fallback ke cookie
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const cookieToken = getCookie('XSRF-TOKEN');
if (cookieToken && !token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = decodeURIComponent(cookieToken);
    console.log('Using CSRF token from cookie');
}