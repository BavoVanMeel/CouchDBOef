var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const DB_URL = "http://127.0.0.1:5984/products/";
const DB_VIEWS = "_design/views/_view/";

  // Get all products
  router.get('/', (req, res) => {
    axios.get(DB_URL + DB_VIEWS + 'allProducts')
    .then(function (response) {
      // handle success
      res.render('list.ejs', { products: response.data.rows })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  })

  // Show add product form
  router.get('/add', (req, res) => {
    res.render('add.ejs', {})
  })

  // Add product to database
  router.post('/add', (req, res) => {
    axios.post(DB_URL, req.body)
      .then(response => res.redirect('/'))
      .catch(error => console.log(error));
  })

  // Search form
  router.get('/search', (req, res) => {
    res.render('search.ejs', {})
  })

  // Find product
  router.post('/search', (req, res) => {
    axios.get(DB_URL + DB_VIEWS + 'allProducts' + '?key="' + req.body.name + '"')
    .then(function (response) {
      // handle success
      if (response.data.rows[0])
        res.render('search_result.ejs', { products: response.data.rows });
      else
        res.render('search_not_found.ejs', {})
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  })

  // Delete a product
  router.post('/delete', (req, res) => {
    axios.get(DB_URL + DB_VIEWS + 'allProducts' + '?key="' + req.body.name + '"')
    .then(function (response) {
      // handle success
      if (response.data.rows[0]) {
        var id = response.data.rows[0].value._id
        var rev = response.data.rows[0].value._rev
        axios.delete(DB_URL + id + '?rev=' + rev)
          .then(response => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  })

module.exports = router;

// Extra opgave: search by id without lookup/view
/*router.post('/delete', (req, res) => {
  var id = req.body.id;
  axios.get(DB_URL + id)
  .then(function(response) {
    axios.delete(DB_URL + id + '?rev=' + response.data._rev)
    .then(response => res.redirect('/'))
    .catch(error => console.log(error))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
})*/
