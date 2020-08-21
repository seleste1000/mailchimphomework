"use strict";

/**
 * A function to convert markdown to html
 * 
 * @param user_input: The user's string input
 * returns: A string with the html translation
 * 
 */
function converter(user_input){
    let converted_text_container = [];
    let converted_text = "";
    let formatted = user_input.split('\n');

    // the converter goes to each line
    //checks for line type, then converts
    for(let i = 0; i < formatted.length; i++){

        
        if (formatted[i] == ""){
            //dont include empty lines, blank lines/extra whitespace should be specified
            continue;
        } else if(isHeader(formatted[i])){
            converted_text_container.push(convertHeader(formatted[i])); 
        } else if (isBlankLine(formatted[i])) {
            converted_text_container.push(convertBlankLine(formatted[i]));
        } else {
            //it's a body statement
            converted_text_container.push(convertBody(formatted[i]));
        }

    }

    converted_text = converted_text_container.join("<br />");

    return converted_text;
}

//check if header regex match
//check for # at beginning of string
function isHeader(input){

    const header_regex = /^([#]{1,6})[ ]{1}(.*)/g;

    return input.match(header_regex) != null;

}

//convert header
//count #s and do <h{count}>
function convertHeader(input){

    const header_regex = /^([#]{1,6})[ ]{1}(.*)/g;

    return input.replace(header_regex, replaceHeaderText);

}


//p1 holds all the #s
//p2 holds the remaining text
function replaceHeaderText(match, p1, p2){

    let level = p1.length;
    let header_text = checkLink(p2) ? convertLink(p2) : p2;

    return `&lt;h${level}&gt;${header_text}&lt;/h${level}&gt;`;

}


//check blank line
//string match for `Blank line`
function isBlankLine(input){

    return input == "Blank line";

}

//convert blank line
//just return <br>
function convertBlankLine(){

    return "&lt;br&gt;";

}


//fails other checks
//convert unformatted text
function convertBody(input){

    //if there is no prefix just convert body text to be between <p> tags
    //before converting to p tags get links
    if(checkLink(input)){
        input = convertLink(input);
    }

    return `&lt;p&gt;${input}&lt;/p&gt;`;
}


//check for link
//search using regex checking for [___](___)
function checkLink(input){

    const regex_link = /[[](.*)[\]][(](.*)[)]/g;

    return input.match(regex_link) != null;

}

//convert link
//use a while loop: 
//  regex.replaceAll doesn't work in all browsers yet
function convertLink(input){

    const regex_link = /[[](.*)[\]][(](.*)[)]/g;
    
    while(input && checkLink(input)){
        input = input.replace(regex_link, replaceLinkText);
    }

    return input;
}

//p1 is link text
//p2 is link url
function replaceLinkText(match, p1, p2){

    return `&lt;a href=\"${p2}/\"&gt;${p1}&lt;/a&gt;`;

}

function main(){
   
    const user_input = document.getElementById('user_input').value;
    const converted_text = converter(user_input);

    document.getElementById("converted_text").innerHTML = converted_text;
}