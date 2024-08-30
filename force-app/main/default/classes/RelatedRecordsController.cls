public with sharing class RelatedRecordsController {
    @AuraEnabled
    public static List<SObject> getRelatedRecords(String childObjectApiName, String relationshipFieldName, String parentRecordId, String fieldSetName, Integer limitSize, Integer offsetSize) {
        
        Schema.SObjectType childObjectType = Schema.getGlobalDescribe().get(childObjectApiName);
        if (childObjectType == null) {
            throw new AuraHandledException('Invalid child object API name.');
        }
        Schema.DescribeSObjectResult childObjectDescribe = childObjectType.getDescribe();
        
        System.debug(fieldSetName);
        Schema.FieldSet fieldSet = childObjectDescribe.fieldSets.getMap().get(fieldSetName);
        if (fieldSet == null) {
            throw new AuraHandledException('Invalid field set name.');
        }

        // Prepare the list of fields to query
        List<String> fieldList = new List<String>();
        for (Schema.FieldSetMember f : fieldSet.getFields()) {
            fieldList.add(f.getFieldPath());
        }
        String fields = 'Id,' + String.join(fieldList, ',');

        String query = 'SELECT ' + fields + ' FROM ' + childObjectApiName + 
                       ' WHERE ' + relationshipFieldName + ' = :parentRecordId' +
                       ' LIMIT :limitSize OFFSET :offsetSize';

        List<SObject> records = new List<SObject>();              
        
        try{
            records = Database.query(query);
            SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE,records);
            records =  decision.getRecords();
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }

       return records;
    }
}
