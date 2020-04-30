<template>
<v-form :key="key">
    <v-container fluid>
      <v-row><v-col><v-card>
	    <v-card-title>Make credit card payment</v-card-title>
	    <v-card-subtitle>You may pay the Program Fees or make a donation to the Ross Mathematics Foundation.</v-card-subtitle>
	    <v-card-text>
	      <v-layout wrap>
	      <v-layout wrap>
		<v-text-field
		    class="mr-4"
		    label="Name on card"
		    v-model="name"
		    >
		    <v-icon slot="prepend">mdi-account</v-icon>
		  </v-text-field>
	      </v-layout>
	      <v-layout wrap>
		<v-icon slot="prepend">mdi-currency-usd</v-icon>
		<v-currency-field
		  class="mr-4"
		  label="Amount"
		  v-model="amount"
		  >
		</v-currency-field>
	      </v-layout>
	      </v-layout>

	      <v-layout wrap>
		<v-layout wrap>
		<v-stripe-card
		  :hideIcon="true"
		  v-model="source"
		  :api-key="stripeKey"
		  >
		  <v-icon slot="prepend">mdi-credit-card</v-icon>
		</v-stripe-card>
		</v-layout>
	      </v-layout>


	      <v-progress-circular v-if="processing"
                                   indeterminate
                                   color="primary"
                                   ></v-progress-circular>
	      <v-btn color="primary" @click="pay" :disabled="processing || (!source) || (amount == 0) || (name == '')">
		Make payment
		<v-icon right>mdi-credit-card</v-icon>
	      </v-btn>

	      <p v-if="message.length > 0">{{ this.message }}</p>

	      <v-divider class="mr-4 mt-6"/>

	    </v-card-text>
      </v-card></v-col></v-row>

      <v-row><v-col><v-card>
	    <v-card-title>History</v-card-title>
	    <v-card-subtitle>See previous payments and check their status here.</v-card-subtitle>
	    <v-card-text>
	      <v-list-item one-line v-for="payment in payments"
			   :key="payment.id">
		<v-list-item-icon v-if="payment.succeeded">
		  <v-icon>mdi-check</v-icon>
		</v-list-item-icon>
		<v-list-item-icon v-else-if="payment.processing">
		  <v-icon>mdi-clock</v-icon>
		</v-list-item-icon>
		<v-list-item-icon v-else>
		  <v-icon>mdi-alert-circle</v-icon>
		</v-list-item-icon>
		<v-list-item-content>
		  <v-list-item-title>
		    <span v-if="payment.succeeded === true">Paid</span>
		    <span v-else-if="payment.processing">Payment in progress for</span>
		    <span v-else-if="payment.succeeded === false">Canceled payment for</span>
		    <span v-else>Canceled payment for</span>
		    ${{ (payment.amount / 100).toFixed(2) }} on {{ payment.createdAt | moment("MM-DD-YYYY") }}</v-list-item-title>
		</v-list-item-content>
	      </v-list-item>
	      <v-divider></v-divider>

	      <v-list-item two-line>
		<v-list-item-icon>
		  <v-icon>mdi-cash-multiple</v-icon>
		</v-list-item-icon>
		<v-list-item-content>
		  <v-list-item-title>Total paid: ${{ (this.totalPaid / 100).toFixed(2) }}</v-list-item-title>
		  <v-list-item-subtitle v-if="this.totalPaid <= 100000">Outstanding balance: ${{ ( (100000 - this.totalPaid) / 100).toFixed(2) }}</v-list-item-subtitle>
		</v-list-item-content>
	      </v-list-item>


	    </v-card-text>
      </v-card></v-col></v-row>


    </v-container>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import VStripeCard from 'v-stripe-elements/lib/VStripeCard';
import userService from '../services/user';

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_API_KEY);

export default {
  computed: {
    ...mapState(['offer', 'payments']),

    totalPaid: {
      get() {
	return this.payments
	  .filter(payment => payment.succeeded)
	  .map(payment => payment.amount)
	  .reduce((a, b) => a + b, 0);
      },
    },
  },

  data() {
    return {
      stripeKey: process.env.VUE_APP_STRIPE_API_KEY,
      key: 1,
      source: undefined,
      name: '',
      amount: 0,
      processing: false,
      message: '',
    };
  },
  methods: {
    ...mapActions([
      'getPayments',
    ]),

    pay() {
      const cents = Math.floor(this.amount * 100);

      const details = {
	amount: cents,
	description: 'Web payment',
      };

      this.processing = true;

      userService.postPayment(details)
	.then((response) => {
	  const { clientSecret } = response.data;
	  console.log(this.source);

	  stripe.confirmCardPayment(clientSecret, {
	    payment_method: {
	      card: { token: this.source.id },
	      billing_details: {
		name: this.name,
	      },
	    },
	  }).then((result) => {
	    this.processing = false;
	    // FIXME: clear names and such

	    if (result.error) {
	      // Show error to your customer (e.g., insufficient funds)
	      this.message = result.error.message;
	    } else if (result.paymentIntent.status === 'succeeded') {
	      this.message = 'Payment processing.';
	    } else {
	      this.message = 'Unknown payment status.';
	    }
	  });

	  this.getPayments();
	})
	.catch((error) => {
	  this.processing = false;
	  this.message = 'Error processing payment.';
	  // handle error
	  console.log(error);
	});
    },
  },

  components: {
    VStripeCard,
  },

  mounted() {
    return this.getPayments();
  },
};
</script>
