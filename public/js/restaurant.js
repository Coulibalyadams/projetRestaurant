
var app = new Vue({
  el: "#app",
  data: {
    name: "",
    restaurant:null,
    restaurants: [],
    linktodetail:"details.html?id="
  },
  created() {
    getRestaurants();
  },
  methods: {
    rechercher: function () {
      findByName(this.name)
    },
    supprimer: function (id) {
      Delete(id)
    },
    select: function (restaurant) {
      this.restaurant=restaurant
    },
    sauver:function(restaurant){
      save()
    }
  }

});

function getRestaurants() {
  fetch("/api/restaurants")
    .then(response => response.json())
    .then(json => {
      app.restaurants = json.data;
    });
}

function findByName(name) {
  fetch("/api/findbyname/" + name)
    .then(response => response.json())
    .then(json => {
      app.restaurants = json;
    });
}

function Delete(id) {
  fetch("/api/restaurants/" + id,
    {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(json => {
      getRestaurants()
    });
}

    function save() {
      fetch("/api/restaurants/" + app.restaurant._id, {
          method: "PUT",
          body: JSON.stringify(app.restaurant),
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
          }
        })
        .then(response => response.json())
        .then(json => {
          getRestaurants()
        });
      }

