var pages = $('.pages').children();
var grabs = false; // Gonna work on this, one day

pages.each(function(i) {
  var page = $(this);
  if (i % 2 === 0) {
    page.css('z-index', (pages.length - i)); 
  }
});

$(window).load(function() {
  
  $('.page').click(function() {
    var page = $(this);
    var page_num = pages.index(page) + 1;
    if (page_num % 2 === 0) {
      page.removeClass('flipped');
      page.prev().removeClass('flipped');
    } else {
      page.addClass('flipped');
      page.next().addClass('flipped');
    }
  });

  if (grabs) {
    $('.page').on('mousedown', function(e) {
      var page = $(this);
      var page_num = pages.index(page) + 1;
      var page_w = page.outerWidth();
      var page_l = page.offset().left;
      var grabbed = '';
      var mouseX = e.pageX;
      if (page_num % 2 === 0) {
        grabbed = 'verso';
        var other_page = page.prev();
        var centerX = (page_l + page_w);
      } else {
        grabbed = 'recto';
        var other_page = page.next();
        var centerX = page_l;
      }

      var leaf = page.add(other_page);

      var from_spine = mouseX - centerX;

      if (grabbed === 'recto') {
        var deg = (90 * -(1 - (from_spine/page_w)));
        page.css('transform', 'rotateY(' + deg + 'deg)');

      } else {
        var deg = (90 * (1 + (from_spine/page_w)));
        page.css('transform', 'rotateY(' + deg + 'deg)');
      }

      leaf.addClass('grabbing');

      $(window).on('mousemove', function(e) {
        mouseX = e.pageX;
        if (grabbed === 'recto') {
          centerX = page_l;
          from_spine = mouseX - centerX;
          var deg = (90 * -(1 - (from_spine/page_w)));
          page.css('transform', 'rotateY(' + deg + 'deg)');
          other_page.css('transform', 'rotateY(' + (180 + deg) + 'deg)');
        } else {
          centerX = (page_l + page_w);
          from_spine = mouseX - centerX;
          var deg = (90 * (1 + (from_spine/page_w)));
          page.css('transform', 'rotateY(' + deg + 'deg)');
          other_page.css('transform', 'rotateY(' + (deg - 180) + 'deg)');
        }

        console.log(deg, (180 + deg) );
      });


      $(window).on('mouseup', function(e) {
        leaf
          .removeClass('grabbing')
          .css('transform', '');

        $(window).off('mousemove');
      });
    });
  }
  
  $('.book').addClass('bound');
});