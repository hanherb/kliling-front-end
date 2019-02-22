<template lang="pug">
  div
    h3( v-if="ongoingConsult == 1") Current Consult:
    sui-table( celled v-if="ongoingConsult == 1")
      sui-table-header
        sui-table-row
          sui-table-header-cell Doctor Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Status
      sui-table-body
        sui-table-row
          sui-table-cell {{consult.doctor_name}}
          sui-table-cell {{consult.checkin_date}}
          sui-table-cell {{consult.status}}
    h3 Doctor List:
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Doctor Name
          sui-table-header-cell Role
          sui-table-header-cell Action
      sui-table-body
        sui-table-row( v-for="user in users")
          sui-table-cell {{user.fullname}}
          sui-table-cell {{user.role}}
          sui-table-cell
            sui-button( basic color="blue" v-on:click="consultWithDoctor(user.fullname)" :disabled="ongoingConsult == 1") Consult
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'patient-consult',
  data(){
      return{
          users: [],
          consult: {},
          ongoingConsult: 0
      }
  },

  created: function()
  {
      this.fetchDoctor();
      this.checkOngoingConsult();
  },

  methods: {
      checkOngoingConsult() {
        this.axios.get(address + ":3000/get-consult", headers).then((response) => {
          let query = `query getAllConsult {
            consults {
              _id
              doctor_name
              patient_name
              checkin_date
              consult_date
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.consults.length; i++) {
              if(result.consults[i].patient_name == this.$session.get('user').fullname) {
                if(result.consults[i].status == 'pending' || result.consults[i].status == 'ongoing') {
                  this.consult = result.consults[i];
                  this.ongoingConsult = 1;
                  break;
                }
              }
            }
          });
        });
      },
      fetchDoctor() {
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = `query getAllUser {
            users {
              _id
              fullname
              email
              role
              authority
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.users.length; i++) {
              if(result.users[i].role == "doctor") {
                this.users.push(result.users[i]);
              }
            }
          });
        })
      },
      consultWithDoctor(name) {
        let patient = this.$session.get('user').fullname;
        let dateObj = basicFunction.getDate();
        let checkin_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
        let postObj = {
          doctor_name: name,
          patient_name: patient,
          checkin_date: checkin_date,
          status: "pending"

        }
        this.axios.post(address + ':3000/add-consult', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleConsult($input:ConsultInput) {
              createConsult(input: $input) {
                  doctor_name
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Consult Success");
            this.$router.push('/patient-consult');
            location.reload();
          });
        });
      }
  }
};
</script>