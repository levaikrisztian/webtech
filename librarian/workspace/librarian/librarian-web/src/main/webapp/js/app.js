var authorsData;
var updateMode = false;
var addMode = false;
var nationalities = [
	"Hungarian",
	"British",
	"American",
	"Spanish",
	"Russian",
	"Finnish"
];
var MESSAGE_DISPLAY_TIME = 2400;

$(document).ready(function() {
	
	// -
	// Navigation setup
	// -
	$(".nav-item").click(function(){
		$(".active").removeClass("active");
		$(this).addClass("active");
		var nav_id = $(this).attr("id");
		var path = "view_contents/" + nav_id + ".html";
		$.get(path, function(data){
			$("#content").html(data);
			$(".input-table").hide();
			$(".new-button-container-finish").hide();
			updateMode = false;
			addMode = false;
			//$(".update-button-container").hide();
		});
		
		// -
		// Authors - LIST
		// -
		if (nav_id == "authors"){
			$.getJSON("authors", function(json_resp){
				authorsData = json_resp;
				$(json_resp).each(function(index, value){
					var date = myFormatDate(value.birthDate);
					authorsData[index].formattedDate = date;
					$("#data-holder").append('<tr class="data-row" id="data-row-'+ value.authorID +'"><td>' +
										value.authorID + '</td><td>' +
										value.name + '</td><td>' +
										value.nationality + '</td><td>' +
										date + '</td></tr>'
									  );
					
				});
				// -
				// New Events Setup
				// -
				$(".new-author").click(function(){
					if (updateMode== false){
						addMode = true;
						$(this).hide();
						$(".input-table").show();
						$(".new-button-container-finish").show();
					}
				});
				$(".done-button").click(function(){
					addMode = false;
					postNewAuthor();
					$("#authors").click();
					$(".input-table").hide();
					$(".new-button-container-finish").hide();
					$(".new-author").show();
				});
				$(".cancel-button").click(function(){
					addMode = false;
					$(".input-table").hide();
					$(".new-button-container-finish").hide();
					$(".new-author").show();
				});
				
				
				// -
				// Update Events Setup
				// -
				$(".data-row").click(function(){
					if (addMode == false){
						if (updateMode == false){
							updateMode= true;
						
						var string = $(this).html();
						var i;
						for (i=4;i<string.length; i++){
							if (string[i] == "<") {break;}
						}
						
						var id = string.substring(4,i);
						var j;
						var index = -1;
						for (j=0; j< authorsData.length; j++ ){
							if (id == authorsData[j].authorID){
								index = j;
								break;
							}
						}
						$(this).addClass("selected-for-update");
						$(this).keypress(function(event){
							if (event.keyCode == 13){
								postUpdateAuthor();
								updateMode= false;
								$("#authors").click();
							}
						});
						
						
						
						if (index >= 0){
							var modifiedContent = '<td> <input type="number" id="update-id" value="' + authorsData[index].authorID + '"></input></td>' +
							'<td> <input type="text" id="update-name" value="' + authorsData[index].name + '"></input></td>' +
							'<td> <select id="update-nationality">';
					
							var k;
							for (k = 0; k<nationalities.length; k++){
								modifiedContent += '<option value="' + nationalities[k] + '"';
								if (nationalities[k] == authorsData[index].nationality){
									modifiedContent += ' selected ';
								}
								modifiedContent += '>' + nationalities[k] +'</option>';
							}
					
							modifiedContent += '</select></input></td>' +
								'<td> <input type="text" id="update-birthDate" value="' + authorsData[index].formattedDate + '"></input></td>';
					
							$(this).html(modifiedContent);
						}
						
						}
					}
					
				});
				
				
			});
		}
		// -
		// End of Authors - LIST
		// -
		
		
		// -
		// Books
		// -
		if (nav_id == "books"){
			$.getJSON("books", function(json_resp){
				$(json_resp).each(function(index, value){
					var content = '<tr class="data-row" id="data-row-'+ value.bookID +'"><td>' +
									value.bookId + '</td><td>' +
									value.title + '</td><td>';
					var i;
					for (i=0; i<value.genres.length-1; i++){
						content += value.genres[i] + ", ";
					}
					content += value.genres[i] + '</td><td>';
					
					for (i=0; i<value.authors.length-1; i++){
						content += value.authors[i].name + " (" + value.authors[i].nationality + ")\n";
					}
					
					content += value.authors[i].name + " (" + value.authors[i].nationality + ')</td></tr>'
					
					$("#data-holder").append(content);
					
				});
			});
		}
			
		
	});
	// -
	// End of Navigation setup
	// -
	
	
	

	$("#home").click();
	
	

});

// -
// Insert Author AJAX
// -
function postNewAuthor(){
	var author = {
			"authorID": $("#id").val(),
		 	"name": $("#name").val(),
		 	"nationality": $("#nationality").val(),
		 	"birthDate": $("#birthDate").val()
		};
		
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/librarian-web/author/insert",
			data: JSON.stringify(author),
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: function(data){
				$(".success").html("New author added.");
				$(".success").show();
				$(".success").fadeOut(MESSAGE_DISPLAY_TIME);
			},
			complete: function(response){
				try {
					if (response.statusText != "OK"){
						$(".failure").html("Error adding new author.<br/>" + response.statusText);
						$(".failure").show();
						$(".failure").fadeOut(MESSAGE_DISPLAY_TIME);
					}
				}
				catch (err){
					console.log(err);
					$(".failure").html("Error adding new author.<br/> Programcode syntax error.");
					$(".failure").show();
					$(".failure").fadeOut(MESSAGE_DISPLAY_TIME);
				}
				
			}
		});
}
//-
//Update Author AJAX
//-
function postUpdateAuthor(){
	var author = {
			"authorID": $("#update-id").val(),
		 	"name": $("#update-name").val(),
		 	"nationality": $("#update-nationality").val(),
		 	"birthDate": $("#update-birthDate").val()
		};
		
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/librarian-web/author/update",
			data: JSON.stringify(author),
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: function(data){
				$(".success").html("Author update successful.");
				$(".success").show();
				$(".success").fadeOut(1600);
			},
			complete: function(response){
				try {
					if (response.statusText != "OK"){
						$(".failure").html("Error updating author.<br/>" + response.statusText);
						$(".failure").show();
						$(".failure").fadeOut(MESSAGE_DISPLAY_TIME);
					}
				}
				catch (err){
					console.log(err);
					$(".failure").html("Error updating author.<br/> Programcode syntax error.");
					$(".failure").show();
					$(".failure").fadeOut(MESSAGE_DISPLAY_TIME);
				}
			}
		});
}

// -
// Date string normalization
// -
function myFormatDate(unformattedDate){
	var date = new Date(unformattedDate);
	var dateString = date.toLocaleString();
	var dateIndex = dateString.indexOf(",");
	dateString = dateString.substring(0,dateIndex);
	var year = null;
	var month = null;
	var day = null;
	var i;
	var lastSeparator = 0;
	
	for (i=0;i<dateString.length;i++){
		if (month == null){
			if (dateString[i] == "/"){
				month = dateString.substring(lastSeparator, i);
				lastSeparator = i;
			}
		} else if (day == null){
			if (dateString[i] == "/"){
				day = dateString.substring(lastSeparator+1, i);
				lastSeparator = i;
				year = dateString.substring(lastSeparator+1);
				i = dateString.length;
			}
		}
	}
    var formattedDate = year + "-" + month + "-" + day;
	
	return formattedDate;
}
