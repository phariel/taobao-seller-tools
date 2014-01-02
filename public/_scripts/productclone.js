function getParameterByName(name, str) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(str);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function() {
  var $steps = $('.steps');
  var $step1 = $('.step1');
  var $step2 = $('.step2');
  var $step3 = $('.step3');
  var $step4 = $('.step4');
  var $link = $('.product-link');
  var $title = $('.product-title');
  var $seller = $('.product-seller');

  var $readBtn = $('.btn-read-product');
  var $cloneBtn = $('.btn-clone-product');
  var $cancelBtn = $('.btn-cancel');
  var $bindPicBtn = $('.btn-bindpic');

  var $itemImgNew = $('.item-img-new');
  var $propItemNew = $('.prop-img-new');

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
            $steps.hide();
            $step2.show();
          }

        })
        .always(function() {
          $this.removeClass('btn-info');
        });
    }
  });

  $cloneBtn.click(function() {
    var $this = $(this);
    $this.addClass('btn-info');
    $.ajax({
      type: 'GET',
      url: '/clone/add'
    })
      .done(function(data) {
        if (data.err && data.err.length > 0) {
          alert('错误： ' + data.err);
        }
        if (data.item_add_response) {
          $steps.hide();
          $step3.show();
        }
      })
      .always(function() {
        $this.removeClass('btn-info');
      });
  });

  $bindPicBtn.click(function() {
    var $this = $(this);
    $this.addClass('btn-info');
    $.ajax({
      type: 'GET',
      url: '/clone/bindpic'
    })
      .done(function(data) {
        if (data.err && data.err.length > 0) {
          alert('错误： ' + data.err);
          return;
        }
        $steps.hide();
        $step4.show();
        var successText = '绑定成功！';
        var failText = '图片没有或其中一些绑定失败';
        $itemImgNew.text((data.item_img) ? successText : failText);
        $propItemNew.text((data.prop_img) ? successText : failText);
      })
      .always(function() {
        $this.removeClass('btn-info');
      });
  });

  $cancelBtn.click(function() {
    $steps.hide();
    $step1.show();
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