var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
          // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
          // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        query_string[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    } 
    return query_string;
  }();

  let nam = QueryString.id;

 var app = new Vue({
    el: "#app",
    data: {
      name: '',
      email: '',
      text: '',
      idrestaurant:'',
      restaurants: [],
      commentaires:[],
      commentaire:[],
      formData:{}
      
    },
    created() {
      findByName()
    },
    methods: {
      submit: function(id) {
        this.idrestaurant=id;
        this.formData.name=this.name;
        this.formData.email=this.email;
        this.formData.text=this.text;
        this.formData.idrestaurant=this.idrestaurant;
        createCommentaire();
        this.name="";
        this.email="";
        this.text="";
        this.idrestaurant="";

      }
    }
  
  });
  

  function findByName() {
    fetch("/api/findbyname/" +nam)
      .then(response => response.json())
      .then(json => {
        app.restaurants = json;
      });
  }

  function createCommentaire() {
    fetch("/api/commentaires/" , {
        method: "POST",
        body: JSON.stringify(app.formData),
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
        app.commentaires.push(app.formData);
        console.log(app.commentaires);
      });
    }

    function findcommentaires() {
      fetch("/api/commentaires/:" +id)
        .then(response => response.json())
        .then(json => {
          app.restaurants = json;
        });
    }

