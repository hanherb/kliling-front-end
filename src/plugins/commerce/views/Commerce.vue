<template lang="pug">
  div
    li( v-for="commerce in commerces" is="sui-card")
      sui-image( :src="commerce.image")
      sui-card-content
        sui-card-header {{commerce.name}}
        sui-card-meta Posted by: {{commerce.user}}
        sui-card-description {{commerce.description}}
      sui-card-content( extra)
        sui-icon( name="money")
        span Rp.{{commerce.price}}
      router-link( is="sui-button" basic color="green" :to="'/update-commerce?id=' + commerce._id") Update
      router-link( is="sui-button" basic color="red" :to="'/delete-commerce?id=' + commerce._id") Delete
    router-link( is="sui-button" basic color="blue" to="/add-commerce") Add
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'commerce',
  data(){
      return{
          commerces: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getAllCommerce {
            commerces {
              _id
              name
              price
              qty
              description
              user
              image
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.commerces = result.commerces;
          });
        });
      }
  }
};
</script>

<style type="text/css">
  img {
    width: 300px;
    height: 250px;
  }
</style>