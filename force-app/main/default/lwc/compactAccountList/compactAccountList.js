import { LightningElement, api } from 'lwc';
import getRecordsList from '@salesforce/apex/AccountTestController.getRecordsList'

export default class CompactAccountList extends LightningElement {

    @api noOfRecords = 10;
    @api objectAPIName = 'Account';
    @api badgeColor = 'rgba(255, 255, 255, 0)';

    pluralAPINames = [
        { objectAPIName: 'Account', pluralLabel: 'Accounts' },
        { objectAPIName: 'Contact', pluralLabel: 'Contacts' },
        { objectAPIName: 'Opportunity', pluralLabel: 'Opportunities' },
        { objectAPIName: 'Case', pluralLabel: 'Cases' },
        { objectAPIName: 'Book__c', pluralLabel: 'Books' }
    ];
    recordsList = [];
    debugMode = true;

    get headerTitle() {
        return this.pluralAPINames.find(opt => opt.objectAPIName === this.objectAPIName).pluralLabel;
    }

    get badgeStyle() {
        return `background-color: ${this.badgeColor}`;
    }

    async connectedCallback() {
        await this.getRecordsList()
    }

    async getRecordsList() {
        await getRecordsList({
            noOfRecords: this.noOfRecords,
            objectAPIName: this.objectAPIName
        })
            .then((result) => {
                this.recordsList = result;
                this.recordsList.forEach(element => {
                    element.Name = element.Name || element.Subject;
                });
                this.printOnConsole('Records List:', 'log', this.recordsList);
            }).catch((error) => {
                this.printOnConsole('Error in getRecordsList:', 'error', error);
            })
    }

    printOnConsole(message, level, object) {
        if (this.debugMode) {
            switch (level) {
                case 'log':
                    console.log(message, object);
                    break;
                case 'warn':
                    console.warn(message, object);
                    break;
                case 'error':
                    console.error(message, object);
                    break;
                default:
                    console.info(message, object);
            }
        }
    }

}