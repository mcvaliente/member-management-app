export function checkEmail(email) {
    if (typeof email !== "undefined" && email !== '') 
    {    
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(email)) {
      
          return false;
        }
        return true;
      
    } else {
        return false;
    }
}

export function checkTextField(fieldValue){
    if (typeof fieldValue === undefined || fieldValue === ''){
        return false;
    }
    return true;
}

export function checkID(idValue){
    if (typeof idValue !== undefined && idValue !== ''){
        //Check that the field is NIF or NIE.
        var value = validateNIF(idValue);
        //console.log("Resultado DNI: " + value);
        if (value === 'UNKNOWN'){
             return false;
        }else {
            return true;
        }
    } else {
        return false;
    }
}

function validateNIF(nif) {
    //Only check NIF/NIE.
    nif = nif.toUpperCase().replace(/[_\W\s]+/g, '');
    if(/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
        var num = nif.match(/\d+/);
        num = (nif[0]!=='Z'? nif[0]!=='Y'? 0: 1: 2)+num;
        if(nif[8]==='TRWAGMYFPDXBNJZSQVHLCKE'[num%23]) {
            return /^\d/.test(nif)? 'NIF': 'NIE';
        }
    }
    return 'UNKNOWN';
}

export function checkDateField(fieldValue){
    if (typeof fieldValue !== undefined && fieldValue !== ''){
        //Check that the field is dd/mm/aaaa
        var isValid = isValidDate(fieldValue);
        if (!isValid){
            return false;
        }
        return true;
    } else {
        return false;
    }

}

//Expected input dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy
//We program it only for dd/mm/yyyy
function isValidDate(dateValue) {
    //First we check that we have 10 characters (dd/mm/yyyy)
    if (dateValue.length !== 10){
        return false;
    } else {
        //var separators = ['\\.', '\\-', '\\/'];
        var separators = ['\\/'];
        var dateParts = dateValue.split(new RegExp(separators.join('|'), 'g'));
        //console.log("DateParts[0]: " + dateParts[0]);
        //console.log("DateParts[1]: " + dateParts[1]);
        //console.log("DateParts[2]: " + dateParts[2]);
        var inputDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        //console.log("Input Date: " + inputDate);
        var dateMonth = parseInt(inputDate.getMonth()) + 1;
        //console.log("dateMonth: " + dateMonth);
        //console.log("fullYear: " + inputDate.getFullYear());
        var strDateMonth =dateMonth.toString();
        var strZero = "0";
        return inputDate.getFullYear().toString() === dateParts[2] && (strDateMonth === dateParts[1] || strZero.concat(strDateMonth) === dateParts[1]) ;
    }
} 

export function greaterThanCurrentDate(dateValue){
    //dateValue with the format dd/mm/aaaa
    var separators = ['\\/'];
    var dateParts = dateValue.split(new RegExp(separators.join('|'), 'g'));
    var inputDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    var currentDate = new Date();
    if (inputDate > currentDate){
        return false;
    } else{
        return true;
    }

}

export function checkListField(fieldValue){
    //Check that at least the list contains one element.
    if (typeof fieldValue === undefined || fieldValue.length === 0){
         return false;
    } else {
        return true;
    }

}
