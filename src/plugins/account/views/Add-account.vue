<template lang="pug">
  sui-form
    sui-form-field
      label Account Name
      input( type="text" v-model="input.account_name" placeholder="Account Name")
    sui-form-field
      label Total
      input( type="number" v-model="input.total" placeholder="Total")
    sui-button( type="button" v-on:click="addAccount()") Submit
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'add-account',
  data() {
    return {
      input: {
        account_name: '',
        total: 0,
      },
    };
  },

  methods: {
    addAccount() {
      const dateObj = basicFunction.getDate();
      const update_date = `${dateObj.date} ${dateObj.month} ${dateObj.year} @ ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`;
      const postObj = {
        account_name: this.input.account_name,
        total: parseInt(this.input.total),
        update_date,
      };
      this.axios.post(`${address}:3000/add-account`, postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          const query = `mutation createSingleAccount($input:AccountInput) {
              createAccount(input: $input) {
                  account_name
              }
          }`;
          const variables = {
            input: postObj,
          };
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert('Add Account Success');
            this.$router.push('/account');
          });
        });
    },
  },
};
</script>
