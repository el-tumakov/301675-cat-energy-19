(function () {
  var MIN_LEVEL = 0;
  var MAX_LEVEL = 100;
  var SHIFT = 34;
  var SHIFT_PERCENT = 3.73;
  var TABLET_WIDTH = 768;
  var catBefore = document.querySelector('.live-example__image-wrap--before');
  var catAfter = document.querySelector('.live-example__image-wrap--after');
  var bar = document.querySelector('.live-example__bar');
  var toggle = document.querySelector('.live-example__toggle');
  var toggleBefore = document.querySelector('.live-example__button--before');
  var toggleAfter = document.querySelector('.live-example__button--after');

  var switchSlide = function (before, after) {
    if (catAfter.classList.contains('live-example__image-wrap--visible') && before) {
      catBefore.classList.add('live-example__image-wrap--visible');
      catAfter.classList.remove('live-example__image-wrap--visible');
      toggle.setAttribute("style", "left: 7px; right: auto");

    } else if (catBefore.classList.contains('live-example__image-wrap--visible') && after) {
      catAfter.classList.add('live-example__image-wrap--visible');
      catBefore.classList.remove('live-example__image-wrap--visible');
      toggle.setAttribute("style", "right: 7px; left: auto");
    }
  };

  var moveSlide = function (evt, elem, parent, firstWrap, secondWrap) {
    evt.preventDefault();

    var currentX = evt.clientX;

    var mousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = currentX - moveEvt.clientX;
      currentX = moveEvt.clientX;

      var elementShift = elem.offsetLeft - shift;
      var firstWrapShift = firstWrap.offsetWidth - shift;
      var secondWrapShift = secondWrap.offsetWidth - shift;

      if (elementShift <= parent.offsetWidth - SHIFT && elementShift >= MIN_LEVEL) {
        elem.style.left = (elementShift * MAX_LEVEL / parent.offsetWidth) + '%';
        firstWrap.style.width = MAX_LEVEL - (elementShift * MAX_LEVEL / parent.offsetWidth) - SHIFT_PERCENT + '%';
        secondWrap.style.width = (elementShift * MAX_LEVEL / parent.offsetWidth) + SHIFT_PERCENT + '%';
      }
    };

    var mouseupHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  if (toggle) {
    toggle.addEventListener('mousedown', function (evt) {
      if (window.innerWidth >= TABLET_WIDTH) {
        moveSlide(evt, toggle, bar, catBefore, catAfter);
      }
    });
  }

  if (bar) {
    bar.addEventListener('click', function () {
      if (window.innerWidth < TABLET_WIDTH) {
        switchSlide(true, true);
      }
    });
  }

  if (toggleBefore) {
    toggleBefore.addEventListener('click', function () {
      if (window.innerWidth < TABLET_WIDTH) {
        switchSlide(true, false);
      } else {
        catBefore.style.width = '100%'
        catAfter.style.width = '0%'
        toggle.style.left = '0%';
      }
    });
  }

  if (toggleAfter) {
    toggleAfter.addEventListener('click', function () {
      if (window.innerWidth < TABLET_WIDTH) {
        switchSlide(false, true);
      } else {
        catBefore.style.width = '0%'
        catAfter.style.width = '100%'
        toggle.style.left = '92%';
      }
    });
  }

  window.addEventListener('resize', function (evt) {
    if (window.innerWidth < TABLET_WIDTH) {
      catBefore.classList.add('live-example__image-wrap--visible');
      catAfter.classList.remove('live-example__image-wrap--visible');
      catBefore.style.width = '';
      catAfter.style.width = '';
      toggle.style.left = '';
    }
  });
})();
