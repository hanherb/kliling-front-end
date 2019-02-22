<template lang="pug">
  div
    sui-image( src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
    h1 {{user.fullname}}
    h3 E-mail: {{user.email}}
    h3 Role: {{user.role}}
    h2 Activity:
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Detail
          sui-table-header-cell Date
      sui-table-body
        sui-table-row( v-for="log in logs")
          sui-table-cell {{log.detail}}
          sui-table-cell {{log.date}}
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'user',
  data(){
      return{
          user: {},
          logs: []
      }
  },

  created: function()
  {
      this.fetchUser();
      this.fetchLog();
  },

  methods: {
      fetchUser() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = `query getSingleUser($userId: String!) {
              user(_id: $userId) {
                  _id
                  fullname
                  email
                  role
                  authority 
              }
          }`;
          let variable = {
            userId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.user = result.user;
          });
        })
      },

      fetchLog() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-log", headers).then((response) => {
          for(let i = 0; i < response.data.length; i++) {
            if(response.data[i].userId == id) {
              this.logs.push(response.data[i]);
            }
          }
        });
      }
  }
};
</script>

<style type="text/css">
  img {
    width: 250px;
    height: 250px;
  }
</style>