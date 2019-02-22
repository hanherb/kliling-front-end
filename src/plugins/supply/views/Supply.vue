<template lang="pug">
  div
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Supplier Name
          sui-table-header-cell Medicine
          sui-table-header-cell Qty
          sui-table-header-cell Supply Date
      sui-table-body
        sui-table-row( v-for="supply in supplies")
          sui-table-cell {{supply.supplier_name}}
          sui-table-cell {{supply.medicine}}
          sui-table-cell {{supply.qty}}
          sui-table-cell {{supply.supply_date}}
    router-link( is="sui-button" basic color="blue" to="/add-supply") Add
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'supply',
  data(){
      return{
          supplies: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-supply", headers).then((response) => {
          let query = `query getAllSupply {
            supplies {
            	supplier_name
              medicine
              qty
              supply_date
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.supplies = result.supplies;
          });
        });
      }
  }
};
</script>