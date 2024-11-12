<template>
  <RouterView />
  <PaymentForm />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<script>
import PaymentForm from './components/PaymentForm.vue';

export default {
  components: {
    PaymentForm
  }
};
</script>

