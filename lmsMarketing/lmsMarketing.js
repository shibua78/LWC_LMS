import { LightningElement, wire } from 'lwc';
import { MessageContext } from 'lightning/messageService';
import {publishMC, subscribeMC, unsubscribeMC} from 'c/lmsShared';

export default class LmsMarketing extends LightningElement {
    
    optValues=[];   //store the selected channels this component subscribes to
    msgToPublish;
    channelType = 'Marketing';
    subBtnLabel = 'Subscribe to Channels';
    subBtnVariant = 'brand';
    
    subscription = null;
    receivedMessage = '';

    @wire(MessageContext) messageContext;

    get options() {
        //specify the various channels that are available for subscription
        return [
            { label: 'Sales', value: 'Sales' },
            { label: 'Service', value: 'Service' }
        ];
    }

    get selectedChannels() {
        //return the selected Channels (checkboxes)
        return this.optValues.join(',');
    }

    handleChange(event) {
        //stores all the selected Channels (checked boxes)
        this.optValues = event.detail.value;
    }

    setMsg(event){
        this.msgToPublish = event.target.value;
    }


    handleSubscribe(){
        if (this.subscription){
            //Unsubscribe from Channels button clicked 
            unsubscribeMC(this.subscription);
            this.subscription = null;
            this.subBtnLabel = 'Subscribe to Channels';
            this.subBtnVariant = 'brand';
        }
        else {
            //Subscribe to Channels button clicked
            subscribeMC(this.messageContext, (subscription, message) => {
                //write code to handle the returned subscription as well as message data
                //we will display the changes to receivedMessage only if the message is valid
                //and the msg type is included in the list of checked box values in optValues
                this.subscription = subscription;
                this.receivedMessage = (message && this.optValues.includes(message.lmsMsgType)) 
                                        ? message.lmsData.message : this.receivedMessage;
            });
            this.subBtnLabel = 'Unsubscribe from Channels';
            this.subBtnVariant = 'destructive';
        }
    }

    handlePublish(){
        //call publish method to send out the message to be published
        //along with the component channel type so subscribers can identify
        publishMC(this.messageContext, this.msgToPublish, this.channelType);
    }    

}