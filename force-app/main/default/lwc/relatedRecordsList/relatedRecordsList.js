import { LightningElement, api, track } from 'lwc';
import getRelatedRecords from '@salesforce/apex/RelatedRecordsController.getRelatedRecords';

const PAGE_SIZE = 10; // Number of records to load per page

export default class RelatedRecordsList extends LightningElement {
    @api realtedRecordTitle;
    @api childObjectApiName;
    @api relationshipFieldName;
    @api fieldSetName;
    @api recordId;

    @track records = [];
    @track displayFields = [];
    @track error;
    @track isLoading = false;

    currentOffset = 0;

    connectedCallback() {
        this.fetchRelatedRecords();
    }

    fetchRelatedRecords() {
        this.isLoading = true;
        console.log(this.fieldSetName);
        getRelatedRecords({
            childObjectApiName: this.childObjectApiName,
            relationshipFieldName: this.relationshipFieldName,
            parentRecordId: this.recordId,
            fieldSetName: this.fieldSetName,
            limitSize: PAGE_SIZE,
            offsetSize: this.currentOffset
        })
        .then(result => {
            console.log(JSON.stringify(result));
            if (result.length > 0) {
                
                this.records = [...this.records, ...result];

                if (!this.displayFields.length && this.records.length > 0) {
                    this.displayFields = Object.keys(this.records[0]).filter(field => field !== 'Id' && field !== 'fields');
                    console.log(JSON.stringify(this.displayFields));
                }
                
                this.currentOffset += PAGE_SIZE;

                this.records.forEach(record => {
                    record.fields = this.displayFields.map(key => {
                        return {
                                 name: key,
                                 value: record[key]
                               }; 
                      });
                });
            }
            console.log(JSON.stringify(this.records));
            this.isLoading = false;
            this.error = undefined;
        })
        .catch(error => {
            this.isLoading = false;
            this.error = error.body.message;
        });
    }

    handleScroll(event) {
        const scrollHeight = event.target.scrollHeight;
        const scrollTop = event.target.scrollTop;
        const clientHeight = event.target.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight && !this.isLoading) {
            this.fetchRelatedRecords();
        }
    }
}
