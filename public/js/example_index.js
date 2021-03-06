// Get references to page elements
var $;

var $searchTerm = $('#search_term');
var $exampleDescription = $('#example-description');
var $submitBtn = $('#submit');
var $exampleList = $('#example-list');

// The API object contains methods for each kind of request we'll make
var API = {
  post: function(example) {
    console.log(example);
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'api/search',
      data: JSON.stringify(example)
    });
  },
  get: function() {
    return $.ajax({
      url: 'api/examples',
      type: 'GET'
    });
  },
  delete: function(id) {
    return $.ajax({
      url: 'api/examples/' + id,
      type: 'DELETE'
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.get().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $('<a>')
        .text(example.text)
        .attr('href', '/example/' + example.id);

      var $li = $('<li>')
        .attr({
          class: 'list-group-item',
          'data-id': example.id
        })
        .append($a);

      var $button = $('<button>')
        .addClass('btn btn-danger float-right delete')
        .text('ｘ');

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    search_term: $searchTerm.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.search_term && example.description)) {
    alert('You must enter an example text and description!');
    return;
  }

  API.post(example).then(function() {
    refreshExamples();
  });

  $searchTerm.val('');
  $exampleDescription.val('');
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr('data-id');

  API.delete(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on('click', handleFormSubmit);
$exampleList.on('click', '.delete', handleDeleteBtnClick);
