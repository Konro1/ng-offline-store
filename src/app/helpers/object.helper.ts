export class ObjectHelper {

    static updateFromObject(parentObject, dataObject) {
        for (const prop in dataObject) {
            if (dataObject.hasOwnProperty(prop)) {
                parentObject[prop] = dataObject[prop];
            }
        }
    }
}
