<template>
  <div class="home">
    <h1>Bienvenue sur VaultPass</h1>
    <p>Gérez vos mots de passe en toute sécurité</p>
    <div class="actions">
      <router-link to="/generator" class="btn-primary">Générer un mot de passe</router-link>
      <router-link to="/login" class="btn-secondary">Se connecter</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple view
</script>

<style scoped>
.home {
  padding: 16px;
  text-align: center;
}

h1 {
  color: var(--color-text);
  margin-bottom: 8px;
}

p {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-surface-hover);
}
</style>
