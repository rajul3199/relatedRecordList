import { createElement } from 'lwc';
import RelatedRecordsList from 'c/relatedRecordsList';
import getRelatedRecords from '@salesforce/apex/RelatedRecordsController.getRelatedRecords';

// Mock Apex method
jest.mock(
    '@salesforce/apex/RelatedRecordsController.getRelatedRecords',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-related-records-list', () => {
    afterEach(() => {
        // Clear the DOM after each test case
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('loads initial set of records on component load', async () => {
        // Arrange: Mocking the Apex call to return test data
        const mockRecords = [
            { Id: '001', Name: 'Record 1', Field1__c: 'Value 1' },
            { Id: '002', Name: 'Record 2', Field1__c: 'Value 2' }
        ];
        getRelatedRecords.mockResolvedValue(mockRecords);

        // Act: Create component and add to DOM
        const element = createElement('c-related-records-list', {
            is: RelatedRecordsList
        });
        document.body.appendChild(element);

        // Assert: Wait for async operations to complete and validate the DOM
        await flushPromises();
        const cards = element.shadowRoot.querySelectorAll('lightning-card');
        expect(cards.length).toBe(2);
        expect(cards[0].title).toBe('Record 1');
        expect(cards[1].title).toBe('Record 2');
    });

    it('displays an error message when Apex call fails', async () => {
        // Arrange: Mocking the Apex call to throw an error
        const errorMessage = 'An error occurred';
        getRelatedRecords.mockRejectedValue({ body: { message: errorMessage } });

        // Act: Create component and add to DOM
        const element = createElement('c-related-records-list', {
            is: RelatedRecordsList
        });
        document.body.appendChild(element);

        // Assert: Wait for async operations to complete and validate the DOM
        await flushPromises();
        const errorEl = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(errorEl.textContent).toBe(errorMessage);
    });

    it('fetches more records when scrolled to the bottom', async () => {
        // Arrange: Mock initial and subsequent Apex calls
        const mockInitialRecords = [
            { Id: '001', Name: 'Record 1', Field1__c: 'Value 1' }
        ];
        const mockMoreRecords = [
            { Id: '002', Name: 'Record 2', Field1__c: 'Value 2' }
        ];
        getRelatedRecords
            .mockResolvedValueOnce(mockInitialRecords) // Initial load
            .mockResolvedValueOnce(mockMoreRecords); // On scroll

        // Act: Create component and add to DOM
        const element = createElement('c-related-records-list', {
            is: RelatedRecordsList
        });
        document.body.appendChild(element);

        // Wait for initial load
        await flushPromises();

        // Simulate scroll to the bottom
        const scrollContainer = element.shadowRoot.querySelector('.scroll-container');
        scrollContainer.dispatchEvent(new CustomEvent('scroll'));

        // Wait for additional records to load
        await flushPromises();

        // Assert: Check if both initial and more records are displayed
        const cards = element.shadowRoot.querySelectorAll('lightning-card');
        expect(cards.length).toBe(2);
        expect(cards[1].title).toBe('Record 2');
    });

    it('does not fetch more records if already loading', async () => {
        // Arrange: Mock initial Apex call to return quickly and second call to delay
        const mockInitialRecords = [
            { Id: '001', Name: 'Record 1', Field1__c: 'Value 1' }
        ];
        const mockMoreRecords = [
            { Id: '002', Name: 'Record 2', Field1__c: 'Value 2' }
        ];
        getRelatedRecords
            .mockResolvedValueOnce(mockInitialRecords) // Initial load
            .mockResolvedValueOnce(mockMoreRecords); // On scroll

        // Act: Create component and add to DOM
        const element = createElement('c-related-records-list', {
            is: RelatedRecordsList
        });
        document.body.appendChild(element);

        // Wait for initial load
        await flushPromises();

        // Simulate two quick scrolls to the bottom
        const scrollContainer = element.shadowRoot.querySelector('.scroll-container');
        scrollContainer.dispatchEvent(new CustomEvent('scroll'));
        scrollContainer.dispatchEvent(new CustomEvent('scroll'));

        // Assert: Ensure the Apex method is only called twice (initial load + one scroll)
        await flushPromises();
        expect(getRelatedRecords).toHaveBeenCalledTimes(2);
    });
});

// Helper function to wait for any asynchronous DOM updates
function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
