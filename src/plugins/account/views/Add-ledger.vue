<template lang="pug">
  sui-form
    sui-form-field
      label Detail
      input( type="text" v-model="input.detail" placeholder="Detail")
    sui-form-field
      label Debit
      input( type="number" v-model="input.debit" placeholder="Debit")
    sui-form-field
      label Credit
      input( type="number" v-model="input.credit" placeholder="Credit")
    sui-button( type="button" v-on:click="addLedger()") Submit
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'add-ledger',
  data() {
    return {
      input: {
        detail: '',
        debit: 0,
        credit: 0,
      },
      balance: 0,
      account: {},
    };
  },

  created() {
    this.fetchAccount();
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
          this.account.total = parseInt(this.account.total);
        });
      });
    },
    addLedger() {
      const dateObj = basicFunction.getDate();
      const date = `${dateObj.date} ${dateObj.month} ${dateObj.year} @ ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`;
      this.balance = parseInt(this.account.total) + parseInt(this.input.debit) - parseInt(this.input.credit);
      const postObj = {
        account_name: this.account.account_name,
        detail: this.input.detail,
        date,
        debit: parseInt(this.input.debit),
        credit: parseInt(this.input.credit),
        balance: parseInt(this.balance),
      };
      this.axios.post(`${address}:3000/add-ledger`, postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          const query = `mutation createSingleLedger($input:LedgerInput) {
              createLedger(input: $input) {
                  detail
              }
          }`;
          const variables = {
            input: postObj,
          };
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            this.updateAccount();
            alert('Add Ledger Success');
            this.$router.push(`/ledger?id=${window.location.href.split('?id=')[1]}`);
          });
        });
    },
    updateAccount() {
      const dateObj = basicFunction.getDate();
      const update_date = `${dateObj.date} ${dateObj.month} ${dateObj.year} @ ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`;
      const postObj = {
        _id: this.account._id,
        account_name: this.account.account_name,
        total: parseInt(this.balance),
        update_date,
      };
      this.axios.post(`${address}:3000/update-account`, postObj, headers)
        .then((response) => {
          const query = `mutation updateSingleAccount($accountId: String!, $input:AccountInput) {
              updateAccount(_id: $accountId, input: $input) {
                  account_name
              }
          }`;
          const variables = {
            accountId: this.account._id,
            input: postObj,
          };
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
          });
        });
    },
  },
};
</script>
