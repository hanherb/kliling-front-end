<template lang="pug">
  sui-form
    sui-form-field
      label Email
      input( type="text" v-model="input.email" placeholder="Email")
    sui-form-field
      label Password
      input( type="password" v-model="input.password" placeholder="Password")
    sui-button( type="button" v-on:click="login()") Submit
</template>

<script>
import address from '../address';

export default {
  name: 'login',
  data(){
        return {
          input: {
            email: "",
            password: ""
          }
        }
    },

    methods: {
        login() {
          if(this.input.email != "" && this.input.password != "") {
            this.axios.post(address + ':3000/login-user', {
              email: this.input.email, 
              password: this.input.password
            })
            .then((response) => {
              console.log(response.data);
              if(response.data.token) {
                alert("Login Success");
                location.reload();
                this.$session.start();
                this.$session.set('user', response.data.response);
                document.cookie = "token=" + response.data.token;
                document.cookie = "user_session=" + this.$session.get('user')._id;
                this.$router.push('/');
              }
              else {
                alert("Incorrect Credential");
              }
            });
          }
          else {
            alert("Email and password cannot be empty");
          }
        }
    }
};
</script>
