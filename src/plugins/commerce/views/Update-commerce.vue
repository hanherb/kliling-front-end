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
      label description
      textarea( type="text" v-model="input.description" placeholder="Description")
    sui-form-field
      label Image URL
      input( type="text" v-model="input.image" placeholder="Image URL")
    sui-button( type="button" v-on:click="updateCommerce()") Submit 
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'update-commerce',
  data(){
      return{
        input:{
          name: "",
          price: "",
          qty: "",
          description: "",
          image: ""
        },
        commerce: []
      }
  },

  created: function()
  {
      this.fetchCommerce();
  },

  methods: {
      fetchCommerce() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getSingleItem($itemId: String!) {
            commerce(_id: $itemId) {
              _id
              name
              price
              qty
              description
              user
              image
            }
          }`;
          let variable = {
            itemId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.name = result.commerce.name;
            this.input.price = result.commerce.price;
            this.input.qty = result.commerce.qty;
            this.input.description = result.commerce.description;
            this.input.image = result.commerce.image;
            this.commerce = result.commerce;
          });
        });
      },
      updateCommerce() {
        let user = this.$session.get('user').fullname;
        let postObj = {
          _id: this.commerce._id,
          name: this.input.name,
          price: parseInt(this.input.price),
          qty: parseInt(this.input.qty),
          description: this.input.description,
          image: this.input.image,
          user: user
        };
        this.axios.post(address + ':3000/update-item', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleCommerce($itemId: String!, $input:CommerceInput) {
              updateCommerce(_id: $itemId, input: $input) {
                  name
              }
          }`;
          let variables = {
            itemId: this.commerce._id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Update Commerce Success");
            this.$router.push('/commerce');
          });
        });
      }
  }
};
</script>