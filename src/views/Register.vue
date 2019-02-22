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
    sui-form-field
      label Password
      input( type="password" v-model="input.password" placeholder="Password")
    sui-form-field
      label Confirm Password
      input( type="password" v-model="input.confirm_password" placeholder="Confirm Password")
    sui-button( type="button" v-on:click="addUser()") Submit 
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'register',
  data(){
      return{
        input:{
          email: "",
          fullname: "",
          role: "",
          authority: [],
          password: "",
          confirm_password: ""
        },
        roles: [],
        plugins: []
      }
  },

  created: function()
  {
      this.fetchRole();
      this.fetchPlugin();
  },

  methods: {
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

      addUser() {
        let postObj = {
          email: this.input.email, 
          fullname: this.input.fullname,
          role: this.input.role,
          authority: this.input.authority,
          password: this.input.password
        };
        this.axios.post(address + ':3000/register-user', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleUser($input:PersonInput) {
              createUser(input: $input) {
                  fullname
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Register User Success");
            this.$router.push('/');
          });

        });
      }
  }
};
</script>