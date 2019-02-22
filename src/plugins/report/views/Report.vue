<template lang="pug">
  div
    sui-button( secondary name="button-commerce" v-on:click="toggleDisplay") commerce
    sui-table( celled name="table-commerce" class="table-report")
      sui-table-header
        sui-table-row
          sui-table-header-cell Name
          sui-table-header-cell Description
          sui-table-header-cell Price
          sui-table-header-cell Qty
      sui-table-body
        sui-table-row( v-for="commerce in commerces")
          sui-table-cell {{commerce.name}}
          sui-table-cell {{commerce.description}}
          sui-table-cell {{commerce.price}}
          sui-table-cell {{commerce.qty}}
      sui-button( primary name="print-commerce" v-on:click="startPrint") Print
    sui-button( secondary name="button-consult" v-on:click="toggleDisplay") consult
    sui-table( celled name="table-consult" class="table-report")
      sui-table-header
        sui-table-row
          sui-table-header-cell Patient Name
          sui-table-header-cell Doctor Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Consult Date
          sui-table-header-cell Status
      sui-table-body
        sui-table-row( v-for="consult in consults")
          sui-table-cell {{consult.patient_name}}
          sui-table-cell {{consult.doctor_name}}
          sui-table-cell {{consult.checkin_date}}
          sui-table-cell {{consult.consult_date}}
          sui-table-cell {{consult.status}}
      sui-button( primary name="print-consult" v-on:click="startPrint") Print
    sui-button( secondary name="button-transaction" v-on:click="toggleDisplay") transaction
    sui-table( celled name="table-transaction" class="table-report")
      sui-table-header
        sui-table-row
          sui-table-header-cell Item Name
          sui-table-header-cell Item Qty
          sui-table-header-cell Total Price
          sui-table-header-cell Buyer Name
          sui-table-header-cell Transaction Date
      sui-table-body
        sui-table-row( v-for="transaction in transactions")
          sui-table-cell {{transaction.itemName}}
          sui-table-cell {{transaction.itemQty}}
          sui-table-cell {{transaction.totalPrice}}
          sui-table-cell {{transaction.buyer_name}}
          sui-table-cell {{transaction.transaction_date}}
      sui-button( primary name="print-transaction" v-on:click="startPrint") Print
    sui-button( secondary name="button-supply" v-on:click="toggleDisplay") supply
    sui-table( celled name="table-supply" class="table-report")
      sui-table-header
        sui-table-row
          sui-table-header-cell Supplier Name
          sui-table-header-cell Medicine
          sui-table-header-cell Qty
          sui-table-header-cell Supply Date
      sui-table-body
        sui-table-row( v-for="supply in supplies")
          sui-table-cell {{supply.supplier_name}}
          sui-table-cell {{supply.medicine}}
          sui-table-cell {{supply.qty}}
          sui-table-cell {{supply.supply_date}}
      sui-button( primary name="print-supply" v-on:click="startPrint") Print
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'report',
  data(){
    return{
        commerces: [],
        consults: [],
        transactions: [],
        supplies: []
    }
  },

  created: function()
  {
      this.fetchCommerces();
      this.fetchConsults();
      this.fetchTransactions();
      this.fetchSupplies();
  },

  methods: {
    fetchCommerces() {
      this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
        let query = `query getAllCommerce {
          commerces {
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

    fetchConsults() {
      this.axios.get(address + ":3000/get-consult", headers).then((response) => {
        let query = `query getAllConsult {
          consults {
            doctor_name
            patient_name
            checkin_date
            consult_date
            status
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.consults = result.consults;
        });
      });
    },

    fetchTransactions() {
      this.axios.get(address + ":3000/get-transaction", headers).then((response) => {
        let query = `query getAllTransaction {
          transactions {
            itemName
            itemQty
            totalPrice
            buyer_name
            transaction_date
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.transactions = result.transactions;
        });
      });
    },

    fetchSupplies() {
      this.axios.get(address + ":3000/get-supply", headers).then((response) => {
        let query = `query getAllSupply {
          supplies {
            supplier_name
            medicine
            qty
            supply_date
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.supplies = result.supplies;
        });
      });
    },

    toggleDisplay(event) {
      let button = event.target.name.split('-')[1];
      let table = "table-" + button;
      let el = document.getElementsByName(table);
      for(let i = 0; i < el.length; i++) {
        if (el[i].style.display === "block") {
          el[i].style.display = "none";
        } else {
          el[i].style.display = "block";
        }
      }
    },

    startPrint(event) {
      if(event.target.name.split('-')[1] == 'commerce') {
        setTimeout(() => {
          this.downloadCSV({filename: "commerce.csv", data: this.commerces});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'consult') {
        setTimeout(() => {
          this.downloadCSV({filename: "consult.csv", data: this.consults});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'transaction') {
        setTimeout(() => {
          this.downloadCSV({filename: "transaction.csv", data: this.transactions});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'supply') {
        setTimeout(() => {
          this.downloadCSV({filename: "supply.csv", data: this.supplies});
        },2000);
      }
    },

    convertArrayOfObjectsToCsv(args) {  
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;

      data = args.data || null;
      if (data == null || !data.length) {
          return null;
      }

      columnDelimiter = args.columnDelimiter || ',';
      lineDelimiter = args.lineDelimiter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function(item) {
          ctr = 0;
          keys.forEach(function(key) {
              if (ctr > 0) result += columnDelimiter;

              result += item[key];
              ctr++;
          });
          result += lineDelimiter;
      });

      return 'sep=,\r\n' + result;
    },

    downloadCSV(args) {
      var data, filename, link;
      var csv = this.convertArrayOfObjectsToCsv({
          data: args.data
      });
      if (csv == null) return;

      filename = args.filename || 'export.csv';

      if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    }
  }
};
</script>

<style type="text/css">
  .table-report {
    display: none;
  }
</style>