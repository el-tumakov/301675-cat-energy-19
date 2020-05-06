(function () {
  var TABLET_WIDTH = 768;
  var DESKTOP_WIDTH = 1300;
  var myMap;

  // Дождёмся загрузки API и готовности DOM.
  ymaps.ready(init);

  function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
      // При инициализации карты обязательно нужно указать
      // её центр и коэффициент масштабирования.
      center: [59.938635, 30.323118], // Москва
      zoom: 18,
      controls: []
    }),

    placemark = new ymaps.Placemark(myMap.getCenter(), {
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: '../img/map-pin.png',
      // Размеры метки.
      iconImageSize: [124, 106],
      iconImageOffset: [-61, -53]
    });

    if (window.innerWidth < TABLET_WIDTH) {
      myMap.setZoom(17);
      placemark.options.set('iconImageSize', [62, 54]);
      placemark.options.set('iconImageOffset', [-30, -40]);
    }

    if (window.innerWidth >= DESKTOP_WIDTH) {
      myMap.setCenter([59.939058, 30.319274], 17);
      placemark.options.set('iconImageOffset', [-80, -130]);
    }

    myMap.geoObjects.add(placemark);
  }
})();
