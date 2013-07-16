/*
 * contentscript.js
 *
 * Author: dave@bit155.com
 *
 * ---------------------------------------------------------------------------
 * 
 * Copyright (c) 2010, David Heaton
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright 
 * notice, this list of conditions and the following disclaimer.
 *  
 *     * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *  
 *     * Neither the name of bit155 nor the names of its contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *  
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var jC = jQuery.noConflict();
(function(){
  // listen for context menu
  var contextNode;
  var mystring;
  addEventListener("contextmenu", function(e) {
    contextNode=null;
    contextNode = e.srcElement;
	//console.log(jC(contextNode).getPath());
	mystring=jC(contextNode).getPath();
	//alert(mystring);
	console.log(jC(contextNode).text());
	//jC(contextNode).css("background-color","gray");
	chrome.runtime.sendMessage({textpath: mystring,fromURI:window.location.href,selText:jC(contextNode).text(),crawlerMode:"NORM"}, function(response) {
		//console.log(response.farewell);
	});
  });
/* var path;
var App = {
   scrollTo: function() {
		console.log(path);
      jC('html, body').animate({scrollTop: jC(path).offset().top}, 2000);
   }
};
*/
/*chrome.extension.onMessage.addListener(function(request,sender,sendResponse) { 
   if(request.substring(0,10) === "html>body>"){
   /*console.log(request);
	//jC(function() {
	// Handler for .ready() called.    
   jC(request).text();   
   console.log(jC(request).text());
   sendResponse({selText: jC(request).text(),crawlerMode:"ROLL"});*/	
   //});
   /*}
   else{
   sendResponse({crawlerMode:"NORM"});
   }
}); */

}()); 
