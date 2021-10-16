var serverIP = "192.168.0.100"; // This is the local computer IP
var port = "3000";

//This method created the button from the approriate children
async function createButton(textBtn, childid) {
  $("#btnContainer").append(
    "<button class='ui-btn' data-index-number=" +
      childid +
      " id='childBtn'>" +
      textBtn +
      "</button>"
  );
}

// This variable hold the username of the eduactor. ****take from login*****
//var educatorUsername = loginUser;
var childrenReflectionArrayPassed = [];
// this method fetch the details of the childrens an educator
function fetchChildrenDetails(educatorUsername) {
  var childByEduURL = `http://${serverIP}:${port}/children/${educatorUsername}`;
  $.ajax({
    type: "GET",
    url: childByEduURL,
    dataType: "JSON",
    beforeSend: function () {
      $.mobile.loading("show");
    },
    success: function (data) {
      if (data.length != 0) {
        storeChildrenDetails(data);
        var childrendDetailsArray = retrieveChildrensFromLocalStore();

        for (
          var childernNo = 0;
          childernNo < childrendDetailsArray.length;
          childernNo++
        ) {
          var childobj = childrendDetailsArray[childernNo];
          var childName = childrendDetailsArray[childernNo].Name;
          var childid = childrendDetailsArray[childernNo]._id;

          createButton(childName, childid);
        }
      } else {
        $("#btnContainer").append("<p>No children assign to you room</p>");
      }
    },
    complete: function () {
      $.mobile.loading("hide");
    },
  });
}

var valData;

// this function retrive the details of
// a perticuler child when the educator choose the childe to enter details
// children details are retrived from the database from the fetchChildrenDetails function
function fetchChildrenDetailsById(ChildId) {
  var childrenStorageData = localStorage.getItem(
    "childrenofEducatorLocalStorage"
  );
  var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];

  for (
    var childernNo = 0;
    childernNo < childrenStorageDataArray.length;
    childernNo++
  ) {
    var childObj = childrenStorageDataArray[childernNo];
    prefillReflection(childObj);

    var childName = childObj.Name;
    var childid = childObj._id;
    var childRoom = childObj.Room;

    if (childid == ChildId) {
      $(".reflection-name").empty();
      $(".reflection-name").append(childName);
      $(".reflection-name").attr("data-index-number", childid);
      $(".reflection-room").empty();
      $(".reflection-room").append(childRoom);

      // add the data-index-number attribute that is used in the form through out
      $("#camera-take-images").attr("data-index-number", childid);
      $("#child-images").attr("data-index-number", childid);
      $("#save-button").attr("data-index-number", childid);
      $("#send-button").attr("data-index-number", childid);
      $("#check-in-time").attr("data-index-number", childid);

      var childJsonFromID = localStorage.getItem(childid);
      var childJsonFromIDObj = JSON.parse(childJsonFromID);
      var reflectionMessage = childJsonFromIDObj.learningReflections;
      $("#textarea_lerning_reflection").val("");
      $("#textarea_lerning_reflection").val(reflectionMessage);
    }
  }
}

// This function prefill the json object and add to the localstore
function prefillReflection(childobj) {
  var refParentName = childobj.Parent.Name;
  var refParentemail = childobj.Parent.Username;
  var refchildId = childobj._id;
  var refChildName = childobj.Name;
  var refChildRoom = childobj.Room;
  var refEducatorName = childobj.Educator.Name;
  var refEducatorUserName = childobj.Educator.Username;
  //getJSON
  var childjson = $.getJSON(
    "js/dailyReflection.json",
    function (jsonRefelection) {
      jsonRefelection.parent.name = refParentName;
      jsonRefelection.parent.email = refParentemail;
      jsonRefelection.childId = refchildId;
      jsonRefelection.childName = refChildName;
      jsonRefelection.childRoom = refChildRoom;
      jsonRefelection.educator.name = refEducatorName;
      jsonRefelection.educator.username = refEducatorUserName;
      jsonRefelection.reflectionid = `${childId}${new Date().getTime()}`;
      // Reflection Id is generated when the child checked in the childid_timecheckin
      if (localStorage.getItem(`${refchildId}`) === null) {
        localStorage.setItem(`${refchildId}`, JSON.stringify(jsonRefelection));
      }
    }
  );
  console.log(childjson);
}

// this method store the details of the children from the database in the localStroge
function storeChildrenDetails(childrenEndroledforEducator) {
  try {
    /* create if the loacal storage is not available in the local storage or 
     * clear the values and repoplate the children details when the user load 
    the application*/
    if (localStorage) {
      var childrenofEducatorLocalStorage;
      if (!localStorage["childrenofEducatorLocalStorage"])
        childrenofEducatorLocalStorage = [];
      else localStorage.removeItem("childrenofEducatorLocalStorage");
      if (!(childrenofEducatorLocalStorage instanceof Array))
        childrenofEducatorLocalStorage = [];
      childrenofEducatorLocalStorage.push(childrenEndroledforEducator);
      // create the childrenofEducatorLocalStorage that contails the children for the educator
      localStorage.setItem(
        "childrenofEducatorLocalStorage",
        JSON.stringify(childrenofEducatorLocalStorage)
      );
      console.log("Given information successfully stored! Thank you.");
    }
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// This Method retrives the Children Details from the localstorage
function retrieveChildrensFromLocalStore() {
  try {
    //Here we are retriving the json object stroed in the childrenofEducatorLocalStorage local storge
    var childrenStorageData = localStorage.getItem(
      "childrenofEducatorLocalStorage"
    );
    var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];
    return childrenStorageDataArray;
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// this method store the daily reflections of the children in the localStroge
function storeDailyReflections(dailyReflection) {
  try {
    /*
    /* create if the loacal storage is not available in the local storage
     */
    if (localStorage) {
      var childrenDailyReflectionsLocalStorage;
      if (!localStorage["dailyReflectionsLocalStorage"])
        childrenDailyReflectionsLocalStorage = [];
      //else localStorage.removeItem("dailyReflectionsLocalStorage");
      if (!(childrenDailyReflectionsLocalStorage instanceof Array))
        childrenDailyReflectionsLocalStorage = [];
      childrenDailyReflectionsLocalStorage.push(dailyReflection);
      // create the childrenDailyReflectionsLocalStorage that contails the daily events of the child
      localStorage.setItem(
        "dailyReflectionsLocalStorage",
        JSON.stringify(dailyReflection)
      );
    }
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// this is the document.ready fuction handeles the button click events
$(document).ready(function () {
  //  dailyReflectionDisplay("6157f00c80342303d60d25c0");
  $("#educator-login").on("click", function (e) {
    $("body").pagecontainer("change", "#home", {
      transition: "slide",
    });
    var loginUser = $("#educator-login").attr("data-login");
    $("#username-lable").empty();
    $("#username-lable").append(loginUser);
    fetchChildrenDetails(loginUser);
  });

  $("#parent-login").on("click", function (e) {
    $("body").pagecontainer("change", "#parenthome", {
      transition: "slide",
    });
    var loginUser = $("#parent-login").attr("data-login");
    $("#username-lable").empty();
    $("#username-lable").append(loginUser);
    dailyReflectionDisplay(loginUser);
  });

  $("#btnContainer").on("click", "#childBtn", function () {
    $("body").pagecontainer("change", "#daily-reflections-page", {
      transition: "slide",
    }, 3000);

    // read the data values in the data attritute to fetch the each child a eductaor list
    // this helps to populate the each child details for create each page for eachild each day
    var childId = $(this).attr("data-index-number");
    fetchChildrenDetailsById(childId);
  });

  //Save the daily refelection of the child
  $("#save-button").on("click", function () {
    var childIDsave = $("#save-button").attr("data-index-number");
    var reflectionMessage = $("#textarea_lerning_reflection").val();
    console.log(reflectionMessage);
    var childJsonFromID = localStorage.getItem(childIDsave);
    var childJsonFromIDObj = JSON.parse(childJsonFromID);
    childJsonFromIDObj.learningReflections = reflectionMessage;
    localStorage.setItem(childIDsave, JSON.stringify(childJsonFromIDObj));

    // Alter the text with the stored text
    var lerningReflectionMessage = childJsonFromIDObj.learningReflections;
    if (
      $("textarea_lerning_reflection").attr("data-index-number") == childIDsave
    ) {
      $("#textarea_lerning_reflection").val("");
      $("#textarea_lerning_reflection").val(lerningReflectionMessage);
    }
  });

  //Save the daily refelection of the child
  $("#send-button").on("click", function () {
    var childIDsave = $("#send-button").attr("data-index-number");

    var childJsonFromID = localStorage.getItem(childIDsave);
    var childJsonFromIDObj = JSON.parse(childJsonFromID);

    var settings = {
      url: `http://${serverIP}:${port}/dailyreflections`,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(childJsonFromIDObj),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      alert(response);
    });
  });

  function addImages(pictures){
    for(var pictureindex = 0; pictureindex < pictures.length; pictureindex++ ){
      var pictureurl = pictures[pictureindex];
      $("#pchild-images").append(`<img src="${pictureurl}"  width='300'>`)
     // console.log(pictureurl);
    }
  }

  /*
  This fuction fetch the latest daily reflection from the database
   */
  function dailyReflectionDisplay(parentId) {
    var dailyReflection = `http://${serverIP}:${port}/dailyreflections/parent/${parentId}`;
    var lerningReflectionhtml;
    $.ajax({
      type: "GET",
      url: dailyReflection,
      dataType: "JSON",
      timeout:4000,
      beforeSend: function () {
        $.mobile.loading("show");
      },
      success: function (data) {

        console.log(data.educator.name);
        addImages(data.pictures);

        $("#pchild-name").empty();
        $("#pchild-name").append(data.childName);
        $("#pchild-room").empty();
        $("#pchild-room").append(data.childRoom);
        $("#pchild-parent").empty();
        $("#pchild-parent").append(data.parent.name);
        $("#pchild-educator").empty();
        $("#pchild-educator").append(data.educator.name);
        $("#pchild-reflections").empty();
        $("#pchild-reflections").append(data.learningReflections);
        $("#pchild-images").empty();
        $("#pchild-images").append(addImages(data.pictures));
        
      },
      complete: function () {
        console.log(lerningReflectionhtml);

        $.mobile.loading("hide");
      },
    });
  }

  //this method used to encode the Base64 image file
  function encodeBase64(image) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(image);
    });
  }

  //This method work with cordova camera plugin
  let app = {
    init: function () {
      document
        .getElementById("camera-take-images")
        .addEventListener("click", app.takephoto);
    },
    takephoto: function () {
      //These are the options of the camera function when the camera take pictures
      let option = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL, // this returens base64 encoded string
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE, // use the image gallery
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK, //use the back camera
        targetWidth: 1024,
      };
      // this take the image from the camera
      navigator.camera.getPicture(app.ftw, app.wtf, option);
    },
    // This fuction is exicuted when the camera is successful
    ftw: function (imageURI) {
      // On successfully captured the image is desplay in the app and send a copy the the server
      sendImagetoServer(imageURI);
    },
    // this even fired when the camera failes
    wtf: function (message) {
      alert(message);
    },
  };

  // this function provide the date time timestamp
  function getTimestamp() {
    const pad = (now, second = 2) =>
      `${new Array(second).fill(0)}${now}`.slice(-second);
    const date = new Date();

    return `${pad(
      date.getFullYear(),
      4
    )}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  // this fuction sends the image to the server as bas 64 encoded file
  function sendImagetoServer(imageURI) {
    // console.log(childIDcamera);
    var base64Img = imageURI;
    var image = new Image();
    image.src = "data:image/jpeg;base64," + base64Img;
    var childImageId = $("#child-images").attr("data-index-number");
    var cemeraAttrbuteId = $("#camera-take-images").attr("data-index-number");
    //add the Image preview to the report check the attrubute in the button and
    //div tages to match in order to avoid the images loaded in every child's reflection pages
    if (childImageId == cemeraAttrbuteId) {
      var img = document.createElement("img");
      img.src = "data:image/jpg;base64," + imageURI;
      img.className = "child-image";
      document.getElementById("child-images").appendChild(img);
    }

    //store the Image captured in the server
    var childimgURL = `http://${serverIP}:3000/img`;

    var form = new FormData();
    form.append("image", image);

    var settings = {
      url: childimgURL,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        fileName: `${new Date().getTime()}.jpg`,
        fileContent: base64Img,
      }),
    };
    // the file is storted succfully it returens the link of the image from the server
    $.ajax(settings).done(function (response) {
      console.log(response.imageurl);
      var childIDcamera = $("#camera-take-images").attr("data-index-number");
      var childJsonFromID = localStorage.getItem(childIDcamera);
      var childJsonFromIDObj = JSON.parse(childJsonFromID);

      var imageLink = response.imageurl;
      childJsonFromIDObj.pictures.push(imageLink);
      localStorage.setItem(childIDcamera, JSON.stringify(childJsonFromIDObj));
    });
  }

  document.addEventListener("deviceready", app.init);
});
