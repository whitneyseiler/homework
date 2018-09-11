import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options) {
  var params = {};

  //limit is set to 11 for determining last page on line 52
  params.limit = 11;

  //if options includes page property, use as search query, otherwise retrieve page 1
  var page = options && options.page ? options.page : 1;
  
  //set offset to item index at zero-based page number assuming ten items per page
  params.offset = ((page - 1) * (params.limit - 1));
  
  //if includes colors property, use as search query, otherwise search all colors
  params['color[]'] = options && options.colors ? options.colors : ["red", "brown", "blue", "yellow", "green"];

  //utilize URI library to construct URL
  var uri = URI(window.path).search(params);
  var requestURL = window.path + '?' + uri.query()

  return fetch(requestURL).then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(payload) {
    return parseData(payload, page)
  })
  .catch(function(error) {
    console.log('ERROR: ', error);
  })
}

/**
 * parse fetched payload into data object and return to retrieve function
 */
function parseData(payload, page) {
  var data = {};

  //if payload object includes more than ten items, there is another page
  data.nextPage = payload.length > 10 ? page + 1 : null;
  data.previousPage = page === 1 ? null : page - 1;

  //only parse first ten items in payload object
  payload = payload.filter(function(item, index) {
    return index < 10;
  })

  data.ids = payload.map(function(item) {
    return item.id
  })

  data.open = payload.filter(function(item) {
    item.isPrimary = isPrimary(item.color);
    return item.disposition === "open";
  })

  data.closedPrimaryCount = payload.filter(function(item) {
    return item.disposition === "closed" && isPrimary(item.color)
  }).length;

  return data;
}

/**
 * return true if input color is a primary color
 */
function isPrimary(color) {
  let primary = ['red', 'blue', 'yellow'];
  return primary.includes(color);
}


export default retrieve;