public with sharing class AccountTestController {

    public AccountTestController() {

    }
    
    @AuraEnabled
    public static List<SObject> getRecordsList(Integer noOfRecords, String objectAPIName){
        try {
            String fields, query;
            if(objectAPIName=='Case') {
                fields='Subject';
            } else {
                fields='Name';
            }
            query = 'SELECT '+fields+' FROM '+objectAPIName+' ORDER BY CreatedDate DESC LIMIT '+noOfRecords;

            List<SObject> sObjectList = database.query(query);            
            return sObjectList.size() > 0 ? sObjectList : new List<SObject>();
        } catch (Exception e) {
            throw new AuraHandledException('getRecordsList: '+e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Account> getAccountsList(Integer noOfRecords){
        try {
            List<Account> accountsList = [SELECT Id, Name, AnnualRevenue FROM Account WHERE AnnualRevenue !=NULL ORDER BY CreatedDate DESC LIMIT :noOfRecords];
            return accountsList.size() > 0 ? accountsList : new List<Account>();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateAccountAnnualIncome(String accountIds){
        try {
            Id[] accountIdsList = accountIds.split(',');
            List<Account> accountsList = [SELECT AnnualRevenue FROM Account WHERE Id IN :accountIdsList];
            for(Account a: accountsList) {
                a.AnnualRevenue += a.AnnualRevenue * 0.05;
            }
            update accountsList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}