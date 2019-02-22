<template lang="pug">
  div
    h3( v-if="ongoingConsult == 1") Current Consult:
    sui-table( celled v-if="ongoingConsult == 1")
      sui-table-header
        sui-table-row
          sui-table-header-cell Patient Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Status
      sui-table-body
        sui-table-row
          sui-table-cell {{ongoingConsultDetail.patient_name}}
          sui-table-cell {{ongoingConsultDetail.checkin_date}}
          sui-table-cell {{ongoingConsultDetail.status}}
    sui-form( v-if="ongoingConsult == 1" v-on:submit.prevent)
      sui-form-field
        label Diagnosis
        textarea( type="text" v-model="input.diagnosis" placeholder="Diagnosis")
      sui-form-field
        label Medicine
        textarea( type="text" v-model="input.medicine" placeholder="Medicine")
      sui-button( basic color="red" v-on:click="finishConsultPatient(ongoingConsultDetail._id, ongoingConsultDetail.patient_name)") Finish
    h3 Patient List:
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Patient Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Status
          sui-table-header-cell Action
      sui-table-body
        sui-table-row( v-for="consult in consults")
          sui-table-cell {{consult.patient_name}}
          sui-table-cell {{consult.checkin_date}}
          sui-table-cell {{consult.status}}
          sui-table-cell
            sui-button( basic color="blue" v-if="consult.status == 'pending'" v-on:click="consultWithPatient(consult._id, consult.patient_name)") Consult
            sui-button( basic color="red" v-if="consult.status == 'ongoing'" v-on:click="finishConsultPatient(consult._id, consult.patient_name)") Finish
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
          input: {
            diagnosis: "",
            medicine: ""
          },
          consults: [],
          ongoingConsultDetail: {},
          currentCheckinDate: "",
          currentConsultDate: "",
          ongoingConsult: ""
      }
  },

  created: function()
  {
      this.fetchConsult();
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
              if(result.consults[i].doctor_name == this.$session.get('user').fullname) {
                if(result.consults[i].status == 'ongoing') {
                  this.ongoingConsultDetail = result.consults[i];
                  this.ongoingConsult = 1;
                  break;
                }
              }
            }
          });
        });
      },
      fetchConsult() {
        this.axios.get(address + ":3000/get-consult", headers).then((response) => {
          let query = `query getAllConsult {
            consults {
              _id,
              patient_name,
              doctor_name,
              checkin_date,
              consult_date,
              diagnosis,
              medicine,
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.consults.length; i++) {
              if(result.consults[i].doctor_name == this.$session.get('user').fullname) {
                if(result.consults[i].status != 'finished') {
                  this.consults.push(result.consults[i]);
                }
              }
            }
          });
        })
      },
      consultWithPatient(id, name) {
        let doctor = this.$session.get('user').fullname;
        for(let i = 0; i < this.consults.length; i++) {
          if(this.consults[i]._id == id) {
            this.currentCheckinDate = this.consults[i].checkin_date;
          }
        }
        let dateObj = basicFunction.getDate();
        let consult_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
        let postObj = {
          _id: id,
          doctor_name: doctor,
          patient_name: name,
          checkin_date: this.currentCheckinDate,
          consult_date: consult_date,
          status: "ongoing"
        }
        this.axios.post(address + ':3000/update-consult', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleConsult($consultId: String!, $input: ConsultInput) {
              updateConsult(_id: $consultId, input: $input) {
                  doctor_name
              }
          }`;
          let variables = {
            consultId: id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Update Consult Success");
            this.$router.push('/doctor-consult');
            this.fetchConsult();
            this.checkOngoingConsult();
          });
        });
      },
      finishConsultPatient(id, name) {
        let doctor = this.$session.get('user').fullname;
        for(let i = 0; i < this.consults.length; i++) {
          if(this.consults[i]._id == id) {
            this.currentCheckinDate = this.consults[i].checkin_date;
            this.currentConsultDate = this.consults[i].consult_date;
          }
        }
        let postObj = {
          _id: id,
          doctor_name: doctor,
          patient_name: name,
          checkin_date: this.currentCheckinDate,
          consult_date: this.currentConsultDate,
          diagnosis: this.input.diagnosis,
          medicine: this.input.medicine,
          status: "finished"
        }
        console.log(postObj);
        this.axios.post(address + ':3000/update-consult', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleConsult($consultId: String!, $input: ConsultInput) {
              updateConsult(_id: $consultId, input: $input) {
                  doctor_name
              }
          }`;
          let variables = {
            consultId: id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Update Consult Success");
            this.$router.push('/doctor-consult');
            // location.reload();
          });
        });
      }
  }
};
</script>