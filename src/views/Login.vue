<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <br />
      <input v-model="email" type="email" placeholder="Email" required />
      <br />
      <label for="password">Password</label>
      <br />
      <input v-model="password" type="password" placeholder="Password" required />
      <br />
      <br />
      <button type="submit">Log In</button>
    </form>
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

    // Store token and optionally user info
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))

    // Navigate to home page
    router.push({ name: 'Home' })
  } catch (error) {
    alert('Login failed')
    console.error(error)
  }
}

</script>
