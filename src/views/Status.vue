<template>
<v-form :key="key">
  <div v-if="this.offer && this.offer.offer === 'accept'">

      <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Your response</v-card-title>
	  <v-card-text>
	      <v-layout wrap>
		  <v-select
		    v-model="decision"
		    hint="Do you accept this offer?"
		    :items="['yes', 'no', 'unsure']"
		    label="Accept offer"
		    single-line
		    persistent-hint
		    ></v-select>
	      </v-layout>
	      <v-layout wrap v-if="(this.offer.decision === 'unsure') || (this.updatedOffer.decision === 'unsure')">
  <v-menu
    ref="decisionDateMenu"
    v-model="decisionDateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
	class="mr-4"
        :value="updatedOffer.decisionDate || decisionDate"
        label="Expected date for accepting or rejecting offer"
        prepend-icon="event"
        readonly
	persistent-hint
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="decisionDate"
      :min="new Date().toISOString().substr(0, 10)"
      @change="saveDecisionDate"
      ></v-date-picker>
  </v-menu>
	      </v-layout>
	  </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveOffer"
	color="primary"
        :disabled="Object.keys(this.updatedOffer).length == 0"
	>
	Save your response
      </v-btn>
    </v-card-actions>
    </v-card></v-col></v-row>
    </v-container>

<p>Congratulations! You have been accepted as a participant in the 2020 Ross Mathematics Program.</p>

<p>Because of the COVID-19 pandemic, the 2020 Ross Mathematics Program has cancelled in-person classes. That decision is a real disappointment to all of us. Instead, the 2020 Ross Program will provide online versions of Ross courses. Those live online sessions will run for six weeks: <span style="display: block; margin-left:1in;margin-top:1em;margin-bottom:1em;">June 28 to August 7, 2020.</span>The intensive mathematical atmosphere in the Ross dormitory cannot be reproduced remotely. But as a participant in the 2020 Ross Program, you will still gain significant experience with deductive thought processes, enhance your understanding of abstraction, and polish your mathematical writing skills.</p>

<p>Please let us know whether you accept a spot in the online 2020 Ross Program.</p>

<p>Your acceptance indicates that you will be available for daily online meetings at specified times, you have a suitable computer and internet connection, and you agree to pay the program fee. Further details are provided below.  A cell phone is not sufficient; you must have a computer running Windows, MacOS, or Linux to participate.</p>

<p>An email will be sent in early May requesting additional information, a parental approval form, instructions for payment and scholarship requests.</p>

<hr/>

<h3>Plans for the 2020 Ross Program</h3>

<h4>Ross Number Theory Course</h4>
<p>During those six weeks, you will be part of a Ross “family” of 4 or 5 students and a junior-counselor, led by a counselor. Before each family meeting, you will view a pre-recorded lecture about some aspect of Number Theory, and then work on an associated set of problems. Your family will then have a live session for an hour, using an audio connection and a common virtual whiteboard. During that meeting, you will discuss the math problems with family members, occasionally writing or typing your thoughts on the whiteboard. After the session ends, you will work on solving the problems on that set, writing up solutions, and sharing your solutions with your counselor. Your counselor will read your work and provide corrections, comments, and suggestions.</p>

<h4>Responses to FAQs</h4>
<ul>
    <li>Each Ross counselor is an undergraduate math major or a math graduate student with experience in abstract algebra and number theory. Math faculty members will occasionally join your family meetings.</li>
    <li>We avoid video connections for family discussions because of latency issues. With some family members in Asia and others are in North America, the time delays involved with videos would be difficult to manage.</li>
    <li>To join these discussions, you will need a good internet connection and a computer running Windows, MacOS, or Linux. You may type on the whiteboard in text (or LaTeX) to clarify your spoken words. If you connect with a tablet and stylus, you should be able to write by hand on the whiteboard.</li>
    <li>You will submit daily homework by typing your solutions in LaTeX.  If you are not already familiar with LaTeX, we will provide training.  The collaborative editor will make it easy.</li>
    <li>Your computer needs a microphone and speakers. Standard laptop computers have those built in, but external mics and earphones might provide better quality communication. Conneccting only with a phone might not make sense.</li>
    <li>All discussions will be in English.</li>
</ul>

<h4>Other Ross Courses</h4>
<p>You are welcome to join the more advanced Ross courses, provided you are keeping up with the Number Theory course. Those advanced courses will use a more standard format, with Zoom or some similar platform. Those courses are designed for counselors and junior-counselors who have had experience with college-level math courses.</p>

<p>This summer we expect to offer three six-week courses as part of Ross 2020:</p>
<ul>
    <li><em>Aspects of Analytic and Algebraic Number Theory</em>, by Prof.&nbsp;Paul Pollack (UGA).</li>
    <li><em>Geometric Group Theory</em>, by Prof.&nbsp;Mark Pengitore (OSU) and Prof.&nbsp;Rachel Skipper (OSU).</li>
    <li><em>Equidistribution</em>, by Prof.&nbsp;Vitaly Bergelson (OSU).</li>
</ul>
<p>To aid participants who have less background, some counselors will offer online sessions to review background material. For example, they might discuss the basics of metric spaces, point-set topology, group theory, axiom of choice, measure theory, or integration.</p>

<p>Ross counselors are also invited to offer their own lectures and short courses. Topics will vary depending on the interests of the presenters, and their willingness to lead online seminars.</p>

<h4>Costs</h4>
<p>In exchange for those six weeks of mathematical experiences, each Ross participant is charged a program fee of $1000 (US Dollars), payable by personal check, credit card, or wire transfer. That fee will be due some weeks before the start of the summer session. Those funds will help pay the salaries of everyone involved in this new online project.</p>

<p>Scholarship funds are available to help support participants whose families have some financial need.</p>
  </div>
  <div v-if="this.offer && (this.offer.offer === 'waitlist' || this.offer.offer === 'reject')">
<p>Thanks for applying to the Ross Mathematics Program.</p>
<p>The Ross Program application process is highly competitive, and our
Admissions Committee has to make difficult choices.  They decided that
we are not able to accept you to the Ross Program this year.</p>

<p>These are hard decisions to make and it is painful to me to write
negative messages like this, to talented and eager applicants.  You
clearly spent some effort working on this application, with good
solutions to some of the application problem.  However, many students
submitted strong applications and we do not have enough room to accept
  them all.</p>

  <div v-if="this.offer.offer === 'waitlist'">
<p>Since your application has positive aspects, we have put your name on
the <strong>Waiting List</strong> for the  Ross Program.  If some spots are still
available by the end of the season, we will contact you
again to ask whether you are still interested.</p></div>

<p>I hope you continue to pursue your strong interests in mathematics and
related fields.</p>

  </div>

  <div v-if="! this.offer">
    <p>Unfortunately, the Admissions Committee is still evaluating applications.  We expect to have more information by April 20.</p>
  </div>
  <p>Please make sure you "log in" to access this page.  (You may need to log out first.)</p>
  <p>If you have questions about the admissions process or any trouble using this page, please contact
<a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>.</p>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['offer']),

    decision: {
      get() { return this.updatedOffer.decision || this.offer.decision; },
      set(v) { this.$set(this.updatedOffer, 'decision', v); },
    },
    decisionDate: {
      get() { return this.updatedOffer.decisionDate || this.offer.decisionDate; },
      set(v) { this.$set(this.updatedOffer, 'decisionDate', v); },
    },
  },

  data() {
    return {
      key: 1,
      updatedOffer: {},
      decisionDateMenu: null,
    };
  },
  methods: {
    ...mapActions([
      'getOffer',
      'updateOffer',
    ]),

    saveOffer() {
      return this.updateOffer(this.updatedOffer);
    },

    saveDecisionDate(date) {
      this.$refs.decisionDateMenu.save(date);
    },

  },

  mounted() {
    return this.getOffer();
  },
};
</script>
