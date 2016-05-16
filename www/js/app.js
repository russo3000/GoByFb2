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
            add_a_place: "Add a place",
            working_offline: "Working Offline",
            working_online: "Working Online",
            connecting: "Connecting",
            add_a_new_item: "Add a new Item",
            add_a_new_item_to_this_category: "Add a new item to this category",
            categories: "Categories",
            photo: "Photo",
            my_gallery: "My Gallery",
            add_an_image: "Add an Image",
            my_notes: "My Notes",
            address: "Address",
            phone_number: "Phone Number",
            website: "Website",
            open_now: "Open Now",
            closed_now: "Closed Now",
            public: "Public",
            private: "Private",
            visibility: "Visibility",
            my_friends: "My Friends",
            can: "can",
            cant: "can't",
            see_this_item: "see this Item",
            please_select_atleast_one_category: "Please select atleast one category",
            add_a_category: "Add a Category",
            delete_this_category: "Delete this category",
            reorder: "Reorder",
            back: "Back",
            this_category_doesnt_have_any_items_yet: "This category doesn't have any items yet",
            there_are_no_available_categories: "There are no available categories",
            s_notes: "'s Notes",
            logout: "Logout",
            english: "English",
            french: "Français",
            spanish: "Español",
            russian: "Русский",
            german: "Deutsch",
            chinese: "中文",
            arabic: "العربية",
            portuguese: "Português",
            japanese: "日本語",
            afrikaans: "Afrikaans"
         
        };
 
var translationsFR= {
home: "Accueil",
edit_categories: "Modifier les catégories",
add_a_place: "Ajouter un endroit",
working_offline: "Travail hors ligne",
working_online: "Travailler en ligne",
connecting: "Connexion  ",
add_a_new_item: "Ajouter un nouvel élément",
add_a_new_item_to_this_category: "Ajouter un nouvel élément à cette catégorie",
categories: "Catégories ",
photo: "photo",
my_gallery: "Ma galerie ",
add_an_image: "Ajouter une image",
my_notes: "Mes notes  ",
address: "adresse",
phone_number: "Numéro de téléphone",
website: "site web   ",
open_now: "Maintenant ouvert",
closed_now: "Fermé Maintenant ",
public: "publique   ",
private: "privé",
visibility: "Visibilité ",
my_friends: "Mes amis   ",
can: "peut ",
cant: "ne peut pas",
see_this_item: "voir cet article ",
please_select_atleast_one_category: "S'il vous plaît sélectionner au moins une catégorie",
add_a_category: "Ajouter une catégorie",
delete_this_category: "Supprimer cette catégorie",
reorder: "Réorganiser",
back: "Retour",
this_category_doesnt_have_any_items_yet: "Cette catégorie n'a pas encore tous les éléments",
there_are_no_available_categories: "Il n'y a pas de catégories disponibles",
s_notes: "notes",
logout: "Déconnexion"
};

var translationsES= {
home: "Inicio",
edit_categories: "Modificar categorías",
add_a_place: "Añade un lugar",
working_offline: "Trabajo fuera de línea",
working_online: "El trabajo en línea",
connecting: "Conexión",
add_a_new_item: "Añadir un nuevo artículo",
add_a_new_item_to_this_category: "Añadir un nuevo elemento a esta categoría",
categories: "Categorías",
photo: "Foto",
my_gallery: "My Gallery",
add_an_image: "Añadir imagen",
my_notes: "Mis notas",
address: "Dirección",
phone_number: "Número de teléfono",
website: "Sitio Web",
open_now: "Abierto ahora",
closed_now: "Ahora cerrada",
public: "Pública",
private: "Privada",
visibility: "Visibilidad",
my_friends: "Mis amigos",
can: "puede",
cant: "no puede",
see_this_item: "ver este artículo",
please_select_atleast_one_category: "Por favor seleccione al menos una categoría",
add_a_category: "Añadir una categoría",
delete_this_category: "Eliminar esta categoría",
reorder: "Reordenar",
back: "Volver",
this_category_doesnt_have_any_items_yet: "Esta categoría no tiene ningún artículo sin embargo",
there_are_no_available_categories: "No hay categorías disponibles",
s_notes: "notas",
logout: "Salir"
};

var translationsRU= {
home: "Главная",
edit_categories: "Редактирование категорий",
add_a_place: "Добавить место",
working_offline: "Работа в автономном режиме",
working_online: "Работа в Интернете",
connecting: "Подключение",
add_a_new_item: "Добавить новый элемент",
add_a_new_item_to_this_category: "Добавить новый элемент в этой категории",
categories: "Категории",
photo: "Фото",
my_gallery: "Моя галерея",
add_an_image: "Добавить изображение",
my_notes: "Мои заметки",
address: "Адрес",
phone_number: "Номер телефона",
website: "веб-сайт",
open_now: "Открыть сейчас",
closed_now: "Вопрос закрыт Теперь",
public: "Открытый",
private: "частные",
visibility: "Видимость",
my_friends: "Мои друзья",
can: "может",
cant: "не может",
see_this_item: "Этот элемент",
please_select_atleast_one_category: "Пожалуйста выберите одну категорию по крайней мере",
add_a_category: "Добавить категорию",
delete_this_category: "Удалить эту категорию",
reorder: "Упорядочивание",
back: "Назад",
this_category_doesnt_have_any_items_yet: "Эта категория не имеет еще ни одного продукта",
there_are_no_available_categories: "Там нет доступных категорий",
s_notes: "Примечания",
logout: "Выход"
};

var translationsDE= {
home: "Nach Hause",
edit_categories: "Kategorien bearbeiten",
add_a_place: "Einen neuen Platz",
working_offline: "Offline-Arbeit",
working_online: "Online arbeiten",
connecting: "Anschließen",
add_a_new_item: "Fügen Sie einen neuen Artikel",
add_a_new_item_to_this_category: "Fügen Sie einen neuen Artikel zu dieser Kategorie",
categories: "Kategorien",
photo: "Foto",
my_gallery: "Meine Galerie",
add_an_image: "Fügen Sie ein Bild",
my_notes: "Meine Notizen",
address: "Adresse",
phone_number: "Telefonnummer ",
website: "Website",
open_now: "Jetzt geöffnet",
closed_now: "Jetzt geschlossen",
public: "Öffentlichkeit",
private: "Privat",
visibility: "Sichtbarkeit",
my_friends: "Meine Freunde",
can: "kann",
cant: "kann nicht",
see_this_item: "siehe Artikel",
please_select_atleast_one_category: "Bitte wählen Sie atleast eine Kategorie",
add_a_category: "Fügen Sie eine Kategorie",
delete_this_category: "Löschen Sie diese Kategorie",
reorder: "Nachbestellung",
back: "back",
this_category_doesnt_have_any_items_yet: "Hat nicht diese Kategorie-haben keine Artikel noch",
there_are_no_available_categories: "Es gibt keine verfügbaren Kategorien",
s_notes: "Hinweise",
logout: "Logout"
};

var translationsZH= {
home: "首页",
edit_categories: "编辑类别",
add_a_place: "添加一个地方",
working_offline: "脱机工作",
working_online: "联机工作",
connecting: "连接",
add_a_new_item: "添加一个新的项目",
add_a_new_item_to_this_category: "添加一个新的项目这一类",
categories: "类别",
photo: "照片",
my_gallery: "我的画廊",
add_an_image: "添加图像",
my_notes: "我的注释",
address: "地址",
phone_number: "电话号码",
website: "网站",
open_now: "打开现在",
closed_now: "现在关闭",
public: "公开",
private: "私人",
visibility: "可见",
my_friends: "我的朋友",
can: "可以",
cant: "不能",
see_this_item: "看到这个项目",
please_select_atleast_one_category: "请至少选择一个类别",
add_a_category: "添加类别",
delete_this_category: "删除此类别",
reorder: "重新排序",
back: "返回",
this_category_doesnt_have_any_items_yet: "此类别没有任何作品",
there_are_no_available_categories: "有没有可用的类别",
s_notes: "注意",
logout: "注销"
};

var translationsAR= {
home: "ترحيب",
edit_categories: "تحرير الفئات",
add_a_place: "إضافة مكان",
working_offline: "العمل دون اتصال",
working_online: "العمل على الانترنت",
connecting: "اتصال",
add_a_new_item: "إضافة عنصر جديد",
add_a_new_item_to_this_category: "إضافة عنصر جديد لهذه الفئة",
categories: "الفئات",
photo: "صور",
my_gallery: "معرض بلدي",
add_an_image: "إضافة صورة",
my_notes: "ملاحظاتي",
address: "عنوان",
phone_number: "رقم الهاتف",
website: "موقع إلكتروني",
open_now: "الآن مفتوحة",
closed_now: "الآن مغلقة",
public: "جمهور",
private: "خاص",
visibility: "رؤية",
my_friends: "أصدقائي",
can: "علبة",
cant: "لا يمكن",
see_this_item: "نرى هذا المقال",
please_select_atleast_one_category: "الرجاء تحديد فئة واحدة على الأقل",
add_a_category: "إضافة فئة",
delete_this_category: "إزالة هذه الفئة",
reorder: "إعادة تنظيم",
back: "عودة",
this_category_doesnt_have_any_items_yet: "هذا التصنيف لديه ليس كل العناصر",
there_are_no_available_categories: "لا توجد فئات المتاحة",
s_notes: "ملاحظات",
logout: "تسجيل الخروج"
};

var translationsJA= {
home: "ホーム",
edit_categories: "カテゴリの編集",
add_a_place: "場所を追加し",
working_offline: "オフライン作業",
working_online: "オンラインで作業",
connecting: "接続",
add_a_new_item: "新しいアイテムを追加し",
add_a_new_item_to_this_category: "このカテゴリーに新しいアイテムを追加し",
categories: "カテゴリー",
photo: "写真",
my_gallery: "マイギャラリー",
add_an_image: "イメージの追加",
my_notes: "マイノート",
address: "住所",
phone_number: "電話番号",
website: "ウェブサイト",
open_now: "オープン今",
closed_now: "今すぐ閉じて",
public: "公共",
private: "プライベート",
visibility: "可視性",
my_friends: "マイフレンド",
can: "缶",
cant: "できません",
see_this_item: "この項目を参照してください",
please_select_atleast_one_category: "少なくとも1つのカテゴリを選択してください",
add_a_category: "カテゴリを追加し",
delete_this_category: "このカテゴリを削除し",
reorder: "並べ替え",
back: "戻ります",
this_category_doesnt_have_any_items_yet: "このカテゴリには、まだすべてのアイテムを持っていません",
there_are_no_available_categories: "利用可能なカテゴリはありません",
s_notes: "ノート",
logout: "ログアウト"
};

var translationsAF= {
home: "Huis",
edit_categories: "Kategorieë wysig",
add_a_place: "Voeg 'n plek",
working_offline: "Aflyn werk",
working_online: "Werk aanlyn",
connecting: "Connecting",
add_a_new_item: "Voeg 'n nuwe item",
add_a_new_item_to_this_category: "Voeg 'n nuwe item in hierdie kategorie",
categories: "Kategorieë",
photo: "Foto",
my_gallery: "My Gallery",
add_an_image: "Voeg 'n beeld",
my_notes: "My Notes",
address: "Adres",
phone_number: "Telefoonnommer",
website: "Webwerf",
open_now: "Oop Nou",
closed_now: "Nou toe",
public: "Publiek",
private: "Private",
visibility: "Sigbaarheid",
my_friends: "My vriende",
can: "kan",
cant: "kan nie",
see_this_item: "Sien hierdie item",
please_select_atleast_one_category: "Kies ten minste een kategorie",
add_a_category: "Voeg 'n kategorie",
delete_this_category: "Verwyder hierdie kategorie",
reorder: "Rangskik",
back: "Terug",
this_category_doesnt_have_any_items_yet: "Hierdie kategorie het nog nie enige items het",
there_are_no_available_categories: "Daar is geen beskikbare kategorieë",
s_notes: "Notes",
logout: "Teken uit"
};

  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('fr', translationsFR);
  $translateProvider.translations('es', translationsES);
  $translateProvider.translations('ru', translationsRU);
  $translateProvider.translations('de', translationsDE);
  $translateProvider.translations('zh', translationsZH);
  $translateProvider.translations('ar', translationsAR);
  $translateProvider.translations('ja', translationsJA);
  $translateProvider.translations('af', translationsAF);

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
