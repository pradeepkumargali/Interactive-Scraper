// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
if(typeof fromURI == 'undefined')
	var fromURI;
if(typeof textPath == 'undefined')
	var textPath;
if(typeof image == 'undefined')
	var image;	
if(typeof dbp == 'undefined')
	var dbp;
var keep_alive = true;
var cursor;
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  //localStorage.setItem(fromURI,textpath);
  chrome.tabs.captureVisibleTab(tab.windowId,catchImage);
  
}
//chrome.browserAction.onClicked.addListener(function(tab) {
//rolltheScraper(tab)
//});


  var objects = [];
  var collectObjects = function (request, cb,cTab) {
    //var objects = [];
    request.onsuccess = function (event) {
      if (!event.target.result) return cb(null, objects,cTab);
      cursor = event.target.result;
      objects.push(cursor.value);
      cursor.continue();
    }
    request.onerror = function (event) {
      cb(event.target.error);
    }
}

/*var asyncLoop = function(o){
    var i=-1;

    var loop = function(){
        i++;
        if(i==o.length){o.callback(); return;}
        o.functionToLoop(loop, i);
    } 
    loop();//init
}*/
    var i=0;
	var currentTab=-10;
function cb(indicator,objects,cTab){
if(indicator==null)
	{
	//console.log(objects);
	/*asyncLoop({
    length : objects.length,
    functionToLoop : function(loop, i){
        setTimeout(function(){
            //Function here
            loop();
        },1000);
    },
    callback : function(){
        document.write('All done!');
    }    
}); */

	currentTab=cTab.id;
	chrome.tabs.update(cTab.id,{url:objects[i].uri,active:true},function(t){		    
    		console.log(objects[i].uri,objects[i].path);    			
			});
}
}

chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {
			if (info.status != "complete") {
				return;
			}
			//i++;
			if(currentTab==tabid){
			chrome.tabs.executeScript(tabid, {
					code: "var EnhanceLibIsLoaded=false;chrome.extension.sendMessage({ loaded: EnhanceLibIsLoaded || false });"
			});
			}
			/*chrome.tabs.update(tabid,{url:objects[i].uri,active:true},function(t){		    
    		console.log(objects[i].uri,objects[i].path);    
			chrome.tabs.executeScript(t.id,{file:"/lib/jquery-ui-1.8.6/js/jquery-1.9.0.min.js",runAt:"document_end"},function() {
			chrome.tabs.executeScript(t.id, { code:"var jClaw = jQuery.noConflict();jClaw('html, body').animate({scrollTop:jClaw('"+objects[i].path+"').offset().top}, 2000);jClaw('"+objects[i].path+"').css({background:'yellow'},1000);",runAt:"document_end"},function(){
			//console.log(objects);
			chrome.tabs.sendMessage(t.id,objects[i].path,function(response){console.log('Win-Win');console.log(response);});
			});
			});
			});*/
	});
var objectsToSend=[];
function getAllData(viewCallback){
	objectsToSend=[];
    store = getObjectStore(DB_STORE_NAME, 'readwrite');
	var req;
    req = store.count();
	
	req.onsuccess = function(evt) {
      console.log('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
					// store = getObjectStore(DB_STORE_NAME, 'readwrite');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
	 // store = getObjectStore(DB_STORE_NAME, 'readwrite');
      //displayActionFailure(this.error);
    };
		  
    req = store.openCursor();
	//return collectObjectsAll(req);
	
    req.onsuccess = function (event) {
      if (!event.target.result){	  
	  viewCallback();
	  return;
	  }
      cursor = event.target.result;
      objectsToSend.push(cursor.value);
      cursor.continue();
    }
    req.onerror = function (event) {
      console.log(event.target.error);
    }
		
}

function rolltheScraper(cTab){
	//if (typeof store == 'undefined')
	if(objects.length==0){
      store = getObjectStore(DB_STORE_NAME, 'readwrite');
	var req;
    req = store.count();
	
	req.onsuccess = function(evt) {
      console.log('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
					// store = getObjectStore(DB_STORE_NAME, 'readwrite');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
	 // store = getObjectStore(DB_STORE_NAME, 'readwrite');
      //displayActionFailure(this.error);
    };
	
	  
    req = store.openCursor();
	collectObjects(req,cb,cTab);
	}
	else
	{
		cb(null,objects,cTab);
	}
    
}

function catchImage(dataUrl){
	console.log(dataUrl);
	//localStorage.setItem('img_'+fromURI,textpath);
	image=dataUrl;
	addSrc(fromURI,image,textPath,selText);
}
// Create one test item for each context type.
var contexts = ["all","page","selection","link","editable","image","video",
                "audio"];
/*for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}*/
chrome.contextMenus.create({"title": "Capture detail", "contexts":["selection"],
                                       "onclick": genericOnClick});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	console.log(objects.length,i);
    if(request.crawlerMode=="ROLL"){
	console.log("ROLL:Gathered Text:  "+request.selText);    
	}
	else if (request.crawlerMode=="NORM")
	{
    console.log("Gathered Text:  "+request.selText+"from a content script:" + request.fromURI+"from the extension"+request.textpath);    
      sendResponse({farewell: "goodbye"});	  
	  fromURI=request.fromURI;
	  textPath=request.textpath;
	  selText=request.selText;
	}
	if(request.loaded==false && i<objects.length){
		chrome.tabs.executeScript(sender.tab.id,{file:"/lib/jquery-ui-1.8.6/js/jquery-1.9.0.min.js",runAt:"document_end"},function() {
			chrome.tabs.executeScript(sender.tab.id, { code:"var jClaw = jQuery.noConflict();jClaw('html, body').animate({scrollTop:jClaw('"+objects[i].path+"').offset().top}, 2000);jClaw('"+objects[i].path+"').css({background:'yellow'},1000);var tTxt=jClaw('"+objects[i].path+"').text();tTxt",runAt:"document_end"},function(results){
			setTimeout(function(){
			//console.log(objects);
			//chrome.tabs.sendMessage(t.id,objects[i].path,function(response){console.log('Win-Win');console.log(response);i++;});
			objects[i].collectedText=results[0];
			console.log(results[0]);
			updateSrc(objects[i],sender.tab.windowId);
			i++;
			chrome.tabs.executeScript(sender.tab.id, { code: "EnhanceLibIsLoaded = true;" },function(){
			if(i<objects.length){
			chrome.tabs.update(sender.tab.id,{url:objects[i].uri,active:true},function(t){		    
    		console.log(objects[i].uri,objects[i].path);    			
			});
			}
			else{
			console.log('End of Cursor. Start Over');
			i=0;
			objects=[];
			}
			});			
			},2000); //Waiting for 2000 
			});
			});
	}	
  });

const DB_NAME = 'cDB';
const DB_VERSION = 3; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = 'source';
var request = indexedDB.open(DB_NAME, DB_VERSION);
 
request.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      // db = req.result;
      dbp = this.result;
      console.log("openDb DONE");
    };
    request.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };
request.onupgradeneeded = function(event) {
  var db = event.target.result;
 
  // Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique.
  var objectStore = db.createObjectStore("source",  { keyPath: 'id', autoIncrement: true } );
 
  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex("uri", "uri", { unique: false });
 
  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  objectStore.createIndex("image", "image", { unique: false });  
  objectStore.createIndex("path", "path", { unique: false });
  
  objectStore.createIndex("regex", "regex", { unique: false });
  objectStore.createIndex("collectedText", "collectedText", { unique: false });
 
  // Store values in the newly created objectStore.
  /* for (var i in customerData) {
    objectStore.add(customerData[i]);
  } */
};


  function getObjectStore(store_name, mode) {
    var tx = dbp.transaction(store_name, mode);
    tx.oncomplete = function(e){
        console.log("Transaction Complete");
      };
      tx.onabort = function(e){
        console.log("Transaction Aborted");
      };
      tx.onerror = function(e){
        console.log("Transaction Error");
      };
	  //tx.onsuccess=keepAlive;
    return tx.objectStore(store_name);
  }

  function clearObjectStore(store_name) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      //displayActionSuccess("Store cleared");
      //displayPubList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      //displayActionFailure(this.error);
    };
  }
  
  function addSrc(uri, image, path) {
    console.log("addSrc arguments:", arguments);
    var obj = { uri: uri, image: image, path: path ,collectedText:selText};
    
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req;
    try {
      req = store.add(obj);
    } catch (e) {      
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      //displayActionSuccess();
      //displayPubList(store);
    };
    req.onerror = function() {
      console.error("addPublication error", this.error);
      //displayActionFailure(this.error);
    };
  }
  
  function updateSrc(obj,tabWindowId){
	var store = getObjectStore(DB_STORE_NAME, 'readwrite');
	fromURI=obj.uri;
	textPath=obj.path;
	selText=obj.collectedText;
	try {
	  console.log(obj.id);
      req = store.delete(obj.id);
    } catch (e) {      
      throw e;
    }
	 req.onsuccess = function (evt) {
      console.log("Deletion in DB successful");
      //displayActionSuccess();
      //displayPubList(store);
    };
    req.onerror = function() {
      console.error("Deletion error", this.error);
      //displayActionFailure(this.error);
    };
	
	chrome.tabs.captureVisibleTab(tabWindowId,catchImage);
	
  }
  
  function deleteSrc(id){
  var store = getObjectStore(DB_STORE_NAME, 'readwrite');
  try {
	  //console.log(obj.id);
      req = store.delete(parseInt(id));
    } catch (e) {      
      throw e;
    }
	 req.onsuccess = function (evt) {
      console.log("Deletion in DB successful");
      //displayActionSuccess();
      //displayPubList(store);
    };
    req.onerror = function() {
      console.error("Deletion error", this.error);
      //displayActionFailure(this.error);
    };
  }