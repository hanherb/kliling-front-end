<template lang="pug">
  sui-table( celled)
    sui-table-header
      sui-table-row
        sui-table-header-cell Patient Name
        sui-table-header-cell Doctor Name
        sui-table-header-cell Check-in Date
        sui-table-header-cell Consult Date
        sui-table-header-cell Diagnosis
        sui-table-header-cell Medicine
        sui-table-header-cell Status
    sui-table-body
      sui-table-row( v-for="consult in consults")
        sui-table-cell {{consult.patient_name}}
        sui-table-cell {{consult.doctor_name}}
        sui-table-cell {{consult.checkin_date}}
        sui-table-cell {{consult.consult_date}}
        sui-table-cell {{consult.diagnosis}}
        sui-table-cell {{consult.medicine}}
        sui-table-cell {{consult.status}}
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'consult',
  data(){
      return{
          consults: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-consult", headers).then((response) => {
          let query = `query getAllConsult {
            consults {
              _id
            	doctor_name
              patient_name
              checkin_date
              consult_date
              diagnosis
              medicine
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.consults = result.consults;
          });
        });
      }
  }
};
</script>