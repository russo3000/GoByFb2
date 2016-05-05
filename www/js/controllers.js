angular.module('controllers', [])

.controller('WelcomeCtrl', function($rootScope, $scope, $state, $q, $window, $timeout, $ionicActionSheet, $cordovaToast, $ionicLoading, config, UserService, DbService, ConnectivityMonitor, $translate) 
{
  var max = 41;
  var min = 0;
  $scope.random = Math.floor(Math.random()*(max-min+1)+min);
  $rootScope.notifications = 0;
  $rootScope.newItemFromHome = null;
  $rootScope.show_friends = false;


  $rootScope.isMobile = function()
  {          
    var isWebView = ionic.Platform.isWebView();
    /*
    var deviceInformation = ionic.Platform.device();      
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var isWindowsPhone = ionic.Platform.isWindowsPhone();
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
    alert("isWebView");
    alert(isWebView);
    alert("isIPad");
    alert(isIPad);
    alert("isIOS");
    alert(isIOS);
    alert("isAndroid");
    alert(isAndroid);
    alert("isWindowsPhone");
    alert(isWindowsPhone);
    alert("currentPlatform");
    alert(currentPlatform);
    alert("currentPlatformVersion");
    alert(currentPlatformVersion);
    */

    return isWebView;
  }

  $rootScope.showToast = function(msg)
  {
    if($rootScope.isMobile())
    {
      $cordovaToast
            .show(msg, 'short', 'center')
            .then(function(success) {
              // success
            }, function (error) {
              // error
            });
    }
    else
    {      
      $ionicLoading.show({template: msg});
      setTimeout(function() { $ionicLoading.hide();}, 2000); 
    };    
  }
  

$rootScope.searchFromFlicker3 = function(searchValuePrimary, place, images_from_flicker, callBack)
{    
    //console.log("Calling API 3");
  
    //#3
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    {
      tags: searchValuePrimary,
      tagmode: "any",
      format: "json"
    },
    function(data) 
    {
    //  console.log("Called API 3");
      //console.log(data.items);

      if(data.items.length > 0)
      {
        $.each(data.items, function(i,item)
        {        
          var my_image = {
                    "image_name" : item.media.m,
                    "image_type" : "flicker"
                    };

          images_from_flicker.push(my_image);        

          //console.log(images_from_flicker);
          if ( i == 3 ) return callBack(place, images_from_flicker);
        });
      }
      else
      {
        return callBack(place, images_from_flicker);
      }
    })
    .fail(function(data)
    {
        console.log(JSON.stringify(data,2))
    });         
  }

  $rootScope.searchFromFlicker2 = function(searchValuePrimary, place, images_from_flicker, callBack)
  {
    //console.log("Calling API 2");
    //#2
    var apiKey = 'efnrvqje9xfz6wk697kewje2';

      $.ajax(
      {
          type:'GET',
         url:"https://api.gettyimages.com/v3/search/images/creative?phrase="+searchValuePrimary,
          //url:"http://api.pixplorer.co.uk/image?word="+searchValuePrimary+'?amount=5&size=m',
          beforeSend: function (request)
          {
            request.setRequestHeader("Api-Key", apiKey);
          }
      })
      .done(function(data)
      {
    //    console.log("Called API 2");
        //console.log(data.images);

        if(data.images.length > 0 )
        {
          for(var i = 0;i<data.images.length;i++)
          {
            var my_image = {
                        "image_name" : data.images[i].display_sizes[0].uri,
                        "image_type" : "getty"
                        };

            images_from_flicker.push(my_image); 

            if ( i == 3 ) return callBack(place, images_from_flicker);
          }

          return callBack(place, images_from_flicker);
        }
        else
        {
          $rootScope.searchFromFlicker3(searchValuePrimary, place, images_from_flicker, callBack);                  
        }

      })
      .fail(function(data)
      {
          console.log(JSON.stringify(data,2))
          $rootScope.searchFromFlicker3(searchValuePrimary, place, images_from_flicker, callBack);                  
      });
  }

  $rootScope.searchFromFlicker = function(searchValuePrimary, place, callBack)
  { 
    var images_from_flicker = [];               
    
    if(ConnectivityMonitor.checkConnection())
    {
    //  console.log("launching primary search:" +searchValuePrimary);

      if(searchValuePrimary != "")
      {
        //going to call several image APIs to get images
        //#1: http://api.pixplorer.co.uk/image (Free image API a guy developed, seems cool)
        //#2: https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase=notre damme
        //#3: http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?

        //#1
        
        // Options are l (large), m (medium), s (small) or tb (thumbnail).
         $.getJSON("http://api.pixplorer.co.uk/image",
        {
          word: searchValuePrimary,
          amount: 10,
          size: 's'
        },
        function(data) 
        {
       //   console.log("Called API 1");
          
          if(data.images.length > 0 )
          {
            $.each(data.images, function(i,item)
            {        
              var my_image = {
                        "image_name" : item.imageurl,
                        "image_type" : "pixplorer"
                        };

              images_from_flicker.push(my_image);        

              //console.log(images_from_flicker);
              if ( i == 3 ) return callBack(place, images_from_flicker);
            });
          }
          else
          {
            $rootScope.searchFromFlicker2(searchValuePrimary, place, images_from_flicker, callBack);            
          }
              
        })
        .fail(function(data)
        {
          //console.log(JSON.stringify(data,2))
          $rootScope.searchFromFlicker2(searchValuePrimary, place, images_from_flicker, callBack);
        }); 
      }
      else
      {
        return callBack(place, images_from_flicker);
      }
    }
    else
    {
      return callBack(place, images_from_flicker);
    }
  }


  $rootScope.showConnectionStatus = function(connectionStatus)
 {  

    $(".connection-status").show();

    switch (connectionStatus)
    {
      case 'not-connected':
        $("#not-connected").show();
        $("#connected").hide();
        $("#connecting").hide();
      break;
      case 'connected':        
        $("#connected").show();
        $("#not-connected").hide();      
        $("#connecting").hide();

        setTimeout(function() 
        { 
          $(".connection-status").hide();
        }, 2000);  
      break;
      case 'connecting':
        $("#connecting").show();
        $("#not-connected").hide();
        $("#connected").hide();      
      break;
      default:
        $("#not-connected").show();
        $("#connected").hide();
        $("#connecting").hide();
      break;
    }
 }  

 $scope.show = function(userFromServer) {

//console.log($rootScope.user);

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Use data from Phone  <div class="action-sheet-icons"><div class="ion-ios-cloud-upload-outline action-sheet-icon"></div> <div class="ion-ios-arrow-thin-right action-sheet-icon"></div> <div class="ion-iphone action-sheet-icon" ></div></div>' }

     ],
     titleText: '<center>Synchronization</center>Data on your phone is not the same as data on the server.',    
    destructiveText: 'Use data from Server  <div class="action-sheet-icons"><div class="ion-iphone action-sheet-icon"></div> <div class="ion-ios-arrow-thin-right action-sheet-icon"></div> <div class="ion-ios-cloud-download-outline action-sheet-icon" ></div></div>',
     
    destructiveButtonClicked: function()
    {
      //console.log("Use Server data");
      //console.log(userFromServer);

      var tmp_friends = $rootScope.user.friends;

      $rootScope.user = userFromServer;
      $rootScope.user.friends = tmp_friends;

      UserService.setUser($rootScope.user);
      

      //for scrolling
      if(typeof $rootScope.user.categories != "undefined")
      {
        $timeout(function()
        {
          var myScroll = new iScroll('wrapperV',{checkDOMChanges: true});
          var myScrolls = [];

          for(var i = 0; i< $rootScope.user.categories.length; i++)
          {
            myScrolls.push(
                new iScroll('wrapper' + i, 
                  { 
                    momentum: true,
                    fadeScrollbar: true,
                    hideScrollbar: true, 
                    hScrollbar: true,
                    snap: 'li',
                    checkDOMChanges: true
                  }
                  ));
          }
          document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        });
      }

      return true;
    },  
     buttonClicked: function(index) 
     {
        //console.log("Use Phone data");

        $rootScope.showToast('Updating Database');
        DbService.Store($rootScope.user, null);
      
        $scope.$apply();
       return true;
     }
   });

 };

$rootScope.isFriendsCategoryPublic = function(friends_category)
{
  //console.log(friends_category);
         
  var private_items_count = 0;
  friends_category.is_public = true;
  for(var j=0; j< friends_category.items.length; j++)
  {
    if(friends_category.items[j].is_public == false)
    {
    //  console.log(friends_category.items[j].is_public);
      private_items_count++;
    }
  }

//console.log(friends_category.items.length+" == "+ private_items_count);

  if(friends_category.items.length == private_items_count)
  {
    friends_category.is_public = false;      
  }
  
  //console.log(friends_category.is_public);
  return friends_category.is_public;
}

$rootScope.GotFriend = function(connected, friend)
{
  //console.log("rootScope.GotFriend");

  if(connected)
  {
    friend.category_names = "";
    for(var i=0; i< friend.categories.length; i++)
    {            
      if($rootScope.isFriendsCategoryPublic(friend.categories[i]))
      {        
        friend.category_names +=friend.categories[i].name+', ';
      }
     
    }
    friend.category_names = friend.category_names.replace(/,\s*$/, "");

    var found = false;
    for(var i=0; i< $rootScope.user.friends.length; i++)
    {
      if($rootScope.user.friends[i].user_id == friend.user_id)
      {
        found = true;
        if($rootScope.user.friends[i].time_stamp != friend.time_stamp) 
        {
          friend.notified = true;            
          $rootScope.notifications++;
          $rootScope.user.friends[i] = friend;          
        }
        else
        {
          $rootScope.user.friends[i].notified = false;
          //console.log("No need to notify about: " +$rootScope.user.friends[i].name);
        }
      }
    }

    //console.log(friend);

    if(!found)
    {      
      friend.notified = true;            
      $rootScope.notifications++;
      $rootScope.user.friends.push(friend); 
    }

    UserService.setUser($rootScope.user); 

    $scope.$apply();    
    $ionicLoading.hide();
  }
  else
  {
    alert("Not connected, couldn't load friends");
  }
}

  $rootScope.gotData = function(ok,  userFromServer)
  {
    $rootScope.notifications = 0;
    $rootScope.user = UserService.getUser();

    //apply translation
    console.log("in welcome");
    console.log($rootScope.user.language);
    $translate.use($rootScope.user.language);

    

    if(ok)
    {
      $rootScope.connectionStatus = "connected";
      $("#connecting").hide();

      //console.log($rootScope.user.time_stamp + " == " + userFromServer.time_stamp);

      if($rootScope.user.time_stamp != userFromServer.time_stamp )
      {
        $scope.show(userFromServer);
      }

      var friends_who_also_use_the_app_ids = userFromServer.friends_who_also_use_the_app_ids.split(',');
        
      for(var i=0; i< friends_who_also_use_the_app_ids.length; i++)
      {
        //console.log("Loading friend with Id: "+ friends_who_also_use_the_app_ids[i]);
        DbService.getFriend(friends_who_also_use_the_app_ids[i], $rootScope.GotFriend);
      }

    }
    else
    {
      $("#connecting").hide();
      if($rootScope.user.time_stamp != userFromServer.time_stamp )
      {
        $scope.show(userFromServer);
      } 
    }
  }

  //This is the success callback from the login method
  var fbLoginSuccess = function(response) 
  {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse).then(function(profileInfo) 
    {
      DbService.GetData(profileInfo, authResponse.accessToken, $rootScope.gotData);       
    }, 
    function(fail)
    {
      //fail get profile info
      console.log('profile info fail', fail);
    });
  };


  //This is the fail callback from the login method
  var fbLoginError = function(error)
  {
    alert('fbLoginError', error);
    $ionicLoading.hide();
  };

  //this method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) 
  {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name,friends&access_token=' + authResponse.accessToken, null,
      function (response) 
      {      
        info.resolve(response);
      },
      function (response) 
      {
        alert("ERROR: " + response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  $scope.clearLocalStorage = function()
  {
    window.localStorage.clear(); 
    console.log("cleared localstorage");
  }



  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() 
  {
    if(ConnectivityMonitor.checkConnection())
    {
      //console.log("Starting FB Login");
      $rootScope.showToast('Logging in...');

      //$rootScope.connectionStatus = "not-connected";
      $rootScope.showConnectionStatus($rootScope.connectionStatus);      

      if($rootScope.isMobile())
      {
        //console.log("Mobile");      
        facebookConnectPlugin.getLoginStatus(function(success)
        {
          $rootScope.connectionStatus = "connecting";
          $rootScope.showConnectionStatus($rootScope.connectionStatus);      
          //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile','user_friends'], fbLoginSuccess, fbLoginError); 
        });

        $ionicLoading.hide();
        $state.go('app.home');

        if(typeof $rootScope.showConnectionStatus != "undefined")
        {
         $rootScope.showConnectionStatus($rootScope.connectionStatus);
        }
      } 
      else 
      {        
       // console.log("Web Browser");
       // console.log($rootScope.connectionStatus);

        if(typeof FB != "undefined" && $rootScope.connectionStatus != "not-connected")
        {          
          FB.login(function(response)
          {            
            var authResponse = response.authResponse;

            if(typeof authResponse != "undefined")
            {
              FB.api('/me', {fields: 'email,name,friends'}, function(profileInfo) 
              {
                $rootScope.connectionStatus = "connecting";      
                $rootScope.showConnectionStatus($rootScope.connectionStatus);

                DbService.GetData(profileInfo, authResponse.accessToken, $rootScope.gotData);            
              });                
            }
          }, {scope: 'email,public_profile,user_friends', return_scopes: true});
        }
        
        $ionicLoading.hide();
        $state.go('app.home'); 

        if(typeof $rootScope.showConnectionStatus != "undefined")
        {
         $rootScope.showConnectionStatus($rootScope.connectionStatus);
        }      
     }
    }
    else
    {
      $rootScope.showToast('Not Connected to Server available, Loading Local Data');

      setTimeout(function()
      { 
        $rootScope.connectionStatus = "not-connected";
        $state.go('app.home');

        if(typeof $rootScope.showConnectionStatus != "undefined")
        {
         $rootScope.showConnectionStatus($rootScope.connectionStatus);
        }

      }, 2000);          
    }
  
  };


  if(config.isOnline)
  {
    $rootScope.connectionStatus = "connected";      
  }
  else
  {
    $rootScope.connectionStatus = "not-connected";
  }

  ConnectivityMonitor.startWatching($rootScope.showConnectionStatus);
  $rootScope.showConnectionStatus($rootScope.connectionStatus);  

})

//Side Menu functionality goes here
.controller('AppCtrl', function($rootScope, $scope, UserService, $state, $ionicLoading, $ionicHistory, $translate, DbService){  


  $rootScope.user = UserService.getUser();



  $scope.goHome = function()
  {
    $ionicHistory.nextViewOptions(
    {
      disableBack: true
    });
    $state.go('app.home'); 
  }

  $rootScope.isMobile = function()
  {          
    var isWebView = ionic.Platform.isWebView();
    return isWebView;
  }

  $scope.languageChanged = function()
  {    
    $rootScope.user.language = $scope.user.language;

    console.log($rootScope.user.language);
    
    $translate.use($rootScope.user.language);
    
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);
  }

  $scope.logOut = function() 
  {

    $rootScope.showToast('Logging out...');

    if(typeof AWS != "undefined")
    {
      if(AWS.config.credentials)
        AWS.config.credentials.clearCachedId();
    }

    if($rootScope.isMobile())
    {
        //facebook logout
        facebookConnectPlugin.logout(function()
        {
          $ionicLoading.hide();
          $state.go('welcome');

        },
        function(fail)
        {
          $ionicLoading.hide();
          $state.go('welcome');
        });
    }
    else
    {
      if(typeof FB != "undefined")
      {
        FB.logout(function(response){});
        $ionicLoading.hide();
        $state.go('welcome');
      }
      else
      {
        $ionicLoading.hide();
        $state.go('welcome');
      }
    }
  };

})


.controller('HomeCtrl', function($ionicPlatform, $rootScope, $scope, UserService, DbService, $state, $filter, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicListDelegate, $cordovaToast, $timeout, $ionicModal){

  //console.log("in Home");

	$rootScope.user = UserService.getUser();

  if(typeof $rootScope.user.categories == "undefined" || $rootScope.user.categories == "")
  {
   $rootScope.user.categories = []; 
  }

  for(var i=0; i< $rootScope.user.categories.length; i++)
  {
      $rootScope.user.categories[i].checked = false;
  }

  $rootScope.toogleSidemenu = function()
  {
     $("#btn_settings").toggleClass( "active" );      
  }

   $scope.showHomeTab = function(tabId)
  {
    console.log(tabId);
    if(!$("#"+tabId).is(':visible'))
    {
      $("#home_main").hide();
      $("#friends").hide();
            
      $("#btn_home_main").addClass("active");
      $("#btn_friends").addClass("active");
            
      $("#btn_"+tabId).removeClass("active");

      $("#"+tabId).show(); 
    }   
  } 

  //custom filter for empty categories because we are using a nested ng-repeat
  $scope.categoryHasVisibleItems = function(category) 
  {
    if(category.items.length > 0 )
    {
      return $filter('filter')(category.items, $scope.query).length > 0;
    }
    else
    {
      //nothing to filter
      return true;
    }
  };

  $scope.refreshComplete = function(ok,  userFromServer)
  {
    $rootScope.gotData(ok,  userFromServer);
    $scope.$broadcast('scroll.refreshComplete');
    $rootScope.showConnectionStatus($rootScope.connectionStatus);
  }

  $scope.doRefresh = function() 
  {
  $("#connecting").show();
   DbService.ReloadData($scope.refreshComplete);
  };

  $scope.notConnected = function()
  {
  $rootScope.showToast('Not connected to Server');
  }

  $scope.connected = function()
  {
  $rootScope.showToast('You are connected');
  }

  $scope.connecting = function()
  {
  $rootScope.showToast('Connection in process');
  }

  $scope.goToItem = function(itemId)
  {
    console.log(itemId);
    window.location = "#/app/item/"+itemId;
    
  }

  $scope.addNewCategory = function()
  {
    //$scope.openModal();
     $ionicPopup.prompt(
     {
       title: 'New category',
       template: ' ',
       inputType: 'text',
       inputPlaceholder: 'Category name'
     }).then(function(res) 
     {

      if(typeof res != "undefined")
      {
        var newCategoryId = 0;

        if($rootScope.user.categories.length > 0)          
        {
         newCategoryId = ($rootScope.user.categories[$rootScope.user.categories.length -1].id + 1) ;
        }

      //console.log("newCategoryId: " + newCategoryId);
       var newCategoryName = res;
       if(newCategoryName != "")
       {
        $scope.createNewCategory(newCategoryId, newCategoryName);
       }
      }
     });
  }

  $scope.createNewCategory = function(newCategoryId, newCategoryName)
  {
    var newCategory = {
      "id": newCategoryId,
      "name": newCategoryName,
      "checked": false,
      "items": []
    }

    //add the Item to the scope
    $rootScope.user.categories.push(newCategory);
    //console.log($rootScope.user);

    //Store the the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);
    
    $ionicScrollDelegate.scrollBottom();

    $timeout(function()
    {
      var myScroll = new iScroll('wrapperV',{checkDOMChanges: true});
      var myScrolls = [];
      
      for(var i = 0; i< $rootScope.user.categories.length; i++)
      {
        myScrolls.push(
            new iScroll('wrapper' + i, 
              { 
                momentum: true,
                fadeScrollbar: true,
                hideScrollbar: true, 
                hScrollbar: true,
                snap: 'li',
                checkDOMChanges: true
              }
              ));
      }
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });
  }

  $scope.editCategory = function(categoryId)
  {
    //console.log(categoryId);
    $scope.openModal();
    $scope.currentCategory = null;
    $scope.shouldShowReorder = true;
  
    if(typeof categoryId != "undefined")
    {
      //need to select an Item given its Id
      for(var i=0; i< $rootScope.user.categories.length; i++)
      {
        if($rootScope.user.categories[i].id == categoryId)
        {
          $scope.currentCategory = $rootScope.user.categories[i];
        }
      }
    }
  }

  $scope.deleteCategory = function(myCategory)
  {
    console.log(myCategory);
    $ionicPopup.confirm(
    {
      title: "Delete Category",
      content: "<strong>All Items in this Category will be lost!</strong> </br> Are you sure you would like to delete: " + myCategory.name +"?"
    }).then(function(res) 
    {
      if(res)
      {        
        for(var i=0; i< $rootScope.user.categories.length; i++)
        {
          if($rootScope.user.categories[i].id == myCategory.id)
          {
            $rootScope.user.categories.splice(i, 1);
          }
        }                                

        //Store the the data in the local storage and AWS

        $rootScope.showToast("Saving");

        DbService.Store($rootScope.user, null);
        
        $ionicListDelegate.closeOptionButtons();
        $scope.closeModal();
      }
      else
      {

      }

      
    });
  }


  $scope.reorderItems = function(item, fromIndex, toIndex) 
  {
    //Move the item in the array
    //console.log("fromIndex: " + fromIndex);
    //console.log("toIndex: " + toIndex);

    //need to reverse the array because we are presenting it backwards
    $scope.currentCategory.items.reverse();
    
    $scope.currentCategory.items.splice(fromIndex, 1);
    $scope.currentCategory.items.splice(toIndex, 0, item);

    //set it back as it was
    $scope.currentCategory.items.reverse();

    $rootScope.showToast("Saving");
    DbService.Store($rootScope.user, null);
  }

  $ionicModal.fromTemplateUrl('views/category.html', 
  {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) 
  {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    
    //Store the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);

    $scope.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {      
    //console.log('Modal is shown!');
    $("#editCategoryName").hide();
      setTimeout(function() { $("#editCategoryName").show();}, 500);    
  });

  $scope.addNewItem = function(myId)
  {    
    var myCategoryId = $("#"+myId).attr("current-category-id");

    //clear the array
    $rootScope.checkedCheckboxes = [];

    if(typeof myCategoryId != "undefined")
      $rootScope.checkedCheckboxes.push(myCategoryId);

//console.log($rootScope.checkedCheckboxes);
    $state.go('app.item_new');
  }


//define google functionality
  if(typeof google != "undefined")
  {
     var input = document.getElementById('itemDataNameHome');

     //var autocomplete = new google.maps.places.Autocomplete(input,{types: ['establishment']});
     var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
      var place = autocomplete.getPlace();
      google.place = place;

      var max = 41;
      var min = 0;
      $scope.random = Math.floor(Math.random()*(max-min+1)+min);  

      $scope.newItem = true;
      $scope.categories_for_flicker = "";
      $scope.newItemId = 0;


      for(var i=0; i< $rootScope.user.categories.length; i++)
      {
        for(var j=0; j< $rootScope.user.categories[i].items.length; j++)
        {
          if($rootScope.user.categories[i].items[j].id > $scope.newItemId)
          {
            $scope.newItemId = $rootScope.user.categories[i].items[j].id;
          }
        }        
      }
      $scope.newItemId = $scope.newItemId +1;

     // console.log("$scope.newItemId: "+ $scope.newItemId);
      
         var default_image = {
                                      image_name: 'img/items/'+$scope.random+'.jpg',
                                      image_type:  'default',  
                                      image_index: 0
                                    }; 
        
      $scope.Item = {
      "id" : $scope.newItemId,
      "name" : "",
      "notes" : "",
      "formatted_address" : "",
      "formatted_phone_number" : "",
      "international_phone_number" : "",
      "website" : "",
      "opening_hours" : null,
      "types" : [],
      "maps_url" : "",
      "images" : [],
      "default_image": default_image,
      "is_public": true
      };
    
    
      $scope.Item.name = document.getElementById('itemDataNameHome').value;
      //console.log($scope.Item.name);

      if(typeof place != "undefined")
      {
        //get images from flicker as an alternative source by using the item's name, and categories as secondary search
        $rootScope.searchFromFlicker($scope.Item.name + "," + "", place, $scope.processPlace);  
      }
      
    }); 
  }


  $scope.processPlace = function(place, images_from_flicker)
  {
   // console.log(images_from_flicker);

    //empty the array
    $scope.Item.images = [];

    if(typeof place != "undefined" && place != null)
    {
      if(typeof place.name != "undefined") { $scope.Item.name = place.name; }
      else { $scope.Item.name = null; }

      if(typeof place.formatted_address != "undefined") { $scope.Item.formatted_address = place.formatted_address; }
      else { $scope.Item.formatted_address = null; }

      if(typeof place.formatted_phone_number != "undefined") { $scope.Item.formatted_phone_number = place.formatted_phone_number; }
      else { $scope.Item.formatted_phone_number = null; }
    
      if(typeof place.international_phone_number != "undefined") { $scope.Item.international_phone_number = place.international_phone_number; }
      else { $scope.Item.international_phone_number = null; }

      if(typeof place.website != "undefined") { $scope.Item.website = place.website; }
      else { $scope.Item.website = null; }

      if(typeof place.opening_hours != "undefined") { $scope.Item.opening_hours = place.opening_hours; }
      else { $scope.Item.opening_hours = null; }

      if(typeof place.types != "undefined") { $scope.Item.types = place.types; }
      else { $scope.Item.types = null; }

      if(typeof place.url != "undefined") { $scope.Item.maps_url = place.url; }
      else { $scope.Item.maps_url = null; }

      if(typeof place.photos != "undefined")
      {
        var images_from_google = [];
        for(var i=0; i< place.photos.length; i++)
        {
           var my_image = {
                    "image_name" : place.photos[i].getUrl({'maxHeight': 800}),
                    "image_type" : "google"
                    };

          images_from_google.push(my_image);

          if ( i == 3 ) break;
        }
        $scope.Item.images = $scope.Item.images.concat(images_from_google);
      }
    }

    if($scope.Item.images.length == 0)
    {
      $scope.Item.images = $scope.Item.images.concat(images_from_flicker);
    }

  if($scope.Item.images.length > 0)
  {
    //assign the first image by default
    $scope.Item.default_image = {
                                  image_name: $scope.Item.images[0].image_name,
                                  image_type:  $scope.Item.images[0].image_type,  
                                  image_index: 0
                                };     
   }
    
    $timeout(function() {
      //console.log("Google Search finished");
      //console.log("New Item:");
      //console.log($scope.Item);
      $rootScope.newItemFromHome = $scope.Item;
      $scope.addNewItem();
      $scope.$apply();
    });    
  }

  $scope.removeNotifications = function(friendId)
  {
    console.log("removeNotifications");
    
    for(var i=0; i< $rootScope.user.friends.length; i++)
    {
      if($rootScope.user.friends[i].user_id == friendId)
      {
        if($rootScope.user.friends[i].notified)
        {
          $rootScope.notifications--;
          $rootScope.user.friends[i].notified = false;  

          UserService.setUser($rootScope.user);         
        }
       
       break;
      }
    }
    //console.log($rootScope.user.friends);   
  }

  //for scrolling
  if(typeof $rootScope.user.categories != "undefined")
  {
    $timeout(function()
    {
      var myScroll = new iScroll('wrapperV',{checkDOMChanges: true});
      var myScrolls = [];

      for(var i = 0; i< $rootScope.user.categories.length; i++)
      {
        myScrolls.push(
            new iScroll('wrapper' + i, 
              { 
                momentum: true,
                fadeScrollbar: true,
                hideScrollbar: true, 
                hScrollbar: true,
                snap: 'li',
                checkDOMChanges: true
              }
              ));
      }
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

      if($rootScope.show_friends)
      {
        console.log($rootScope.show_friends);
        $rootScope.show_friends = false;
        $scope.showHomeTab('friends');        
      }

    });
  }
    // end for scrolling    
    //setTimeout(function() { $rootScope.showConnectionStatus($rootScope.connectionStatus);}, 300);    
})

.controller('ItemCtrl', function($rootScope, $scope, $timeout, UserService, DbService, $state, $stateParams, $ionicLoading, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup, $ionicListDelegate, $ionicScrollDelegate, $cordovaCamera, $cordovaFile, ConnectivityMonitor, $cordovaSocialSharing)
{
  $scope.newItem = false;

  $scope.connectionStatus = $rootScope.connectionStatus;

  if(typeof $rootScope.checkedCheckboxes == "undefined")
  {
    $rootScope.checkedCheckboxes = [];
  }

  if(typeof $rootScope.user == "undefined")
  {
    $rootScope.user = UserService.getUser();
  }

  if($rootScope.checkedCheckboxes.length == 0)
  {
    for(var i=0; i< $rootScope.user.categories.length; i++)
    {
      $rootScope.user.categories[i].checked = false;
    }          
  }
  else
  {
    
    for( var i=0; i< $rootScope.checkedCheckboxes.length; i++)
    {
      for(var j=0; j< $rootScope.user.categories.length; j++)
      {
        if($rootScope.checkedCheckboxes[i] == $rootScope.user.categories[j].id)
        {
          $rootScope.user.categories[j].checked = true;
        }
      }
    }

  }

  $scope.user = $rootScope.user;

  //categories_for_flicker
  $scope.categories_for_flicker = "";
  for(var i=0; i< $rootScope.user.categories.length; i++)
  {
    if($rootScope.user.categories[i].checked)
    {
      $scope.categories_for_flicker += $rootScope.user.categories[i].name +',';
    }          
  }

  //Creating a new Item
  if(typeof $stateParams.itemId == "undefined" && $rootScope.newItemFromHome == null)
  {  
    var max = 41;
    var min = 0;
    $scope.random = Math.floor(Math.random()*(max-min+1)+min);  

    $scope.newItem = true;
    $scope.categories_for_flicker = "";
    $scope.newItemId = 0;


    for(var i=0; i< $rootScope.user.categories.length; i++)
    {
      for(var j=0; j< $rootScope.user.categories[i].items.length; j++)
      {
        if($rootScope.user.categories[i].items[j].id > $scope.newItemId)
        {
          $scope.newItemId = $rootScope.user.categories[i].items[j].id;
        }
      }        
    }
    $scope.newItemId = $scope.newItemId +1;

   // console.log("$scope.newItemId: "+ $scope.newItemId);
    
       var default_image = {
                              image_name: 'img/items/'+$scope.random+'.jpg',
                              image_type:  'default',  
                              image_index: 0
                            }; 
      
    $scope.Item = {
    "id" : $scope.newItemId,
    "name" : "",
    "notes" : "",
    "formatted_address" : "",
    "formatted_phone_number" : "",
    "international_phone_number" : "",
    "website" : "",
    "opening_hours" : null,
    "types" : [],
    "maps_url" : "",
    "images" : [],
    "default_image": default_image,
    "is_public": true
    };
    
    $scope.Item.name = $("#itemDataNameHome").val();
  }
  else //Editing existing Item
  {   

    if($rootScope.newItemFromHome == null) 
    {
      for(var i=0; i< $rootScope.user.categories.length; i++)
      {
        $rootScope.user.categories[i].checked = false;
        for(var j=0; j< $rootScope.user.categories[i].items.length; j++)
        {
          if($rootScope.user.categories[i].items[j].id == $stateParams.itemId)
          {
            $scope.Item = $rootScope.user.categories[i].items[j];
            $rootScope.user.categories[i].checked = true;
          }
        }
      }
    }
    else
    {
      $scope.newItem = true;
      $scope.Item = $rootScope.newItemFromHome;
      $rootScope.newItemFromHome =null;
    }

    $("#my-item").css('background-image', 'url(' + $scope.Item.default_image.image_name + ')');
  }


  //console.log($scope.Item);

  $("#itemDataName").attr("placeholder",$scope.Item.name);

  if($scope.Item.images.length == 0)
  {
    $("#wrapperImageSelection").hide();
    $("#example-elastic-header").height(270);
  }
  else
  {
    $("#wrapperImageSelection").show();
    $("#example-elastic-header").height(320);
  }

$scope.scrollTop = function()
{
  $ionicScrollDelegate.scrollTop(true);
}

$scope.makePrivate = function()
{  
  $scope.updateItemSelectedCategoryValues();

  if(!$scope.newItem)
  {
    $scope.saveItem(false);
  }
}


  //define google functionality
  if(typeof google != "undefined")
  {
     var input = document.getElementById('itemDataName');

     //var autocomplete = new google.maps.places.Autocomplete(input,{types: ['establishment']});
     var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
      var place = autocomplete.getPlace();
      google.place = place;

      $scope.Item.name = document.getElementById('itemDataName').value;
      //console.log($scope.Item.name);

      if(typeof place != "undefined")
      {
        //get images from flicker as an alternative source by using the item's name, and categories as secondary search
        $rootScope.searchFromFlicker($scope.Item.name + "," + $scope.categories_for_flicker, place, $scope.processPlace);  
      }
      
    }); 
  }


  $scope.processPlace = function(place, images_from_flicker)
  {
   // console.log(images_from_flicker);

    //empty the array
    $scope.Item.images = [];

    if(typeof place != "undefined" && place != null)
    {
      if(typeof place.name != "undefined") { $scope.Item.name = place.name; }
      else { $scope.Item.name = null; }

      if(typeof place.formatted_address != "undefined") { $scope.Item.formatted_address = place.formatted_address; }
      else { $scope.Item.formatted_address = null; }

      if(typeof place.formatted_phone_number != "undefined") { $scope.Item.formatted_phone_number = place.formatted_phone_number; }
      else { $scope.Item.formatted_phone_number = null; }
    
      if(typeof place.international_phone_number != "undefined") { $scope.Item.international_phone_number = place.international_phone_number; }
      else { $scope.Item.international_phone_number = null; }

      if(typeof place.website != "undefined") { $scope.Item.website = place.website; }
      else { $scope.Item.website = null; }

      if(typeof place.opening_hours != "undefined") { $scope.Item.opening_hours = place.opening_hours; }
      else { $scope.Item.opening_hours = null; }

      if(typeof place.types != "undefined") { $scope.Item.types = place.types; }
      else { $scope.Item.types = null; }

      if(typeof place.url != "undefined") { $scope.Item.maps_url = place.url; }
      else { $scope.Item.maps_url = null; }

      if(typeof place.photos != "undefined")
      {
        var images_from_google = [];
        for(var i=0; i< place.photos.length; i++)
        {
           var my_image = {
                    "image_name" : place.photos[i].getUrl({'maxHeight': 800}),
                    "image_type" : "google"
                    };

          images_from_google.push(my_image);

          if ( i == 3 ) break;
        }
        $scope.Item.images = $scope.Item.images.concat(images_from_google);
      }
    }

    if($scope.Item.images.length == 0)
    {
      $scope.Item.images = $scope.Item.images.concat(images_from_flicker);
    }

  if($scope.Item.images.length > 0)
  {
    //assign the first image by default
    $scope.Item.default_image = {
                                  image_name: $scope.Item.images[0].image_name,
                                  image_type:  $scope.Item.images[0].image_type,  
                                  image_index: 0
                                };  
      
   }
    
    $timeout(function() {
    //  console.log("Google Search finished");
      $scope.firstSearch();
    $scope.$apply();
    });
    
  }
  

  $scope.firstSearch = function()
  {    
    $scope.Item.name = document.getElementById('itemDataName').value;                               

    if($scope.Item.images.length == 0)
    {
      $("#wrapperImageSelection").hide();
      $("#example-elastic-header").height(270);
    }
    else
    {
      $("#wrapperImageSelection").show();
      $("#example-elastic-header").height(320);
    } 
  }

  $scope.showItemTab = function(itemTabId)
  {
    if(!$("#"+itemTabId).is(':visible'))
    {
      $("#main").hide();
      $("#time").hide();
      $("#notes").hide();
      $("#phone").hide();

      $("#button_time").removeClass("selected");
      $("#button_notes").removeClass("selected");
      $("#button_phone").removeClass("selected");
      $("#button_main").removeClass("selected");

      $("#button_"+itemTabId).addClass("selected");

      $("#"+itemTabId).slideDown(); 
    }   
  }


$scope.editItems = function(ItemAttribute)
 {
  //console.log("Editing: " + ItemAttribute);

  var scope = $scope.$new();
  var title = "";
  var subTitle = "";

   switch(ItemAttribute)
  {
      case 'formatted_address':
        title = "Address";
        subTitle = "Please update the address";
        scope.data = {response: $scope.Item.formatted_address };
      break;
      case 'international_phone_number':
        title = "Phone number";
        subTitle = "Please update the phone number";
        scope.data = {response: $scope.Item.international_phone_number };  
      break;
      case 'website':
        title = "Website";
        subTitle = "Please update the website";
        scope.data = {response: $scope.Item.website };  
      break;
      case 'notes':
        title = "My Notes";
        subTitle = "Please update the notes";
        scope.data = {response: $scope.Item.notes };  
      break;
  }

    $ionicPopup.prompt({
     title: title,
     template: '<input type="text" ng-model="data.response">',
     scope: scope,
     subTitle: subTitle,
     buttons: [
       { text: 'Cancel',  onTap: function(e) { return false; } },
       {
         text: '<b>OK</b>',
         type: 'button-positive',
         onTap: function(e) {
           return scope.data.response
         }
       },
     ]
   }).then(function(res) 
   {
    // console.log(res);
     if(typeof res != "undefined" && res != "")
      {
        switch(ItemAttribute)
        {
            case 'formatted_address':
              $scope.Item.formatted_address = res;
            break;
            case 'international_phone_number':
              $scope.Item.international_phone_number = res;      
            break;
            case 'website':
              $scope.Item.website = res;      
            break;
            case 'notes':
              $scope.Item.notes = res;      
            break;
        }

        $scope.updateItemSelectedCategoryValues();

        $scope.saveItem(false);
      }
     $ionicListDelegate.closeOptionButtons();
   });
  };

  $scope.goToMap = function()
  {
    //somehow the null test was failing
    if($scope.Item.maps_url && $scope.Item.maps_url != null && $scope.Item.maps_url != "")
    {
      window.location = $scope.Item.maps_url;
    }
    else if($scope.Item.formatted_address != null && $scope.Item.formatted_address != "")
    {
     window.location = "https://www.google.com/maps/place/"+$scope.Item.formatted_address; 
    }    
  }

  $scope.imageSelection = function()
  {
    $ionicScrollDelegate.scrollTop();
    if(  $("#itemImageSelection").is(":visible") == true )
    {        
      $("#itemImageSelection").slideUp();
      //$("#editItemName").slideDown();
    }
    else
    {
      $("#itemImageSelection").slideDown();
      //$("#editItemName").slideUp();
    }
  }

  $scope.cancelImageSelection = function()
  {
    $("#itemImageSelection").slideUp();
    //$("#editItemName").slideDown();
  }  
  
  $scope.makeDefault = function(imgId, index)
  {
    var img = document.getElementById(imgId);

    $scope.Item.default_image.image_name = img.getAttribute('src');
    $scope.Item.default_image.image_type = img.getAttribute('img-type');
    $scope.Item.default_image.image_index = index;

    //console.log("Making default: index = " + index);
    DbService.Store($rootScope.user, $ionicLoading.hide);
  }

  $scope.onHold = function(imageId)
  {
    $scope.toggleImageDeletion(imageId);
  }

  $scope.cancelImageDeletion = function(imageId)
  {
      $scope.toggleImageDeletion(imageId);
  }

  $scope.deleteImage = function(imageIndex)
  {
    if($scope.Item.images.length > 1)
    {
      var img = document.getElementById("image_"+imageIndex);
      var image_name = img.getAttribute('src');

      for(var i=0; i< $scope.Item.images.length; i++)
      {
        if($scope.Item.images[i].image_name == image_name)
        {
          break;
        }
      }

      $scope.Item.images.splice(i, 1);

      $rootScope.showToast('Deleted Image');      
  
    }
    else
    {
     $scope.Item.images = [];
     
     var my_image = {
                      "image_name" : $scope.Item.default_image.image_name,
                      "image_type" : $scope.Item.default_image.image_type
                      }; 

      $scope.Item.images.push(my_image);

      $rootScope.showToast('This is the default image, it cannot be deleted');
    }

    $scope.toggleImageDeletion(imageIndex);

    $timeout(function() { $scope.$apply(); });
  }

  $scope.toggleImageDeletion = function(imageId)
  {
      $("#image_wrapper_"+imageId).toggleClass("to-delete");
      $("#itemDelete_"+imageId).toggle();
      $("#itemCancelDelete_"+imageId).toggle();
  }

///////
    $ionicModal.fromTemplateUrl('views/lightbox.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      
      //console.log('Modal is shown!');
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
  
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  
    $scope.goToSlide = function() {
      $scope.modal.show();

      setTimeout(function() { $ionicSlideBoxDelegate.slide($scope.Item.default_image.image_index);}, 100);    

    }
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  

///////
  $scope.takePhoto = function()
  {
   $scope.selectImage("photo");
  }
 
  $scope.showGallery = function() 
  {       
    $scope.selectImage("gallery");
  }

  $scope.selectImage = function(sourceType)
  {  
    var options = $scope.optionsForType(sourceType);

    $cordovaCamera.getPicture(options).then(function(imageUrl) 
    {
      var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);

      if(name.indexOf('?') != -1) 
      {
        name = name.substr(0, name.lastIndexOf('?'));
        newName = $scope.makeid() + name;
      }

      var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
      var newName = $scope.makeid() + name;

      $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName).then(function(info) 
      {
        var images_from_phone = [];

        var my_image = {
                    "image_name" : cordova.file.dataDirectory + newName,
                    "image_type" : sourceType
                    };

        images_from_phone.push(my_image); 

        $scope.Item.images = images_from_phone.concat($scope.Item.images);

        $timeout(function() { $scope.$apply(); });
  
        $("#itemImageSelection").slideUp();
        $("#editItemName").slideDown();       
  
      }, function(e) 
      {
          alert("Error: " + e);
      });
    });
  }

  $scope.makeid = function() 
  {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

    $scope.optionsForType =function(type) 
  {
      var destinationType = Camera.DestinationType.FILE_URI;
      var sourceType = Camera.PictureSourceType.CAMERA;
      var encodingType = Camera.EncodingType.JPEG;
      var popoverOptions = CameraPopoverOptions;
      var saveToPhotoAlbum = false;
      var targetWidth = 640;
      var targetHeight = 640;
      var correctOrientation = false;
      var quality = 100;

    switch (type) 
    {
      case "photo":
        sourceType =  Camera.PictureSourceType.CAMERA;        
        break;
      case "gallery":
        sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }

 return {
        destinationType: destinationType,
        sourceType: sourceType,
        encodingType: encodingType,
        popoverOptions: popoverOptions,
        saveToPhotoAlbum: saveToPhotoAlbum,
        targetWidth: targetWidth,
        targetHeight: targetHeight,
        correctOrientation: correctOrientation,
        quality: quality
        };
  }


  $scope.addNewCategory = function()
  {
    //$scope.openModal();
     $ionicPopup.prompt(
     {
       title: 'New category',
       template: ' ',
       inputType: 'text',
       inputPlaceholder: 'Category name'
     }).then(function(res) 
     {

      if(typeof res != "undefined")
      {
        var newCategoryId = 0;

        if($rootScope.user.categories.length > 0)
        {
         newCategoryId = ($rootScope.user.categories[$rootScope.user.categories.length -1].id + 1) ;
        }

        console.log("newCategoryId: " + newCategoryId);

       var newCategoryName = res;
       if(newCategoryName != "")
       {
        $scope.createNewCategory(newCategoryId, newCategoryName);
       }
      }
     });
  }

  $scope.createNewCategory = function(newCategoryId, newCategoryName)
  {
    var newCategory = {
      "id": newCategoryId,
      "name": newCategoryName,
      "checked": true,
      "items": []
    }    
    
    //add the Item to the rootScope
    $rootScope.user.categories.push(newCategory);

    //Store the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);

   $timeout(function(){ $scope.updateItemSelectedCategoryValues();});

  }

  $rootScope.showAlert = function(messageType, messageText) 
  {
    $ionicPopup.alert(
    {
      title: messageType,
      content: messageText
    }).then(function(res) {
      //console.log('Test Alert Box');
    });
  };


  

  $scope.deleteCategory = function(myCategory)
  {
    $ionicPopup.confirm(
    {
      title: "Delete Category",
      content: "<strong>All Items in this Category will be lost!</strong> </br> Are you sure you would like to delete: " + myCategory.name +"?"
    }).then(function(res) 
    {
      if(res)
      {        
        for(var i=0; i< $rootScope.user.categories.length; i++)
        {
          if($rootScope.user.categories[i].id == myCategory.id)
          {
            $rootScope.user.categories.splice(i, 1);
          }
        }                                

        //Store the the data in the local storage and AWS

        $rootScope.showToast("Saving");

        DbService.Store($rootScope.user, null);
      }

      $ionicListDelegate.closeOptionButtons();
    });
  }

    $scope.editCategory = function(myCategory)
    {

      $ionicPopup.prompt(
     {
       title: 'Edit Category',
       template: ' ',
       inputType: 'text',
       inputPlaceholder: myCategory.name
     }).then(function(res) 
     {
       if(typeof res != "undefined")
       {
         var newCategoryName = res;

         if(newCategoryName != "")
         {        
            //update the category name
            for(var i=0; i< $rootScope.user.categories.length; i++)
            {
              if($rootScope.user.categories[i].id == myCategory.id)
              {
                $rootScope.user.categories[i].name = newCategoryName;
              }
            }

          //Store the the data in the local storage and AWS
          $rootScope.showToast('Saving');
          DbService.Store($rootScope.user, null);
    
         }         
      }

      $ionicListDelegate.closeOptionButtons();
       
     });
    }


  $scope.updateItemSelectedCategoryValues = function(category)
  {
    $rootScope.checkedCheckboxes = [];
    var checkedCategories = [];

    $("input:checkbox[name=category]:checked").each(function()
    {
      $rootScope.checkedCheckboxes.push($(this).val());
      //get the category Id to associate
      checkedCategories.push($(this)[0].attributes.categoryid.value);
    });

    if($rootScope.checkedCheckboxes.length == 0)
    {
      $rootScope.showAlert("Warning","* Please select atleast one category");
      $("#categoryRequired").show();
    }
    else
    {
      $("#categoryRequired").hide();

       for(var i=0; i< $rootScope.user.categories.length; i++)
       {
          var index = $rootScope.arrayObjectIndexOf($rootScope.user.categories[i].items, $scope.Item);
          
        //if the item is in this categories items then check if we might have to remove it or keep it
        if(index >= 0)
        {
          //console.log("Item: " + $scope.Item.id + " already in : " + $rootScope.user.categories[i].id);

          //if Item's category is not present in Checked Categories, then remove it, 
          if(checkedCategories.indexOf($rootScope.user.categories[i].id.toString()) < 0)
          {
           //   console.log("removing item: "+$scope.Item.id + " from category : " + $rootScope.user.categories[i].id);
              $rootScope.user.categories[i].items.splice(index,1);
          }
          else
          {
            //keep it
          }
        }
        else //since it is not present, check if we may add it
        {
         // console.log("Item: " + $scope.Item.id + " Not in : " + $rootScope.user.categories[i].id);           
          
          //if Item's category is present in Checked Categories, then add it, 
          if(checkedCategories.indexOf($rootScope.user.categories[i].id.toString()) >= 0)
          {
            //console.log("adding item: "+$scope.Item.id + " to category : " + $rootScope.user.categories[i].id);
            $rootScope.user.categories[i].items.push($scope.Item); 
          }
        }
       }

       //console.log($rootScope.user);

      if(!$scope.newItem)
      {
        //Store the data in the local storage and AWS
      DbService.Store($rootScope.user, null);
      }
      
    } 
  }

   $rootScope.reorderCategory = function(category, fromIndex, toIndex) 
 {
    //Move the item in the array
    $rootScope.user.categories.splice(fromIndex, 1);
    $rootScope.user.categories.splice(toIndex, 0, category);

    //Store the the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);
    
    $ionicListDelegate.showReorder(false);
  };


 $scope.convertFileToDataURLviaFileReader = function(url, callback){

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader  = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

$scope.shareLocalImage = function(base64Image)
{

  var message = "";
  var subject = "GoBy Sharing";
  var file = null;
  var link = "";
  

    if(typeof $scope.Item.name != undefined && $scope.Item.name)
        message += $scope.Item.name +" ";

      if(typeof $scope.Item.formatted_address != undefined && $scope.Item.formatted_address)
        message += $scope.Item.formatted_address +" ";

      if(typeof $scope.Item.international_phone_number != undefined && $scope.Item.international_phone_number)
        message += $scope.Item.international_phone_number +" ";

      if(typeof $scope.Item.notes != undefined && $scope.Item.notes)
        message += $scope.Item.notes +" ";

      file = base64Image;

      if($scope.Item.maps_url != "")
      {
        link = $scope.Item.maps_url;
      }
      else if($scope.Item.website != "")
      {
       link = $scope.Item.website; 
      }

      message += " - Shared by GoBy!";
  
  $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
  .then(function(result) 
  {
    // Success!
    //$rootScope.toast('Item Shared');
      $rootScope.showToast('Item Shared');
  }, function(err) 
  {
    // An error occured. Show a message to the user
    //$rootScope.toast('ERROR: Item not Shared :'+ err);
    $rootScope.showToast('ERROR: Item not Shared :'+ err);
  }); 

  base64Image = null;
  file = null;
}

  $scope.shareItem = function()
  {

    if($scope.Item.default_image.image_type == "photo" || $scope.Item.default_image.image_type == "gallery")
    {
      $scope.convertFileToDataURLviaFileReader($scope.cItem.default_image.image_name, $scope.shareLocalImage);
    }
    else
    {
      var message = "";
      var subject = "GoBy Sharing";
      var file = null;
      var link = "";


    if(typeof $scope.Item.name != undefined && $scope.Item.name)
        message += $scope.Item.name +" ";

      if(typeof $scope.Item.formatted_address != undefined && $scope.Item.formatted_address)
        message += $scope.Item.formatted_address +" ";

      if(typeof $scope.Item.international_phone_number != undefined && $scope.Item.international_phone_number)
        message += $scope.Item.international_phone_number +" ";

      if(typeof $scope.Item.notes != undefined && $scope.Item.notes)
        message += $scope.Item.notes +" ";

      file = $scope.Item.default_image.image_name;

      if($scope.Item.maps_url != "")
      {
        link = $scope.Item.maps_url;
      }
      else if($scope.Item.website != "")
      {
       link = $scope.Item.website; 
      }

      message += " - Shared by GoBy!";

      $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
      .then(function(result) 
      {
        // Success!        
        $rootScope.showToast('Item Shared');        
      }, function(err) 
      {
        // An error occured. Show a message to the user
        $rootScope.showToast('ERROR: Item not Shared :'+ err);
      });

      file = null;
    }
  }

  $rootScope.arrayObjectIndexOf = function(myArray, searchTerm) 
  {
    for(var i = 0, len = myArray.length; i < len; i++) 
    {
      if (myArray[i].id === searchTerm.id) return i;
    }
    return -1;
  }

  $scope.deleteItem = function()
  {
    $ionicPopup.confirm(
    {
      title: "Delete Item",
      content: "Are you sure you would like to delete: " + $scope.Item.name +"?"
    }).then(function(res) 
    {
      if(res)
      {        
        //Delete the item form the Categorie's items
        for(var i=0; i< $rootScope.user.categories.length; i++)
        {
          var index = $rootScope.arrayObjectIndexOf($rootScope.user.categories[i].items, $scope.Item);
          //console.log(index);

          if(index >= 0)
          {
            $rootScope.user.categories[i].items.splice(index,1);
          }          
        }

        //Store the data in the local storage and AWS
        $rootScope.showToast('Saving');
        DbService.Store($rootScope.user, null);
        
        //Go to the Lists
        $state.go('app.home');
      }
    });
  }



  $scope.saveItem = function(goHome)
  {
    if($scope.newItem)
    {
      if($rootScope.checkedCheckboxes.length == 0)
      {
        $rootScope.showAlert("Warning","* Please select atleast one category");

        $("#categoryRequired").show();
      }
      else
      {
        $("#categoryRequired").hide();

        if($("#itemDataName").val() != "")
        {
          $scope.Item.name = $("#itemDataName").val();
        }
        else
        {
          if($("#itemDataName").attr("placeholder") != "")
          {
            $scope.Item.name = $("#itemDataName").attr("placeholder");
          }          
        }

       // console.log("Name: "+$scope.Item.name);

        if($scope.Item.name == "")
        {
          $rootScope.showAlert("Warning","Please provide a name");          
        }
        else
        {          
          //Only selecte the categories that have been checked and add them to the Item's categories
          //console.log($rootScope.user.categories[0].items);

          for(var i=0; i< $rootScope.user.categories.length; i++)
          {
            if($rootScope.user.categories[i].checked)
            {  
              var found = false; 
              for(var j=0; j< $rootScope.user.categories[i].items.length; j++)
              {

                //console.log($rootScope.user.categories[i].items[j].id +" == "+ $scope.Item.id);

                if($rootScope.user.categories[i].items[j].id == $scope.Item.id)
                {
                  found = true;
                }
              }

              if(!found)
              {
                $rootScope.user.categories[i].items.push($scope.Item);
              }
            }
          }          
          // console.log($rootScope.user.categories[0].items);
          
          //Store the data in the local storage and AWS
          $rootScope.showToast('Saving');
          DbService.Store($rootScope.user, null);
          $state.go('app.home');    
          $scope.Item = null;
        }
      }
    }
    else
    {

      if($rootScope.checkedCheckboxes.length == 0)
      {
        $rootScope.showAlert("Warning","* Please select atleast one category");

        $("#categoryRequired").show();
      }
      else
      {
        $("#categoryRequired").hide();

        if(document.getElementById('itemDataName').value != "")
        {
          $scope.Item.name = document.getElementById('itemDataName').value;  
        }
                
        //Store the data in the local storage and AWS
        $rootScope.showToast('Saving');
        DbService.Store($rootScope.user, null);

        if(goHome)
        {
          $state.go('app.home');            
          $scope.Item = null;
        }
      }
    }
  }

      //for scrolling
      $timeout(function()
      {
        var ImageSelectionScroll = new iScroll('wrapperImageSelection', 
                { 
                  momentum: true,
                  fadeScrollbar: false,
                  hideScrollbar: false, 
                  hScrollbar: true,
                  snap: 'li',
                  checkDOMChanges: true
                }
                )

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
      });
      // end for scrolling

      //setTimeout(function() { $rootScope.showConnectionStatus($rootScope.connectionStatus);}, 1000);    
})

.controller('CategoriesCtrl', function($rootScope, $scope, DbService, UserService, $state, $ionicLoading, $ionicModal, $ionicPopup, $ionicScrollDelegate, $ionicListDelegate){

  console.log("in CategoriesCtrl");
  $scope.addNewCategory = function()
  {
    //$scope.openModal();
     $ionicPopup.prompt(
     {
       title: 'New category',
       template: ' ',
       inputType: 'text',
       inputPlaceholder: 'Category name'
     }).then(function(res) 
     {

      if(typeof res != "undefined")
      {
        var newCategoryId = 0;

        if($rootScope.user.categories.length > 0)          
        {
         newCategoryId = ($rootScope.user.categories[$rootScope.user.categories.length -1].id + 1) ;
        }

      //console.log("newCategoryId: " + newCategoryId);
       var newCategoryName = res;
       if(newCategoryName != "")
       {
        $scope.createNewCategory(newCategoryId, newCategoryName);
       }
      }
     });
  }

  $scope.createNewCategory = function(newCategoryId, newCategoryName)
  {
    var newCategory = {
      "id": newCategoryId,
      "name": newCategoryName,
      "checked": false,
      "items": []
    }

    //add the Item to the scope
    $rootScope.user.categories.push(newCategory);
    //console.log($rootScope.user);

    //Store the the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);
    
    $ionicScrollDelegate.scrollBottom();
  }

 $scope.editCategory = function(myCategory)
    {

      $ionicPopup.prompt(
     {
       title: 'Edit Category',
       template: ' ',
       inputType: 'text',
       inputPlaceholder: myCategory.name
     }).then(function(res) 
     {
       if(typeof res != "undefined")
       {
         var newCategoryName = res;

         if(newCategoryName != "")
         {        
            //update the category name
            for(var i=0; i< $rootScope.user.categories.length; i++)
            {
              if($rootScope.user.categories[i].id == myCategory.id)
              {
                $rootScope.user.categories[i].name = newCategoryName;
              }
            }

          //Store the the data in the local storage and AWS
          $rootScope.showToast('Saving');
          DbService.Store($rootScope.user, null);
    
         }         
      }

      $ionicListDelegate.closeOptionButtons();
       
     });
    }

  $scope.deleteCategory = function(myCategory)
  {
    console.log(myCategory);
    $ionicPopup.confirm(
    {
      title: "Delete Category",
      content: "<strong>All Items in this Category will be lost!</strong> </br> Are you sure you would like to delete: " + myCategory.name +"?"
    }).then(function(res) 
    {
      if(res)
      {        
        for(var i=0; i< $rootScope.user.categories.length; i++)
        {
          if($rootScope.user.categories[i].id == myCategory.id)
          {
            $rootScope.user.categories.splice(i, 1);
          }
        }                                

        //Store the the data in the local storage and AWS

        $rootScope.showToast("Saving");

        DbService.Store($rootScope.user, null);
        
        $ionicListDelegate.closeOptionButtons();
        $scope.closeModal();
      }
      else
      {

      }

      
    });
  }

  $rootScope.reorderCategory = function(category, fromIndex, toIndex) 
 {
    //Move the item in the array
    $rootScope.user.categories.splice(fromIndex, 1);
    $rootScope.user.categories.splice(toIndex, 0, category);

    //Store the the data in the local storage and AWS
    $rootScope.showToast('Saving');
    DbService.Store($rootScope.user, null);
    
    $ionicListDelegate.showReorder(false);
  };

})

.controller('FriendsCtrl', function($rootScope, $scope, DbService, UserService, $state, $ionicLoading){

  console.log("in FriendsCtrl");

  //console.log($rootScope.user);

})


.controller('FriendCtrl', function($rootScope, $scope, $stateParams, $timeout, UserService, $ionicHistory){

  console.log("in Friend");

  $rootScope.currentFriend = null;

  for(var i=0; i< $rootScope.user.friends.length; i++)
  {
    if($rootScope.user.friends[i].user_id == $stateParams.friendId)
    {
        $rootScope.currentFriend = $rootScope.user.friends[i];
    }
  }



  //console.log($stateParams);
  var private_categories_count = 0;
  for(var i=0; i< $rootScope.currentFriend.categories.length; i++ )
  {
    var private_items_count = 0;
    $rootScope.currentFriend.categories[i].is_public = true;
    for(var j=0; j< $rootScope.currentFriend.categories[i].items.length; j++)
    {
      if($rootScope.currentFriend.categories[i].items[j].is_public == false)
      {
        console.log($rootScope.currentFriend.categories[i].items[j].is_public);
        private_items_count++;
      }
    }

    if($rootScope.currentFriend.categories[i].items.length == private_items_count)
    {
      $rootScope.currentFriend.categories[i].is_public = false;
      private_categories_count++;      
    }
  }

  $scope.AllCategoriesPrivate = false;
  if($rootScope.currentFriend.categories.length == private_categories_count)
  {
    $scope.AllCategoriesPrivate = true;
  }

//console.log($rootScope.currentFriend);
//console.log($scope.AllCategoriesPrivate);
//console.log($rootScope.currentFriend.categories.length);

$scope.showFriends = function()
  {
    $rootScope.show_friends = true;
    $ionicHistory.goBack();
  }

  $timeout(function()
    {
      var myScroll = new iScroll('wrapperV',{checkDOMChanges: true});
      var myScrolls = [];
      
      for(var i = 0; i< $rootScope.currentFriend.categories.length; i++)
      {
        if($rootScope.currentFriend.categories[i].is_public)
        {
          myScrolls.push(
              new iScroll('wrapper_friend' + i, 
                { 
                  momentum: true,
                  fadeScrollbar: true,
                  hideScrollbar: true, 
                  hScrollbar: true,
                  snap: 'li',
                  checkDOMChanges: true
                }
                ));
        }
      }
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    
    });

})

.controller('FriendsItemCtrl', function($rootScope, $scope, $timeout, UserService, DbService, $state, $stateParams, $ionicLoading, $ionicModal, $ionicSlideBoxDelegate, $ionicHistory, $ionicPopup, $ionicListDelegate, $ionicScrollDelegate, $cordovaCamera, $cordovaFile, ConnectivityMonitor, $cordovaSocialSharing){

  console.log("in FriendsItemCtrl");

  $scope.newItem = false;

  

  for(var i=0; i< $rootScope.currentFriend.categories.length; i++)
  {
    for(var j=0; j< $rootScope.currentFriend.categories[i].items.length; j++)
    {      
      console.log("making false")
      console.log("($rootScope.currentFriend.categories["+i+"] " + $rootScope.currentFriend.categories[i].name);

      $rootScope.currentFriend.categories[i].checked = false;

      if($rootScope.currentFriend.categories[i].items[j].id == $stateParams.itemId)
      {        
        $scope.Item = $rootScope.currentFriend.categories[i].items[j];
        $rootScope.currentFriend.categories[i].checked = true;

       console.log("making true")
       console.log("($rootScope.currentFriend.categories["+i+"] " + $rootScope.currentFriend.categories[i].name);
        break;
      }      
      
    }
    
  }

  console.log($rootScope.currentFriend.categories);    
  $scope.Item.style = "red";
  console.log($scope.Item);


//$("#my-item").css('background-image', 'url(' + $scope.Item.default_image.image_name + ')');

  


  $scope.showItemTab = function(itemTabId)
  {
    if(!$("#"+itemTabId).is(':visible'))
    {
      $("#main").hide();
      $("#time").hide();
      $("#notes").hide();
      $("#phone").hide();

      $("#button_time").removeClass("selected");
      $("#button_notes").removeClass("selected");
      $("#button_phone").removeClass("selected");
      $("#button_main").removeClass("selected");

      $("#button_"+itemTabId).addClass("selected");

      $("#"+itemTabId).slideDown(); 
    }   
  }


  $scope.goToMap = function()
  {
    //somehow the null test was failing
    if($scope.Item.maps_url && $scope.Item.maps_url != null && $scope.Item.maps_url != "")
    {
      window.location = $scope.Item.maps_url;
    }
    else if($scope.Item.formatted_address != null && $scope.Item.formatted_address != "")
    {
     window.location = "https://www.google.com/maps/place/"+$scope.Item.formatted_address; 
    }    
  }

  

///////
    $ionicModal.fromTemplateUrl('views/lightbox.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      
      //console.log('Modal is shown!');
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
  
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  
    $scope.goToSlide = function(index) {
      $scope.modal.show();

      setTimeout(function() { $ionicSlideBoxDelegate.slide(index);}, 100);    

    }
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  

///////
  


$scope.shareLocalImage = function(base64Image)
{

  var message = "";
  var subject = "GoBy Sharing";
  var file = null;
  var link = "";
  
  if(typeof $scope.Item.name != undefined)
    message += $scope.Item.name +" ";

  if(typeof $scope.Item.formatted_address != undefined)
    message += $scope.Item.formatted_address +" ";

  if(typeof $scope.Item.international_phone_number != undefined)
    message += $scope.Item.international_phone_number +" ";

  if(typeof $scope.Item.notes != undefined)
    message += $scope.Item.notes +" ";

  file = base64Image;

  if($scope.Item.maps_url != "")
  {
    link = $scope.Item.maps_url;
  }
  else if($scope.Item.website != "")
  {
   link = $scope.Item.website; 
  }
  
  $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
  .then(function(result) 
  {
    // Success!
      $rootScope.showToast('Item Shared');      
  }, function(err) 
  {
    // An error occured. Show a message to the user
    $rootScope.showToast('ERROR: Item not Shared :'+ err);
  }); 

  base64Image = null;
  file = null;
}

  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $scope.scrollTop = function()
{
  $ionicScrollDelegate.scrollTop(true);
}

  $scope.shareItem = function()
  {

    if($scope.Item.default_image.image_type == "photo" || $scope.Item.default_image.image_type == "gallery")
    {
      $scope.convertFileToDataURLviaFileReader($scope.cItem.default_image.image_name, $scope.shareLocalImage);
    }
    else
    {
      var message = "";
      var subject = "GoBy Sharing";
      var file = null;
      var link = "";

      if(typeof $scope.Item.name != undefined)
        message += $scope.Item.name +" ";

      if(typeof $scope.Item.formatted_address != undefined)
        message += $scope.Item.formatted_address +" ";

      if(typeof $scope.Item.international_phone_number != undefined)
        message += $scope.Item.international_phone_number +" ";

      if(typeof $scope.Item.notes != undefined)
        message += $scope.Item.notes +" ";

      file = $scope.Item.default_image.image_name;

      if($scope.Item.maps_url != "")
      {
        link = $scope.Item.maps_url;
      }
      else if($scope.Item.website != "")
      {
       link = $scope.Item.website; 
      }

      $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
      .then(function(result) 
      {
        // Success!
        $rootScope.showToast('Item Shared');
      }, function(err) 
      {
        // An error occured. Show a message to the user
        $rootScope.showToast('ERROR: Item not Shared :'+ err);
      });

      file = null;
    }
  }

  $rootScope.arrayObjectIndexOf = function(myArray, searchTerm) 
  {
    for(var i = 0, len = myArray.length; i < len; i++) 
    {
      if (myArray[i].id === searchTerm.id) return i;
    }
    return -1;
  }



})

;
