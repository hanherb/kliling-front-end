<template lang="pug">
  div
    h3 Delete {{account.account_name}} ?
    sui-button-group
      router-link( is="sui-button" to="/account") Cancel
      sui-button-or
      sui-button( negative v-on:click="deleteAccount()") Delete
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'delete-account',
  data() {
    return {
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
          this.account = result.account;
        });
      });
    },
    deleteAccount() {
      const postObj = {
        _id: this.account._id,
      };
      this.axios.post(`${address}:3000/delete-account`, postObj, headers)
        .then((response) => {
          const query = `mutation deleteSingleAccount($accountId: String!) {
              deleteAccount(_id: $accountId) {
                  account_name
              }
          }`;
          const variables = {
            accountId: this.account._id,
          };
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert('Delete Account Success');
            this.$router.push('/account');
          });
        });
    },
  },
};
</script>
