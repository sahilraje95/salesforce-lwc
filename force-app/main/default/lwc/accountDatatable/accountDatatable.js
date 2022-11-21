import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAccountsList from '@salesforce/apex/AccountTestController.getAccountsList';
import updateAccountAnnualIncome from '@salesforce/apex/AccountTestController.updateAccountAnnualIncome';

export default class AccountDatatable extends LightningElement {

    @api noOfRecords = 10;
    @api badgeColor = 'rgba(255, 255, 255, 0)';

    @track accountsList=[];

    headerTitle='Accounts';
    debugMode = false;
    columns=[
        {label: 'Name', fieldName: 'Name'},
        {label: 'Annual Revenue', fieldName: 'AnnualRevenue'}
    ]
    selectedAccounts=[];

    get badgeStyle() {
        return `background-color: ${this.badgeColor}`;
    }

    async connectedCallback() {
        await this.getAccountsList();
    }

    async getAccountsList() {
        await getAccountsList({
            noOfRecords: this.noOfRecords
        })
        .then(result => {
            this.printOnConsole('getAccountsList result:','log',result);
            if(result.length) {
                this.accountsList = result;
                this.printOnConsole('getAccountsList result:','log',JSON.parse(JSON.stringify(this.accountsList)));
            }
        })
        .catch(error => {
            this.printOnConsole('getAccountsList error:','error',error);
        });
    }

    getSelectedAccount(event) {
        this.selectedAccounts = event.detail.selectedRows;
        this.printOnConsole('selectedAccounts:','log',this.selectedAccounts);
    }

    updateAccountAnnualRevenue() {
        this.printOnConsole('updateAccountAnnualRevenue selectedAccounts:','log',JSON.parse(JSON.stringify(this.selectedAccounts)));
        let accountIdsToUpdate = JSON.parse(JSON.stringify(this.selectedAccounts)).map(item=>{
            return item.Id
        });
        this.printOnConsole('Account Ids String:','log',accountIdsToUpdate.join(','));
        if(JSON.parse(JSON.stringify(this.selectedAccounts)).length) {
            updateAccountAnnualIncome({
                accountIds: accountIdsToUpdate.join(',')
            })
            .then(result => {
                this.getAccountsList();
                const event = new ShowToastEvent({
                    title: 'Success',
                    variant: 'success',
                    message: 'Accounts updated successfully.'
                });
                this.dispatchEvent(event);
            })
            .catch(error => {
                this.printOnConsole('updateAccountAnnualIncome error:','error',error);
            });
        } else {
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: 'No account selected. Please select atleast one account.'
            });
            this.dispatchEvent(event);
        }
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