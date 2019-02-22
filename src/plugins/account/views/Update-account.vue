<template lang="pug">
  sui-form
    sui-form-field
      label Account Name
      input( type="text" v-model="input.account_name" placeholder="Account Name")
    sui-form-field
      label Total
      input( type="number" v-model="input.total" placeholder="Total")
    sui-button( type="button" v-on:click="updateAccount()") Submit
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'update-account',
  data() {
    return {
      input: {
        account_name: '',
        total: 0,
      },
      account: [],
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
          this.input.account_name = result.account.account_name;
          this.input.total = result.account.total;
          this.account = result.account;
        });
      });
    },
    updateAccount() {
      const dateObj = basicFunction.getDate();
      const update_date = `${dateObj.date} ${dateObj.month} ${dateObj.year} @ ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`;
      const postObj = {
        _id: this.account._id,
        account_name: this.input.account_name,
        total: parseInt(this.input.total),
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
            alert('Update Account Success');
            this.$router.push('/account');
          });
        });
    },
  },
};
</script>
