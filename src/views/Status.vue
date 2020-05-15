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
		    prepend-icon="question_answer"
		    single-line
		    persistent-hint
		    ></v-select>
	      </v-layout>

	      <v-layout wrap v-if="(this.offer.decision === 'yes') || (this.updatedOffer.decision === 'yes')">
		<v-select
		  v-model="summerLocation"
		  :items="countries"
		  item-text="name"
		  item-value="alpha2"
		  prepend-icon="public"
		  label="Summer Location"
		  hint="Where will you be living during the summer?"
		  persistent-hint
		  single-line
		  ></v-select>
	      </v-layout>

		<v-layout wrap v-if="(this.offer.decision === 'yes') || (this.updatedOffer.decision === 'yes')">
		<v-combobox
		  v-model="possibleUsernames"
		  prepend-icon="face"
		  label="Desired username"
		  hint="What username would you like to use as your identifier during Ross meetings? Please provide some possibilities.
 Your username should be related to your actual name or nickname, with
 standard letters used in English.  Ross administrators might need to
 change your username if it is inappropriate or is too close to
 another person's username."
		  persistent-hint
		  multiple
		  chips
		  single-line
		  ></v-combobox>

	      </v-layout>

		<v-layout wrap v-if="(this.offer.decision === 'yes') || (this.updatedOffer.decision === 'yes')">
		<v-select
		  v-model="goodTimes"
		  :items="possibleTimes"
		  prepend-icon="alarm"
		  item-text="name"
		  item-value="hour"
		  label="Available meeting times"
		  :hint="`In your current local timezone which we detect to be ${this.timezone}, when would you be available for a daily meeting with your Counselor?`"
		  persistent-hint
		  multiple
		  single-line
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

    timezone: {
      get() { return this.updatedOffer.timezone || this.offer.timezone; },
      set(v) { this.$set(this.updatedOffer, 'timezone', v); },
    },

    timezoneOffset: {
      get() { return this.updatedOffer.timezoneOffset || this.offer.timezoneOffset; },
      set(v) { this.$set(this.updatedOffer, 'timezoneOffset', v); },
    },

    summerLocation: {
      get() { return this.updatedOffer.summerLocation || this.offer.summerLocation; },
      set(v) { this.$set(this.updatedOffer, 'summerLocation', v); },
    },

    possibleUsernames: {
      get() { return this.updatedOffer.possibleUsernames || this.offer.possibleUsernames; },
      set(v) { this.$set(this.updatedOffer, 'possibleUsernames', v); },
     },

    goodTimes: {
      get() { return this.updatedOffer.goodTimes || this.offer.goodTimes; },
      set(v) { this.$set(this.updatedOffer, 'goodTimes', v); },
    },
  },

  data() {
    return {
      key: 1,
      updatedOffer: {},
      decisionDateMenu: null,
      possibleTimes: [],
      countries:
[
   {
      alpha2: 'AF',
      name: 'Afghanistan',
   },
   {
      alpha2: 'AL',
      name: 'Albania',
   },
   {
      alpha2: 'DZ',
      name: 'Algeria',
   },
   {
      alpha2: 'AS',
      name: 'American Samoa',
   },
   {
      alpha2: 'AD',
      name: 'Andorra',
   },
   {
      alpha2: 'AO',
      name: 'Angola',
   },
   {
      alpha2: 'AI',
      name: 'Anguilla',
   },
   {
      alpha2: 'AQ',
      name: 'Antarctica',
   },
   {
      alpha2: 'AG',
      name: 'Antigua and Barbuda',
   },
   {
      alpha2: 'AR',
      name: 'Argentina',
   },
   {
      alpha2: 'AM',
      name: 'Armenia',
   },
   {
      alpha2: 'AW',
      name: 'Aruba',
   },
   {
      alpha2: 'AU',
      name: 'Australia',
   },
   {
      alpha2: 'AT',
      name: 'Austria',
   },
   {
      alpha2: 'AZ',
      name: 'Azerbaijan',
   },
   {
      alpha2: 'BS',
      name: 'Bahamas',
   },
   {
      alpha2: 'BH',
      name: 'Bahrain',
   },
   {
      alpha2: 'BD',
      name: 'Bangladesh',
   },
   {
      alpha2: 'BB',
      name: 'Barbados',
   },
   {
      alpha2: 'BY',
      name: 'Belarus',
   },
   {
      alpha2: 'BE',
      name: 'Belgium',
   },
   {
      alpha2: 'BZ',
      name: 'Belize',
   },
   {
      alpha2: 'BJ',
      name: 'Benin',
   },
   {
      alpha2: 'BM',
      name: 'Bermuda',
   },
   {
      alpha2: 'BT',
      name: 'Bhutan',
   },
   {
      alpha2: 'BO',
      name: 'Bolivia (Plurinational State of)',
   },
   {
      alpha2: 'BQ',
      name: 'Bonaire, Sint Eustatius and Saba',
   },
   {
      alpha2: 'BA',
      name: 'Bosnia and Herzegovina',
   },
   {
      alpha2: 'BW',
      name: 'Botswana',
   },
   {
      alpha2: 'BV',
      name: 'Bouvet Island',
   },
   {
      alpha2: 'BR',
      name: 'Brazil',
   },
   {
      alpha2: 'IO',
      name: 'British Indian Ocean Territory',
   },
   {
      alpha2: 'BN',
      name: 'Brunei Darussalam',
   },
   {
      alpha2: 'BG',
      name: 'Bulgaria',
   },
   {
      alpha2: 'BF',
      name: 'Burkina Faso',
   },
   {
      alpha2: 'BI',
      name: 'Burundi',
   },
   {
      alpha2: 'CV',
      name: 'Cabo Verde',
   },
   {
      alpha2: 'KH',
      name: 'Cambodia',
   },
   {
      alpha2: 'CM',
      name: 'Cameroon',
   },
   {
      alpha2: 'CA',
      name: 'Canada',
   },
   {
      alpha2: 'KY',
      name: 'Cayman Islands',
   },
   {
      alpha2: 'CF',
      name: 'Central African Republic',
   },
   {
      alpha2: 'TD',
      name: 'Chad',
   },
   {
      alpha2: 'CL',
      name: 'Chile',
   },
   {
      alpha2: 'CN',
      name: 'China',
   },
   {
      alpha2: 'CX',
      name: 'Christmas Island',
   },
   {
      alpha2: 'CC',
      name: 'Cocos (Keeling) Islands',
   },
   {
      alpha2: 'CO',
      name: 'Colombia',
   },
   {
      alpha2: 'KM',
      name: 'Comoros',
   },
   {
      alpha2: 'CD',
      name: 'Congo (the Democratic Republic of the)',
   },
   {
      alpha2: 'CG',
      name: 'Congo',
   },
   {
      alpha2: 'CK',
      name: 'Cook Islands',
   },
   {
      alpha2: 'CR',
      name: 'Costa Rica',
   },
   {
      alpha2: 'HR',
      name: 'Croatia',
   },
   {
      alpha2: 'CU',
      name: 'Cuba',
   },
   {
      alpha2: 'CW',
      name: 'CuraÃ§ao',
   },
   {
      alpha2: 'CY',
      name: 'Cyprus',
   },
   {
      alpha2: 'CZ',
      name: 'Czechia',
   },
   {
      alpha2: 'CI',
      name: "CÃ´te d'Ivoire",
   },
   {
      alpha2: 'DK',
      name: 'Denmark',
   },
   {
      alpha2: 'DJ',
      name: 'Djibouti',
   },
   {
      alpha2: 'DM',
      name: 'Dominica',
   },
   {
      alpha2: 'DO',
      name: 'Dominican Republic',
   },
   {
      alpha2: 'EC',
      name: 'Ecuador',
   },
   {
      alpha2: 'EG',
      name: 'Egypt',
   },
   {
      alpha2: 'SV',
      name: 'El Salvador',
   },
   {
      alpha2: 'GQ',
      name: 'Equatorial Guinea',
   },
   {
      alpha2: 'ER',
      name: 'Eritrea',
   },
   {
      alpha2: 'EE',
      name: 'Estonia',
   },
   {
      alpha2: 'SZ',
      name: 'Eswatini',
   },
   {
      alpha2: 'ET',
      name: 'Ethiopia',
   },
   {
      alpha2: 'FK',
      name: 'Falkland Islands [Malvinas]',
   },
   {
      alpha2: 'FO',
      name: 'Faroe Islands',
   },
   {
      alpha2: 'FJ',
      name: 'Fiji',
   },
   {
      alpha2: 'FI',
      name: 'Finland',
   },
   {
      alpha2: 'FR',
      name: 'France',
   },
   {
      alpha2: 'GF',
      name: 'French Guiana',
   },
   {
      alpha2: 'PF',
      name: 'French Polynesia',
   },
   {
      alpha2: 'TF',
      name: 'French Southern Territories',
   },
   {
      alpha2: 'GA',
      name: 'Gabon',
   },
   {
      alpha2: 'GM',
      name: 'Gambia',
   },
   {
      alpha2: 'GE',
      name: 'Georgia',
   },
   {
      alpha2: 'DE',
      name: 'Germany',
   },
   {
      alpha2: 'GH',
      name: 'Ghana',
   },
   {
      alpha2: 'GI',
      name: 'Gibraltar',
   },
   {
      alpha2: 'GR',
      name: 'Greece',
   },
   {
      alpha2: 'GL',
      name: 'Greenland',
   },
   {
      alpha2: 'GD',
      name: 'Grenada',
   },
   {
      alpha2: 'GP',
      name: 'Guadeloupe',
   },
   {
      alpha2: 'GU',
      name: 'Guam',
   },
   {
      alpha2: 'GT',
      name: 'Guatemala',
   },
   {
      alpha2: 'GG',
      name: 'Guernsey',
   },
   {
      alpha2: 'GN',
      name: 'Guinea',
   },
   {
      alpha2: 'GW',
      name: 'Guinea-Bissau',
   },
   {
      alpha2: 'GY',
      name: 'Guyana',
   },
   {
      alpha2: 'HT',
      name: 'Haiti',
   },
   {
      alpha2: 'HM',
      name: 'Heard Island and McDonald Islands',
   },
   {
      alpha2: 'VA',
      name: 'Holy See',
   },
   {
      alpha2: 'HN',
      name: 'Honduras',
   },
   {
      alpha2: 'HK',
      name: 'Hong Kong',
   },
   {
      alpha2: 'HU',
      name: 'Hungary',
   },
   {
      alpha2: 'IS',
      name: 'Iceland',
   },
   {
      alpha2: 'IN',
      name: 'India',
   },
   {
      alpha2: 'ID',
      name: 'Indonesia',
   },
   {
      alpha2: 'IR',
      name: 'Iran (Islamic Republic of)',
   },
   {
      alpha2: 'IQ',
      name: 'Iraq',
   },
   {
      alpha2: 'IE',
      name: 'Ireland',
   },
   {
      alpha2: 'IM',
      name: 'Isle of Man',
   },
   {
      alpha2: 'IL',
      name: 'Israel',
   },
   {
      alpha2: 'IT',
      name: 'Italy',
   },
   {
      alpha2: 'JM',
      name: 'Jamaica',
   },
   {
      alpha2: 'JP',
      name: 'Japan',
   },
   {
      alpha2: 'JE',
      name: 'Jersey',
   },
   {
      alpha2: 'JO',
      name: 'Jordan',
   },
   {
      alpha2: 'KZ',
      name: 'Kazakhstan',
   },
   {
      alpha2: 'KE',
      name: 'Kenya',
   },
   {
      alpha2: 'KI',
      name: 'Kiribati',
   },
   {
      alpha2: 'KP',
      name: "Korea (the Democratic People's Republic of)",
   },
   {
      alpha2: 'KR',
      name: 'Korea (the Republic of)',
   },
   {
      alpha2: 'KW',
      name: 'Kuwait',
   },
   {
      alpha2: 'KG',
      name: 'Kyrgyzstan',
   },
   {
      alpha2: 'LA',
      name: "Lao People's Democratic Republic",
   },
   {
      alpha2: 'LV',
      name: 'Latvia',
   },
   {
      alpha2: 'LB',
      name: 'Lebanon',
   },
   {
      alpha2: 'LS',
      name: 'Lesotho',
   },
   {
      alpha2: 'LR',
      name: 'Liberia',
   },
   {
      alpha2: 'LY',
      name: 'Libya',
   },
   {
      alpha2: 'LI',
      name: 'Liechtenstein',
   },
   {
      alpha2: 'LT',
      name: 'Lithuania',
   },
   {
      alpha2: 'LU',
      name: 'Luxembourg',
   },
   {
      alpha2: 'MO',
      name: 'Macao',
   },
   {
      alpha2: 'MG',
      name: 'Madagascar',
   },
   {
      alpha2: 'MW',
      name: 'Malawi',
   },
   {
      alpha2: 'MY',
      name: 'Malaysia',
   },
   {
      alpha2: 'MV',
      name: 'Maldives',
   },
   {
      alpha2: 'ML',
      name: 'Mali',
   },
   {
      alpha2: 'MT',
      name: 'Malta',
   },
   {
      alpha2: 'MH',
      name: 'Marshall Islands',
   },
   {
      alpha2: 'MQ',
      name: 'Martinique',
   },
   {
      alpha2: 'MR',
      name: 'Mauritania',
   },
   {
      alpha2: 'MU',
      name: 'Mauritius',
   },
   {
      alpha2: 'YT',
      name: 'Mayotte',
   },
   {
      alpha2: 'MX',
      name: 'Mexico',
   },
   {
      alpha2: 'FM',
      name: 'Micronesia (Federated States of)',
   },
   {
      alpha2: 'MD',
      name: 'Moldova (the Republic of)',
   },
   {
      alpha2: 'MC',
      name: 'Monaco',
   },
   {
      alpha2: 'MN',
      name: 'Mongolia',
   },
   {
      alpha2: 'ME',
      name: 'Montenegro',
   },
   {
      alpha2: 'MS',
      name: 'Montserrat',
   },
   {
      alpha2: 'MA',
      name: 'Morocco',
   },
   {
      alpha2: 'MZ',
      name: 'Mozambique',
   },
   {
      alpha2: 'MM',
      name: 'Myanmar',
   },
   {
      alpha2: 'NA',
      name: 'Namibia',
   },
   {
      alpha2: 'NR',
      name: 'Nauru',
   },
   {
      alpha2: 'NP',
      name: 'Nepal',
   },
   {
      alpha2: 'NL',
      name: 'Netherlands',
   },
   {
      alpha2: 'NC',
      name: 'New Caledonia',
   },
   {
      alpha2: 'NZ',
      name: 'New Zealand',
   },
   {
      alpha2: 'NI',
      name: 'Nicaragua',
   },
   {
      alpha2: 'NE',
      name: 'Niger',
   },
   {
      alpha2: 'NG',
      name: 'Nigeria',
   },
   {
      alpha2: 'NU',
      name: 'Niue',
   },
   {
      alpha2: 'NF',
      name: 'Norfolk Island',
   },
   {
      alpha2: 'MP',
      name: 'Northern Mariana Islands',
   },
   {
      alpha2: 'NO',
      name: 'Norway',
   },
   {
      alpha2: 'OM',
      name: 'Oman',
   },
   {
      alpha2: 'PK',
      name: 'Pakistan',
   },
   {
      alpha2: 'PW',
      name: 'Palau',
   },
   {
      alpha2: 'PS',
      name: 'Palestine',
   },
   {
      alpha2: 'PA',
      name: 'Panama',
   },
   {
      alpha2: 'PG',
      name: 'Papua New Guinea',
   },
   {
      alpha2: 'PY',
      name: 'Paraguay',
   },
   {
      alpha2: 'PE',
      name: 'Peru',
   },
   {
      alpha2: 'PH',
      name: 'Philippines',
   },
   {
      alpha2: 'PN',
      name: 'Pitcairn',
   },
   {
      alpha2: 'PL',
      name: 'Poland',
   },
   {
      alpha2: 'PT',
      name: 'Portugal',
   },
   {
      alpha2: 'PR',
      name: 'Puerto Rico',
   },
   {
      alpha2: 'QA',
      name: 'Qatar',
   },
   {
      alpha2: 'MK',
      name: 'Republic of North Macedonia',
   },
   {
      alpha2: 'RO',
      name: 'Romania',
   },
   {
      alpha2: 'RU',
      name: 'Russian Federation',
   },
   {
      alpha2: 'RW',
      name: 'Rwanda',
   },
   {
      alpha2: 'RE',
      name: 'Reunion',
   },
   {
      alpha2: 'BL',
      name: 'Saint Barthelemy',
   },
   {
      alpha2: 'SH',
      name: 'Saint Helena, Ascension and Tristan da Cunha',
   },
   {
      alpha2: 'KN',
      name: 'Saint Kitts and Nevis',
   },
   {
      alpha2: 'LC',
      name: 'Saint Lucia',
   },
   {
      alpha2: 'MF',
      name: 'Saint Martin (French part)',
   },
   {
      alpha2: 'PM',
      name: 'Saint Pierre and Miquelon',
   },
   {
      alpha2: 'VC',
      name: 'Saint Vincent and the Grenadines',
   },
   {
      alpha2: 'WS',
      name: 'Samoa',
   },
   {
      alpha2: 'SM',
      name: 'San Marino',
   },
   {
      alpha2: 'ST',
      name: 'Sao Tome and Principe',
   },
   {
      alpha2: 'SA',
      name: 'Saudi Arabia',
   },
   {
      alpha2: 'SN',
      name: 'Senegal',
   },
   {
      alpha2: 'RS',
      name: 'Serbia',
   },
   {
      alpha2: 'SC',
      name: 'Seychelles',
   },
   {
      alpha2: 'SL',
      name: 'Sierra Leone',
   },
   {
      alpha2: 'SG',
      name: 'Singapore',
   },
   {
      alpha2: 'SX',
      name: 'Sint Maarten (Dutch part)',
   },
   {
      alpha2: 'SK',
      name: 'Slovakia',
   },
   {
      alpha2: 'SI',
      name: 'Slovenia',
   },
   {
      alpha2: 'SB',
      name: 'Solomon Islands',
   },
   {
      alpha2: 'SO',
      name: 'Somalia',
   },
   {
      alpha2: 'ZA',
      name: 'South Africa',
   },
   {
      alpha2: 'GS',
      name: 'South Georgia and the South Sandwich Islands',
   },
   {
      alpha2: 'SS',
      name: 'South Sudan',
   },
   {
      alpha2: 'ES',
      name: 'Spain',
   },
   {
      alpha2: 'LK',
      name: 'Sri Lanka',
   },
   {
      alpha2: 'SD',
      name: 'Sudan',
   },
   {
      alpha2: 'SR',
      name: 'Suriname',
   },
   {
      alpha2: 'SJ',
      name: 'Svalbard and Jan Mayen',
   },
   {
      alpha2: 'SE',
      name: 'Sweden',
   },
   {
      alpha2: 'CH',
      name: 'Switzerland',
   },
   {
      alpha2: 'SY',
      name: 'Syrian Arab Republic',
   },
   {
      alpha2: 'TW',
      name: 'Taiwan',
   },
   {
      alpha2: 'TJ',
      name: 'Tajikistan',
   },
   {
      alpha2: 'TZ',
      name: 'Tanzania, United Republic of',
   },
   {
      alpha2: 'TH',
      name: 'Thailand',
   },
   {
      alpha2: 'TL',
      name: 'Timor-Leste',
   },
   {
      alpha2: 'TG',
      name: 'Togo',
   },
   {
      alpha2: 'TK',
      name: 'Tokelau',
   },
   {
      alpha2: 'TO',
      name: 'Tonga',
   },
   {
      alpha2: 'TT',
      name: 'Trinidad and Tobago',
   },
   {
      alpha2: 'TN',
      name: 'Tunisia',
   },
   {
      alpha2: 'TR',
      name: 'Turkey',
   },
   {
      alpha2: 'TM',
      name: 'Turkmenistan',
   },
   {
      alpha2: 'TC',
      name: 'Turks and Caicos Islands',
   },
   {
      alpha2: 'TV',
      name: 'Tuvalu',
   },
   {
      alpha2: 'UG',
      name: 'Uganda',
   },
   {
      alpha2: 'UA',
      name: 'Ukraine',
   },
   {
      alpha2: 'AE',
      name: 'United Arab Emirates',
   },
   {
      alpha2: 'GB',
      name: 'United Kingdom of Great Britain and Northern Ireland',
   },
   {
      alpha2: 'UM',
      name: 'United States Minor Outlying Islands',
   },
   {
      alpha2: 'US',
      name: 'United States of America',
   },
   {
      alpha2: 'UY',
      name: 'Uruguay',
   },
   {
      alpha2: 'UZ',
      name: 'Uzbekistan',
   },
   {
      alpha2: 'VU',
      name: 'Vanuatu',
   },
   {
      alpha2: 'VE',
      name: 'Venezuela (Bolivarian Republic of)',
   },
   {
      alpha2: 'VN',
      name: 'Viet Nam',
   },
   {
      alpha2: 'VG',
      name: 'Virgin Islands (British)',
   },
   {
      alpha2: 'VI',
      name: 'Virgin Islands (U.S.)',
   },
   {
      alpha2: 'WF',
      name: 'Wallis and Futuna',
   },
   {
      alpha2: 'EH',
      name: 'Western Sahara',
   },
   {
      alpha2: 'YE',
      name: 'Yemen',
   },
   {
      alpha2: 'ZM',
      name: 'Zambia',
   },
   {
      alpha2: 'ZW',
      name: 'Zimbabwe',
   },
   {
      alpha2: 'AX',
      name: 'Aland Islands',
   },
],
    };
  },
  methods: {
    ...mapActions([
      'getOffer',
      'updateOffer',
    ]),

    saveOffer() {
      console.log(this.updatedOffer);
      return this.updateOffer(this.updatedOffer);
    },

    saveDecisionDate(date) {
      this.$refs.decisionDateMenu.save(date);
    },

  },

  mounted() {
    const today = new Date();
    this.timezoneOffset = today.getTimezoneOffset();
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.possibleTimes = [];
    this.possibleTimes.push({ name: 'Midnight - 1am', hour: 0 });
    for (let i = 1; i < 11; i += 1) {
      this.possibleTimes.push({ name: `${i}am - ${i + 1}am`, hour: i });
    }
    this.possibleTimes.push({ name: '11am - Noon', hour: 11 });
    this.possibleTimes.push({ name: 'Noon - 1pm', hour: 12 });
    for (let i = 1; i < 11; i += 1) {
      this.possibleTimes.push({ name: `${i}pm - ${i + 1}pm`, hour: i + 12 });
    }
    this.possibleTimes.push({ name: '11pm - Midnight', hour: 23 });

    return this.getOffer();
  },
};
</script>
