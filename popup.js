var saveItemName = "tempSaveUrls";

document.addEventListener('DOMContentLoaded', function() {
    var saveTabsButton = document.getElementById('saveTabsButton');
    var restoreTabsButton = document.getElementById('restoreTabsButton');    

    saveTabsButton.addEventListener('click', function() {
        chrome.storage.sync.remove(saveItemName, function(){
            SaveCurrentWindowTabs(); 
        });
    });        

    restoreTabsButton.addEventListener('click', function() {    
        OpenSaveTabs();
        CloseEmptyTabs();        
    });
});

function SaveCurrentWindowTabs(){
    myArray = [];
    chrome.tabs.query({ "currentWindow": true }, function (array_of_Tabs) { 
        for (var i = 0; i < array_of_Tabs.length; i++) {
            myArray.push(array_of_Tabs[i].url);
        }

        //could not make tempsaveurls a var for some reason (saveItemName)
        chrome.storage.sync.set({"tempSaveUrls" : myArray}, function() {
        console.log(array_of_Tabs.length+' urls saved: '+ JSON.stringify(myArray));

        ShowSavedAlert();   
        });
    });
}

function OpenSaveTabs(){
    chrome.storage.sync.get(saveItemName, function (items) {
        console.log(JSON.stringify(items));
        var savedUrls = items[saveItemName];
        console.log(' urls: '+ JSON.stringify(items));
        for(var i=0; i<savedUrls.length; i++){
            console.log('create: '+ savedUrls[i]);
            chrome.tabs.create({active:false, url: savedUrls[i]});
        }
    });
}

function CloseEmptyTabs(){
    chrome.tabs.query({ "currentWindow": true }, function (array_of_Tabs) { 
        myArray = [];
        for (var i = 0; i < array_of_Tabs.length; i++) { 
            console.log(array_of_Tabs[i].url);                   
            if(array_of_Tabs[i].url == 'chrome://newtab/'){
                chrome.tabs.remove(array_of_Tabs[i].id);
            }
        }                       
    });
}

function ShowSavedAlert(){
    chrome.browserAction.setBadgeText({text:"+1"});
    setTimeout(function() {
        chrome.browserAction.setBadgeText({text:""})
    }, 500);    
}
