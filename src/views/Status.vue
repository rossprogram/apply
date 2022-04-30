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


<div v-if="this.offer.location === 'ohio'">
  <p>Congratulations! You have been accepted as a participant in the 2022 Ross Mathematics Program
  at Ohio Dominican University in Columbus, Ohio.  This location will run from June 15 (Wednesday) through  July 27, 2022.</p>
</div>
<div v-else-if="this.offer.location === 'indiana'">
  <p>Congratulations! You have been accepted as a participant in the 2022 Ross Mathematics Program
    at Rose-Hulman Institute of Technology in Terre Haute, Indiana.  This location will run from
    June 19 (Sunday) through July 29, 2022.</p>
</div>
<div v-else>
  <p>Congratulations! You have been accepted as a participant in the 2022 Ross Mathematics Program.</p>
</div>

<p>Please let us know whether you accept a spot in the in-person 2022 Ross Program. An email will be sent in early May requesting additional information, a parental approval form, instructions for payment and for scholarship requests.</p>

<hr/>

<h3>Plans for the 2022 Ross Program</h3>

    <p>During those six weeks, you will be part of a Ross “family” of 4 or 5 students and a junior-counselor, led by a counselor.  You are welcome to join the more advanced Ross courses, provided you are keeping up with the Number Theory course.</p>

<h4>Costs</h4>
<p>In exchange for those six weeks of mathematical experiences, each Ross participant is charged a program fee of $6000 (US Dollars), payable by personal check, credit card, or wire transfer. That fee will be due some weeks before the start of the summer session.  These funds provide for room and board (i.e., housing in the dorm and meals in the cafeteria) for those six weeks as well as salaries for the instructional staff.</p>

<p>Scholarship funds are available to help support participants whose families have some financial need.</p>
  </div>
  <div v-if="this.offer && (this.offer.offer === 'waitlist' || this.offer.offer === 'reject')">
<p>Thank you for applying to the Ross Mathematics Program.</p>
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
    <p>Unfortunately, the Admissions Committee is still evaluating applications.  We expect to have more information after mid-April.</p>
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
