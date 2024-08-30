# The steps to use the `RelatedRecordsList` Lightning Web Component:

1. **Navigate to Setup**: Go to the child object in Salesforce Setup.
2. **Create a Field Set**: Create a new field set on the child object that includes the fields you want to display. Remember to name the field set appropriately.
3. **Copy Field Set API Name**: After creating the fieldset, copy its API Name.
4. **Navigate to the Parent Object**: Go to the parent object where you want to add the related records list.
5. **Edit the Lightning Record Page**: Open the Lightning Record Page of the parent object for editing.
6. **Add the Component**: Drag the `RelatedRecordsList` LWC component from the custom components section onto the page.
7. **Configure the Component**: Place the component on the page's desired location.
8. **Set Component Attributes**: Fill in the component attributes with:
   - Title: A title for the related records section.
   - Child Object API Name: The API name of the child object.
   - Relationship Field Name: The API name of the field on the child object that relates it to the parent object.
   - Field Set API Name: The API name of the field set you created on the child object.
9. **Save the Page**: Save the changes to the Lightning Record Page.
10. **View Related Records**: Navigate to a parent object record to view the related records displayed based on your configuration. 

By following these steps, you'll successfully add the `RelatedRecordsList` component to your parent object’s Lightning Record Page and configure it to show related records dynamically. 
![image](https://github.com/user-attachments/assets/a25b77a7-39af-4f43-99aa-391644bb9152)

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
