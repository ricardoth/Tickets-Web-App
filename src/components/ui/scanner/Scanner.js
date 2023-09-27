import React, { useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode';

export const Scanner = ({onScanSuccess}) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 600,
                height: 600
            },
            fps: 5,
        });
    
        scanner.render(success, error);
    
        function success(result) {
            scanner.clear();
            if(onScanSuccess) {
                onScanSuccess(result);
            }
        }

        function error(err) {
            console.warn(err);
        }
    }, [onScanSuccess]);

    
    return (
        <>
            <h3>QR Scanner</h3>
            {
                <div id="reader"></div>
            }
        </>
    )
}
