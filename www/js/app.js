// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'services','ngCordova','pascalprecht.translate'])

.constant('config', {
    FBappIdProd: '1663498527242562',
    FBappIdSecret: '34acca6a5f91b6834b74941e71f1225d',
    AWSIdentityPoolId: 'eu-west-1:f9c1658b-a4c9-4f5f-b3c9-eb1b264f96cf',
    isOnline: false
})

.directive('elasticHeader', function($ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function(scope, scroller, attr) {

      var scrollerHandle = $ionicScrollDelegate.$getByHandle(attr.delegateHandle);
      var header = document.getElementById(attr.elasticHeader);
      var default_image = document.getElementById("my-item");
      
      
      //var headerHeight = header.clientHeight;
      var headerHeight = 390;
      var translateAmt, scaleAmt, scrollTop, lastScrollTop;
      var translateAmt2, scaleAmt2, scrollTop2, lastScrollTop2;
      var ticking = false;
      
      var ItemName = document.getElementById("editItemName");

      // Set transform origin to top:
      header.style[ionic.CSS.TRANSFORM + 'Origin'] = 'center bottom';
      
      default_image.style[ionic.CSS.TRANSFORM + 'Origin'] = 'center bottom';
      
      
      // Update header height on resize:
      window.addEventListener('resize', function() {
        //headerHeight = header.clientHeight;
        headerHeight = 390;
      }, false);

      scroller[0].addEventListener('scroll', requestTick);
      
      function requestTick() {
        if (!ticking) {         
          ionic.requestAnimationFrame(updateElasticHeader);
        }
        ticking = true;
      }
      
      function updateElasticHeader() {
        
        scrollTop = scrollerHandle.getScrollPosition().top;

        if (scrollTop >= 0) 
        {
          // Scrolling up. 
  
          translateAmt2 = -scrollTop /2 ;                              
          scaleAmt2 = scrollTop / (headerHeight) + 1;   
        } 
        else 
        {
          // Scrolling down. Header should expand:
          //translateAmt = 0;   
          translateAmt = -scrollTop /2 ;                                     
          scaleAmt = scrollTop / (headerHeight) + 1;
        }

        //console.log("scrollTop: "+ scrollTop+", translateAmt: "+ translateAmt+", scaleAmt: " + scaleAmt);

        // Update header with new position/size:
        header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,'+(translateAmt)+'px,0) scale('+scaleAmt+','+scaleAmt+')';

        default_image.style[ionic.CSS.TRANSFORM] = 'translate3d(0,'+(translateAmt2)+'px,0) scale('+1+','+1+')';
                        
        ticking = false;
      }
    }
  }
})


.run(function($ionicPlatform, config, $cordovaNetwork, $rootScope) {

  $ionicPlatform.ready(function() 
  {    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) 
    {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      if($cordovaNetwork.isOnline())
      {
        config.isOnline = true;        
      }
      else
      {
        config.isOnline = false;
      }       
    }
    else
    {
      if(navigator && navigator.onLine)
      {
        config.isOnline = true;  
      }
      else
      {
        config.isOnline = false;
      }    
    }

    if(config.isOnline)
      {
        $rootScope.connectionStatus = "connected";      
      }
      else
      {
        $rootScope.connectionStatus = "not-connected";
      }

      startWatching($rootScope.showConnectionStatus);
      $rootScope.showConnectionStatus($rootScope.connectionStatus);

      function startWatching(callback)
      {
        //console.log("in start watching: " + $rootScope.connectionStatus);

          if($rootScope.isMobile())
          {
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState)
            {            
             // console.log("went online");
              $rootScope.connectionStatus = "connected";
              callback($rootScope.connectionStatus);
            });

            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState)
            {
             // console.log("went offline");
              $rootScope.connectionStatus = "not-connected";
              callback($rootScope.connectionStatus);
            });
          }
          else 
          {
            window.addEventListener("online", function(e) 
            {
            //  console.log("went online");
              $rootScope.connectionStatus = "connected";
              callback($rootScope.connectionStatus);
            }, false);    

            window.addEventListener("offline", function(e) 
            {
            //  console.log("went offline");
              $rootScope.connectionStatus = "not-connected";
              callback($rootScope.connectionStatus);;
            }, false);  
          }
      } 


    if(window.StatusBar) 
    {
      StatusBar.styleDefault();
    }

  });

if(!ionic.Platform.isAndroid())
{
  window.fbAsyncInit = function() {
    FB.init({
      appId      : config.FBappIdProd,
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

}



})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $translateProvider) {

var userObject = JSON.parse(window.localStorage.GoByData || '{}');

var translationsEN = {
            home: "Home",
            edit_categories: "Edit Categories",
            add_a_place: "Add a place"            
        };
 
var translationsSP= {
            home: "Pagina Principal",
            edit_categories: "Editar Categorias",
            add_a_place: "Añadir un lugar"            
        };

  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('sp', translationsSP);

  $translateProvider.preferredLanguage(userObject.language);
  $translateProvider.fallbackLanguage("en");

  $ionicConfigProvider.views.maxCache(0);

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

  $stateProvider.state('welcome', 
  {
    url: '/welcome',
    templateUrl: "views/welcome.html",
    controller: 'WelcomeCtrl'
  })
  .state('app', 
  {
    url: "/app",
    abstract: true,
    templateUrl: "views/sidemenu.html",
    controller: 'AppCtrl'
  })
  .state('app.home', 
  {
    url: "/home",
    views: 
    {
      'menuContent': 
      {
        templateUrl: "views/home.html",
        controller: 'HomeCtrl'
      },
      cache: false
    }
  })
  .state('app.friends', 
  {
    url: "/friends",
    views: 
    {
      'menuContent': 
      {
        templateUrl: "views/friends.html",
        controller: 'FriendsCtrl'
      },
      cache: false
    }
  })
  .state('app.categories', 
  {
    url: "/categories",
    views: 
    {
      'menuContent': 
      {
        templateUrl: "views/categories.html",
        controller: 'CategoriesCtrl'
      },
      cache: false
    }
  })
    .state('app.friend', {
    url: '/friends/:friendId',
    views: {
      'menuContent': {
        templateUrl: 'views/friend.html',
        controller: 'FriendCtrl'
      },
      cache: false
    }
  })
  .state('app.item_new', 
  {
    url: "/item",
    views: 
    {
      'menuContent': 
      {
        templateUrl: "views/item.html",
        controller: 'ItemCtrl'
      },
      cache: false
    }
  })
  .state('app.item', {
    url: '/item/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl'
      },
      cache: false
    }
  })
.state('app.friendsitem', {
    url: '/friendsitem/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'views/friendsitem.html',
        controller: 'FriendsItemCtrl'
      },
      cache: false
    }
  })



  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
})
