<template lang="pug">
sui-menu(attached="top")
  sui-container
    router-link( is="sui-menu-item" to="/") Home
    router-link( v-if="session" is="sui-menu-item" to="/users") User
    router-link( v-if="session" is="sui-menu-item" to="/add-plugin") Add Plugin
    router-link( is="sui-menu-item" to="/about") About
    router-link( v-if="session" v-for="plugin in plugins" is="sui-menu-item" :to="plugin.url" :id="plugin.name") {{plugin.name}}
    router-link( is="sui-menu-item" v-if="!session" to="/login") Login
    router-link( is="sui-menu-item" v-if="!session" to="/register") Register
    router-link( is="sui-menu-item" v-if="session" :to="'/profile?id=' + session._id") {{session.fullname}}
    a( is="sui-menu-item" v-if="session" v-on:click="logout") Logout
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import basicFunction from '../basicFunction';
import address from '../address';

export default {
    data(){
        return{
            plugins: [],
            session: []
        }
    },

    created: function()
    {
        this.fetchItems();
        this.fetchSession();
    },

    methods: {
        fetchItems() {
          let query = `query getAllPlugin {
            plugins {
              name
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.plugins.length; i++) {
              if(result.plugins[i].status == 1) {
                let temp = {
                  'name': result.plugins[i].name,
                  'status': result.plugins[i].status
                }
                temp.url = this.filterMenuBySession(temp.name);
                this.plugins.push(temp);
              }
            }
          });
        },

        fetchSession() {
          this.session = this.$session.get('user');
        },

        filterMenuBySession(pluginName) {
          if(this.session) {
            if(pluginName == 'consult') {
              if(this.session.role == 'doctor') {
                return 'doctor-consult';
              }
              else if(this.session.role == 'user') {
               return 'patient-consult';
              }
              else {
                return 'consult';
              }
            }
            else if(pluginName == 'commerce') {
              if(this.session.role == 'user') {
                return 'buy-commerce';
              }
              else if(this.session.role == 'doctor') {
                return 'buy-commerce';
              }
              else {
                return 'commerce';
              }
            }
            else {
              return pluginName;
            }
          }
          else {
            return pluginName;
          } 
        },

        logout() {
          this.axios.get(address + ":3000/logout").then((response) => {
            alert("Successfully Logged Out");
            basicFunction.deleteAllCookies();
            this.$session.destroy();
            this.$router.push('/');
            location.reload();
          });
        }
    }
}
</script>

<style>
</style>
