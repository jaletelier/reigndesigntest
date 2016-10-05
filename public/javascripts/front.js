$(document).ready(function() {

  $('.container').on('click', '.delete', function() {
    var itemID = $(this).attr('rel');
    //Hide deleted element
    $('#item' + itemID).fadeOut('normal', function() {
      $(this).remove();
    });
    $.ajax({
      'type': 'delete',
      'url': '/' + itemID,
      'success': function(data) {
        //Add new to replace the deleted one if there are more in the database
        html = $.parseHTML(data);
        $(html).find('.itemrow').each(function(index) {
          var newID = $(this).attr('id');
          if ($('#' + newID).length === 0) {
            $('.container').append(this);
            $(this).hide();
            $(this).fadeIn();
            return
          }
        });
      }
    });
  });

  $('.container').on("mouseenter", '.itemrow', function() {
    $(this).find('.delete').show();
  });

  $('.container').on("mouseleave", '.itemrow', function() {
    $(this).find('.delete').hide();
  });
});