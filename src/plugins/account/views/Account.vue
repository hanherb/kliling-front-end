<template lang="pug">
  sui-table( celled)
    sui-table-header
      sui-table-row
        sui-table-header-cell Account Name
        sui-table-header-cell Total
        sui-table-header-cell Last Update
        sui-table-header-cell Action
    sui-table-body
      sui-table-row( v-for="account in accounts")
        sui-table-cell
          router-link( :to="'/ledger?id=' + account._id") {{account.account_name}}
        sui-table-cell {{account.total}}
        sui-table-cell {{account.update_date}}
        sui-table-cell
          router-link( is="sui-button" basic color="green" :to="'/update-account?id=' + account._id") Update
          router-link( is="sui-button" basic color="red" :to="'/delete-account?id=' + account._id") Delete
    sui-table-footer
      sui-table-row
        sui-table-header-cell( colspan="4")
          router-link( is="sui-button" basic color="blue" to="/add-account") Add
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'account',
  data() {
    return {
      accounts: [],
    };
  },

  created() {
    this.fetchItems();
  },

  methods: {
    fetchItems() {
      this.axios.get(`${address}:3000/get-account`, headers).then((response) => {
        const query = `query getAllAccount {
            accounts {
                _id
              	account_name
                total
                update_date
            }
          }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.accounts = result.accounts;
        });
      });
    },
  },
};
</script>
