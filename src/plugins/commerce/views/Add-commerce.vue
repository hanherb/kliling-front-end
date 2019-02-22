<template lang="pug">
  sui-form
    sui-form-field
      label Item Name
      input( type="text" v-model="input.name" placeholder="Item Name")
    sui-form-field
      label Price
      input( type="number" v-model="input.price" placeholder="Price")
    sui-form-field
      label Qty
      input( type="number" v-model="input.qty" placeholder="Qty")
    sui-form-field
      label Description
      textarea( type="text" v-model="input.description" placeholder="Description")
    sui-form-field
      label Image URL
      input( type="text" v-model="input.image" placeholder="Image URL")
    sui-button( type="button" v-on:click="addCommerce()") Submit 
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'add-commerce',
  data(){
      return{
        input:{
          name: "",
          price: "",
          qty: "",
          description: "",
          image: ""
        }
      }
  },

  methods: {
      addCommerce() {
        let user = this.$session.get('user').fullname;
        let postObj = {
          name: this.input.name,
          price: parseInt(this.input.price),
          qty: parseInt(this.input.qty),
          description: this.input.description,
          image: this.input.image,
          user: user
        };
        this.axios.post(address + ':3000/add-item', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleCommerce($input:CommerceInput) {
              createCommerce(input: $input) {
                  name
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Item Success");
            this.$router.push('/commerce');
          });
        });
      }
  }
};
</script>