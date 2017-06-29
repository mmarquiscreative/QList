var queueController = (function() {
    function QItem (num, type, memb, task, status, due){
        this.num = num;
        this.type = type;
        this.memb = memb;
        this.task = task;
        this.status = status;
        this.due = due;
    };
    
    var inputValues = {
        num: '#taskNumValue',
        type: '#typeNameValue',
        memb: '#memberValue',
        task: '#taskNameValue',
        status: '#statusValue',
        due: "#datepicker"
    };
    
    var statValueOptions = {
        normal: 'Normal',
        hot: 'HOT',
        rush: 'RUSH'
    }
    
    var queue = {
        list: []
    }
    
    return {
        inputValues: inputValues,
        statValueOptions: statValueOptions,
        queueObj: queue,
        // 1. Get input from fields
        getInput: function(){

            var num, type, memb, task, status, due;
            
            num = document.querySelector(inputValues.num).value;
            type = document.querySelector(inputValues.type).value;
            memb = document.querySelector(inputValues.memb).value;
            task = document.querySelector(inputValues.task).value;
            status = document.querySelector(inputValues.status).value;
            due = document.querySelector(inputValues.due).value;
                                    
            // Create new QItem object with input from HTML
            var newQItem = new QItem(num, type, memb, task, status, due);
            
            // Add newQItem obj to end of the queue.list array
            queue.list.push(newQItem);
            
            return newQItem;
        },
        
    }
})();

var UIController = (function() {
    var currentValue;
    var DOMstrings = {
        submitEntry: '.submitEntry',
        resetBtn: '#reset',
        queueContainer: '#queueContainer',
        inputFields: '.inputField',
        completeTd: 'complete',
        copyTd: 'copy',
        tempTaskNumID: "#tempTaskNum",
        tempJobTypeID: "#tempJobType",
        tempMemberNameID: "#tempMemberName",
        tempTaskNameID: "#tempTaskName",
        tempStatusID: "#tempStatus",
        tempDueDateID: "#tempDueDate",
        taskNumTd: 'taskNumTD',
        jobTypeTd: 'jobTypeTD',
        memberNameTd: 'memberNameTD',
        taskNameTd: 'taskNameTD',
        statusTd: 'statusTD',
        dueDateTd: 'dueDateTD', 
        alertBox: '.alertBox',
        alertBoxTxt: '#alertBoxTxt',
        hiddenClass: 'hidden'
    };
    
    var TDInputStrings = {
        taskNumInput: ['<td class="taskNum"><input class="tempTextInput" id="tempTaskNum" inputField" type="tel" size="5" maxLength="5" name="taskNum"  value="', '"/></td>'],
        jobTypeInput: ['<td class="jobTypeTD"><input class="tempTextInput" id="tempJobType" inputField" type="text" value="', '"/></td>'],
        memberNameInput: ['<td class="memberNameTD"><input class="tempTextInput" id="tempMemberName" inputField" type="text" value="', '"/></td>'],
        taskNameInput: ['<td class="taskNameTD"><input class="tempTextInput" id="tempTaskName" inputField" type="text" value="', '"/></td>'],
        statusInput: ['<td class="statusTD"><input class="tempTextInput" id="tempStatus" inputField" type="text" value="', '"/></td>'],
        dueDateInput: ['<td class="dueDateTD"><input class="tempTextInput" id="tempDueDate" inputField" type="text" value="', '"/></td>']
    };
    
    var copyCounter = {
        // row id: an array;
    }
    
    var tdObjects = {
        taskNumObj: {
            TDInput1: TDInputStrings.taskNumInput[0],
            TDInput2: TDInputStrings.taskNumInput[1],
            tempElementID: DOMstrings.tempTaskNumID,
            elementID: DOMstrings.taskNumTd,
            childNodeSlot: 1},
        jobTypeObj: {
            TDInput1: TDInputStrings.jobTypeInput[0],
            TDInput2: TDInputStrings.jobTypeInput[1],
            tempElementID: DOMstrings.tempJobTypeID,
            elementID: DOMstrings.jobTypeTd,
            childNodeSlot: 2},
    memberNameObj: {
            TDInput1: TDInputStrings.memberNameInput[0],
            TDInput2: TDInputStrings.memberNameInput[1],
            tempElementID: DOMstrings.tempMemberNameID,
            elementID: DOMstrings.memberNameTd,
            childNodeSlot: 3},
    taskNameObj: {
            TDInput1: TDInputStrings.taskNameInput[0],
            TDInput2: TDInputStrings.taskNameInput[1],
            tempElementID: DOMstrings.tempTaskNameID,
            elementID: DOMstrings.taskNameTd,
            childNodeSlot: 4},
    statusObj: {
            TDInput1: TDInputStrings.statusInput[0],
            TDInput2: TDInputStrings.statusInput[1],
            tempElementID: DOMstrings.tempStatusID,
            elementID: DOMstrings.statusTd,
            childNodeSlot: 5},
    dueDateObj: {
            TDInput1: TDInputStrings.dueDateInput[0],
            TDInput2: TDInputStrings.dueDateInput[1],
            tempElementID: DOMstrings.tempDueDateID,
            elementID: DOMstrings.dueDateTd,
            childNodeSlot: 6}
    }
     
    function setVal(target, value){
            document.querySelector(target).value = value;
    };
    
    function toggleHidden(target){
        console.log(document.querySelector(target).classList);
document.querySelector(target).classList.toggle(DOMstrings.hiddenClass);
    }
    
    function queueAlert(alertTxt){
    document.querySelector(DOMstrings.alertBoxTxt).innerHTML = alertTxt;
        toggleHidden(DOMstrings.alertBox);
    }
    
        return {
            queueAlert: queueAlert,
            DOMstrings: DOMstrings,
            TDInputStrings: TDInputStrings,
            tdObjects: tdObjects,
            copyCounter: copyCounter,
            addListItem: function(obj){

                var html, newHtml, element;
                 
               
                html = '<tr id="%%task%%" class="%%status%%"><td class="dragHandle">&#9776</td><td class="taskNumTD">%%num%%</td><td class="jobTypeTD">%%jobType%%</td><td class="memberNameTD">%%member%%</td><td class="taskNameTD">%%taskName%%</td><td class="statusTD">%%status%%</td><td class="dueDateTD">%%date%%</td><td class="endIcons"><span class="copy">&#10064</span> <span class="complete">&#10005</span></td></tr>';
                
                element = DOMstrings.queueContainer;

                newHtml = html.replace('%%task%%', 'task__' + obj.num);
                
                // run the below num replace twice for both places in html
                newHtml = newHtml.replace('%%num%%', obj.num);
                newHtml = newHtml.replace('%%num%%', obj.num);
                newHtml = newHtml.replace('%%jobType%%', obj.type);
                newHtml = newHtml.replace('%%member%%', obj.memb);
                newHtml = newHtml.replace('%%taskName%%', obj.task);
                
                // run the below status replace twice for both places in html
                newHtml = newHtml.replace('%%status%%', obj.status);
                newHtml = newHtml.replace('%%status%%', obj.status);
                newHtml = newHtml.replace('%%date%%', obj.due);

               if (obj.status === 'HOT' || obj.status === "RUSH"){
                   document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml);
               } else if (obj.status === 'Normal'){
                   document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
                    } else {
                        alert('No such status. Please select a status of Normal, HOT, or RUSH.')
                    }
            },
            
        setVal: setVal,

        clearFields: function(obj, target, value) {
            console.log(obj);
            if (obj.status === 'HOT' || obj.status === 'RUSH' || obj.status === 'Normal'){
            var fields, fieldsArr;
            console.log('running clearFields');
            console.log(document.querySelectorAll(DOMstrings.inputFields));
            fields = document.querySelectorAll(DOMstrings.inputFields);
            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
                setVal(target, value);
            } else {
                console.log('did not finish clearFields: status not correct');
            }

        },
        
        setDisabledBtn: function(btnID, boolVal){
           document.querySelector(btnID).disabled = boolVal;
        }
        
        
    }
})();

var AppController = (function(qCtrl, UICtrl) {
    function addNewItem(){
        // 1. Get input, add to obj
        var newItem = qCtrl.getInput();
        
        // 2. Add input to queue
        UICtrl.addListItem(newItem);
        
        // re-run drag and drop to include new list
        dragndrop(newItem);
        
        // reset fields
        UICtrl.clearFields(newItem, qCtrl.inputValues.status, qCtrl.statValueOptions.normal);
        
        // remove disabled from reset button if a new task has been added
        if (newItem.status === 'HOT' || newItem.status === 'RUSH' || newItem.status === 'Normal'){
            UICtrl.setDisabledBtn(UICtrl.DOMstrings.resetBtn, false);
        }
        
        refreshListeners();
        
        // check for duplicates
        checkForDuplicates(newItem.num)
    };
    
    /* var obj = {
            "results": [
              {
                  "id": "460",
                  "name": "Widget 1",
                  "loc": "Shed"
              }, {
                  "id": "461",
                  "name": "Widget 2",
                  "loc": "Kitchen"
              }, {
                  "id": "462",
                  "name": "Widget 3",
                  "loc": "bath"
              }
            ]
            };


        function removeFunction (myObjects,prop,valu)
        {
             return myObjects.filter(function (val) {
              return val[prop] !== valu;
          });

        }
        
    function removeFromArray (myObjects,prop,valu)
        {
             return myObjects.filter(function (val) {
              return val[prop] !== valu;
          });

        }
*/
    
    function removeQItem(){
                console.log('running removeQItem');
                this.parentNode.parentNode.outerHTML='';
                checkForDuplicates(qCtrl.queueObj.list[0].num);
                removeFromArray (qCtrl.queueObj.list, 'num', this.parentNode.parentNode.id);
    }
    
    //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////
    // %% Under Construction %%
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    
    
    
    function copyQItem(){
            var currentRow, currentRowId, rowIdName, originalRow, originalHtml, originalId, newHtml, currentHTML, newHTML, newID, copyCounterName, totalHtml;
        console.log('running copyQItem');
        currentRow = this.parentNode.parentNode;
        currentRowId = currentRow.id;
        rowIdName = currentRowId.split('__');
        
        console.log();
        
        if (!(UICtrl.copyCounter[rowIdName[1]] > 0)) {
        UICtrl.copyCounter[rowIdName[1]] = 1;
            
        currentRow.id = currentRow.id;
        originalHtml = currentRow.outerHTML;
        console.log(originalHtml);
        
        currentRow.id = currentRow.id + '__' + UICtrl.copyCounter[rowIdName[1]].toString();
        newHtml = currentRow.outerHTML;
        console.log(newHtml);
        
        totalHtml = newHtml + originalHtml;
            
        currentRow.outerHTML = totalHtml;
        console.log(totalHtml);
            
        } else if (UICtrl.copyCounter[rowIdName[1]] >= 0){
            console.log('copyQItem else if started');
            console.log(rowIdName);
            console.log(rowIdName[2]);
            UICtrl.copyCounter[rowIdName[1]] = (parseInt(rowIdName[2]) + 1);
            console.log(UICtrl.copyCounter[rowIdName[1]]);
            
            currentRow.id = currentRow.id;
            originalHtml = currentRow.outerHTML;
            console.log(originalHtml);
        
            currentRow.id = rowIdName[0] + '__' + rowIdName[1] + '__' + UICtrl.copyCounter[rowIdName[1]];
            newHtml = currentRow.outerHTML;
            console.log(newHtml);
        
            totalHtml = newHtml + originalHtml;
            
            currentRow.outerHTML = totalHtml;
            console.log(totalHtml);
            
        } else {
            console.log('adding copy id did not work. current id is ' + currentRow.id)
            
        console.log(UICtrl.copyCounter[rowIdName[1]]);
        };
        console.log(currentRow.id);
        dragndrop();
        setEventListeners();
    }

    
    
    //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////
    
    
    
    function editValue(){
        var rowID, initHTML, switchResult, newValue; 
        
        // get ID of row
        currentValue = this.textContent;
        rowID = "#" + this.parentNode.id;
        
        // save current element HTML
        initHTML = this.outerHTML;
        
        // return the right tdObject for the td clicked on
        switch (this.className){
                case UICtrl.DOMstrings.taskNumTd:
                    console.log('taskNum it is!');
                    switchResult = UICtrl.tdObjects.taskNumObj;
                    break;
                case UICtrl.DOMstrings.jobTypeTd:
                    console.log('jobType it is!');
                    switchResult = UICtrl.tdObjects.jobTypeObj;
                    break;
                case UICtrl.DOMstrings.memberNameTd:
                    console.log('memberName it is!');
                    switchResult = UICtrl.tdObjects.memberNameObj;
                    break;
                case UICtrl.DOMstrings.taskNameTd:
                    console.log('taskName it is!');
                    switchResult = UICtrl.tdObjects.taskNameObj;
                    break;
                case UICtrl.DOMstrings.statusTd:
                    console.log('status it is!');
                    switchResult = UICtrl.tdObjects.statusObj;
                    break;
                case UICtrl.DOMstrings.dueDateTd:
                    console.log('dueDate it is!');
                    switchResult = UICtrl.tdObjects.dueDateObj;
                    break;
                default:
                    console.log('could not find a match for this.className');
                };
        
        // change the td's HTML to the matching input HTML saved in the tdObject
         this.outerHTML = switchResult.TDInput1 + currentValue + switchResult.TDInput2;
       // add an event listener for the enter key
        document.querySelector(switchResult.tempElementID).addEventListener('keypress', function(e){
                    var key = e.which || e.keyCode;
            
            // if enter is pressed
            if (key === 13){
                    
                // save input from text field
                var newValue = this.value;
                    console.log(newValue);
                // return td to initial HTML
                this.parentNode.outerHTML = initHTML;         
                console.log(initHTML);
               // update the td.textContent with new value
                document.querySelector(rowID).childNodes[switchResult.childNodeSlot].textContent = newValue;
                    refreshListeners();
                    };
                });
    
    };
        
    

    function checkForDuplicates(inputObjNum){
        // check inputObj.num against all other inputObj.num in the queue list
        var counter, counterList;
        counter = 0;
        counterList = 0;

        qCtrl.queueObj.list.forEach(function(cur){

            if (inputObjNum === cur.num) {
               if (counter < 1){
                    counter++;
                    counterList++;
                    console.log('duplicate detected: counter = ' + counter);
                    console.log('duplicate detected: counterList = ' + counterList);

               } else if (counter >= 1){
                   console.log('duplicate detected: adding class ');
                   counterList++;
                   document.querySelector(UICtrl.DOMstrings.alertBox).classList.remove(UICtrl.DOMstrings.hiddenClass);
                    counter = 0

               }
            } else {
                console.log('no duplicates detected');
                
            };
        });
            if (counterList < 1){
                document.querySelector(UICtrl.DOMstrings.alertBox).classList.add(UICtrl.DOMstrings.hiddenClass);
            };
    }
    
    function resetQueue() {
        console.log('started reset queue')
        document.querySelector(UICtrl.DOMstrings.queueContainer).innerHTML="";
        
        UICtrl.setDisabledBtn(UICtrl.DOMstrings.resetBtn, true);
        document.querySelector(UICtrl.DOMstrings.alertBox).classList.add(UICtrl.DOMstrings.hiddenClass);
    };
    
    function addListenerToAllClass(className, classFunction){
        var classArray;
        classArray = document.getElementsByClassName(className);

        for (var i = 0; i < classArray.length; i++){
            classArray[i].addEventListener('click', classFunction);
        };
    };
    
    function refreshListeners(){
        setEventListeners();
    }
    
    function setEventListeners() {
         document.querySelector(UICtrl.DOMstrings.submitEntry).addEventListener('click', addNewItem);
        document.querySelector(UICtrl.DOMstrings.resetBtn).addEventListener('click', resetQueue);
        
        addListenerToAllClass(UICtrl.DOMstrings.completeTd, removeQItem);
        addListenerToAllClass(UICtrl.DOMstrings.copyTd, copyQItem);
        addListenerToAllClass(UICtrl.DOMstrings.taskNumTd, editValue);
        addListenerToAllClass(UICtrl.DOMstrings.jobTypeTd, editValue);
        addListenerToAllClass(UICtrl.DOMstrings.memberNameTd, editValue);
        addListenerToAllClass(UICtrl.DOMstrings.taskNameTd, editValue);
        addListenerToAllClass(UICtrl.DOMstrings.statusTd, editValue);
        addListenerToAllClass(UICtrl.DOMstrings.dueDateTd, editValue);
    };
    
    
function dragndrop(obj) {
    function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

$(document).ready(function() {

	
	// Initialise the second table specifying a dragClass and an onDrop function that will display an alert
	$("#queueList1").tableDnD({
		onDragClass: 'drag',
		onDrop: function(table, row) {
			var rows = table.tBodies[0].rows;
			var debugStr = "Row dropped was "+row.id+". New order: ";
			for (var i=0; i<rows.length; i++) {
				debugStr += rows[i].id+" ";
			}
			$(table).parent().find('.result').text(debugStr);
            console.log(row.attr);
		},
		onDragStart: function(table, row) {
			$(table).parent().find('.result').text("Started dragging row "+row.id);
		}
	});
});}
    return {
        checkForDuplicates: checkForDuplicates,
        
    init: function(){
        setEventListeners();
        dragndrop();
        UICtrl.setVal(qCtrl.inputValues.status, qCtrl.statValueOptions.normal);
        
        
        
    }}
})(queueController, UIController);

AppController.init();

