var pages = $('.pages').children();
var grabs = false; // Gonna work on this, one day
var startTime = Date.now(); // Tiempo de inicio para el loader

pages.each(function(i) {
  var page = $(this);
  if (i % 2 === 0) {
    page.css('z-index', (pages.length - i)); 
  }
});

$(window).load(function() {
  var effectTime = 0; // Tiempo del efecto de scroll
  
  // Detectar orientación portrait y hacer scroll horizontal
  function scrollToRightIfPortrait() {
    if (window.innerHeight > window.innerWidth) {
      effectTime = 1500; // 300ms delay + 1200ms animate
      // En portrait: hacer scroll hacia la derecha
      setTimeout(function() {
        $('#loader').css('background', 'transparent'); // Hacer loader transparente durante el efecto
        var maxScroll = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ) - window.innerWidth;
        $('html, body').animate({ scrollLeft: maxScroll }, 1200, function() {
          $('#loader').css('background', '#e3dfd8'); // Restaurar background después del efecto
        });
      }, 300);
    }
  }
  
  scrollToRightIfPortrait();
  
  // También detectar cambios de orientación
  window.addEventListener('orientationchange', function() {
    setTimeout(scrollToRightIfPortrait, 100);
  });
  
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

  
  setTimeout(function() {
    $('#loader').fadeOut();
    
    // Reproducir videos automáticamente
    var videos = document.querySelectorAll('.split-video1, .split-video2');
    videos.forEach(function(video) {
      video.play();
    });
  }, 0);
});