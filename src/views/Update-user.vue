<template lang="pug">
  sui-form
    sui-form-field
      label Email
      input( type="text" v-model="input.email" placeholder="Email")
    sui-form-field
      label Full Name
      input( type="text" v-model="input.fullname" placeholder="Full Name")
    sui-form-field
      label Role
      sui-dropdown( selection :options="roles" v-model="input.role" placeholder="Role")
    sui-form-field
      label User Management Authority
      div
        sui-checkbox( label="create" v-model="input.authority" value="create")
      div
        sui-checkbox( label="update" v-model="input.authority" value="update")
      div
        sui-checkbox( label="delete" v-model="input.authority" value="delete")
      label API Authority
      div( v-for="plugin in plugins")
        sui-checkbox( :label="plugin.name" v-model="input.authority" :value="plugin.name")
    sui-button( type="button" v-on:click="updateUser()") Submit 
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'update-user',
  data(){
      return{
        input:{
          email: "",
          fullname: "",
          role: "",
          authority: []
        },
        roles: [],
        plugins: []
      }
  },

  created: function()
  {
      this.fetchUser();
      this.fetchRole();
      this.fetchPlugin();
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
            this.input.email = result.user.email;
            this.input.fullname = result.user.fullname;
            this.input.role = result.user.role;
            this.input.authority = result.user.authority;
          });
        })
      },
      fetchRole() {
        this.axios.get(address + ":3000/get-role", headers).then((response) => {
          let query = `query getAllRole {
            roles {
                role_name
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.roles.length; i++) {
              let temp = {
                'text': result.roles[i].role_name,
                'value': result.roles[i].role_name
              }
              this.roles.push(temp);
            }
          });
        });
      },

      fetchPlugin() {
        this.axios.get(address + ":3000/get-plugin", headers).then((response) => {
          let query = `query getAllPlugin {
            plugins {
              name
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.plugins = result.plugins;
          });
        });
      },

      updateUser() {
        let postObj = {
          email: this.input.email, 
          fullname: this.input.fullname,
          role: this.input.role,
          authority: this.input.authority
        };
        this.axios.post(address + ':3000/update-user', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleUser($userEmail:String!, $input:PersonInput) {
              updateUser(email: $userEmail, input: $input) {
                  fullname
              }
          }`;
          let variables = {
            userEmail: this.input.email,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Update User Success");
            this.$router.push('/users');
          });

        });
      }
  }
};
</script>