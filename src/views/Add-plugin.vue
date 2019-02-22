<template lang="pug">
  sui-form
    sui-form-field
      label Plugin List
      div( v-for="plugin in plugins")
        sui-checkbox( :label="plugin" v-model="input.plugin" :value="plugin")
    sui-button( type="button" v-on:click="addPlugin()") Submit 
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'add-plugin',
  data(){
      return{
        input:{
          plugin: []
        },
        plugins: []
      }
  },

  created: function()
  {
      this.fetchPluginDirectory();
      this.fetchActivePlugin();
  },

  methods: {
      fetchPluginDirectory() {
        this.axios.get(address + ":3000/list-plugin", headers).then((response) => {
          for(let i = 0; i < response.data.length; i++) {
            if(response.data[i] != 'login' && response.data[i] != 'register') {
              this.plugins.push(response.data[i]);
            }
          }
        });
      },

      fetchActivePlugin() {
        this.axios.get(address + ":3000/get-plugin", headers).then((response) => {
          let query = `query getAllPlugin {
            plugins {
              name
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.plugins.length; i++) {
              if(result.plugins[i].status == 1) {
                this.input.plugin.push(result.plugins[i].name);
              }
            }
          });
        });
      },

      addPlugin() {
        let pluginWithStatus = [];
        let e1 = this.plugins;
        let e2 = this.input.plugin;
        let flag = false;

        for (var i = 0; i < e1.length; i++) {
          for (var j = 0; j < e2.length; j++) {
            if(e1[i] === e2[j]) {
              flag = true;
            }
          }
          if(flag) {
            pluginWithStatus.push({'name': e1[i], 'status': 1});
            flag = false;
          }
          else
            pluginWithStatus.push({'name': e1[i], 'status': 0});
        }
        let postObj = {
          plugin: pluginWithStatus
        };
        this.axios.post(address + ':3000/add-plugin', postObj, headers)
        .then((response) => {
          for (var i = 0; i < pluginWithStatus.length; i++) {
            let query = `mutation updateSinglePlugin($pluginName:String!, $input:PluginInput) {
                updatePlugin(name: $pluginName, input: $input) {
                    name
                }
            }`;
            let variables = {
              pluginName: pluginWithStatus[i].name,
              input: {
                name: pluginWithStatus[i].name,
                status: pluginWithStatus[i].status
              }
            }
            graphqlFunction.graphqlMutation(query, variables, (result) => {
              console.log(result);
            });
          }
          alert("Add Plugin Success");
          location.reload();
          this.$router.push('/add-plugin');
        });
      }
  }
};
</script>