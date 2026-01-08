<template>
  <v-container fluid fill-height>
    <v-flex xs12 sm12>
      <h1>Apply to the 2026 Ross Mathematics Program</h1>
      <p>This website will help you as you navigate the Ross application process for Summer 2026.</p>
      <p>
        If you run into any trouble, please feel free to contact
        <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a> for assistance.
      </p>

      <p><strong>The 2026 application window opens January 15, 2026.</strong> Applications are due March 8, 2026. We expect admissions decisions to be finalized by mid-April.</p>

      <p v-if="!profile">
        The first step is to <router-link to="/signup">sign up for an account</router-link> by
        providing your email address; a password will be emailed to you. Even if you created an
        account previously, you must create a new account for 2026.
      </p>
      <v-btn v-if="!profile" to="/signup" color="primary">Create a Ross account</v-btn>

      <p v-if="profile">
        After you have created an account, you can begin to
        <router-link to="/apply">work on your application</router-link>.
      </p>

      <p><v-btn v-if="profile" to="/apply" color="primary">Update your application</v-btn></p>

<!--
<p v-if="offer && offer.offer == 'accept'"><v-btn v-if="profile" to="/status" color="primary">Provide travel information</v-btn></p>
<p v-else><v-btn v-if="profile" to="/status" color="primary">View status</v-btn></p>
<p v-if="offer && offer.offer == 'accept'"><v-btn v-if="profile" to="/fees" color="primary">Pay course fees</v-btn></p>
-->

    </v-flex>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['profile', 'offer']),
  },
  methods: {
    ...mapActions(['getOffer']),
  },
  mounted() {
    return this.getOffer();
  },
};
</script>
