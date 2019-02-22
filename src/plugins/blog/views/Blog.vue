<template lang="pug">
  div
    sui-item-group
      li( v-for="blog in blogs" is="sui-item")
        sui-item-content
          sui-item-header {{blog.title}}
          sui-item-description
            p {{blog.content}}
          sui-item-extra Posted by: {{blog.author}} on {{blog.date}} {{blog.month}} {{blog.year}}
          router-link( is="sui-button" basic color="green" :to="'/update-blog?id=' + blog._id") Update
          router-link( is="sui-button" basic color="red" :to="'/delete-blog?id=' + blog._id") Delete
    router-link( is="sui-button" basic color="blue" to="/add-blog") Add
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'blog',
  data(){
      return{
          blogs: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-blog", headers).then((response) => {
          let query = `query getAllBlog {
            blogs {
                _id
              	title
    	        	content
    		        date
    		        month
    		        year
    		        author
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.blogs = result.blogs;
          });
        });
      }
  }
};
</script>