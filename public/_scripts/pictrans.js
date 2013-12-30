$(function() {
  var $steps = $('.steps');
  var $step1 = $('.step1');
  var $step2 = $('.step2');
  var $step3 = $('.step3');
  var $link = $('.pic-link');
  var $pic = $('.pic-cont');

  var $readBtn = $('.btn-read-pic');
  var $cancelBtn = $('.btn-cancel');
  var $saveBtn = $('.btn-save');
  var $backBtn = $('.btn-back');

  var $picContNew = $('.pic-cont-new');
  var $picPathNew = $('.pic-path-new');

  var btnSaving = 'btn-info';

  var url = '';

  $readBtn.click(function() {
    var $this = $(this);
    url = $link.val();
    if (url == '') return;
    $pic.attr('src', url);
    $steps.hide();
    $step2.show();
  });

  $cancelBtn.add($backBtn).click(function() {
    $link.val('');
    $steps.hide();
    $step1.show();
  });

  $saveBtn.click(function() {
    var $this = $(this);
    if ($this.hasClass(btnSaving)) return;
    $this.addClass(btnSaving);
    $.ajax({
      type: 'GET',
      url: '/pictrans/save?url=' + url
    })
      .done(function(data) {
        data = $.parseJSON(data);
        if (data.err && data.err.length > 0) {
          alert('错误： ' + data.err);
        }
        if (data.picture_upload_response) {
          var path = data.picture_upload_response.picture.picture_path;
          $picContNew.attr('src', path);
          $picPathNew.text(path);
          $steps.hide();
          $step3.show();
        }
      })
      .always(function() {
        $this.removeClass(btnSaving);
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