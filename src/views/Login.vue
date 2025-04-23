<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Welcome Back</h1>
      <p>Please log in to continue</p>
      <form @submit.prevent="login">
        <label for="email">Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" required />

        <label for="password">Password</label>
        <input v-model="password" type="password" placeholder="Password" required />

        <button type="submit">Log In</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '@/config'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: email.value,
      password: password.value
    })

    const { token, user } = response.data.data

    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))

    router.push({ name: 'Home' })
  } catch (error) {
    alert('Login failed')
    console.error(error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #141e30, #243b55);
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
}

.login-card {
  background-color: #1f1f2e;
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.login-card h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.login-card p {
  margin-bottom: 20px;
  color: #bbb;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  text-align: left;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 1rem;
  background: #2e2e3a;
  color: white;
}

button {
  margin-top: 15px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ff4f81;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #e23a68;
}
</style>
