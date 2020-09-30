import React from 'react';

//Loader to use when the user is waiting for the execution of an operation.
export const Loader = ( ) => {
    return(
        <div className="loaderStyle" style={{height:'1350px', display:'block', opacity:'1'}}>
            <div className="waitingSimple">                
            </div>
        </div>
    );    
};
