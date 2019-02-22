<template lang="pug">
  sui-form
    sui-form-field
      label Medicine
      sui-dropdown( selection :options="commerces" v-model="input.medicine" placeholder="Medicine")
    sui-form-field
      label Qty
      input( type="number" v-model="input.qty" placeholder="Qty")
    sui-button( type="button" v-on:click="addSupply()") Submit 
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'add-supply',
  data(){
      return{
        input:{
          _id: "",
          medicine: "",
          qty: "",
          totalQty: "",
        },
        commerces: []
      }
  },

  created: function()
  {
      this.fetchMedicine();
  },

  methods: {
      fetchMedicine() {
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getAllItem {
            commerces {
              _id
              name
              qty
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.commerces.length; i++) {
              let temp = {
                '_id': result.commerces[i]._id,
                'text': result.commerces[i].name,
                'value': result.commerces[i].name,
                'qty': result.commerces[i].qty
              }
              this.commerces.push(temp);
            }
          });
        });
      },
      addSupply() {
        for(let i = 0; i < this.commerces.length; i++) {
          if(this.commerces[i].value == this.input.medicine) {
            this.input._id = this.commerces[i]._id;
            this.input.totalQty = parseInt(this.commerces[i].qty) + parseInt(this.input.qty);
          }
        }
        let dateObj = basicFunction.getDate();
        let supplier_name = this.$session.get('user').fullname;
        let supply_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
        let postObj = {
          supplier_name: supplier_name, 
          medicine: this.input.medicine,
          qty: parseInt(this.input.qty),
          supply_date: supply_date
        };
        this.axios.post(address + ':3000/add-supply', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleSupply($input:SupplyInput) {
              createSupply(input: $input) {
                  medicine
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Supply Success");
            this.addQty(this.input._id);
            this.$router.push('/supply');
          });
        });
      },
      addQty(id) {
        let postObj = {
          _id: id,
          qty: parseInt(this.input.totalQty)
        };
        this.axios.post(address + ':3000/item-supplied', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleCommerce($itemId: String!, $input:CommerceInput) {
              updateCommerce(_id: $itemId, input: $input) {
                  name
              }
          }`;
          let variables = {
            itemId: id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
          });
        });
      }
  }
};
</script>