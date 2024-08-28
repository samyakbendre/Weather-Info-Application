<template>
    <div class="signup-container">
      <div class="signup-card">
        <h2 class="signup-title">Sign Up</h2>
        <form @submit.prevent="signup" class="signup-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': usernameError }"
              placeholder="Enter your username"
            />
            <p v-if="usernameError" class="error-text">{{ usernameError }}</p>
          </div>
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
            class="signup-button"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border"></span>
            Sign Up
          </button>
          <p v-if="signupError" class="error-text">{{ signupError }}</p>
        </form>
        <p class="signup-footer">
          Already have an account?
          <router-link to="/login" class="login-link">Log In</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        loading: false,
        usernameError: '',
        emailError: '',
        passwordError: '',
        signupError: ''
      };
    },
    methods: {
      async signup() {
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
        this.signupError = '';
  

        if (!this.username) {
          this.usernameError = 'Username is required';
          return;
        }
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
          const response = await axios.post('http://localhost:3000/users', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          console.log('User signed up successfully:', response.data);
          this.$router.push('/login');
        } catch (error) {
          console.error('Signup error:', error);
          this.signupError = 'An error occurred during signup';
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
  
  .signup-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-background);
    width: 100%;
  }
  
  .signup-card {
    max-width: 400px;
    width: 100%;
    background: var(--color-background-soft);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .signup-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: var(--color-heading);
  }
  
  .signup-form .form-group {
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
  
  .signup-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background: var(--color-heading);
    color: var(--color-background);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .signup-button:hover {
    background: rgba(200, 214, 247, 0.889);
    color: black;
  }
  
  .signup-button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
  
  .signup-footer {
    margin-top: 1rem;
    text-align: center;
  }
  
  .login-link {
    color: var(--color-heading);
    text-decoration: underline;
  }
  
  .login-link:hover {
    color: darken(var(--color-heading), 10%);
  }
  </style>
  