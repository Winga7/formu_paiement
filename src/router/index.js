import { createRouter, createWebHistory } from "vue-router";
import PaymentForm from "../components/PaymentForm.vue"; // Assurez-vous que ce chemin est correct

const routes = [
  {
    path: "/payment",
    name: "PaymentForm",
    component: PaymentForm,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
