<template lang="pug">
  div
    li( v-for="commerce in commerces" is="sui-card")
      sui-image( :src="commerce.image")
      sui-card-content
        sui-card-header {{commerce.name}}
        sui-card-meta Posted by: {{commerce.user}}
        sui-card-description {{commerce.description}}
      sui-card-content( extra)
        sui-icon( name="money")
        span Rp.{{commerce.price}}
      sui-card-content( extra)
        p Qty:
        input( type="number" placeholder="Qty" value="1" :id="commerce._id")
      sui-button( basic color="green" v-on:click="addToCart(commerce._id, commerce.name, commerce.price, commerce.qty)") Add to cart
    h3( v-if="carts") Shopping Cart:
    sui-table( celled v-if="carts")
      sui-table-header
        sui-table-row
          sui-table-header-cell Item Name
          sui-table-header-cell Qty
          sui-table-header-cell Price
      sui-table-body
        sui-table-row( v-for="cart in carts")
          sui-table-cell {{cart.itemName}}
          sui-table-cell {{cart.itemQty}}
          sui-table-cell {{cart.totalPrice}}
        sui-table-row
          sui-table-cell( colspan="2") Total:
          sui-table-cell {{totalShoppingPrice}}
    sui-button( v-if="carts" basic color="blue" v-on:click="buyItem()") Checkout
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import basicFunction from '~/src/basicFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'commerce',
  data(){
      return{
          input: {
            qty: ""
          },
          commerces: [],
          carts: [],
          totalShoppingPrice: 0
      }
  },

  created: function()
  {
      this.fetchItems();
      this.fetchShoppingCart();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getAllCommerce {
            commerces {
              _id
              name
              price
              qty
              description
              user
              image
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.commerces = result.commerces;
          });
        });
      },
      addToCart(id, name, price, prevQty) {
        let qty = document.getElementById(id).value;
        let tempCart = {
          itemId: id,
          itemName: name,
          itemQty: qty,
          prevQty: prevQty,
          totalPrice: price * qty
        };
        if(this.$session.get('session_cart')) {
          let sessionCart = this.$session.get('session_cart');
          sessionCart.push(tempCart);
          this.$session.set('session_cart', sessionCart);
          this.fetchShoppingCart();
        }
        else {
          let sessionCart = [];
          sessionCart.push(tempCart);
          this.$session.set('session_cart', sessionCart);
          this.fetchShoppingCart();
        }
      },
      fetchShoppingCart() {
        this.carts = this.$session.get('session_cart');
        if(this.carts) {
          for(let i = 0; i < this.carts.length; i++) {
            this.totalShoppingPrice += this.carts[i].totalPrice;
          }
        }
      },
      buyItem() {
        let postObj = this.carts;
        let dateObj = basicFunction.getDate();
        let transaction_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
        for(let i = 0; i < postObj.length; i++) {
          postObj[i].buyer_name = this.$session.get('user').fullname;
          postObj[i].transaction_date = transaction_date;
        }

        this.axios.post(address + ':3000/add-transaction', postObj, headers)
        .then((response) => {
          let query = `mutation createTransaction($input:TransactionInput) {
              createTransaction(input: $input) {
                  _id
              }
          }`;
          for(let i = 0; i < postObj.length; i++) {
            postObj[i]._id = response.data.insertedIds[i];
            postObj[i].itemQty = parseInt(postObj[i].itemQty);
            let variables = {
              input: {
                _id: postObj[i]._id,
                itemId: postObj[i].itemId,
                itemName: postObj[i].itemName,
                itemQty: postObj[i].itemQty,
                totalPrice: postObj[i].totalPrice,
                buyer_name: postObj[i].buyer_name,
                transaction_date: postObj[i].transaction_date
              }
            }
            graphqlFunction.graphqlMutation(query, variables, (result) => {
              this.substractQty(postObj[i].itemId, (postObj[i].prevQty-postObj[i].itemQty), () => {
                if(i == (postObj.length-1)) {
                  this.$session.remove('session_cart');
                  alert("Add Transaction Success");
                  this.$router.push('/buy-commerce');
                  this.fetchShoppingCart();
                  this.fetchItems();
                }
              });
            });
          }
        });
      },
      substractQty(id, qty, callback) {
        let postObj = {
          _id: id,
          qty: qty
        };
        this.axios.post(address + ':3000/substract-qty', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleItem($itemId:String!, $input:CommerceInput) {
              updateCommerce(_id: $itemId, input: $input) {
                  name
              }
          }`;
          let variables = {
            itemId: id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            if(callback)
                return callback();
          });
        });
      }
  }
};
</script>

<style type="text/css">
  img {
    width: 300px;
    height: 250px;
  }
</style>