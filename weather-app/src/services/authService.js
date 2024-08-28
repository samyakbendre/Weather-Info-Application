export default {
    isAuthenticated() {
      return !!localStorage.getItem('user');
    },
    login(user) {
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      localStorage.removeItem('user');
    },
    getUser() {
      return JSON.parse(localStorage.getItem('user'));
    }
  };
  