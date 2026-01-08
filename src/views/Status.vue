<template>
  <v-form :key="key">
    <div v-if="this.offer && this.offer.offer === 'accept'">
      <v-container fluid>
        <v-row
          ><v-col
            ><v-card>
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

                <v-layout
                  wrap
                  v-if="this.offer.decision === 'unsure' || this.updatedOffer.decision === 'unsure'"
                >
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

                <v-layout
                  wrap
                  v-if="this.offer.decision === 'yes' || this.updatedOffer.decision === 'yes'"
                >
                  <v-select
                    sm4
                    v-model="travelMethod"
                    hint="How will you travel to Ross?"
                    :items="['', 'driving', 'flying']"
                    label="Travel method"
                    prepend-icon="mdi-train-car"
                    single-line
                    persistent-hint
                  ></v-select>
                  <v-menu
                    sm4
                    ref="arrivalDateMenu"
                    v-model="arrivalDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        class="mr-4"
                        :value="updatedOffer.arrivalDate || arrivalDate"
                        label="Scheduled arrival date"
                        prepend-icon="event"
                        readonly
                        persistent-hint
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="arrivalDate"
                      :min="new Date().toISOString().substr(0, 10)"
                      @change="saveArrivalDate"
                    ></v-date-picker>
                  </v-menu>
                  <v-menu
                    sm4
                    ref="arrivalTimeMenu"
                    v-model="arrivalTimeMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        class="mr-4"
                        :value="updatedOffer.arrivalTime || arrivalTime"
                        label="Arrival time"
                        readonly
                        persistent-hint
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      ref="picker"
                      v-model="arrivalTime"
                      @change="saveArrivalTime"
                    ></v-time-picker>
                  </v-menu>
                </v-layout>

                <v-layout
                  wrap
                  v-if="
                    this.offer.travelMethod === 'flying' ||
                    this.updatedOffer.travelMethod === 'flying'
                  "
                >
                  <v-flex xs6>
                    <v-select
                      prepend-icon="mdi-airplane-landing"
                      v-model="flightCarrier"
                      :items="airlines"
                      item-text="name"
                      item-value="iata"
                      label="Airline"
                      persistent-hint
                      single-line
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      class="mr-4"
                      :label="
                        'Flight number of flight landing at ' +
                        (this.offer.location === 'ohio' ? 'CMH' : 'IND')
                      "
                      v-model="flightNumber"
                    />
                  </v-flex>
                </v-layout>

                <v-layout
                  wrap
                  v-if="
                    this.offer.travelMethod === 'flying' ||
                    this.updatedOffer.travelMethod === 'flying'
                  "
                >
                  <v-textarea
                    outlined
                    label="Your complete travel plans, including connecting flight information and your contact information"
                    v-model="travelPlan"
                  >
                  </v-textarea>
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
            </v-card></v-col
          ></v-row
        >
      </v-container>

      <div v-if="this.offer.location === 'ohio'">
        <p>
          Congratulations! You have been accepted as a participant in the 2026 Ross Mathematics
          Program at Otterbein University in Columbus, Ohio. This location will run from June 14
          through July 24, 2026.
        </p>
        <p>
          You should plan to arrive at the Columbus airport (CMH) on June 14 (Sunday) in the
          afternoon. There will be an orientation meeting that night at 7 PM.
        </p>
      </div>
      <div v-else-if="this.offer.location === 'indiana'">
        <p>
          Congratulations! You have been accepted as a participant in the 2026 Ross Mathematics
          Program at Rose-Hulman Institute of Technology in Terre Haute, Indiana. This location will
          run from June 14 through July 24, 2026.
        </p>
        <p>
          You should plan to arrive at the Indianapolis airport (IND) on June 14 (Sunday) in the
          afternoon. There will be an orientation meeting that night at 7 PM.
        </p>
      </div>
      <div v-else-if="this.offer.location === 'philippines'">
        <p>
	The Ross Program will not be able to offer a site outside the USA this year.</p>
      </div>
      <div v-else>
        <p>
          Congratulations! You have been accepted as a participant in the Ross Mathematics Program.
        </p>
      </div>

      <p>
        Please let us know whether you accept a spot in the in-person 2026 Ross Program. An email
        will be sent in <strong>early May</strong> requesting additional information, a parental approval form,
        and instructions for payment and scholarship requests.
      </p>

      <hr />

      <h3>Plans for the 2026 Ross Program</h3>

      <p>
        During the Program, you will be part of a Ross “family” of students and a
        junior counselor, led by a counselor. You are welcome to join the more advanced Ross
        courses, provided you are keeping up with the Number Theory course.
      </p>

      <div v-if="this.offer.location === 'philippines'">
        <h4>Costs</h4>
        <p>
          In exchange for those many weeks of mathematical experiences, each Ross participant is
          charged a program fee of $7500 (US Dollars).
        </p>
      </div>
      <div v-else>
        <h4>Costs</h4>
        <p>
          In exchange for those many weeks of mathematical experiences, each Ross participant is
          charged a program fee of $7500 (US Dollars), payable by personal check, credit card, or
          wire transfer. That fee will be due some weeks before the start of the summer session.
          These funds provide for room and board (i.e., housing in the dorm and meals in the
          cafeteria) for those weeks as well as salaries for the instructional staff.
        </p>
      </div>

      <p>
        Scholarship funds are available to help support participants whose families have some
        financial need. An email will be sent with instructions on how to request scholarship funds.
      </p>
    </div>
    <div v-if="this.offer && (this.offer.offer === 'waitlist' || this.offer.offer === 'reject')">
      <p>Thank you for applying to the Ross Mathematics Program.</p>
      <p>
        The Ross Program application process is highly competitive, and our Admissions Committee has
        to make difficult choices. They decided that we are not able to accept you to the Ross
        Program this year.
      </p>

      <p>
        These are hard decisions to make and it is painful to me to write negative messages like
        this, to talented and eager applicants. Many students submitted strong applications and we
        do not have enough room to accept them all.
      </p>

      <div v-if="this.offer.offer === 'waitlist'">
        <p>
          We have put your name on the <strong>Waiting List</strong> for the Ross Program. If some
          spots are still available by the end of the season, we will contact you again to ask
          whether you are still interested.
        </p>
      </div>

      <p>We hope you continue to pursue your strong interests in mathematics and related fields.</p>
    </div>

    <div v-if="!this.offer">
      <p>
        Unfortunately, the Admissions Committee is still evaluating applications. We expect to have
        more information in the coming weeks.
      </p>
    </div>
    <p>Please make sure you log in to access this page. (You may need to log out first.)</p>
    <p>
      If you have questions about the admissions process or any trouble using this page, please
      contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>.
    </p>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['offer']),

    decision: {
      get() {
        return this.updatedOffer.decision || this.offer.decision;
      },
      set(v) {
        this.$set(this.updatedOffer, 'decision', v);
      },
    },
    decisionDate: {
      get() {
        return this.updatedOffer.decisionDate || this.offer.decisionDate;
      },
      set(v) {
        this.$set(this.updatedOffer, 'decisionDate', v);
      },
    },
    arrivalDate: {
      get() {
        return this.updatedOffer.arrivalDate || this.offer.arrivalDate;
      },
      set(v) {
        this.$set(this.updatedOffer, 'arrivalDate', v);
      },
    },
    arrivalTime: {
      get() {
        return this.updatedOffer.arrivalTime || this.offer.arrivalTime;
      },
      set(v) {
        this.$set(this.updatedOffer, 'arrivalTime', v);
      },
    },
    flightCarrier: {
      get() {
        return this.updatedOffer.flightCarrier || this.offer.flightCarrier;
      },
      set(v) {
        this.$set(this.updatedOffer, 'flightCarrier', v);
      },
    },
    flightNumber: {
      get() {
        return this.updatedOffer.flightNumber || this.offer.flightNumber;
      },
      set(v) {
        this.$set(this.updatedOffer, 'flightNumber', v);
      },
    },
    travelMethod: {
      get() {
        return this.updatedOffer.travelMethod || this.offer.travelMethod;
      },
      set(v) {
        this.$set(this.updatedOffer, 'travelMethod', v);
      },
    },
    travelPlan: {
      get() {
        return this.updatedOffer.travelPlan || this.offer.travelPlan;
      },
      set(v) {
        this.$set(this.updatedOffer, 'travelPlan', v);
      },
    },

    timezone: {
      get() {
        return this.updatedOffer.timezone || this.offer.timezone;
      },
      set(v) {
        this.$set(this.updatedOffer, 'timezone', v);
      },
    },

    timezoneOffset: {
      get() {
        return this.updatedOffer.timezoneOffset || this.offer.timezoneOffset;
      },
      set(v) {
        this.$set(this.updatedOffer, 'timezoneOffset', v);
      },
    },

    summerLocation: {
      get() {
        return this.updatedOffer.summerLocation || this.offer.summerLocation;
      },
      set(v) {
        this.$set(this.updatedOffer, 'summerLocation', v);
      },
    },

    possibleUsernames: {
      get() {
        return this.updatedOffer.possibleUsernames || this.offer.possibleUsernames;
      },
      set(v) {
        this.$set(this.updatedOffer, 'possibleUsernames', v);
      },
    },

    goodTimes: {
      get() {
        return this.updatedOffer.goodTimes || this.offer.goodTimes;
      },
      set(v) {
        this.$set(this.updatedOffer, 'goodTimes', v);
      },
    },
  },

  data() {
    return {
      key: 1,
      updatedOffer: {},
      decisionDateMenu: null,
      arrivalDateMenu: null,
      arrivalTimeMenu: null,
      possibleTimes: [],
      airlines: [
        {
          id: '10',
          name: '40-Mile Air',
          alias: '\\N',
          iata: 'Q5',
          icao: 'MLA',
          callsign: 'MILE-AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '22',
          name: 'Aloha Airlines',
          alias: '\\N',
          iata: 'AQ',
          icao: 'AAH',
          callsign: 'ALOHA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '24',
          name: 'American Airlines',
          alias: '\\N',
          iata: 'AA',
          icao: 'AAL',
          callsign: 'AMERICAN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '35',
          name: 'Allegiant Air',
          alias: '\\N',
          iata: 'G4',
          icao: 'AAY',
          callsign: 'ALLEGIANT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '109',
          name: 'Alaska Central Express',
          alias: '\\N',
          iata: 'KO',
          icao: 'AER',
          callsign: 'ACE AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '149',
          name: 'Air Cargo Carriers',
          alias: '\\N',
          iata: '2Q',
          icao: 'SNC',
          callsign: 'NIGHT CARGO',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '210',
          name: 'Airlift International',
          alias: '\\N',
          iata: '',
          icao: 'AIR',
          callsign: 'AIRLIFT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '281',
          name: 'America West Airlines',
          alias: '\\N',
          iata: 'HP',
          icao: 'AWE',
          callsign: 'CACTUS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '282',
          name: 'Air Wisconsin',
          alias: '\\N',
          iata: 'ZW',
          icao: 'AWI',
          callsign: 'AIR WISCONSIN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '287',
          name: 'Allegheny Commuter Airlines',
          alias: '\\N',
          iata: '',
          icao: 'ALO',
          callsign: 'ALLEGHENY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '295',
          name: 'Air Sunshine',
          alias: '\\N',
          iata: '',
          icao: 'RSI',
          callsign: 'AIR SUNSHINE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '315',
          name: 'ATA Airlines',
          alias: '\\N',
          iata: '',
          icao: 'AMT',
          callsign: 'AMTRAN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '397',
          name: 'Arrow Air',
          alias: '\\N',
          iata: 'JW',
          icao: 'APW',
          callsign: 'BIG A',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '452',
          name: 'Atlantic Southeast Airlines',
          alias: '\\N',
          iata: 'EV',
          icao: 'ASQ',
          callsign: 'ACEY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '659',
          name: 'American Eagle Airlines',
          alias: '\\N',
          iata: 'MQ',
          icao: 'EGF',
          callsign: 'EAGLE FLIGHT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '792',
          name: 'Access Air',
          alias: '\\N',
          iata: 'ZA',
          icao: 'CYD',
          callsign: 'CYCLONE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '882',
          name: 'Air Florida',
          alias: '\\N',
          iata: 'QH',
          icao: 'FLZ',
          callsign: 'AIR FLORIDA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '928',
          name: 'Atlas Air',
          alias: '\\N',
          iata: '5Y',
          icao: 'GTI',
          callsign: 'GIANT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1316',
          name: 'AirTran Airways',
          alias: '\\N',
          iata: 'FL',
          icao: 'TRS',
          callsign: 'CITRUS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1442',
          name: 'Bemidji Airlines',
          alias: '\\N',
          iata: 'CH',
          icao: 'BMJ',
          callsign: 'BEMIDJI',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1472',
          name: 'Bering Air',
          alias: '\\N',
          iata: '8E',
          icao: 'BRG',
          callsign: 'BERING AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1629',
          name: 'Cape Air',
          alias: '\\N',
          iata: '9K',
          icao: 'KAP',
          callsign: 'CAIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1739',
          name: 'Chautauqua Airlines',
          alias: '\\N',
          iata: 'RP',
          icao: 'CHQ',
          callsign: 'CHAUTAUQUA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1814',
          name: 'Coastal Air',
          alias: '\\N',
          iata: 'DQ',
          icao: '',
          callsign: 'U.S. Virgin Islands',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1821',
          name: 'Colgan Air',
          alias: '\\N',
          iata: '9L',
          icao: 'CJC',
          callsign: 'COLGAN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1828',
          name: 'Comair',
          alias: '\\N',
          iata: 'OH',
          icao: 'COM',
          callsign: 'COMAIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1843',
          name: 'CommutAir',
          alias: '\\N',
          iata: 'C5',
          icao: 'UCA',
          callsign: 'COMMUTAIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1860',
          name: 'Compass Airlines',
          alias: '\\N',
          iata: 'CP',
          icao: 'CPZ',
          callsign: 'Compass Rose',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1881',
          name: 'Continental Airlines',
          alias: '\\N',
          iata: 'CO',
          icao: 'COA',
          callsign: 'CONTINENTAL',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1883',
          name: 'Continental Express',
          alias: '\\N',
          iata: 'CO',
          icao: '',
          callsign: 'JETLINK',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1884',
          name: 'Continental Micronesia',
          alias: '\\N',
          iata: 'CS',
          icao: 'CMI',
          callsign: 'AIR MIKE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '1931',
          name: 'Crown Airways',
          alias: '\\N',
          iata: '',
          icao: 'CRO',
          callsign: 'CROWN AIRWAYS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2009',
          name: 'Delta Air Lines',
          alias: '\\N',
          iata: 'DL',
          icao: 'DAL',
          callsign: 'DELTA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2261',
          name: 'Evergreen International Airlines',
          alias: '\\N',
          iata: 'EZ',
          icao: 'EIA',
          callsign: 'EVERGREEN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2293',
          name: 'Express One International',
          alias: '\\N',
          iata: 'EO',
          icao: 'LHN',
          callsign: 'LONGHORN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2295',
          name: 'ExpressJet',
          alias: '\\N',
          iata: 'XE',
          icao: 'BTA',
          callsign: 'JET LINK',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2404',
          name: 'Florida West International Airways',
          alias: '\\N',
          iata: 'RF',
          icao: 'FWL',
          callsign: 'FLO WEST',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2454',
          name: 'Freedom Air',
          alias: '\\N',
          iata: 'FP',
          icao: 'FRE',
          callsign: 'FREEDOM',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2456',
          name: 'Freedom Airlines',
          alias: '\\N',
          iata: '',
          icao: 'FRL',
          callsign: 'FREEDOM AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2468',
          name: 'Frontier Airlines',
          alias: '\\N',
          iata: 'F9',
          icao: 'FFT',
          callsign: 'FRONTIER FLIGHT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2470',
          name: 'Frontier Flying Service',
          alias: '\\N',
          iata: '2F',
          icao: 'FTA',
          callsign: 'FRONTIER-AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2577',
          name: 'GoJet Airlines',
          alias: '\\N',
          iata: 'G7',
          icao: 'GJS',
          callsign: 'GATEWAY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2607',
          name: 'Great Lakes Airlines',
          alias: '\\N',
          iata: 'ZK',
          icao: 'GLA',
          callsign: 'LAKES AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2645',
          name: 'Gulfstream International Airlines',
          alias: '\\N',
          iata: '',
          icao: 'GFT',
          callsign: 'GULF FLIGHT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2657',
          name: 'Hageland Aviation Services',
          alias: '\\N',
          iata: 'H6',
          icao: 'HAG',
          callsign: 'HAGELAND',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2688',
          name: 'Hawaiian Airlines',
          alias: '\\N',
          iata: 'HA',
          icao: 'HAL',
          callsign: 'HAWAIIAN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2778',
          name: 'Horizon Air',
          alias: 'Horizon Airlines',
          iata: 'QX',
          icao: 'QXE',
          callsign: 'HORIZON AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2855',
          name: 'Indigo',
          alias: '\\N',
          iata: 'I9',
          icao: 'IBU',
          callsign: 'INDIGO BLUE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '2937',
          name: 'Island Airlines',
          alias: '\\N',
          iata: 'IS',
          icao: '',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3001',
          name: 'Jet Airways',
          alias: '\\N',
          iata: 'QJ',
          icao: '',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3029',
          name: 'JetBlue Airways',
          alias: '\\N',
          iata: 'B6',
          icao: 'JBU',
          callsign: 'JETBLUE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3123',
          name: 'Kenmore Air',
          alias: '\\N',
          iata: 'M5',
          icao: 'KEN',
          callsign: 'KENMORE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3466',
          name: 'Mesa Airlines',
          alias: '\\N',
          iata: 'YV',
          icao: 'ASH',
          callsign: 'AIR SHUTTLE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3467',
          name: 'Mesaba Airlines',
          alias: '\\N',
          iata: 'XJ',
          icao: 'MES',
          callsign: 'MESABA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3494',
          name: 'Midway Airlines',
          alias: '\\N',
          iata: 'JI',
          icao: 'MDW',
          callsign: 'MIDWAY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3497',
          name: 'Midwest Airlines',
          alias: '\\N',
          iata: 'YX',
          icao: 'MEP',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3641',
          name: 'NetJets',
          alias: '\\N',
          iata: '1I',
          icao: 'EJA',
          callsign: 'EXECJET',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3644',
          name: 'New England Airlines',
          alias: '\\N',
          iata: 'EJ',
          icao: 'NEA',
          callsign: 'NEW ENGLAND',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3731',
          name: 'Northwest Airlines',
          alias: '\\N',
          iata: 'NW',
          icao: 'NWA',
          callsign: 'NORTHWEST',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3781',
          name: 'Omni Air International',
          alias: '\\N',
          iata: 'OY',
          icao: 'OAE',
          callsign: 'OMNI-EXPRESS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3860',
          name: 'Pacific Island Aviation',
          alias: '\\N',
          iata: '',
          icao: 'PSA',
          callsign: 'PACIFIC ISLE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3865',
          name: 'Pacific Wings',
          alias: '\\N',
          iata: 'LW',
          icao: 'NMI',
          callsign: 'TSUNAMI',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3935',
          name: 'Peninsula Airways',
          alias: '\\N',
          iata: 'KS',
          icao: 'PEN',
          callsign: 'PENINSULA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3969',
          name: 'Piedmont Airlines (1948-1989)',
          alias: '\\N',
          iata: 'PI',
          icao: 'PDT',
          callsign: 'PIEDMONT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '3976',
          name: 'Pinnacle Airlines',
          alias: '\\N',
          iata: '9E',
          icao: 'FLG',
          callsign: 'FLAGSHIP',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4026',
          name: 'Potomac Air',
          alias: '\\N',
          iata: 'BK',
          icao: 'PDC',
          callsign: 'DISTRICT',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4187',
          name: 'Republic Airlines',
          alias: '\\N',
          iata: 'RW',
          icao: 'RPA',
          callsign: 'BRICKYARD',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4294',
          name: 'Ryan Air Services',
          alias: '\\N',
          iata: '',
          icao: 'RYA',
          callsign: 'RYAN AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4295',
          name: 'Ryan International Airlines',
          alias: '\\N',
          iata: 'RD',
          icao: 'RYN',
          callsign: 'RYAN INTERNATIONAL',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4335',
          name: 'Seaborne Airlines',
          alias: '\\N',
          iata: 'BB',
          icao: 'SBS',
          callsign: 'SEABORNE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4342',
          name: 'Scenic Airlines',
          alias: '\\N',
          iata: '',
          icao: 'SCE',
          callsign: 'SCENIC',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4356',
          name: 'Sun Country Airlines',
          alias: '\\N',
          iata: 'SY',
          icao: 'SCX',
          callsign: 'SUN COUNTRY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4370',
          name: 'Southeast Air',
          alias: '\\N',
          iata: '',
          icao: 'SEA',
          callsign: 'SOUTHEAST AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4411',
          name: 'Skagway Air Service',
          alias: '\\N',
          iata: 'N5',
          icao: 'SGY',
          callsign: 'SKAGWAY AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4547',
          name: 'Southwest Airlines',
          alias: '\\N',
          iata: 'WN',
          icao: 'SWA',
          callsign: 'SOUTHWEST',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4589',
          name: 'Skywalk Airlines',
          alias: '\\N',
          iata: 'AL',
          icao: 'SYX',
          callsign: 'SKYWAY-EX',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4687',
          name: 'Spirit Airlines',
          alias: '\\N',
          iata: 'NK',
          icao: 'NKS',
          callsign: 'SPIRIT WINGS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4738',
          name: 'SkyWest',
          alias: '\\N',
          iata: 'OO',
          icao: 'SKW',
          callsign: 'SKYWEST',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4804',
          name: 'Southern Airways',
          alias: '\\N',
          iata: '',
          icao: 'SOU',
          callsign: 'SOUTHERN EXPRESS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4816',
          name: 'South Pacific Island Airways',
          alias: '\\N',
          iata: '',
          icao: 'SPI',
          callsign: 'SOUTH PACIFIC',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '4822',
          name: 'Shuttle America',
          alias: '\\N',
          iata: 'S5',
          icao: 'TCF',
          callsign: 'MERCURY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5160',
          name: 'Trans States Airlines',
          alias: '\\N',
          iata: 'AX',
          icao: 'LOF',
          callsign: 'WATERSKI',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5207',
          name: 'USA3000 Airlines',
          alias: '\\N',
          iata: 'U5',
          icao: 'GWY',
          callsign: 'GETAWAY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5209',
          name: 'United Airlines',
          alias: '\\N',
          iata: 'UA',
          icao: 'UAL',
          callsign: 'UNITED',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5265',
          name: 'US Airways',
          alias: '\\N',
          iata: 'US',
          icao: 'USA',
          callsign: 'U S AIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5268',
          name: 'US Helicopter',
          alias: '\\N',
          iata: '',
          icao: 'USH',
          callsign: 'US-HELI',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5279',
          name: 'United States Air Force',
          alias: '\\N',
          iata: '',
          icao: 'AIO',
          callsign: 'AIR CHIEF',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5284',
          name: 'US Helicopter Corporation',
          alias: '\\N',
          iata: 'UH',
          icao: '',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5331',
          name: 'Virgin America',
          alias: '\\N',
          iata: 'VX',
          icao: 'VRD',
          callsign: 'REDWOOD',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5424',
          name: 'Western Airlines',
          alias: '\\N',
          iata: 'WA',
          icao: 'WAL',
          callsign: 'WESTERN',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '5465',
          name: 'World Airways',
          alias: '\\N',
          iata: 'WO',
          icao: 'WOA',
          callsign: 'WORLD',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '8461',
          name: 'Carnival Air Lines',
          alias: '',
          iata: 'KW',
          icao: '\\N',
          callsign: 'Carnival Air',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '8809',
          name: 'Island Air (WP)',
          alias: '',
          iata: 'WP',
          icao: 'MKU',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '9833',
          name: 'Epic Holiday',
          alias: 'Epic Holidays',
          iata: 'FA',
          icao: '4AA',
          callsign: 'Epic',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10123',
          name: 'Texas Wings',
          alias: '',
          iata: 'TQ',
          icao: 'TXW',
          callsign: 'TXW',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10226',
          name: 'Atifly',
          alias: '',
          iata: 'A1',
          icao: 'A1F',
          callsign: 'atifly',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10739',
          name: 'Air Choice One',
          alias: '',
          iata: '3E',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10748',
          name: 'Locair',
          alias: '',
          iata: 'ZQ',
          icao: 'LOC',
          callsign: 'LOCAIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10765',
          name: 'SeaPort Airlines',
          alias: '',
          iata: 'K5',
          icao: 'SQH',
          callsign: 'SASQUATCH',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '10776',
          name: 'Salmon Air',
          alias: '',
          iata: 'S6',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '439',
          name: 'Alaska Airlines',
          alias: '\\N',
          iata: 'AS',
          icao: 'ASA',
          callsign: ' Inc.',
          country: 'ALASKA',
          active: 'Y',
        },
        {
          id: '10912',
          name: 'Alaska Seaplane Service',
          alias: '',
          iata: 'J5',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '12961',
          name: 'Gryphon Airlines',
          alias: '',
          iata: '6P',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '13391',
          name: 'U.S. Air',
          alias: '',
          iata: '-+',
          icao: '--+',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '13633',
          name: 'PanAm World Airways',
          alias: '',
          iata: 'WQ',
          icao: 'PQW',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '15887',
          name: 'CBM America',
          alias: '',
          iata: '',
          icao: 'XBM',
          callsign: 'AIRMAX',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '15975',
          name: 'Black Stallion Airways',
          alias: '',
          iata: 'BZ',
          icao: 'BSA',
          callsign: 'Stallion',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16135',
          name: 'Yellowstone Club Private Shuttle',
          alias: '',
          iata: 'Y1',
          icao: '\\N',
          callsign: 'YCS',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16264',
          name: 'Trans Pas Air',
          alias: '',
          iata: 'T6',
          icao: 'TP6',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16625',
          name: 'Papillon Grand Canyon Helicopters',
          alias: '',
          iata: 'HI',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16702',
          name: 'Usa Sky Cargo',
          alias: 'USky',
          iata: 'E1',
          icao: 'ES2',
          callsign: 'USKY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16726',
          name: 'Era Alaska',
          alias: '',
          iata: '7H',
          icao: 'ERR',
          callsign: 'ERAH',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16735',
          name: 'Hankook Air US',
          alias: '',
          iata: 'H1',
          icao: 'HA1',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '16932',
          name: 'Orbit Airlines',
          alias: 'Orbit',
          iata: '',
          icao: 'OBT',
          callsign: 'Orbit',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17519',
          name: 'SENIC AIRLINES',
          alias: '',
          iata: 'YR',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17563',
          name: 'XOJET',
          alias: '',
          iata: '',
          icao: 'XOJ',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17628',
          name: 'Orbit International Airlines',
          alias: '',
          iata: '',
          icao: 'OAI',
          callsign: 'OA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17629',
          name: 'Orbit Regional Airlines',
          alias: '',
          iata: '',
          icao: 'OAR',
          callsign: 'OA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17630',
          name: 'Orbit Atlantic Airways',
          alias: '',
          iata: '',
          icao: 'OAN',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17841',
          name: 'Aws express',
          alias: '',
          iata: 'B0',
          icao: '666',
          callsign: 'aws',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17859',
          name: 'Southjet',
          alias: '',
          iata: '76',
          icao: 'SJS',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17860',
          name: 'Southjet connect',
          alias: '',
          iata: '77',
          icao: 'ZCS',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '17862',
          name: 'Southjet cargo',
          alias: '',
          iata: '78',
          icao: 'XAN',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18169',
          name: 'Patriot Airways',
          alias: '',
          iata: 'P4',
          icao: '\\N',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18178',
          name: 'Vision Airlines (V2)',
          alias: '',
          iata: 'V2',
          icao: 'RBY',
          callsign: 'RUBY',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18239',
          name: 'Yellowtail',
          alias: '',
          iata: 'YE',
          icao: 'YEL',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18241',
          name: 'Royal Airways',
          alias: 'Royal Inc.',
          iata: 'KG',
          icao: 'RAW',
          callsign: 'RAW',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18257',
          name: 'Executive AirShare',
          alias: '',
          iata: '',
          icao: 'XSR',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18529',
          name: 'T.J. Air',
          alias: '',
          iata: 'TJ',
          icao: 'TJA',
          callsign: 'T.J. Air',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '18930',
          name: 'Maryland Air',
          alias: 'Maryland',
          iata: 'M1',
          icao: 'M1F',
          callsign: 'Maryland Flight',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19016',
          name: 'Apache Air',
          alias: 'Apache',
          iata: 'ZM',
          icao: 'IWA',
          callsign: 'APACHE',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19287',
          name: 'National Air Cargo',
          alias: '',
          iata: 'N8',
          icao: 'NCR',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19290',
          name: 'Eastern Atlantic Virtual Airlines',
          alias: '',
          iata: '13',
          icao: 'EAV',
          callsign: 'EAVA',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19350',
          name: 'Comfort Express Virtual Charters Albany',
          alias: '',
          iata: '',
          icao: 'EVC',
          callsign: 'Comfort Express',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19351',
          name: 'Comfort Express Virtual Charters',
          alias: '',
          iata: '',
          icao: 'CEO',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19433',
          name: 'XAIR USA',
          alias: '',
          iata: 'XA',
          icao: 'XAU',
          callsign: 'XAIR',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19619',
          name: 'Envoy Air',
          alias: '',
          iata: '',
          icao: 'ENY',
          callsign: 'Envoy',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19674',
          name: 'Rainbow Air (RAI)',
          alias: 'Rainbow Air (RAI)',
          iata: 'RN',
          icao: 'RAB',
          callsign: 'Rainbow',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19676',
          name: 'Rainbow Air Polynesia',
          alias: 'Rainbow Air POL',
          iata: 'RX',
          icao: 'RPO',
          callsign: 'Rainbow Air',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19678',
          name: 'Rainbow Air US',
          alias: 'Rainbow Air US',
          iata: 'RM',
          icao: 'RNY',
          callsign: 'Rainbow Air',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19774',
          name: 'Spike Airlines',
          alias: 'Aero Spike',
          iata: 'S0',
          icao: 'SAL',
          callsign: 'Spike Air',
          country: 'United States',
          active: 'Y',
        },
        {
          id: '19804',
          name: 'All America',
          alias: 'All America',
          iata: 'A2',
          icao: 'AL2',
          callsign: '',
          country: 'United States',
          active: 'Y',
        },
      ],
      countries: [
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
    ...mapActions(['getOffer', 'updateOffer']),

    saveOffer() {
      return this.updateOffer(this.updatedOffer);
    },

    saveDecisionDate(date) {
      this.$refs.decisionDateMenu.save(date);
    },

    saveArrivalDate(date) {
      this.$refs.arrivalDateMenu.save(date);
    },
    saveArrivalTime(time) {
      this.$refs.arrivalTimeMenu.save(time);
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
