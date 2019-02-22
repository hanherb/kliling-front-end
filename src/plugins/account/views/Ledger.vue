<template lang="pug">
  div
    h3 {{account.account_name}} Ledger
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Date
          sui-table-header-cell Transaction Detail
          sui-table-header-cell Debit
          sui-table-header-cell Credit
          sui-table-header-cell Balance
      sui-table-body
        sui-table-row( v-for="ledger in ledgers")
          sui-table-cell {{ledger.date}}
          sui-table-cell {{ledger.detail}}
          sui-table-cell {{ledger.debit}}
          sui-table-cell {{ledger.credit}}
          sui-table-cell {{ledger.balance}}
      sui-table-footer
        sui-table-row
          sui-table-header-cell( colspan="5")
            router-link( is="sui-button" basic color="blue" :to="'/add-ledger?id=' + account._id") Add
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'ledger',
  data() {
    return {
      ledgers: [],
      account: {},
    };
  },

  created() {
    this.fetchAccount();
    this.fetchLedger();
  },

  methods: {
    fetchAccount() {
      const id = window.location.href.split('?id=')[1];
      this.axios.get(`${address}:3000/get-account`, headers).then((response) => {
        const query = `query getSingleAccount($accountId: String!) {
            account(_id: $accountId) {
              _id
              account_name
              total
              update_date
            }
          }`;
        const variable = {
          accountId: id,
        };
        graphqlFunction.graphqlFetchOne(query, variable, (result) => {
          this.account = result.account;
        });
      });
    },
    fetchLedger() {
      this.axios.get(`${address}:3000/get-ledger`, headers).then((response) => {
        const query = `query getAllLedger {
            ledgers {
                _id
                account_name
                detail
                date
                debit
                credit
                balance
            }
          }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for (let i = 0; i < result.ledgers.length; i++) {
            if (result.ledgers[i].account_name == this.account.account_name) {
              this.ledgers.push(result.ledgers[i]);
            }
          }
        });
      });
    },
  },
};
</script>
