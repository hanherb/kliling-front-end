<template lang="pug">
  sui-form
    sui-form-field
      label Title
      input( type="text" v-model="input.title" placeholder="Title")
    sui-form-field
      label Content
      textarea( type="text" v-model="input.content" placeholder="Content")
    sui-button( type="button" v-on:click="updateBlog()") Submit 
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'update-blog',
  data(){
      return{
        input:{
          title: "",
          content: ""
        },
        blog: []
      }
  },

  created: function()
  {
      this.fetchBlog();
  },

  methods: {
      fetchBlog() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-blog", headers).then((response) => {
          let query = `query getSingleBlog($blogId: String!) {
            blog(_id: $blogId) {
              _id
              title
              content
            }
          }`;
          let variable = {
            blogId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.title = result.blog.title;
            this.input.content = result.blog.content;
            this.blog = result.blog;
          });
        });
      },
      updateBlog() {
        let dateObj = basicFunction.getDate();
        let author = this.$session.get('user').fullname;
        let postObj = {
          _id: this.blog._id,
          title: this.input.title, 
          content: this.input.content,
          date: dateObj.date,
          month: dateObj.month,
          year: dateObj.year,
          author: author
        };
        this.axios.post(address + ':3000/update-post', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleBlog($blogId: String!, $input:BlogInput) {
              updateBlog(_id: $blogId, input: $input) {
                  title
              }
          }`;
          let variables = {
            blogId: this.blog._id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Update Blog Success");
            this.$router.push('/blog');
          });
        });
      }
  }
};
</script>