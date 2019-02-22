<template lang="pug">
  sui-table( celled)
    sui-table-header
      sui-table-row
        sui-table-header-cell Full Name
        sui-table-header-cell Email
        sui-table-header-cell Role
        sui-table-header-cell Action
    sui-table-body
      sui-table-row( v-for="user in users")
        sui-table-cell {{user.fullname}}
        sui-table-cell {{user.email}}
        sui-table-cell {{user.role}}
        sui-table-cell
          router-link( is="sui-button" basic color="green" :to="'/update-user?email=' + user.email") Update
          router-link( is="sui-button" basic color="red" :to="'/delete-user?email=' + user.email") Delete
    sui-table-footer
      sui-table-row
        sui-table-header-cell( colspan="4")
          router-link( is="sui-button" basic color="blue" to="/add-user") Add     
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'user',
  data(){
      return{
          users: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = `query getAllUser {
            users {
              fullname
              email
              role
              authority
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.users = result.users;
          });
        })
      }
  }
};
</script>