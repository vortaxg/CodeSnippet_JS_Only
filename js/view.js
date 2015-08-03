"use strict";

var inputParameters,
    id,
    workingObj,
    fileId,
    fileIdRegExp;

(function () {
    try{
        inputParameters = window.location.search;
        fileIdRegExp = /id=\d+/;
        id = fileIdRegExp.exec(inputParameters)[0].replace('id=', '');
        fileIdRegExp = /f=\d+/;
        fileId = fileIdRegExp.exec(inputParameters)[0].replace('f=', '') - 1;

        workingObj = JSON.parse(localStorage.getItem(id));
        drawTextField('fileContent', workingObj.attachedFiles[fileId].content);

        document.getElementById('selectSourceFile').addEventListener('change', handleSelectionFile);
        document.getElementById('downloadBtn').addEventListener('click', handleDownloadFile);
    } catch(e){
        console.log(e);
        location.href = '404.html';
    }
})();
makeSelectorContent();


function makeSelectorContent(){
    var container,
        option,
        frag,
        value,
        id;
    container = document.getElementById('selectSourceFile');
    frag = document.createDocumentFragment();
    for (var key in workingObj.attachedFiles) {
        option = document.createElement('option');
        value = workingObj.attachedFiles[key].fileName;

        option.textContent = value;
       
        option.setAttribute('value', key);
        
        if (key == fileId) {
            option.setAttribute('selected', 'selected');
        }
        frag.appendChild(option);
    }
    container.appendChild(frag);
}

function handleSelectionFile() {
    var selected = document.getElementById('selectSourceFile').value;
    drawTextField('fileContent', workingObj.attachedFiles[selected].content);
    fileId = selected;
}

function handleDownloadFile(event) {
    event.preventDefault();
    var dataForDownload = workingObj.attachedFiles[fileId].content;
    window.open('data:text/csv;charset=utf-8,' + encodeURI(dataForDownload));
}

