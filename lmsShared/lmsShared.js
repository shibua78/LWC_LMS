import { APPLICATION_SCOPE, subscribe, unsubscribe, publish } from 'lightning/messageService';
import LWCMC from '@salesforce/messageChannel/LWCMessageChannel__c';

//this function will receive the message context as argument
//and we will use the callbk function to send the subscription
//and message back to the calling component
const subscribeMC = (messageContext, callbk) => {
    const subscription = subscribe(
        messageContext, LWCMC, (message) => {
            callbk(subscription, message)
        }, {scope: APPLICATION_SCOPE});
}

//unsubscribe using the subscription passed
const unsubscribeMC = (subscription) => {
    unsubscribe(subscription);
}

//publish using the message context, the message and channel type
//passed from calling component
const publishMC = (messageContext, lmsMsg, lmsChannelType) => {
    const message = {
        lmsData:{
            message: lmsMsg,
        },
        lmsMsgType: lmsChannelType
    };
    publish(messageContext, LWCMC, message);
}

//export the functions so that they are
//accessible in other modules
export {publishMC, subscribeMC, unsubscribeMC};

