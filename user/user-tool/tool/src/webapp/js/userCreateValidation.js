/******************************************************************************
 * $URL$
 * $Id$
 ******************************************************************************
 *
 * Copyright (c) 2003-2014 The Apereo Foundation
 *
 * Licensed under the Educational Community License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *       http://opensource.org/licenses/ecl2
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *****************************************************************************/
// USER declared in userValidationCommon.js

// Validate the password from the form
USER.validatePassword = function () {
    var username = USER.trim(USER.get("user_eid").value);
    var pw = USER.get("user_pw").value;
    var strongMsg = USER.get("strongMsg");
    var moderateMsg = USER.get("moderateMsg");
    var weakMsg = USER.get("weakMsg");
    var failMsg = USER.get("failMsg");
    var strengthInfo = USER.get("strengthInfo");
    var strengthBar = USER.get("strengthBar");
    var strengthBarMeter = USER.get("strengthBarMeter");

    // If the password field has a value:
    // 1) make the AJAX call to the validate password REST endpoint
    // 2) conditionally display the appropriate messages
    // 3) conditionally hide/show the strength info message
    if (USER.isPasswordPolicyEnabled && pw.length > 0) {
        USER.validatePasswordREST(pw, username);
        USER.displayMessages(strongMsg, moderateMsg, weakMsg, failMsg, strengthBar, strengthBarMeter);
        USER.displayStrengthInfo();
    }

    // Otherwise, password policy is disabled OR the password field has no value
    else {
        USER.passwordValid = pw.length > 0;
        USER.hideAllElements(strongMsg, moderateMsg, weakMsg, failMsg, strengthInfo, strengthBar, strengthBarMeter);
    }

    // Verify the passwords match (which in turn validates the form)
    USER.verifyPasswordsMatch();
};

// Verify the passwords match
USER.verifyPasswordsMatch = function () {
    var pw = USER.get("user_pw").value;
    var pw2 = USER.get("user_pw0").value;
    var matchMsg = USER.get("matchMsg");
    var noMatchMsg = USER.get("noMatchMsg");

    USER.passwordsMatch = pw === pw2;
    if (pw.length > 0 || pw2.length > 0) {
        USER.display(matchMsg, USER.passwordsMatch);
        USER.display(noMatchMsg, !USER.passwordsMatch);
    }
    else {
        USER.display(matchMsg, false);
        USER.display(noMatchMsg, false);
    }

    USER.validateForm();
}

// Validate the user ID from the form
USER.validateUserId = function () {
    var userId = USER.trim(USER.get("user_eid").value);
    USER.userValid = userId.length > 0;
    USER.validatePassword();
};

// Validate the email address from the form
USER.validateEmail = function () {
    var email = USER.trim(USER.get("email").value);
    var emailWarningMsg = USER.get("emailWarningMsg");

    if (email.length < 1) {
        USER.emailValid = true;
    }
    else {
        USER.emailValid = USER.checkEmail(email);
    }

    USER.display(emailWarningMsg, !USER.emailValid);
    USER.validateForm();
};

// Validate the form (enable/disable the submit button)
USER.validateForm = function () {
    var submitButton = USER.get("eventSubmit_doSave");

    if (USER.userValid && USER.emailValid && USER.passwordValid && USER.passwordsMatch) {
        submitButton.disabled = false;
    }
    else {
        submitButton.disabled = true;
    }

    setMainFrameHeightNow(window.name);
};

// Initialization function
jQuery(document).ready(function () {
    USER.validateEmail();
    USER.validateUserId();
});
