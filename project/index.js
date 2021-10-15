function calculateCost(product) {
  return product.price * product.quantity;
}

function generateStringDate(product) {
  const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ];
  return new Date(product.date).getDate() + " " + monthNames[new Date(product.date).getMonth()];
}


var jsonDoc = $.getJSON("out.json",
  function (data) {
    var mainresult = [];
    var products = data.products;

    var groupedByDate = new Map();

    products.forEach(product => {

      

      product.date = generateStringDate(product)
      var cost = calculateCost(product)
      product.cost = cost.toFixed(2)

      if (product.image==null){
        product.image='img/zagl.jpg';
      }

      if (!groupedByDate.has(product.date)) {
        groupedByDate.set(product.date, [product])
      } else {
        var productArray = groupedByDate.get(product.date)
        productArray.push(product);
        groupedByDate.set(product.date, productArray)
      }
    })

    groupedByDate.forEach((productArray, date) => {

      var productInfo = [];
      var groupedById = new Map();


      productArray.forEach(product => {

      

        if (!groupedById.has(product.id)) {
          groupedById.set(product.id, [product]);
        } else {
          var productArray = groupedById.get(product.id);
          productArray.push(product);
          groupedById.set(product.id, productArray)
        }
      })

      var costGlobal = 0;
      groupedById.forEach((productArray, id) => {

        var cost = productArray.map(el => parseFloat(el.cost)).reduce((a, b) => a + b);
        productInfo.push({
          id: id,
          data: productArray,
          cost: cost.toFixed(2),
          namerp: productArray[0].namerp,
          id: productArray[0].id
        })
        costGlobal += cost
      })
      mainresult.push({
        date: date,
        el: productInfo,
        costGlobal: costGlobal.toFixed(2)
      })



    })

    var template = Handlebars.compile(document.getElementById('entry-template').innerHTML);
    var html = template({
      mainresult: mainresult
    })

    document.getElementById('here').innerHTML = html;

    const imgs = [
      'img/slider_open.png',
      'img/slider_close.png'
    ]

    function* imageSrcGenerator(srcArr) {
      let i = -1;
      while (++i < srcArr.length || !(i = 0))
        yield srcArr[i];
    }

    $('.cost').text((i, text) => {
      const [cost, currency] = text.split(' ');
      return `${(+cost).toLocaleString()} ${currency}`;
    });


    $(".list_prihod_rashod").hide();
    $('.list_data').on('click', '.imya_list_data', function () {
      $(this)
        .next('.list_prihod_rashod')
        .not(':animated')
        .slideToggle();



      var img = $(this).find("img")
      if (!img[0].open) {
        img[0].src = imgs[0]
        img[0].open = true;
      } else {
        img[0].src = imgs[1];
        img[0].open = false;
      }


    });

    $('.list_prihod_rashod').on('click', '.imya_prihod_rashod', function () {
      $(this)
        .next('.list_spisok_tovarov')
        .not(':animated')
        .slideToggle();
    });


  })