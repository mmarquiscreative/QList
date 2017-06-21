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
    var DOMstrings = {
        submitEntry: '.submitEntry',
        resetBtn: '#reset',
        queueContainer: '#queueContainer',
        inputFields: '.inputField',
        completeTd: 'complete'
    };
    
    function setVal(target, value){
            document.querySelector(target).value = value;
    };
        return {
            DOMstrings: DOMstrings,
            addListItem: function(obj){

                var html, newHtml, element;
                 
               
                html = '<tr id="%%task%%" class="%%status%%"><td>&#9776</td><td>%%num%%</td><td>%%jobType%%</td><td>%%member%%</td><td>%%taskName%%</td><td>%%status%%</td><td>%%date%%</td><td class="complete">&#10005</td></tr>';

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
        },
        
        
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
    };
    
    function removeQItem(){
                console.log('running removeQItem');
                this.parentNode.outerHTML='';
    }
    
    function resetQueue() {
        console.log('started reset queue')
        document.querySelector(UICtrl.DOMstrings.queueContainer).innerHTML="";
        
        UICtrl.setDisabledBtn(UICtrl.DOMstrings.resetBtn, true);
    };
    
    function addListenerToAllClass(className){
        var classArray;
        classArray = document.getElementsByClassName(className);
                console.log(classArray);

        for (var i = 0; i < classArray.length; i++){
            classArray[i].addEventListener('click', removeQItem);
        };
    };
    
    function refreshListeners(){
        setEventListeners();
    }
    
    function setEventListeners() {
         document.querySelector(UICtrl.DOMstrings.submitEntry).addEventListener('click', addNewItem);
        document.querySelector(UICtrl.DOMstrings.resetBtn).addEventListener('click', resetQueue);
        
        addListenerToAllClass(UICtrl.DOMstrings.completeTd);
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
    init: function(){
        setEventListeners();
        dragndrop();
        UICtrl.setVal(qCtrl.inputValues.status, qCtrl.statValueOptions.normal);
        
        
        
    }}
})(queueController, UIController);

AppController.init();

