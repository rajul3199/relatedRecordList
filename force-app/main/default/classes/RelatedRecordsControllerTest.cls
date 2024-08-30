@IsTest
public class RelatedRecordsControllerTest {

    @IsTest
    static void testGetRelatedRecords_Success() {
        // Set up test data
        Account parentAccount = new Account(Name = 'Test Parent Account');
        insert parentAccount;

        Contact contact1 = new Contact(FirstName = 'John', LastName = 'Doe', Email = 'john.doe@example.com', AccountId = parentAccount.Id);
        Contact contact2 = new Contact(FirstName = 'Jane', LastName = 'Smith', Email = 'jane.smith@example.com', AccountId = parentAccount.Id);
        insert new List<Contact>{ contact1, contact2 };

        Test.startTest();
        // Call the Apex method
        List<SObject> result = RelatedRecordsController.getRelatedRecords(
            'Contact',
            'AccountId',
            parentAccount.Id,
            'TestFieldSet', // Ensure this field set exists in your org on the Contact object
            2,
            0
        );
        Test.stopTest();

        // Assert that records are returned correctly
        System.assertEquals(2, result.size(), 'The number of returned records should be 2');
        System.assertEquals('John', result[0].get('FirstName'), 'First record FirstName should match');
        System.assertEquals('Doe', result[0].get('LastName'), 'First record LastName should match');
        System.assertEquals('Jane', result[1].get('FirstName'), 'Second record FirstName should match');
        System.assertEquals('Smith', result[1].get('LastName'), 'Second record LastName should match');
    }

    @IsTest
    static void testGetRelatedRecords_InvalidChildObject() {
        Test.startTest();
        try {
            RelatedRecordsController.getRelatedRecords(
                'InvalidObject__c',
                'AccountId',
                'dummyId',
                'TestFieldSet',
                2,
                0
            );
            System.assert(false, 'Expected AuraHandledException for invalid object API name.');
        } catch (AuraHandledException e) {
           
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetRelatedRecords_InvalidFieldSetName() {
        // Set up test data
        Account parentAccount = new Account(Name = 'Test Parent Account');
        insert parentAccount;

        // Create a valid child record
        Contact contact = new Contact(FirstName = 'John', LastName = 'Doe', Email = 'john.doe@example.com', AccountId = parentAccount.Id);
        insert contact;

        Test.startTest();
        try {
            RelatedRecordsController.getRelatedRecords(
                'Contact',
                'AccountId',
                parentAccount.Id,
                'InvalidFieldSet',
                2,
                0
            );
            System.assert(false, 'Expected AuraHandledException for invalid field set name.');
        } catch (AuraHandledException e) {
          
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetRelatedRecords_EmptyResult() {
        // Set up test data
        Account parentAccount = new Account(Name = 'Test Parent Account');
        insert parentAccount;

        Test.startTest();
        // Call the Apex method with a parent ID that has no children
        List<SObject> result = RelatedRecordsController.getRelatedRecords(
            'Contact',
            'AccountId',
            'NonExistentParentId',
            'TestFieldSet', // Ensure this field set exists in your org on the Contact object
            2,
            0
        );
        Test.stopTest();

        // Assert that no records are returned
        System.assertEquals(0, result.size(), 'The number of returned records should be 0 for a non-existent parent ID');
    }
}
