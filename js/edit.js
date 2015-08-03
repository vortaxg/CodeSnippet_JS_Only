"use strict";

var id,
    idStorage = [],
    workingObj;

(function () {
    id = window.location.search.slice(4);
    if (id in localStorage) {
        workingObj = JSON.parse(localStorage.getItem(id));
    } else {
        location.href = '404.html';
    }
    drawInputData(workingObj);
})();


function drawInputData(obj) {
    drawTextField('snippetNameField', obj.snippetName);
    drawTextField('descriptionField', obj.description);
    drawTextField('authorField', obj.authorName);
    drawTextField('dateField', obj.creatingDate);
    drawFileDescriptionTable();
}

function drawFileDescriptionTable() {
    clearElementById('upload-files-data-output');
    var container,
     lastModifiedDate,
     internalData,
     length,
    link,
    destination,
    btnEdit,
    btnDestroy,
     id;

    container = document.getElementById('upload-files-data-output');
    internalData = workingObj.attachedFiles;
    length = internalData.length;
    id = length;

    for (var i = length - 1; i >= 0; i--) {
        container.insertRow(0);
        container.rows[0].insertCell(0);
        container.rows[0].cells[0].appendChild(document.createTextNode(id));

        link = document.createElement('a');
        link.textContent = internalData[i].fileName;

        destination = 'view.html?id=' + workingObj.id + "&f=" + id;
        link.setAttribute('href', destination);
        container.rows[0].insertCell(1);
        container.rows[0].cells[1].appendChild(link);

        lastModifiedDate = moment(internalData[i].creationDate).format('DD/MM/YYYY hh:mm');

        container.rows[0].insertCell(2);
        container.rows[0].cells[2].appendChild(document.createTextNode(lastModifiedDate));

        btnEdit = document.createElement('button');
        btnEdit.classList.add('btn', 'btn-default');
        btnEdit.setAttribute('value', id);
        btnEdit.appendChild(document.createTextNode('Edit'));


        btnDestroy = document.createElement('button');

        btnDestroy.classList.add('btn', 'btn-danger');
        btnDestroy.setAttribute('value', id);
        btnDestroy.appendChild(document.createTextNode('Destroy'));

        container.rows[0].insertCell(3);
        container.rows[0].cells[3].appendChild(btnEdit);
        container.rows[0].cells[3].appendChild(btnDestroy);
        id--;

    }
    handles();
}

function handleDestroyFile(event) {
    var target,
        deleteElementPosition;
    target = event.target.value;
    if (target > 0) {
        deleteElementPosition = target - 1;
        workingObj.attachedFiles.splice(deleteElementPosition, 1);
        drawFileDescriptionTable();
    }
};

function handleEditFile(event) {
    var target,
        destination;
    target = event.target.value;
    destination = 'view.html?id=' + id + "&f=" + target;
    location.href = destination;
};


function handles() {
    try {
        document.getElementById('saveSnippetBtn').addEventListener('click', handleSaveSnippet);
        document.getElementById('cancelSnippetBtn').addEventListener('click', handleCancelSnippet);
        document.getElementById('snippetNameField').addEventListener('blur', handleChangeSnippetNameField);
        document.getElementById('descriptionField').addEventListener('blur', handleDescriptionField);
        document.getElementById('upload-file').addEventListener('change', pullfiles);
        document.querySelector('.btn-danger').addEventListener('click', handleDestroyFile);
        document.querySelector('.btn-default').addEventListener('click', handleEditFile);
    } catch (e) {
        console.error(e.message);
    }
}

function handleSaveSnippet() {
    var sObj;
    sObj = JSON.stringify(workingObj);
    delete localStorage[id];
    localStorage.setItem(id, sObj);
    location.href = 'index.html';
}

function handleCancelSnippet() {
    location.href = 'index.html';
}

function handleChangeSnippetNameField(event) {
    workingObj.snippetName = event.target.value;
}

function handleDescriptionField(event) {
    workingObj.description = event.target.value;
}

function pullfiles(opt_startByte, opt_stopByte) {

    var file,
    start,
    stop,
    reader,
    fileDescriptionObj,
    id,
    blob;

    file = document.getElementById('upload-file').files[0];
    start = 0;
    stop = file.size - 1;
    reader = new FileReader();
    fileDescriptionObj = {};
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            id = getRandomId(1, 9);
            fileDescriptionObj = {
                'id': id,
                'fileName': file.name,
                'creationDate': file.lastModifiedDate,
                'content': evt.target.result
            }
            workingObj.attachedFiles.push(fileDescriptionObj);
            drawFileDescriptionTable();
        }
    };
    blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}
