<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<template>
  <div>
    <h2>FootBall API</h2>
    <div style="padding-top: 20px">
     
      <button @click="getMatchedData" class="btn btn-warning">
        Refresh Data
      </button>
      <button @click="getPredictions" class="btn btn-warning">
        Get Prediction Data
      </button>
      <button @click="getOdds" class="btn btn-warning">
        Get Odd Data
      </button>
      <button @click="getProbibilities" class="btn btn-warning">
        Get Probability Data
      </button>
      <input id="startDate" class="form-control" type="date" v-model="date" />
    </div>
    <div class="div d-flex table-section" style="padding-top: 20px">
      <table>
        <thead>
          <tr style="white-space: nowrap">
            <th>ID</th>
            <th style="padding: 8px 10px" @click="sortList('country_league')">
              Country & League &#8597
            </th>

            <th @click="sortList('home')">Home & Away &#8597</th>
            <th @click="sortList('under_over')">U/O &#8597</th>
            <th style="padding: 8px 70px" @click="sortList('advice')">Advice &#8597</th>
            <th sortKey="goals_over_under.U15" @click="sortList('goals_over_under.U15')">U-1.5 &#8597</th>
            <th @click="sortList('goals_over_under.U25')">U-2.5 &#8597</th>
            <th @click="sortList('goals_over_under.U35')">U-3.5 &#8597</th>
            <th @click="sortList('goals_over_under.O15')">O-1.5 &#8597</th>
            <th @click="sortList('goals_over_under.O25')">O-2.5 &#8597</th>
            <th @click="sortList('goals_over_under.O35')">O-3.5 &#8597</th>
            <th @click="sortList('both_teams_score.yes')">BTTS Yes &#8597</th>
            <th @click="sortList('both_teams_score.no')">BTTS No &#8597</th>
            <th @click="sortList('match_winner.home')">1 &#8597</th>
            <th @click="sortList('match_winner.draw')">X &#8597</th>
            <th @click="sortList('match_winner.away')">2 &#8597</th>
            <th @click="sortList('double_chance.DH')">1-X &#8597</th>
            <th @click="sortList('double_chance.AH')">1-2 &#8597</th>
            <th @click="sortList('double_chance.AD')">2-X &#8597</th>
            <th @click="sortList('goals.home')">Goals &#8597</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prediction, index) in matchedData" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ prediction?.country_league }}</td>
            <td>{{ prediction?.home }} - {{ prediction?.away }}</td>
            <td>{{ prediction?.under_over }}</td>
            <td>{{ prediction?.advice }}</td>
            <td>{{ prediction?.goals_over_under?.U15 }}</td>
            <td>{{ prediction?.goals_over_under?.U25 }}</td>
            <td>{{ prediction?.goals_over_under?.U35 }}</td>
            <td>{{ prediction?.goals_over_under?.O15 }}</td>
            <td>{{ prediction?.goals_over_under?.O25 }}</td>
            <td>{{ prediction?.goals_over_under?.O35 }}</td>
            <td>{{ prediction?.both_teams_score?.yes }}</td>
            <td>{{ prediction?.both_teams_score?.no }}</td>
            <td>{{ prediction?.match_winner?.home }}</td>
            <td>{{ prediction?.match_winner?.draw }}</td>
            <td>{{ prediction?.match_winner?.away }}</td>
            <td>{{ prediction?.double_chance?.DH }}</td>
            <td>{{ prediction?.double_chance?.AH }}</td>
            <td>{{ prediction?.double_chance?.AD }}</td>
            <td>
              {{ prediction?.goals?.home }} - {{ prediction?.goals?.away }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="div d-flex table-section" style="padding-top: 20px">
      <table>
        <thead>
          <tr style="white-space: nowrap">
            <th>ID</th>
            <th>Home & Away &#8597</th>
            <th>BTTS</th>
            <th>O2.5</th>
            <th>U2.5</th>
            <th>O3.5</th>
            <th>U3.5</th>
            <th>1</th>
            <th>x</th>
            <th>2</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(probibility, index) in probabilities" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ probibility?.home }} - {{ probibility?.away }}</td>
            <td>{{ probibility?.btts }}</td>
            <td>{{ probibility?.over_2_5 }}</td>
            <td>{{ probibility?.under_2_5 }}</td>
            <td>{{ probibility?.over_3_5 }}</td>
            <td>{{ probibility?.under_2_5 }}</td>
            <td>{{ probibility?.one }}</td>
            <td>{{ probibility?.x }}</td>
            <td>{{ probibility?.two }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'footballApi',
  props: {
    msg: String,
  },
  data() {
    return {
      sortBy: false,
      http: 'http://localhost:3000/api',
      matchedData: [],

      probabilities: [],
      sortedbyASC: true,
      date: ''
    };
  },
  methods: {
    async getMatchedData() {
      this.matchedData = [];
      const req = axios.get(`${this.http}/match-data`);
      const matchedData = await req.then((res) => res.data.predictions);

      this.matchedData = matchedData;
      this.getLastProbibilities()
    },
    async getPredictions() {
      axios.get(`${this.http}/prediction?date=${this.date}`);

      console.log('Prediction Done');
    },

    async getOdds() {
      axios.get(`${this.http}/odd?date=${this.date}`);

      console.log('Odd Done');
    },
    async getProbibilities() {
      axios.get(`${this.http}/probabilities?date=${this.date}`);

      console.log('Probabilities Done');
    },
    async getLastProbibilities(){
      this.probabilities = [];
      const req = axios.get(`${this.http}/probabilities/find?date=${this.date}`);
      const probabilities = await req.then((res) => res.data.games);

      this.probabilities = probabilities;
    },
    sortList(sortBy: any) {
      if (this.sortedbyASC) {
        this.matchedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.matchedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
  },
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

table-section {
  overflow-y: scroll;
  margin: auto;
  width: 90%;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th:hover {
  cursor: pointer;
  background: rgb(229, 255, 211);
}

tr:nth-child(even) {
  background-color: #f3f3f3;
}


.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}


.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
}


.tab button:hover {
  background-color: #ddd;
}


.tab button.active {
  background-color: #ccc;
}

.tabcontent {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
