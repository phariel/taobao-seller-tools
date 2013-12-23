$(function() {
  var $step1 = $('.step1');
  var $step2 = $('.step2');
  var $step3 = $('.step3');
  var $link = $('.pic-link');
  var $pic = $('.pic-cont');

  var $readBtn = $('.btn-read-pic');
  var $cancelBtn = $('.btn-cancel');
  var $saveBtn = $('.btn-save');

  var $picContNew = $('.pic-cont-new');
  var $picPathNew = $('.pic-path-new');

  var url = '';

  $readBtn.click(function() {
    var $this = $(this);
    url = $link.val();
    if(url=='') return;
    $pic.attr('src', url);
    $step1.hide();
    $step2.show();
    $step3.hide();
  });

  $cancelBtn.click(function() {
    $step1.show();
    $step2.hide();
    $step3.hide();
  });

  $saveBtn.click(function() {
    var $this = $(this);
    $this.addClass('btn-info');
    $.ajax({
      type: 'GET',
      url: '/pictrans/save?url=' + url
    })
      .done(function(data) {
        if (data.err && data.err.length > 0) {
          alert('错误： ' + data.err);
        }
        if (data.picture_upload_response) {
          var path = data.picture_upload_response.picture.picture_path;
          $picContNew.attr('src', path);
          $picPathNew.text(path);
          $step1.hide();
          $step2.hide();
          $step3.show();
        }
      })
      .always(function() {
        $this.removeClass('btn-info');
      });
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