/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, no-unused-vars */
// Zoho Form Validation Script

// Define potentially undefined functions
function zf_addDataToSalesIQ() {
  // This is a placeholder function that would be defined by Zoho SalesIQ integration
  // Since isSalesIQIntegrationEnabled is set to false, this won't be called
  return true;
}

function zf_MandatoryCheckSignature(fieldObj) {
  // This is a placeholder function for signature validation
  // It's called in zf_CheckMandatory but doesn't seem to be defined elsewhere
  return true;
}

function zf_ValidateAndSubmit() {
  if (zf_CheckMandatory()) {
    if (zf_ValidCheck()) {
      if (isSalesIQIntegrationEnabled) {
        zf_addDataToSalesIQ();
      }
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function zf_CheckMandatory() {
  for (var i = 0; i < zf_MandArray.length; i++) {
    var fieldObj = document.forms.form[zf_MandArray[i]];
    if (fieldObj) {
      if (fieldObj.nodeName != null) {
        if (fieldObj.nodeName == 'OBJECT') {
          if (!zf_MandatoryCheckSignature(fieldObj)) {
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
        } else if (fieldObj.value.replace(/^\s+|\s+$/g, '').length == 0) {
          if (fieldObj.type == 'file') {
            fieldObj.focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
          fieldObj.focus();
          zf_ShowErrorMsg(zf_MandArray[i]);
          return false;
        } else if (fieldObj.nodeName == 'SELECT') {
          if (fieldObj.options[fieldObj.selectedIndex].value == '-Select-') {
            fieldObj.focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
        } else if (fieldObj.type == 'checkbox' || fieldObj.type == 'radio') {
          if (fieldObj.checked == false) {
            fieldObj.focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
        }
      } else {
        var checkedValsCount = 0;
        var inpChoiceElems = fieldObj;
        for (var ii = 0; ii < inpChoiceElems.length; ii++) {
          if (inpChoiceElems[ii].checked === true) {
            checkedValsCount++;
          }
        }
        if (checkedValsCount == 0) {
          inpChoiceElems[0].focus();
          zf_ShowErrorMsg(zf_MandArray[i]);
          return false;
        }
      }
    }
  }
  return true;
}

function zf_ValidCheck() {
  var isValid = true;
  for (var ind = 0; ind < zf_FieldArray.length; ind++) {
    var fieldObj = document.forms.form[zf_FieldArray[ind]];
    if (fieldObj) {
      if (fieldObj.nodeName != null) {
        var checkType = fieldObj.getAttribute('checktype');
        if (checkType == 'c2') {
          if (!zf_ValidateNumber(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c3') {
          if (!zf_ValidateCurrency(fieldObj) || !zf_ValidateDecimalLength(fieldObj, 10)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c4') {
          if (!zf_ValidateDateFormat(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c5') {
          if (!zf_ValidateEmailID(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c6') {
          if (!zf_ValidateLiveUrl(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c7') {
          if (!zf_ValidatePhone(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        } else if (checkType == 'c8') {
          zf_ValidateSignature(fieldObj);
        } else if (checkType == 'c9') {
          if (!zf_ValidateMonthYearFormat(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
        }
      }
    }
  }
  return isValid;
}

function zf_ShowErrorMsg(uniqName) {
  var fldLinkName;
  for (var errInd = 0; errInd < zf_FieldArray.length; errInd++) {
    fldLinkName = zf_FieldArray[errInd].split('_')[0];
    document.getElementById(fldLinkName + '_error').style.display = 'none';
  }
  var linkName = uniqName.split('_')[0];
  document.getElementById(linkName + '_error').style.display = 'block';
}

function zf_ValidateNumber(elem) {
  var validChars = '-0123456789';
  var numValue = elem.value.replace(/^\s+|\s+$/g, '');
  if (numValue != null && !numValue == '') {
    var strChar;
    var result = true;
    if (numValue.charAt(0) == '-' && numValue.length == 1) {
      return false;
    }
    for (var i = 0; i < numValue.length && result == true; i++) {
      strChar = numValue.charAt(i);
      if (strChar == '-' && i != 0) {
        return false;
      }
      if (validChars.indexOf(strChar) == -1) {
        result = false;
      }
    }
    return result;
  } else {
    return true;
  }
}

function zf_ValidateDateFormat(inpElem) {
  var dateValue = inpElem.value.replace(/^\s+|\s+$/g, '');
  if (dateValue == '') {
    return true;
  } else {
    return zf_DateRegex.test(dateValue);
  }
}

function zf_ValidateCurrency(elem) {
  var validChars = '0123456789.';
  var numValue = elem.value.replace(/^\s+|\s+$/g, '');
  if (numValue.charAt(0) == '-') {
    numValue = numValue.substring(1, numValue.length);
  }
  if (numValue != null && !numValue == '') {
    var strChar;
    var result = true;
    for (var i = 0; i < numValue.length && result == true; i++) {
      strChar = numValue.charAt(i);
      if (validChars.indexOf(strChar) == -1) {
        result = false;
      }
    }
    return result;
  } else {
    return true;
  }
}

function zf_ValidateDecimalLength(elem, decimalLen) {
  var numValue = elem.value;
  if (numValue.indexOf('.') >= 0) {
    var decimalLength = numValue.substring(numValue.indexOf('.') + 1).length;
    if (decimalLength > decimalLen) {
      return false;
    } else {
      return true;
    }
  }
  return true;
}

function zf_ValidateEmailID(elem) {
  var check = 0;
  var emailValue = elem.value;
  if (emailValue != null && !emailValue == '') {
    var emailArray = emailValue.split(',');
    for (var i = 0; i < emailArray.length; i++) {
      var emailExp = /^[\w]([\w\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
      if (!emailExp.test(emailArray[i].replace(/^\s+|\s+$/g, ''))) {
        check = 1;
      }
    }
    if (check == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function zf_ValidateLiveUrl(elem) {
  var urlValue = elem.value;
  if (urlValue !== null && typeof urlValue !== 'undefined') {
    urlValue = urlValue.replace(/^\s+|\s+$/g, '');
    if (urlValue !== '') {
      var urlregex = new RegExp(
        "^(((https|http|ftps|ftp)://[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*(\\.[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*)+(:\\d{1,5})?)|((w|W){3}(\\.[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*){2,}(:\\d{1,5})?)|([a-zA-Z\\d]+((_|-)[a-zA-Z\\d]+)*(\\.[a-zA-Z\\d]+((_|-)[a-zA-Z\\d]+)*)+(:\\d{1,5})?))(/[-\\w.?,:'/\\\\+=&;%$#@()!~]*)?$",
        'i'
      );
      return urlregex.test(urlValue);
    }
  }
  return true;
}

function zf_ValidatePhone(inpElem) {
  var ZFPhoneRegex = {
    PHONE_INTE_ALL_REG: /^[+]{0,1}[()0-9-. ]+$/,
    PHONE_INTE_NUMERIC_REG: /^[0-9]+$/,
    PHONE_INTE_CONT_CODE_ENABLED_REG: /^[(0-9-.][()0-9-. ]*$/,
    PHONE_USA_REG: /^[0-9]+$/,
    PHONE_CONT_CODE_REG: /^[+][0-9]{1,4}$/,
  };
  var phoneFormat = parseInt(inpElem.getAttribute('phoneFormat'));
  var fieldInpVal = inpElem.value.replace(/^\s+|\s+$/g, '');
  var toReturn = true;
  if (phoneFormat === 1) {
    if (inpElem.getAttribute('valType') == 'code') {
      var codeRexp = ZFPhoneRegex.PHONE_CONT_CODE_REG;
      if (fieldInpVal != '' && !codeRexp.test(fieldInpVal)) {
        return false;
      }
    } else {
      var IRexp = ZFPhoneRegex.PHONE_INTE_ALL_REG;
      if (inpElem.getAttribute('phoneFormatType') == '2') {
        IRexp = ZFPhoneRegex.PHONE_INTE_NUMERIC_REG;
      }
      if (fieldInpVal != '' && !IRexp.test(fieldInpVal)) {
        toReturn = false;
        return toReturn;
      }
    }
    return toReturn;
  } else if (phoneFormat === 2) {
    var InpMaxlength = inpElem.getAttribute('maxlength');
    var USARexp = ZFPhoneRegex.PHONE_USA_REG;
    if (fieldInpVal != '' && USARexp.test(fieldInpVal) && fieldInpVal.length == InpMaxlength) {
      toReturn = true;
    } else if (fieldInpVal == '') {
      toReturn = true;
    } else {
      toReturn = false;
    }
    return toReturn;
  }
}

function zf_ValidateMonthYearFormat(inpElem) {
  var monthYearValue = inpElem.value.replace(/^\s+|\s+$/g, '');
  if (monthYearValue == '') {
    return true;
  } else {
    return zf_MonthYearRegex.test(monthYearValue);
  }
}

// Adding a signature validation function that was referenced but not defined
function zf_ValidateSignature(objElem) {
  // Placeholder implementation
  return true;
}

// Initialize the required variables
var zf_DateRegex = new RegExp(
  '^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$'
);
var zf_MonthYearRegex = new RegExp(
  '^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$'
);
var zf_MandArray = [
  'Name_First',
  'Name_Last',
  'PhoneNumber_countrycode',
  'Dropdown2',
  'MultipleChoice',
  'Number',
  'FileUpload',
  'Address_AddressLine1',
  'Address_City',
  'Address_Region',
];
var zf_FieldArray = [
  'Name_First',
  'Name_Last',
  'PhoneNumber_countrycode',
  'Email',
  'Dropdown2',
  'MultipleChoice',
  'Decimal',
  'Number',
  'Dropdown',
  'SingleLine',
  'SingleLine1',
  'Dropdown1',
  'FileUpload',
  'Address_AddressLine1',
  'Address_AddressLine2',
  'Address_City',
  'Address_Region',
];
var isSalesIQIntegrationEnabled = false;
var salesIQFieldsArray = [];
