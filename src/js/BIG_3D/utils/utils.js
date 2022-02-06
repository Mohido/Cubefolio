/** 
 * @module_explanation
 * This module contain extra functionalities that will be used in the whole project. 
 * 
 * 
 * @objects :
 *  - Severities : Describes the severity options. Can be passed to the logs.
 * 
 * @functions :
 *  - log(Int , String);      Takes a severity and a message. Prints out the message if the severity is in teh default bound.
 */



/** DONT TOUCH !! */
const SEVERITIES = {   
    INFO_       : 0,
    WARNING_    : 1,
    ERROR_      : 2
};

/** Touch */
const DEFAULT_SEVERITY = SEVERITIES.INFO_;        // <--- EDIT THIS TO PRINT THE SEVERITY.


///-----------------------------------------------------------------------------------



function severityToString(severity){
    if(severity == SEVERITIES.INFO_){
        return "INFO";
    }
    if(severity == SEVERITIES.WARNING_){
        return "WARNING";
    }
    if(severity == SEVERITIES.ERROR_){
        return "ERROR";
    }
    return "UNDEFINED_SEVERITY";
}



function log(severity, message){
    if (severity >= DEFAULT_SEVERITY){
        let severityStr = severityToString(severity);
        console.log(`[${severityStr}]: ${message}`);
    }
}



function assert(check, message){
    if(check){
        log(SEVERITIES.ERROR_, message);
        throw "message";
    }
}

export {log, SEVERITIES as Severities, assert};