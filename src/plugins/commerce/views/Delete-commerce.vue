<template lang="pug">
  div
    h3 Delete {{commerce.name}} ?
    sui-button-group
      router-link( is="sui-button" to="/commerce") Cancel
      sui-button-or
      sui-button( negative v-on:click="deleteCommerce()") Delete
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'delete-commerce',
  data(){
      return{
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
            this.commerce = result.commerce;
          });
        });
      },
      deleteCommerce() {
        let postObj = {
          _id: this.commerce._id
        };
        this.axios.post(address + ':3000/delete-item', postObj, headers)
        .then((response) => {
          let query = `mutation deleteSingleCommerce($itemId: String!) {
              deleteCommerce(_id: $itemId) {
                  name
              }
          }`;
          let variables = {
            itemId: this.commerce._id
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Delete Commerce Success");
            this.$router.push('/commerce');
          });
        });
      }
  }
};
</script>