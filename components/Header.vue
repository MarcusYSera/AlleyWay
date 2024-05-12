<template>
  <header class="header">
    <div class="logo">AlleyWay</div>
    <nav>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
        <li><nuxt-link to="/game-page">Game</nuxt-link></li>
        <!-- Add more navigation links as needed -->
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
export default {
  name: 'Header',
  // Component options (data, methods, etc.) go here
}
</script>

<style scoped>
/* Add styles for the header component */
.header {
  background-color: #414931;
  color: #fff;
  padding: 10px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav ul li {
  display: inline-block;
  margin-right: 10px;
}

nav ul li:last-child {
  margin-right: 0;
}
a:link {
  color: white;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: white;
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: white;
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: white;
  background-color: transparent;
  text-decoration: underline;
}
</style>
