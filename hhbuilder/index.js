let householdList = [];

window.onload = function() {
  const form = document.querySelector("form");
  form.setAttribute("id", "form")

  const relationshipSelector = form.querySelector("select[name=rel]");
  relationshipSelector.addEventListener('change', checkRelationship, false);

  const ageInput = document.querySelector("input[name=age]");
  ageInput.addEventListener('change', checkAge, false);
  
  //set age input border after form reset
  ageInput.style.border = "1px solid rgb(238, 238, 238)";

  const addButton = document.querySelector("button[class=add]")
  addButton.addEventListener('click', createMemberObject, false);

  let submitBtn = document.querySelector("button[type=submit]");
  submitBtn.addEventListener('click', handleSubmit, false);

  buildTable();
}

/**
 * ensure that age input is filled, valid and above zero
 */
function checkAge() {
  const ageInput = document.querySelector("input[name=age]");
  const age = Number(ageInput.value);
  const errorType = "ageError"
  let errorText = null;

  if (isNaN(age)) {
    errorText = "Age must be a number";
  } else if (!age) {
    errorText = "Age field is required";
  } else if (age <= 0) {
    errorText = "Age must be greater than zero";
  }

  if (errorText) {
    addError(ageInput, errorText, errorType);
    return false;
  } else if (document.getElementById(errorType)) {
    removeError(ageInput, errorType)
    return true;
  }
}

/**
 * ensure that relationship option is selected
 */
function checkRelationship() {
  const relationshipSelector = document.querySelector("select[name=rel]");
  const relationship = relationshipSelector.value;
  const errorType = "relationshipError"

  let errorText = relationship === "" ? "Please select a relationship" : null;

  if (errorText) { 
    addError(relationshipSelector, errorText, errorType);
    return false; 
  } else if (document.getElementById(errorType)) {
    removeError(relationshipSelector, errorType)
    return true;
  }
}

/**
 * add error message and red border around invalid form element
 */
function addError(input, error, errorType) {
  input.style.border = "2px red dashed";

  const errorText = document.createElement("span");
  errorText.id = errorType;
  errorText.innerHTML = error;
  errorText.style.color = "red";

  input.parentNode.appendChild(errorText);
}

/**
 * remove error once form element is valid
 */
function removeError(input, errorType) {
  input.style.border = "none";
  const error = document.getElementById(errorType)

  input.parentNode.removeChild(error);
}

/**
 * build household member data object and push to householdList
 */
function createMemberObject(e) {
  e.preventDefault();
  const newMember = {};
  const info = document.querySelector("form").elements;

  for (var i = 0; i < info.length; i++) {
    if (info[i].tagName !== "BUTTON") {
      if (info[i].name === "smoker") {
        newMember[info[i].name] = info[i].checked
      } else {
      newMember[info[i].name] = info[i].value;
      }
    }
  }
  newMember.id = newMember.age + newMember.rel + newMember.smoker;
  householdList.push(newMember);

  form.reset();
  populateTable(newMember);
  return newMember;
}

/**
 * build new table element
 */
function buildTable() {
  const table = document.createElement("table");
  const tHead = document.createElement("thead");
  const hRow = document.createElement("tr");

  const headers = ["AGE", "RELATIONSHIP", "SMOKER"];
  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement("th");
    th.style.padding = "10px";
    th.innerHTML = headers[i];
    hRow.appendChild(th);
  }

  tHead.appendChild(hRow);
  table.appendChild(tHead);
  var tBody = document.createElement("tbody");
  table.appendChild(tBody);
  document.querySelector("body").appendChild(table);
}

/**
 * clear table content and repopulate when member is edited
 */
function clearTable() {
  let old_tbody = document.querySelector("tbody");
  var new_tbody = document.createElement('tbody');
  old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
}

/**
 * populate table data from householdList
 */
function populateTable() {
  clearTable();
  let tbody = document.querySelector("tbody");

  for (var i = 0; i < householdList.length; i++) {
    let household = householdList[i];
    let bRow = document.createElement("tr");
    bRow.id = householdList[i].id;
    
    for (var key in household) {
      if (key !== "id") {
        let td = document.createElement("td");
        td.header = key;
        td.contentEditable = "true";
        td.align = "center";
        td.innerHTML = household[key];
        td.onkeyup = function() {
            let id = td.parentNode.id;
            let header = td.header;
            let input = td.innerText;
            let index; 

            for (var i = 0; i < householdList.length; i++) {
              member = householdList[i]
              if (member.id === id) {
                member[header] = input;
                index = i;
              }
            }
          }
        bRow.appendChild(td);
      }
    }
    let removeBtn = createRemoveButton();
    bRow.appendChild(removeBtn);
    tbody.appendChild(bRow);
  }
}

/**
 * build remove button for new list item
 */
function createRemoveButton() {
  let removeBtn = document.createElement("button");
  removeBtn.id = "remove-button";
  removeBtn.innerHTML = "X";
  removeBtn.setAttribute("style", "float: right; margin: 10px; textAlign: center")
  removeBtn.addEventListener('click', removeMember, false);

  return removeBtn;
}

/**
 * retrieve index of household member
 * used by removeMember and editMember functions
 */
function findMember(id) {
  for (var i = 0; i < householdList.length; i++) {
    for (var key in householdList[i]) {
      if (key === id) {
        return i;
      }
    }
  }
}

/**
 * remove member from household list
 */
function removeMember(e) {
  let memberId = e.target.parentNode.id;
  let memberIndex = findMember(memberId);

  householdList.splice(memberIndex, 1);
  populateTable();
}

/**
 * display data in "debug" section on submit
 */
function handleSubmit(e) {
  e.preventDefault();
  householdList = JSON.stringify(householdList);
  let displayContainer = document.querySelector("pre");
  displayContainer.innerHTML = householdList;
  displayContainer.style.display = "block";
}