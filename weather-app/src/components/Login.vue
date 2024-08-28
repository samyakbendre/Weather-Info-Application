<template>
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">Log In</h2>
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'border-red-500': emailError }"
              placeholder="Enter your email"
            />
            <p v-if="emailError" class="error-text">{{ emailError }}</p>
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              :class="{ 'border-red-500': passwordError }"
              placeholder="Enter your password"
            />
            <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
          </div>
          <button
            type="submit"
            class="submit-button"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border"></span>
            Log In
          </button>
          <p v-if="loginError" class="error-text">{{ loginError }}</p>
        </form>
        <p class="signup-prompt">
          Don't have an account?
          <router-link to="/signup" class="signup-link">Sign Up</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import authService from '@/services/authService';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        emailError: '',
        passwordError: '',
        loginError: ''
      };
    },
    methods: {
      async login() {
        this.emailError = '';
        this.passwordError = '';
        this.loginError = '';
  
        if (!this.email) {
          this.emailError = 'Email is required';
          return;
        }
        if (!this.password) {
          this.passwordError = 'Password is required';
          return;
        }
  
        this.loading = true;
  
        try {
          const response = await axios.get('http://localhost:3000/users', {
            params: {
              email: this.email,
              password: this.password
            }
          });
          const user = response.data.find(
            user => user.email === this.email && user.password === this.password
          );
          if (user) {
            console.log('User logged in successfully:', user);
            authService.login(user);
            this.$router.push('/home');
          } else {
            this.loginError = 'Invalid email or password';
          }
        } catch (error) {
          console.error('Login error:', error);
          this.loginError = 'An error occurred while logging in';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>

  .spinner-border {
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top: 2px solid #ffffff;
    width: 1.5em;
    height: 1.5em;
    animation: spin 0.75s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-card {
    max-width: 400px;
    width: 100%;
    background: var(--color-background-soft);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-border);
  }
  
  .login-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: var(--color-heading);
  }
  
  .login-form .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-background);
    color: var(--color-text);
    transition: border-color 0.3s ease-in-out;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--color-heading);
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
  
  .error-text {
    color: var(--color-text-error);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .submit-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background: var(--color-heading);
    color: var(--color-background);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .submit-button:hover {
    background: rgba(200, 214, 247, 0.889);
    color:black
  }
  
  .submit-button:disabled {
    background-color: #b0bec5; 
    cursor: not-allowed;
  }
  
  .signup-prompt {
    margin-top: 1.5rem;
    text-align: center;
    color: var(--color-text);
  }
  
  .signup-link {
    color: var(--color-heading);
    text-decoration: underline;
  }
  
  .signup-link:hover {
    color: darken(var(--color-heading), 10%);
  }
  </style>
  