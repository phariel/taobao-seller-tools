function getParameterByName(name, str) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(str);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function() {
  var $step1 = $('.step1');
  var $step2 = $('.step2');
  var $link = $('.product-link');
  var $title = $('.product-title');
  var $seller = $('.product-seller');

  var $readBtn = $('.btn-read-product');
  var $cancelBtn = $('.btn-cancel');

  $readBtn.click(function() {
    var $this = $(this);
    var url = $link.val();
    if (url.length > 0) {
      $this.addClass('btn-info');
      var id = getParameterByName('id', url);
      $.ajax({
        type: 'GET',
        url: '/clone/read/' + id
      })
        .done(function(data) {
          if (data.err && data.err.length > 0) {
            alert('错误： ' + data.err);
          }
          if (data.item_get_response) {
            var item = data.item_get_response.item;
            $link.data('item', item);
            $title.text(item.title);
            $seller.text(item.nick);
            $step1.hide();
            $step2.show();
          }

        })
        .always(function() {
          $this.removeClass('btn-info');
        });
    }
  });

  $cancelBtn.click(function() {
    $step1.show();
    $step2.hide();
  });

  $link.focus(function() {
    var $this = $(this);
    $this.data('val', $this.val());
    $this.val('');
  }).blur(function() {
    var $this = $(this);
    if ($this.val() == '') {
      $this.val($this.data('val'));
    }
  });

});