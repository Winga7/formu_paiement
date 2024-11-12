<template>
  <div class="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-md shadow-md">
    <h1 class="text-2xl font-bold mb-4">Formulaire de Paiement</h1>
    <div class="relative mb-4">
      <div :class="['credit-card', isFlipped ? 'flipped' : '', cardType]" @click="flipCard">
        <div class="front">
          <div class="flex justify-between items-center">
            <div class="text-sm font-medium">{{ cardType.toUpperCase() }}</div>
            <img :src="cardLogo" alt="Card Logo" class="h-8">
          </div>
          <div class="mt-6 text-xl font-semibold tracking-widest">{{ maskedCardNumber }}</div>
          <div class="mt-6">
            <div class="text-xs">Titulaire de la carte</div>
            <div class="text-lg font-medium">{{ cardholderName || 'NOM DU TITULAIRE' }}</div>
          </div>
        </div>
        <div class="back">
          <div class="text-right text-lg font-medium">{{ cvv || 'CVV' }}</div>
        </div>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="cardholder-name" class="block text-sm font-medium text-gray-300">Titulaire de la carte:</label>
        <input type="text" id="cardholder-name" v-model="cardholderName" required class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white">
      </div>
      <div>
        <label for="card-number" class="block text-sm font-medium text-gray-300">Numéro de carte:</label>
        <input type="text" id="card-number" v-model="formattedCardNumber" @input="updateCardType" maxlength="19" required class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white">
      </div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <label for="expiry-date" class="block text-sm font-medium text-gray-300">Date d'expiration (MM/AA):</label>
          <vue-datepicker-next v-model="expiryDate" :format="formatDate" :input-class="'mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white'" />
        </div>
        <div class="flex-1">
          <label for="cvv" class="block text-sm font-medium text-gray-300">CVV:</label>
          <input type="text" id="cvv" v-model="cvv" @focus="flipCard(true)" @blur="flipCard(false)" maxlength="3" required class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white">
        </div>
      </div>
      <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Soumettre</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import visaLogo from '@/assets/visa.svg';
import mastercardLogo from '@/assets/mastercard.svg';

export default {
  components: {
    'vue-datepicker-next': Datepicker
  },
  setup() {
    const cardholderName = ref('');
    const cardNumber = ref('');
    const expiryDate = ref('');
    const cvv = ref('');
    const isFlipped = ref(false);
    const cardType = ref('');
    const cardLogo = ref('');

    const handleSubmit = () => {
      if (!validateCardNumber(cardNumber.value)) {
        alert('Numéro de carte invalide.');
        return;
      }

      if (!validateExpiryDate(expiryDate.value)) {
        alert('Date d\'expiration invalide ou expirée.');
        return;
      }

      if (!validateCVV(cvv.value)) {
        alert('CVV invalide.');
        return;
      }

      alert('Paiement accepté.');
    };

    const validateCardNumber = (cardNumber) => {
      const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/;
      return regex.test(cardNumber);
    };

    const validateExpiryDate = (expiryDate) => {
      const [month, year] = expiryDate.split('/').map(Number);
      if (month < 1 || month > 12) return false;

      const now = new Date();
      const expiry = new Date(`20${year}`, month - 1);
      return expiry >= now;
    };

    const validateCVV = (cvv) => {
      const regex = /^[0-9]{3,4}$/;
      return regex.test(cvv);
    };

    const formatDate = (date) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString().slice(-2);
      return `${month < 10 ? '0' : ''}${month}/${year}`;
    };

    const updateCardType = () => {
      const firstDigit = cardNumber.value[0];
      if (firstDigit === '4') {
        cardType.value = 'visa';
        cardLogo.value = visaLogo;
      } else if (firstDigit === '5') {
        cardType.value = 'mastercard';
        cardLogo.value = mastercardLogo;
      } else {
        cardType.value = '';
        cardLogo.value = '';
      }
    };

    const flipCard = (flip) => {
      isFlipped.value = flip;
    };

    const formattedCardNumber = computed({
      get() {
        return cardNumber.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      },
      set(value) {
        cardNumber.value = value.replace(/\s/g, '');
      }
    });

    const maskedCardNumber = computed(() => {
      const number = cardNumber.value.replace(/\s/g, '');
      if (number.length === 0) return '**** **** **** ****';
      if (number.length <= 4) return number;
      const visibleStart = number.slice(0, 4);
      const visibleEnd = number.slice(-4);
      const maskedMiddle = number.slice(4, -4).replace(/\d/g, '*');
      return `${visibleStart} ${maskedMiddle} ${visibleEnd}`.replace(/(.{4})/g, '$1 ').trim();
    });

    return {
      cardholderName,
      cardNumber,
      expiryDate,
      cvv,
      isFlipped,
      cardType,
      cardLogo,
      handleSubmit,
      validateCardNumber,
      validateExpiryDate,
      validateCVV,
      formatDate,
      updateCardType,
      flipCard,
      formattedCardNumber,
      maskedCardNumber
    };
  }
};
</script>

<style scoped>
.credit-card {
  width: 100%;
  height: 200px;
  perspective: 1000px;
  margin-bottom: 1rem;
}
.credit-card .front,
.credit-card .back {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  backface-visibility: hidden;
  transition: transform 0.6s;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem;
  box-sizing: border-box;
}
.credit-card .front {
  background-color: #1a202c;
  color: white;
}
.credit-card.visa .front {
  background-color: #1a73e8;
}
.credit-card.mastercard .front {
  background-color: #e63946;
}
.credit-card .back {
  background-color: #1a202c;
  color: white;
  transform: rotateY(180deg);
}
.credit-card.flipped .front {
  transform: rotateY(180deg);
}
.credit-card.flipped .back {
  transform: rotateY(0deg);
}
</style>
