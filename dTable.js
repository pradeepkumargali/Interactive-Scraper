jVClaw=jQuery.noConflict();
var oTable;

jVClaw(document).ready(function() {
    jVClaw('#demo').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
		
		//var oTable = jVClaw('#example').dataTable();
     
    /* Apply the jEditable handlers to the table */
    /*jVClaw('td').editable( '/DataTables-1.9.4/examples/examples_support/editable_ajax.php', {
        "callback": function( sValue, y ) {
            var aPos = oTable.fnGetPosition( this );
            oTable.fnUpdate( sValue, aPos[0], aPos[1] );
        },
        "submitdata": function ( value, settings ) {
            return {
                "row_id": this.parentNode.getAttribute('id'),
                "column": oTable.fnGetPosition( this )[2]
            };
        },
        "height": "14px",
        "width": "100%"
    } );*/
	jVClaw( document ).on( "click", "#example tbody tr", function( e ) { 
	//jVClaw("#example tbody tr").on("click", function( e ) {
        if ( jVClaw(this).hasClass('row_selected') ) {
            jVClaw(this).removeClass('row_selected');
        }
        else {
            jVClaw('tr.row_selected').removeClass('row_selected');
            jVClaw(this).addClass('row_selected');
        }
    });
     
    /* Add a click handler for the delete row */
	jVClaw( document ).on( "click", "#delete", function( e ) {
    //jVClaw('#delete').on("click", function() {
        var anSelected = fnGetSelected( oTable );
        if ( anSelected.length !== 0 ) {
			console.log(anSelected[0].children[0].innerText);	
            
			chrome.runtime.getBackgroundPage(function(backgroundPage){
				backgroundPage.deleteSrc(anSelected[0].children[0].innerText);
				oTable.fnDeleteRow( anSelected[0] );
		});
        }
    } );
	
	jVClaw( document ).on( "click", "#clear", function( e ) {
    //jVClaw('#delete').on("click", function() {
    chrome.runtime.getBackgroundPage(function(backgroundPage){
		backgroundPage.clearObjectStore();
	    oTable.fnClearTable();
		});
        
    } );
     
    /* Init the table */
    //oTable = jVClaw('#example').dataTable( );
	oTable=jVClaw('#example').dataTable({	
		"aoColumns": [			
			{ "mData": "id","sTitle":"ID","sClass":"center" },			
			{ "mData": "uri" ,"sTitle":"URL","sClass":"center"},			
			{
				"sTitle": "Image",
				"sClass": "center",
				"mData":"image",
				"mRender": function(data,type,full) {
					var sReturn;
					//if ( sReturn == "A" ) {
						sReturn = '<a href="'+data+'" target="_blank"><img width="400px" src="'+data+'"></a>';
					//}
					return sReturn;
				}
			},
			{ "mData": "collectedText", "sTitle":"Collected Text","sClass":"center" },
			{ "mData": "path", "sClass": "center", "sTitle":"DOM Path"},
			
		],
		"aoColumnDefs": [
			{ "sWidth": "1%", "aTargets": [4] },
			{ "sWidth": "20%", "aTargets": [3] },
			{ "sWidth": "70%", "aTargets": [2] },
			{ "sWidth": "10%", "aTargets": [1] },
			{ "sWidth": "10%", "aTargets": [0] },
		]
	
		});
	var dOrig = [];	
	var d=[];
	chrome.runtime.getBackgroundPage(function(backgroundPage){
	backgroundPage.getAllData(function(){
	dOrig=backgroundPage.objectsToSend;
	//console.log(dOrig);	
	for(var i=0;i<dOrig.length;i++){	
	//console.log(td.id);
	console.log(dOrig[i]);
	oTable.fnAddData(dOrig[i]);
	//console.log('In for loop');
	}
    //setTimeout( function () {
    //console.log(d);    
                    //oTable.fnAddData( d );
                           
        
    //}, 500 );
	});
	
	}); 
	 
	
		
} ); 

function fnGetSelected( oTableLocal )
{
    return jVClaw('tr.row_selected');
}

