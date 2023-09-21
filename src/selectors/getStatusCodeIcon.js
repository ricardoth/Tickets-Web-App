export const getColorStatusCode = (statusCode) => {
    let outputStatus = '';
    switch (statusCode) {
        case 1:
            outputStatus = 'success';
            break;

        case 2: 
            outputStatus = 'error';
            break;
    
        case 3: 
            outputStatus = 'warning';
            break;
        default:
            outputStatus = 'info';
            break;
    }
    return outputStatus;
}