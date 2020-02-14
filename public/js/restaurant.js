

var app = new Vue({
  el: "#app",
  data: {
    name: "",
    restaurant:null,
    restaurantProches:[],
    restaurants: [],
    linktodetail:"single.html?id="
  },
  created() {
    getRestaurants()
    rechercheProche(this.restaurants)
    
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
    },
    recupererRestoProche:function(){
      rechercheProche(this.restaurants)
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


      // google map variable

      var distanceProche=5000;//km

      var latlng ;

      var nyc = new google.maps.LatLng(40.715, -74.002); 
		  var london = new google.maps.LatLng(51.506, -0.119); 
		  var distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
		  console.log(distance/1000);
	

		
		// Position par défaut
		var centerpos = new google.maps.LatLng(5.3493759999999995,-3.9985152);
		
		// Ansi que des options pour la carte, centrée sur latlng
		var optionsGmaps = {
			center:centerpos,
			navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 0
		};
		
		// Initialisation de la carte avec les options
		var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
		
		if(navigator.geolocation) {
		
			// Fonction de callback en cas de succès
			function affichePosition(position) {

				// On instancie un nouvel objet LatLng pour Google Maps
				latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
				// Ajout d'un marqueur à la position trouvée
				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					title:"Vous êtes ici"
				});
				
				map.panTo(latlng);
		
			}
		
			// Fonction de callback en cas d’erreur
			function erreurPosition(error) {
				var info = "Erreur lors de la géolocalisation : ";
				switch(error.code) {
				case error.TIMEOUT:
					info += "Timeout !";
				break;
				case error.PERMISSION_DENIED:
					info += "Vous n’avez pas donné la permission";
				break;
				case error.POSITION_UNAVAILABLE:
					info += "La position n’a pu être déterminée";
				break;
				case error.UNKNOWN_ERROR:
					info += "Erreur inconnue";
				break;
				}
				document.getElementById("maposition").innerHTML = info;
			}
		
			navigator.geolocation.getCurrentPosition(affichePosition,erreurPosition);
		
		} else {
		
			alert("Ce navigateur ne supporte pas la géolocalisation");
		
    }
    
    
      


        function rechercheProche(restaurants)
        {
          var i=0;
          var marker;

          restaurants.forEach(element => {
            
            var restoPosition = new google.maps.LatLng(element.address.coord[0], element.address.coord[1]); 
            var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, restoPosition);
            var distanceKM=distance/1000;
            if(distanceKM<9339){
              i=i+1;
              console.log(i);
              console.log(distance);
              // Ajout d'un marqueur à la position trouvée
              
				      marker= new google.maps.Marker({
					    position: restoPosition,
					    map: map,
					    title:element.name
				      });
              app.restaurantProches.push(element);
            }
          });
          app.restaurantProches.forEach(element => {console.log(element.name);});
        }

