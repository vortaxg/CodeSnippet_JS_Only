"use strict";

function getRandomId(minValue, maxValue) {
    var id = 0,
        min = minValue || 5,
        max = maxValue ||1000;
    do {
        id = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (idStorage.indexOf(id) >= 0)
    idStorage.push(id);
    return id;
}

function clearElementById(elementId) {
    try {
        var container = document.getElementById(elementId);
    } catch (e) {
          console.log(e.message)
    }
    while (container.childNodes[0]) {
        container.removeChild(container.childNodes[0]);
    }
}

function drawTextField(fieldId, fieldValue) {
    var container;
    container = document.getElementById(fieldId);
    if (fieldId === 'dateField') {
        fieldValue = moment(fieldValue).format('YYYY-MM-DD');
    }
    container.value = fieldValue;
}