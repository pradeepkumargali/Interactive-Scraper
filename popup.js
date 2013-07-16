jVClaw=jQuery.noConflict();

jVClaw(document).ready(function() {
	jVClaw( "#rollOn" ).on( "click",function( e ) {
	chrome.tabs.getSelected(null, function(tab) {
		var myTab=tab;
		chrome.runtime.getBackgroundPage(function(backgroundPage){
		backgroundPage.rolltheScraper(tab);
		//backgroundPage.clearObjectStore();
	    //oTable.fnClearTable();
		})
		
		});
});

});