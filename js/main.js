"use strict";

/// <reference path="jquery-2.1.4.min.js" />

var snippetStorage = [],
    workingSnippetStorage = [],
    idStorage = [],
    output = [],
    currentCategory = 'MVC',
    quantityPages = 0,
    switchStateAuthor = '',
    switchStateName = '',
    switchStateDate = '',
    currentTableSize = 10,  //output filter size
    currentPage = 1;


addItemsToLocalStorage();
createTempStorrage(currentCategory);
calcQuantityPages();
outputALL(1);
controlActivity();
toggleActiveButton();

//===========Local Data Storage=================

function Snippet(item) {
    this.id = getRandomId(5,1000);
    this.categoryId = item.categoryId;
    this.categoryName = item.categoryName;
    this.description = item.description;
    this.authorId = item.authorId;
    this.authorName = item.authorName;
    this.creatingDate = item.creatingDate;
    this.snippetId = item.snippetId;
    this.snippetName = item.snippetName;
    this.snippetContent = item.snippetContent;
    this.attachedFiles = item.attachedFiles;
}

function addItemsToLocalStorage() {
    var tempObj,
        sObj;
    
    var condition = localStorage.getItem(0) === 'data is loaded';
    if (!condition) {
        localStorage.clear();
    for (var i = 0, l = items.length; i < l; i++) {
        tempObj = new Snippet(items[i]);
        sObj = JSON.stringify(tempObj);
        localStorage.setItem(0, 'data is loaded');
        localStorage.setItem(tempObj.id, sObj);
    }
    }
}

function createTempStorrage(categoryName) {
    var tempObj;
    workingSnippetStorage.length = 0;
    for (var key in localStorage) {
        if (key > 5) { 
        tempObj = JSON.parse(localStorage[key]);
        if (tempObj.categoryName == categoryName) {
            workingSnippetStorage.push(tempObj);

        }
        }
    }
}


/*function drawTable(i) {
    var tbody = document.getElementById('output'),
        cell = document.createElement('td'),
        link = document.createElement('a'),
        linkDestination = 'edit.html' + '?id=' + workingSnippetStorage[i].id,
        customDate = moment(workingSnippetStorage[i].creatingDate).format('DD.MM.YYYY hh:mm');

    tbody.insertRow(0);
    tbody.rows[0].insertCell(0);
    tbody.rows[0].cells[0].appendChild(link);

    link.setAttribute('href', linkDestination);
    link.textContent = workingSnippetStorage[i].snippetName;

    tbody.rows[0].insertCell(1);
    tbody.rows[0].cells[1].appendChild(document.createTextNode(workingSnippetStorage[i].description));

    tbody.rows[0].insertCell(2);
    tbody.rows[0].cells[2].appendChild(document.createTextNode(workingSnippetStorage[i].authorName));

    tbody.rows[0].insertCell(3);
    tbody.rows[0].cells[3].appendChild(document.createTextNode(customDate));


}*/
function drawTable(i) {
    var container = document.getElementById('output'),
        row = document.createElement('tr');

    container.appendChild(row);

    var cell = document.createElement('td'),
        link = document.createElement('a'),
        linkDestination;

    linkDestination = 'edit.html' + '?id=' + workingSnippetStorage[i].id;
    link.setAttribute('href', linkDestination);
    link.textContent = workingSnippetStorage[i].snippetName;
    row.appendChild(cell);
    cell.appendChild(link);

    cell = document.createElement('td');
    cell.textContent = workingSnippetStorage[i].description;
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = workingSnippetStorage[i].authorName;
    row.appendChild(cell);

    cell = document.createElement('td');
    var customDate = moment(workingSnippetStorage[i].creatingDate).format('DD.MM.YYYY hh:mm');
    cell.textContent = customDate;
    row.appendChild(cell);
}

function drawPagination(startPage) {
    clearElementById('pagination');
    calcQuantityPages();
    drawPagerButton('pagePrevious', 'Previous', 'disabled');
    drawPaginationBody(startPage, 'pagination');
    drawPagerButton('pageNext', 'Next', 'disabled');
    addHandlers();
    controlActivity();
    toggleActiveButton();
}

//accepts id - id of created element, textContext - text inside element, someSwitch - class
function drawPagerButton(id, textContext, someSwitch) {
    var container = document.getElementById('pagination'),
        page = document.createElement('li'),
        wrap = document.createElement('span'),
        link = document.createElement('a');

    wrap.textContent = textContext;
    wrap.setAttribute('aria-hidden', 'true');

    link.setAttribute('href', '#');
    link.setAttribute('aria-label', textContext);

    page.setAttribute('id', id);

    if (!!someSwitch) {
        page.setAttribute('class', someSwitch);
    }
    container.appendChild(page);
    page.appendChild(link);
    link.appendChild(wrap);
}
function drawPaginationBody(startPage, idToSearch) {
    var container = document.getElementById(idToSearch),
        frag = document.createDocumentFragment();
    if (!startPage || startPage <= 5) {
        startPage = 1;
    } else if (startPage > 5) {
        var temp = 0;
        if (startPage % 5 == 0) {
            temp = startPage % 5 + 1;
        } else {
            temp = startPage % 5 - 1;
        }
        startPage -= temp;
    }
    var inernalCounter = startPage;
    if (startPage > 1) {
        drawPagerButton('morePrevious', '<<<');
    }
    for (var i = 0; i < 5; i++) {
        var cell = document.createElement('li'),
            link = document.createElement('a');

        cell.setAttribute('value', inernalCounter);

        if (inernalCounter <= quantityPages) {
            cell.setAttribute('value', inernalCounter);
        } else {
            cell.classList.add('disabled');
            cell.removeAttribute('value');
        }
        link.textContent = inernalCounter;
        link.setAttribute('href', '#');
        frag.appendChild(cell);
        cell.appendChild(link);
        inernalCounter++;
    }
    container.appendChild(frag);
    if (quantityPages - 5 > startPage) {
            drawPagerButton('moreNext', '>>>');
    }
}

function outputALL(startPage) {
    clearElementById('output');
    var size,
        hz = 0,
        startPosition;

    startPage = !startPage ? 1 : startPage;
    size = currentTableSize || 10;
    startPosition = (startPage - 1) * currentTableSize || 0;

    for (var i = startPosition, l = workingSnippetStorage.length; i < l; i++) {
        if (size == hz) {
            break;
        }
        drawTable(i);
        hz++;
    }
    drawPagination(startPage);
}

function handleKeyPress(event) {
            if (event.keyCode == 13) {
                var searchText = document.getElementById('searchFilterField').value;
                if (searchText) {
                    workingSnippetStorage = search(searchText);
                    outputALL();
                } else {
                    createTempStorrage(currentCategory);
                    outputALL();
                }
                event.preventDefault();
            }
        }

function addHandlers() {
    try{
        goToByCategory('categoryMVC', 'MVC');
        goToByCategory('categoryC#', 'C#');
        goToByCategory('categoryJQuery', 'jQuery');
        goToByCategory('categoryJavascript', 'javascript');
        goToPreviousPage();
        goToNextPage();
        goToByPaginationButton();
        goToMorePages();
        reverseTableSnippetName();
        sortTableByKeyword();
        sortTableByName();
        sortTableByAuthor();
        sortTableByDate();
        changeOutputTabbleRows();
    } catch (e) {
        console.log(e.message);
    }
}


function goToByCategory(id, categoryName) {
    document.getElementById(id).onclick = function () {
        currentCategory = categoryName;
        createTempStorrage(currentCategory);
        currentPage = 1;
        outputALL(currentPage);
    }
};
function goToPreviousPage() {
    document.getElementById('pagePrevious').addEventListener("click", handlePressPrevious);
    function handlePressPrevious() {
        if (currentPage > 1) {
            currentPage--;
            outputALL(currentPage);
        }

    }
}
function goToNextPage() {
    document.getElementById('pageNext').addEventListener("click", handlePressNext);
    function handlePressNext() {
        if (quantityPages > currentPage) {
            currentPage++;
            outputALL(currentPage);
        }
    }
};
function goToByPaginationButton() {
    var container = document.querySelector('.pagination');
    container.addEventListener('click', handlePressPaginationButton);

};
function goToMorePages() {
    if (!!(document.getElementById('morePrevious'))) {
        document.getElementById('morePrevious').addEventListener("click", morePrevious);
        function morePrevious() {
            currentPage = 1;
            outputALL(currentPage);
            drawPagination(currentPage);
        }
    }
    if (!!(document.getElementById('moreNext'))) {
        document.getElementById('moreNext').addEventListener("click", moreNext);
        function moreNext() {
            currentPage = quantityPages;
            outputALL(currentPage);
        }
    }
}

function reverseTableSnippetName() {
    document.getElementById('snippetName').addEventListener('click', handleReverseSnippetName);
}
function sortTableByKeyword() {
    document.getElementById('searchFilterField').addEventListener('keydown', handleKeyPress);

}
function sortTableByName() {
    document.getElementById('sortByName').addEventListener('click', handleSortByName);

}
function sortTableByAuthor() {
    document.getElementById('sortByAuthor').addEventListener('click', handleSortByAuthor);

}
function sortTableByDate() {
    document.getElementById('sortByDate').addEventListener('click', handleSortByDate);

}
function changeOutputTabbleRows() {
    document.getElementById('view').addEventListener('change', handleChangeTabbleRows);
}

function toggleActiveButton() {
    var container = document.querySelector('.pagination'),
        navEl = container.querySelectorAll('li');

    for (var i = 0; i < navEl.length; i++) {
        if (navEl[i].value == currentPage) {
            navEl[i].classList.add('active');
        } else {
            navEl[i].classList.remove('active');
        }
    }
}
function controlActivity() {
    if (currentPage > 1) {
        setState('pagePrevious', 'enable');
    } else {
        setState('pagePrevious', 'disable');
    }
    if (currentPage == quantityPages) {
        setState('pageNext', 'disable');
    } else {
        setState('pageNext', 'enable');
    }
}
function setState(id, state) {
    var container = document.getElementById(id);
    if (state == 'disable') {
        container.classList.add('disabled');
    }
    if (state == 'enable') {
        container.classList.remove('disabled');
    }
}
function calcQuantityPages() {
    if (workingSnippetStorage.length % currentTableSize == 0) {
        quantityPages = Math.floor(workingSnippetStorage.length / currentTableSize);
    } else {
        quantityPages = Math.floor(workingSnippetStorage.length / currentTableSize) + 1;
    }
    return quantityPages;
}
function search(searchText) {
    var tempArr = [];
    for (var i = 0; i < workingSnippetStorage.length; i++) {
        var inputVar = workingSnippetStorage[i].snippetName.toLowerCase(),
            target = searchText.toLowerCase();

        if (inputVar.indexOf(target) >= 0) {
            tempArr.push(workingSnippetStorage[i]);
        }
    }
    return tempArr;
}
function sortByParam(param, a, b) {
     var nameA = a[param].toLowerCase(),
        nameB = b[param].toLowerCase();
     if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
     return 0;
}

function handleReverseSnippetName() {
    workingSnippetStorage.reverse();
    outputALL();
}
function handlePressPaginationButton(event) {
    var target = event.target.parentElement.getAttribute('value');
    if (target > 0) {
        currentPage = target;
        outputALL(currentPage);
    }
};
function handleSortByName() {
    if (switchStateName === 'off') {
        workingSnippetStorage.reverse();
        switchStateName = 'on';
    } else {
        workingSnippetStorage.sort(sortByParam.bind(null, 'snippetName'));
        switchStateName = 'off';
    }
    outputALL();
};
function handleSortByAuthor() {
    if (switchStateAuthor == 'on') {
        workingSnippetStorage.reverse();
        switchStateAuthor = 'off';
    } else {
        workingSnippetStorage.sort(sortByParam.bind(null, 'authorName'));
        switchStateAuthor = 'on';
    }
    outputALL();
};
function handleSortByDate() {
    if (switchStateDate == 'on') {
        workingSnippetStorage.reverse();
        switchStateDate = 'off';
    } else {
        workingSnippetStorage.sort(function (a, b) {
            var dateA = Date.parse(a.creatingDate),
                dateB = Date.parse(b.creatingDate)
            console.log(dateA + " " + dateB);
            return dateA - dateB;
        });
        switchStateDate = 'on';
    }
    outputALL();
};
function handleChangeTabbleRows() {
    currentTableSize = document.getElementById("view").value;
    outputALL();
};