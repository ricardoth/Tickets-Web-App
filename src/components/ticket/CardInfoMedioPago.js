import React, { useEffect } from 'react'
import { Combobox } from '../ui/combobox/Combobox';
import { environment } from '../../environment/environment.dev';
import { parserMedioPago} from '../../types/parsers';
const UrlGetMedioPagos = environment.UrlGetMedioPagos;

export const CardInfoMedioPago = ({valueMedioPago, setValueMedioPago}) => {
    useEffect(() => {
        setValueMedioPago(valueMedioPago);
      }, [valueMedioPago]);
  
      return (
          <>
              <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Forma de Pago</h5>
                                <p className="card-text">Seleccione el método de pago que utilizará</p>

                                <div className="col-lg-12">
                                    <label>MedioPago</label>
                                    <Combobox
                                            id="idMedioPago"
                                            name="idMedioPago"
                                            value={valueMedioPago}
                                            setValue={setValueMedioPago}
                                            url={UrlGetMedioPagos}
                                            parser={parserMedioPago}
                                            tipoAuth={environment.BasicAuthType}
                                        /> 
                                </div>

                                <div className="col-lg-12">
                                    <label>Valor</label>
                                    <input 
                                        type="text" 
                                        id="montoPago"
                                        name="montoPago"
                                        value={formik.values.montoPago}
                                        onChange={formik.handleChange}
                                        className="form-control" 
                                        placeholder='$'
                                        autoComplete="off"
                                        />
                                </div>
                                
                            </div>
                        </div>
          </>
      )
}
