<template lang="pug">
  sui-form
    sui-form-field
      label Title
      input( type="text" v-model="input.title" placeholder="Title")
    sui-form-field
      label Content
      textarea( type="text" v-model="input.content" placeholder="Content")
    sui-button( type="button" v-on:click="addBlog()") Submit 
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'add-blog',
  data(){
      return{
        input:{
          title: "",
          content: ""
        }
      }
  },

  methods: {
      addBlog() {
        let dateObj = basicFunction.getDate();
        let author = this.$session.get('user').fullname;
        let postObj = {
          title: this.input.title, 
          content: this.input.content,
          date: dateObj.date,
          month: dateObj.month,
          year: dateObj.year,
          author: author
        };
        this.axios.post(address + ':3000/add-post', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleBlog($input:BlogInput) {
              createBlog(input: $input) {
                  title
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Blog Success");
            this.$router.push('/blog');
          });
        });
      }
  }
};
</script>